/* global describe, it */

const path = require('path')
const assert = require('assert')
const Parser = require('../src/Parser')
const serializeToModule = require('serialize-to-js').serializeToModule

const exp = require('./fixtures/parser.js')

var p = new Parser()
var parser = p.parse.bind(p)

if (~process.argv.indexOf('--writetests')) {
  ;(function () {
    var store = {}
    var filename = path.resolve(__dirname, 'fixtures', 'parser.js')
    for (var name in exp) {
      var res = parser(name)
      store[name] = res
    }
    var js = serializeToModule(store, {beautify: true, comment: 'eslint-disable'})
    require('fs').writeFileSync(filename, js, 'utf8')
    console.log(filename, 'written')
  })()
}

function test (name) {
  it(name, function () {
    var res = parser(name)
    assert.deepEqual(res, exp[name])
  })
}

describe('#parser', function () {
  for (var name in exp) {
    test(name)
  }
})
