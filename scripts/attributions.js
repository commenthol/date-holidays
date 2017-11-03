#!/usr/bin/env node

/* eslint
   key-spacing: 0
 */

'use strict'

var fs = require('fs')
var path = require('path')

var argv = process.argv
  .slice(2)
  .map((f) => {
    return process.cwd() + '/' + f
  })

var config = {
  fileRegex: /^([A-Z]+)\.yaml$/,
  license: argv[0] || path.resolve(__dirname, '..', 'LICENSE'),
  countries: argv[1] || path.resolve(__dirname, '..', 'data', 'countries')
}

function uniq (arr) {
  var obj = {}
  arr.forEach((i) => {
    obj[i] = 1
  })
  return Object.keys(obj)
}

function Attributions () {
}
module.exports = Attributions

Attributions.prototype = {
  _load (filename) {
    return fs.readFileSync(filename, 'utf8')
  },

  _save (filename, data) {
    return fs.writeFileSync(filename, data, 'utf8')
  },

  load () {
    var list = fs.readdirSync(config.countries)
    console.log(list.length, 'files read')

    this.data = list
      .map((file) => {
        if (config.fileRegex.test(file)) {
          return this._load(path.resolve(config.countries, file))
        }
        return ''
      })
      .join('')
      .split(/[\n\r]/)

    return this
  },

  extract () {
    var data = this.data.filter((d) => {
      if (/#\s*@attrib\s/.test(d)) {
        return true
      }
    })
      .map((d) => {
        return d
          .replace(/#\s*@attrib/, '')
          .trim()
      })
      .sort()

    this.data = uniq(data).join('\n')

    return this
  },

  insert (filename) {
    this.filename = filename
    var license = this._load(filename)
    this.data = license.replace(/<(attribution)>[^]*<\/\1>/m, '<attribution>\n\n' + this.data + '\n\n</attribution>')
    return this
  },

  save () {
    this._save(this.filename, this.data)
  }
}

if (module === require.main) {
  var a = new Attributions()
  a.load().extract().insert(config.license).save()
}
