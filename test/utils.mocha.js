/* global describe, it */

var assert = require('assert')
var utils = require('../src/internal/utils')

describe('toDate', function () {
  it('should convert 2017 to 2017-01-01 to local date', function () {
    const res = utils.toDate(2017)
    assert.equal(res.toString(), new Date('2017-01-01 00:00').toString())
  })
  it('should convert 2017-05 to 2017-05-01 to local date', function () {
    const res = utils.toDate('2017-05')
    assert.equal(res.toString(), new Date('2017-05-01 00:00').toString())
  })
  it('should convert 2017-05-05 to 2017-05-05 to local date', function () {
    const res = utils.toDate('2017-05-05')
    assert.equal(res.toString(), new Date('2017-05-05 00:00').toString())
  })
  it('should convert 2017-05-05 to 2017-05-05 to utc date', function () {
    const res = utils.toDate('2017-05-05', true)
    assert.equal(res.toString(), new Date('2017-05-05T00:00Z').toString())
  })
})
