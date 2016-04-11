'use strict'

/* global describe, it */

var path = require('path')
var assert = require('assert')
var parser = require('../lib/parser')

var exp = require('./lib/testcases.js')

var writetests

for (var i in process.argv) {
  /*
  mocha test/parser.mocha.js --writetests
  meld parser.json test/lib/testcases.js
  */
  if (process.argv[i] === '--writetests') {
    writetests = true
    break
  }
}

if (writetests) {
  ;(function () {
    var store = {}
    var filename = path.join(__dirname, '../parser.json')
    for (var name in exp) {
      var res = parser(name)
      store[name] = res
    }
    function replacer (key, value) {
      if (value === undefined) {
        return 'undefined'
      }
      return value
    }
    var json = JSON.stringify(store, replacer, 2)
      .replace(/"/g, '\'')
      .replace(/: 'undefined'/g, ': undefined')
      .replace(/^(\s*)'([^ -]+)':/mg, '$1$2:')

    require('fs').writeFileSync(filename, json, 'utf8')
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
