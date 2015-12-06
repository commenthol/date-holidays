'use strict'

/* global describe, it */

var fs = require('fs')
var assert = require('assert')
var Holidays = require('..')

var writetests

for (var i in process.argv) {
  // regenerate tests with `mocha test/all.mocha.js --writetests`
  if (process.argv[i] === '--writetests') {
    writetests = true
    break
  }
}

var years = [ 2015, 2016, 2017, 2018, 2019, 2020 ]

function filename (name) {
  var file = __dirname + '/assets/' + name + '.json'
  return file
}

function writeFile (name, obj) {
  if (writetests) {
    var file = filename(name)
    fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8')
  }
}

function test (year, country, state, region) {
  var name = country + (state ? '-' + state : '') + (region ? '-' + region : '') + '-' + year

  it(name, function () {
    var hd = new Holidays(country, state, region)
    var res = hd.getHolidays(year)

    for (var i in res) {
      assert.ok(typeof res[i].name === 'string', 'translation missing for rule ' + i + ': ' + JSON.stringify(res[i]))
    }

    writeFile(name, res)
    var exp = fs.readFileSync(filename(name), 'utf8')
    assert.equal(JSON.stringify(res, null, 2), exp)
  })
}

describe('#All Holidays', function () {
  years.forEach(function (year) {
    var countries = Holidays().getCountries()

    Object.keys(countries).forEach(function (country) {
      describe(year + ':' + country, function () {
        test(year, country)

        var states = Holidays().getStates(country)

        if (states) {
          Object.keys(states).forEach(function (state) {
            test(year, country, state)

            describe(state, function () {
              var regions = Holidays().getRegions(country, state)

              if (regions) {
                Object.keys(regions).forEach(function (region) {
                  test(year, country, state, region)
                })
              }
            })
          })
        }
      })
    })
  })
})
