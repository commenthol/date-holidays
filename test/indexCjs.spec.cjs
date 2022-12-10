const assert = require('assert')

describe('cjs', function () {
  it('module.exports', function () {
    const Holidays = require('../lib/index.cjs')
    const hd = new Holidays()
    const countries = hd.getCountries()
    assert.ok(Object.keys(countries).length > 100)
  })

  it('exports.default', function () {
    const Holidays = require('../lib/index.cjs').default
    const hd = new Holidays()
    const countries = hd.getCountries()
    assert.ok(Object.keys(countries).length > 100)
  })
})
