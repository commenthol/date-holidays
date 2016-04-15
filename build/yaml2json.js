'use strict'

if (module === require.main) {
  var fs = require('fs')
  var path = require('path')
  var jsyaml = require('js-yaml')
  var dirname = path.resolve(__dirname, '..', 'data')

  var data =
    fs.readFileSync(dirname + '/holidays.yaml', 'utf8') +
    fs.readFileSync(dirname + '/names.yaml', 'utf8')

  var obj = jsyaml.safeLoad(data)
  var json = JSON.stringify(obj, null, 2) + '\n'

  fs.writeFileSync(dirname + '/holidays.json', json, 'utf8')
}
