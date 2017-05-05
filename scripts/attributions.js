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
  data   : argv[0] || path.resolve(__dirname, '..', 'data/holidays.yaml'),
  license: argv[1] || path.resolve(__dirname, '..', 'LICENSE')
}

function load (filename) {
  var data = fs.readFileSync(filename, 'utf8')
  return data.split(/[\n\r]/)
}

function save (filename, data) {
  return fs.writeFileSync(filename, data, 'utf8')
}

function extract (data) {
  data = data.filter((d) => {
    if (/#\s*@source.*wikipedia/.test(d)) return true
  })
  .map((d) => {
    return d
      .replace(/#\s*@source/, '')
      .trim()
  })
  .sort()
  return data
}

function insert (filename, data) {
  var license = load(filename).join('\n')
  data = data.join('\n')
  license = license.replace(/<(attribution)>[^]*<\/\1>/m, '<attribution>\n\n' + data + '\n\n</attribution>')
  return license
}

var data = load(config.data)
data = extract(data)
var lic = insert(config.license, data)
save(config.license, lic)
