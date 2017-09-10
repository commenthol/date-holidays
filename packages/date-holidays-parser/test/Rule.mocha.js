/* global describe, it */

const assert = require('assert')
const fixResult = require('./lib/helper').fixResult
const Rule = require('../src/Rule')
const testcases = require('./fixtures/parser')
const CalEventFactory = require('../src/CalEventFactory')

describe('#Rule', function () {
  it('can resolve rule dateIfThen', function () {
    var tc = testcases['01-01 if monday then next monday']
    var ruleFn = new Rule()
    var calEvent = new CalEventFactory(tc[0]).inYear(2018)
    ruleFn.setEvent(calEvent).resolve(tc[1])
    var exp = [{
      date: '2018-01-08 00:00:00',
      start: 'mon 2018-01-08 00:00',
      end: 'tue 2018-01-09 00:00'
    }]
    assert.deepEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve time rule', function () {
    var tc = testcases['01-01 14:00']
    var ruleFn = new Rule()
    var calEvent = new CalEventFactory(tc[0]).inYear(2015)
    ruleFn.setEvent(calEvent).resolve(tc[1])
    var exp = [{
      date: '2015-01-01 14:00:00',
      start: 'thu 2015-01-01 14:00',
      end: 'fri 2015-01-02 00:00'
    }]
    assert.deepEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateIfThen with time', function () {
    var tc = testcases['05-01 14:00 if sunday then 00:00']
    var ruleFn = new Rule()
    var calEvent = new CalEventFactory(tc[0]).inYear(2016)
    ruleFn.setEvent(calEvent).resolve(tc[1]).resolve(tc[2])
    var exp = [{
      date: '2016-05-01 00:00:00',
      start: 'sun 2016-05-01 00:00',
      end: 'mon 2016-05-02 00:00'
    }]
    assert.deepEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateDir', function () {
    var tc = testcases['wednesday before 11-23']
    var calEvent = new CalEventFactory(tc[0]).inYear(2016)
    var ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    var exp = [{
      date: '2016-11-16 00:00:00',
      start: 'wed 2016-11-16 00:00',
      end: 'thu 2016-11-17 00:00'
    }]
    assert.deepEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateDir using day count before', function () {
    var tc = testcases['4 days before 11-23']
    var calEvent = new CalEventFactory(tc[0]).inYear(2016)
    var ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    var exp = [{
      date: '2016-11-19 00:00:00',
      start: 'sat 2016-11-19 00:00',
      end: 'sun 2016-11-20 00:00'
    }]
    assert.deepEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateDir using day count after', function () {
    var tc = testcases['4 days after 11-27']
    var calEvent = new CalEventFactory(tc[0]).inYear(2016)
    var ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    var exp = [{
      date: '2016-12-01 00:00:00',
      start: 'thu 2016-12-01 00:00',
      end: 'fri 2016-12-02 00:00'
    }]
    assert.deepEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule year', function () {
    var tc = testcases['11-01 in odd years']
    var calEvent = new CalEventFactory(tc[0]).inYear(2015)
    var ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    var exp = [{
      date: '2015-11-01 00:00:00',
      start: 'sun 2015-11-01 00:00',
      end: 'mon 2015-11-02 00:00'
    }]
    assert.deepEqual(fixResult(calEvent.get()), exp)
  })

  it('can resolve rule dateBridge', function () {
    var tc = testcases['09-22 if 09-21 is holiday']
    var calEvent = new CalEventFactory(tc[0]).inYear(2015)
    var ruleFn = new Rule()
    ruleFn.setEvent(calEvent).resolve(tc[1])
    var exp = [{
      date: '2015-09-22 00:00:00',
      start: 'tue 2015-09-22 00:00',
      end: 'wed 2015-09-23 00:00'
    }]
    assert.deepEqual(fixResult(calEvent.get()), exp)
  })
})
