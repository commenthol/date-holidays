#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const resolve = path.resolve
const jsyaml = require('js-yaml')
const PrePin = require('prepin')
const { pick: _pick, omit: _omit } = require('lodash')

const REGEX = /^([A-Z]+)\.yaml$/

const dirParser = path.dirname(require.resolve('date-holidays-parser'))

const config = {
  dirname: resolve(__dirname, '..', 'data'),
  countries: resolve(__dirname, '..', 'data', 'countries'),
  factories: [
    resolve(dirParser, '..', 'src', 'CalEventFactory.js'),
    resolve(dirParser, '..', 'lib', 'CalEventFactory.cjs')
  ]
}

function Holidays2json (opts) {
  this.opts = opts || {}
  this.list = this.opts.list || []
}
Holidays2json.prototype = {
  /**
   * get list of supported countries from directory
   */
  getList: function () {
    let list = fs.readdirSync(config.countries)
    list = list
      .map((file) => {
        if (REGEX.test(file)) {
          return file.replace(REGEX, '$1')
        } else {
          return undefined
        }
      })
      .filter(function (file) {
        return file
      })
      .sort()
    this.list = list
    return this
  },
  /**
   * load a single yaml file
   */
  load: function (cc, filename) {
    filename = filename || resolve(config.countries, cc + '.yaml')
    const data = fs.readFileSync(filename, 'utf8')
    const obj = jsyaml.load(data)
    return obj
  },
  /**
   * build `holidays.json file`
   */
  build: function () {
    const obj = this.load('0')
    obj.holidays = {}
    this.list.forEach(function (cc) {
      Object.assign(obj.holidays, this.load(cc).holidays)
    }.bind(this))
    Object.assign(obj, this.load(null, resolve(config.dirname, 'names.yaml')))

    if (this.opts.pick) {
      obj.holidays = _pick(obj.holidays, this.opts.pick)
    } else if (this.opts.omit) {
      obj.holidays = _omit(obj.holidays, this.opts.omit)
    }

    obj.version = new Date().toISOString().replace(/^(.*)T.*$/, '$1')
    this.holidays = obj

    if (this.opts.min) this.prepin()

    return this
  },
  /**
   * save holidays
   */
  save: function () {
    const json = JSON.stringify(this.holidays, null, 2) + '\n'
    fs.writeFileSync(resolve(config.dirname, 'holidays.json'), json, 'utf8')
    fs.writeFileSync(resolve(__dirname, '..', 'src', 'data.js'), 'export const data = ' + json, 'utf8')
    if (fs.existsSync(resolve(__dirname, '..', 'lib'))) {
      fs.writeFileSync(resolve(__dirname, '..', 'lib', 'data.cjs'), 'exports.data = ' + json, 'utf8')
    }
  },
  /**
   * modify the factories to require only the minimum required packages
   */
  prepin: function () {
    // reduce final build size
    const macros = dive(this.holidays)
    config.factories.forEach(function (fa) {
      new PrePin({ macros, input: fa, output: fa }).proc().catch(function (e) {
        console.error(e)
      })
    })
  }
}
module.exports = Holidays2json

if (module === require.main) {
  const args = process.argv.splice(2)

  const getOption = function (option) {
    const i = args.indexOf(option)
    if (i !== -1) {
      const list = (args[i + 1] || '').toUpperCase().split(',').sort()
      if (list && list.length) return list
      return true
    }
  }

  if (getOption('-h') || getOption('--help')) {
    console.log([
      '',
      'holidays2json [options]',
      '',
      'translate holidays.yaml data to json',
      '',
      '-p|--pick   comma separated list of countries to pick',
      '            from holidays.json file',
      '-o|--omit   comma separated list of countries to omit',
      '            from holidays.json file',
      '-m|--min    minimize the package dependencies - e.g. if using webpack or',
      '            browserify',
      '',
      'NOTE: There are some countries which depend on data of others which',
      '      might render the file useless. e.g. "GU" requires "US", so try',
      '      to pick or omit both.',
      '',
      'Use in your build process in package.json "scripts" section.',
      '      "build" : "holidays2json -p US,CA,GU"',
      'and run then with `npm run build`',
      ''
    ].join('\n    '))
    process.exit(0)
  }

  const opts = {
    pick: getOption('--pick') || getOption('-p'),
    omit: getOption('--omit') || getOption('-o'),
    min: getOption('--min') || getOption('-m')
  }

  new Holidays2json(opts).getList().build().save()
}

/**
* searches for `days` to obtain macros for prepin
*/
function dive (data, macros) {
  macros = macros || {
    nobengali: true,
    nochinese: true,
    noequinox: true,
    nohebrew: true,
    noislamic: true,
    nojalaali: true,
    nojulian: true
  }
  switch (toString.call(data)) {
    case '[object Object]':
      Object.keys(data).forEach(function (key) {
        if (key === 'days') {
          Object.keys(data[key]).forEach(function (key) {
            if (/\b(Muharram|Safar|Rabi al-awwal|Rabi al-thani|Jumada al-awwal|Jumada al-thani|Rajab|Shaban|Ramadan|Shawwal|Dhu al-Qidah|Dhu al-Hijjah)\b/.test(key)) {
              delete macros.noislamic
            } else if (/\b(julian)\b/.test(key)) {
              delete macros.nojulian
            } else if (/\b(chinese|vietnamese|korean)\b/.test(key)) {
              delete macros.nochinese
            } else if (/\b(bengali-revised)\b/.test(key)) {
              delete macros.nobengali
            } else if (/\b(equinox|solstice)\b/.test(key)) {
              delete macros.noequinox
            } else if (/\b(Nisan|Iyyar|Sivan|Tamuz|Av|Elul|Tishrei|Cheshvan|Kislev|Tevet|Shvat|Adar)\b/.test(key)) {
              delete macros.nohebrew
            } else if (/\b(Farvardin|Ordibehesht|Khordad|Tir|Mordad|Shahrivar|Mehr|Aban|Azar|Dey|Bahman|Esfand)\b/.test(key)) {
              delete macros.nojalaali
            }
          })
        } else {
          dive(data[key], macros)
        }
      })
      break
  }
  return macros
}
