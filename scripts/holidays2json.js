#!/usr/bin/env node

/* eslint no-multi-str:0 */
'use strict'

var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var jsyaml = require('js-yaml')

module.exports = holidays2json

function holidays2json (opts) {
  var dirname = path.resolve(__dirname, '..', 'data')

  var data =
    fs.readFileSync(dirname + '/holidays.yaml', 'utf8') +
    fs.readFileSync(dirname + '/names.yaml', 'utf8')

  var obj = jsyaml.safeLoad(data)

  if (opts.pick) {
    obj.holidays = _.pick(obj.holidays, opts.pick)
  } else if (opts.omit) {
    obj.holidays = _.omit(obj.holidays, opts.omit)
  }
  var json = JSON.stringify(obj, null, 2) + '\n'

  fs.writeFileSync(dirname + '/holidays.json', json, 'utf8')
}

if (module === require.main) {
  var args = process.argv.splice(2)

  var getOption = function (option) {
    var i = args.indexOf(option)
    if (i !== -1) {
      var list = args[i + 1].toUpperCase().split(',').sort()
      if (list && list.length) return list
    }
  }

  if (args.indexOf('-h') !== -1 || args.indexOf('--help') !== -1) {
    console.log([
      '',
      'holidays2json [options]',
      '',
      'translate holidays.yaml data to json',
      '',
      '-p|--pick   comma seperated list of countries to pick',
      '            from holidays.json file',
      '-o|--omit   comma seperated list of countries to omit',
      '            from holidays.json file',
      '',
      'NOTE: There are some countries which depend on data of others which',
      '      might render the file useless. e.g. "GU" requires "US", so try',
      '      to pick or omit both.',
      '',
      'Use in your build process in package.json "scripts" section.',
      '      "build" : "holidays2json -p US,CA,GU"',
      '      and run then with `npm run build`',
      ''
    ].join('\n    '))
    process.exit(0)
  }

  var opts = {
    pick: getOption('--pick') || getOption('-p'),
    omit: getOption('--omit') || getOption('-o')
  }

  holidays2json(opts)
}
