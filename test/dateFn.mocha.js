'use strict'

/* global describe, it */

var _ = require('lodash')
var assert = require('assert')
var dateFn = require('../lib/dateFn')
var toIso = require('./lib/helper').toIso

var _tc = require('./lib/testcases.js')

function tc (key) {
  var o = _.merge({}, _tc[key])
  assert.ok(o)
  return o
}

describe('#dateFn', function () {
  describe('General', function () {
    it('can convert a date to a string', function () {
      var res = dateFn.toString(new Date(2015, 11, 31, 23, 59, 59))
      var exp = '2015-12-31 23:59:59'
      assert.equal(res, exp)
    })
  })

  describe('Fixed Date', function () {
    it('03-12', function () {
      var fn = dateFn(tc('03-12'))
      var res = fn(2016)
      assert.equal(toIso(res.start), 'sat 2016-03-12 00:00')
      assert.equal(toIso(res.end), 'sun 2016-03-13 00:00')
    })

    it('03-12T16', function () {
      var fn = dateFn(tc('03-12T16'))
      var res = fn(2016)
      assert.equal(toIso(res.start), 'sat 2016-03-12 16:00')
      assert.equal(toIso(res.end), 'sun 2016-03-13 00:00')
    })

    it('2015-10-09', function () {
      var fn = dateFn(tc('2015-10-09'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'fri 2015-10-09 00:00')
      assert.equal(toIso(res.end), 'sat 2015-10-10 00:00')
    })

    it('2015-10-09 for 2016', function () {
      var fn = dateFn(tc('2015-10-09'))
      var res = fn(2016)
      assert.ok(!res)
    })
  })

  describe('Movable Date', function () {
    describe('christian dates', function () {
      it('3 days before Easter', function () {
        var fn = dateFn(tc('easter -3'))
        var res = fn(2015)
        assert.equal(toIso(res.start), 'thu 2015-04-02 00:00')
        assert.equal(toIso(res.end), 'fri 2015-04-03 00:00')
      })

      it('50 days after Orthodox Easter', function () {
        var fn = dateFn(tc('orthodox 50'))
        var res = fn(2015)
        assert.equal(toIso(res.start), 'mon 2015-06-01 00:00')
        assert.equal(toIso(res.end), 'tue 2015-06-02 00:00')
      })
    })

    describe('islamic dates', function () {
      // hijri calendar
      it('3 Shawwal', function () {
        var fn = dateFn(tc('3 Shawwal'))
        var res = fn(2015)[0]
        assert.equal(toIso(res.start), 'sat 2015-07-18 18:00')
        assert.equal(toIso(res.end), 'sun 2015-07-19 18:00')
      })

      it('13 Rabi al-thani', function () {
        var fn = dateFn(tc('13 Rabi al-thani'))
        var res = fn(2017)
        assert.equal(toIso(res[0].start), 'tue 2017-01-10 18:00')
        assert.equal(toIso(res[0].end), 'wed 2017-01-11 18:00')
        assert.equal(toIso(res[1].start), 'sat 2017-12-30 18:00')
        assert.equal(toIso(res[1].end), 'sun 2017-12-31 18:00')
      })
    })

    describe('hebrew calendar', function () {
      // hebrew calendar
      it('15 Nisan 5775', function () {
        var fn = dateFn(tc('15 Nisan'))
        var res = fn(2015)
        assert.equal(toIso(res[0].start), 'fri 2015-04-03 18:00')
        assert.equal(toIso(res[0].end), 'sat 2015-04-04 18:00')
      })

      it('15 Nisan 5776', function () {
        var fn = dateFn(tc('15 Nisan'))
        var res = fn(2016)
        assert.equal(toIso(res[0].start), 'fri 2016-04-22 18:00')
        assert.equal(toIso(res[0].end), 'sat 2016-04-23 18:00')
      })

      it('18 Tevet 5775/ 5776', function () {
        var fn = dateFn(tc('18 Tevet'))
        var res = fn(2015)
        assert.equal(toIso(res[0].start), 'thu 2015-01-08 18:00')
        assert.equal(toIso(res[0].end), 'fri 2015-01-09 18:00')
        assert.equal(toIso(res[1].start), 'tue 2015-12-29 18:00')
        assert.equal(toIso(res[1].end), 'wed 2015-12-30 18:00')
      })
    })

    // equinox
    describe('equinox', function () {
      it('spring equinox', function () {
        var fn = dateFn(tc('spring equinox'))
        var res = fn(2015)
        assert.equal(toIso(res.start), 'fri 2015-03-20 00:00')
        assert.equal(toIso(res.end), 'sat 2015-03-21 00:00')
      })

      it('spring equinox in Asia/Tokyo', function () {
        var fn = dateFn(tc('spring equinox in Asia/Tokyo'))
        var res = fn(2015)
        assert.equal(toIso(res.start), 'sat 2015-03-21 00:00')
        assert.equal(toIso(res.end), 'sun 2015-03-22 00:00')
      })

      it('3 days after autumn equinox', function () {
        var fn = dateFn(tc('3 days after autumn equinox'))
        var res = fn(2015)
        assert.equal(toIso(res.start), 'sat 2015-09-26 00:00')
        assert.equal(toIso(res.end), 'sun 2015-09-27 00:00')
      })

      it('1 day before summer solstice', function () {
        var fn = dateFn(tc('1 day before summer solstice'))
        var res = fn(2015)
        assert.equal(toIso(res.start), 'sat 2015-06-20 00:00')
        assert.equal(toIso(res.end), 'sun 2015-06-21 00:00')
      })

      it('3rd monday before winter solstice', function () {
        var fn = dateFn(tc('3rd monday before winter solstice'))
        var res = fn(2015)
        assert.equal(toIso(res.start), 'mon 2015-12-07 00:00')
        assert.equal(toIso(res.end), 'tue 2015-12-08 00:00')
      })
    })
  })

  describe('Different start-time', function () {
    it('01-01 14:00', function () {
      var fn = dateFn(tc('01-01 14:00'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'thu 2015-01-01 14:00')
      assert.equal(toIso(res.end), 'fri 2015-01-02 00:00')
    })

    it('easter -3 14:00', function () {
      var fn = dateFn(tc('easter -3 14:00'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'thu 2015-04-02 14:00')
      assert.equal(toIso(res.end), 'fri 2015-04-03 00:00')
    })
  })

  describe('Different Duration', function () {
    it('09-04 08:00 +14h', function () {
      var fn = dateFn(tc('09-04 08:00 +14h'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'fri 2015-09-04 08:00')
      assert.equal(toIso(res.end), 'fri 2015-09-04 22:00')
    })

    it('09-04 08:00 +321h', function () {
      var fn = dateFn(tc('09-04 08:00 +321h'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'fri 2015-09-04 08:00')
      assert.equal(toIso(res.end), 'thu 2015-09-17 17:00')
    })

    it('easter -3 14:00 +4h', function () {
      var fn = dateFn(tc('easter -3 14:00 +4hours'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'thu 2015-04-02 14:00')
      assert.equal(toIso(res.end), 'thu 2015-04-02 18:00')
    })

    it('easter -3 14:00 +3days', function () {
      var fn = dateFn(tc('easter -3 14:00 +3days'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'thu 2015-04-02 14:00')
      assert.equal(toIso(res.end), 'sun 2015-04-05 14:00')
    })
  })

  describe('Start-time changes per weekday', function () {
    it('05-01 14:00 if sunday then 00:00', function () {
      var fn = dateFn(tc('05-01 14:00 if sunday then 00:00'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'fri 2015-05-01 14:00')
      assert.equal(toIso(res.end), 'sat 2015-05-02 00:00')
    })

    it('05-01 14:00 if sunday then 00:00 in 2016', function () {
      var fn = dateFn(tc('05-01 14:00 if sunday then 00:00'))
      var res = fn(2016)
      assert.equal(toIso(res.start), 'sun 2016-05-01 00:00')
      assert.equal(toIso(res.end), 'mon 2016-05-02 00:00')
    })

    it('01-01 if sunday then next monday 14:10 if sunday then 01:59', function () {
      var fn = dateFn(tc('01-01 if sunday then next monday 14:10 if sunday then 01:59'))
      var res = fn(2015)[0]
      assert.equal(toIso(res.start), 'thu 2015-01-01 14:10')
      assert.equal(toIso(res.end), 'fri 2015-01-02 00:00')
    })

    it('01-01 if sunday then next monday 14:10 if sunday then 01:59 in 2017', function () {
      var fn = dateFn(tc('01-01 if sunday then next monday 14:10 if sunday then 01:59'))
      var res = fn(2017)[0]
      assert.equal(toIso(res.start), 'mon 2017-01-02 01:59')
      assert.equal(toIso(res.end), 'tue 2017-01-03 00:00')
    })

    it('12-31 14:00 if sunday then 00:00', function () {
      var fn = dateFn(tc('12-31 14:00 if sunday then 00:00'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'thu 2015-12-31 14:00')
      assert.equal(toIso(res.end), 'fri 2016-01-01 00:00')
    })

    it('12-31 14:00 if sunday then 00:00 in 2017', function () {
      var fn = dateFn(tc('12-31 14:00 if sunday then 00:00'))
      var res = fn(2017)
      assert.equal(toIso(res.start), 'sun 2017-12-31 00:00')
      assert.equal(toIso(res.end), 'mon 2018-01-01 00:00')
    })
  })

  describe('Changes to different weekday', function () {
    it('wednesday before 11-23', function () {
      var fn = dateFn(tc('wednesday before 11-23'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'wed 2015-11-18 00:00')
      assert.equal(toIso(res.end), 'thu 2015-11-19 00:00')
    })

    it('2nd sunday before 11-01', function () {
      var fn = dateFn(tc('2nd sunday before 11-01'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'sun 2015-10-18 00:00')
      assert.equal(toIso(res.end), 'mon 2015-10-19 00:00')
    })

    it('2nd sunday after 11-01', function () {
      var fn = dateFn(tc('2nd sunday after 11-01'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'sun 2015-11-08 00:00')
      assert.equal(toIso(res.end), 'mon 2015-11-09 00:00')
    })

    it('tuesday before 4th thursday after 11-01', function () {
      var fn = dateFn(tc('tuesday before 4th thursday after 11-01'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'tue 2015-11-24 00:00')
      assert.equal(toIso(res.end), 'wed 2015-11-25 00:00')
    })

    it('tuesday before 2nd tuesday after 11-01', function () {
      var fn = dateFn(tc('tuesday before 2nd tuesday after 11-01'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'tue 2015-11-03 00:00')
      assert.equal(toIso(res.end), 'wed 2015-11-04 00:00')
    })

    it('sunday after 4th thursday after 11-01', function () {
      var fn = dateFn(tc('sunday after 4th thursday after 11-01'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'sun 2015-11-29 00:00')
      assert.equal(toIso(res.end), 'mon 2015-11-30 00:00')
    })
  })

  describe('Change to different weekday if date falls on a certain weekday', function () {
    it('01-01 if monday then next monday', function () {
      var fn = dateFn(tc('01-01 if monday then next monday'))
      var res = fn(2018)[0]
      assert.equal(toIso(res.start), 'mon 2018-01-08 00:00')
      assert.equal(toIso(res.end), 'tue 2018-01-09 00:00')
    })

    it('01-01 if monday then next monday for 2015', function () {
      var fn = dateFn(tc('01-01 if monday then next monday'))
      var res = fn(2015)[0]
      assert.equal(toIso(res.start), 'thu 2015-01-01 00:00')
      assert.equal(toIso(res.end), 'fri 2015-01-02 00:00')
    })

    it('01-01 if sunday then previous monday', function () {
      var fn = dateFn(tc('01-01 if sunday then previous monday'))
      var res = fn(2017)[0]
      assert.equal(toIso(res.start), 'mon 2016-12-26 00:00')
      assert.equal(toIso(res.end), 'tue 2016-12-27 00:00')
    })

    it('01-01 if sunday then previous monday for 2016', function () {
      var fn = dateFn(tc('01-01 if sunday then previous monday'))
      var res = fn(2016)[0]
      assert.equal(toIso(res.start), 'fri 2016-01-01 00:00')
      assert.equal(toIso(res.end), 'sat 2016-01-02 00:00')
    })

    it('01-01 if sunday then next sunday', function () {
      var fn = dateFn(tc('01-01 if sunday then next sunday'))
      var res = fn(2017)[0]
      assert.equal(toIso(res.start), 'sun 2017-01-08 00:00')
      assert.equal(toIso(res.end), 'mon 2017-01-09 00:00')
    })

    it('01-01 if sunday then previous sunday', function () {
      var fn = dateFn(tc('01-01 if sunday then previous sunday'))
      var res = fn(2017)[0]
      assert.equal(toIso(res.start), 'sun 2016-12-25 00:00')
      assert.equal(toIso(res.end), 'mon 2016-12-26 00:00')
    })

    it('substitutes 01-01 if sunday then next tuesday in 2017', function () {
      var fn = dateFn(tc('substitutes 01-01 if sunday then next tuesday'))
      var res = fn(2017)[0]
      assert.equal(toIso(res.start), 'tue 2017-01-03 00:00')
      assert.equal(toIso(res.end), 'wed 2017-01-04 00:00')
    })

    it('substitutes 01-01 if sunday then next tuesday in 2016', function () {
      var fn = dateFn(tc('substitutes 01-01 if sunday then next tuesday'))
      var res = fn(2016)
      assert.ok(!res.start)
    })

    it('substitutes 1 Shawwal if wednesday,saturday,sunday then next monday in 2016', function () {
      var fn = dateFn(tc('substitutes 1 Shawwal if wednesday,saturday,sunday then next monday'))
      var res = fn(2016)[0]
      // console.log(res)
      assert.equal(toIso(res.start), 'mon 2016-07-11 00:00')
      assert.equal(toIso(res.end), 'tue 2016-07-12 00:00')
    })

    it('substitutes 1 Shawwal if wednesday,saturday,sunday then next monday in 2018', function () {
      var fn = dateFn(tc('substitutes 1 Shawwal if wednesday,saturday,sunday then next monday'))
      var res = fn(2018)[0]
      // console.log(res)
      assert.ok(!res.start)
    })

    it('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday 2015', function () {
      var fn = dateFn(tc('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday'))
      var res = fn(2015)[0]
      assert.equal(toIso(res.start), 'mon 2015-10-12 00:00')
      assert.equal(toIso(res.end), 'tue 2015-10-13 00:00')
    })

    it('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday 2016', function () {
      var fn = dateFn(tc('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday'))
      var res = fn(2016)[0]
      assert.equal(toIso(res.start), 'mon 2016-10-10 00:00')
      assert.equal(toIso(res.end), 'tue 2016-10-11 00:00')
    })

    it('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday 2017', function () {
      var fn = dateFn(tc('10-12 if tuesday,wednesday then previous monday if thursday,friday,saturday,sunday then next monday'))
      var res = fn(2017)[0]
      assert.equal(toIso(res.start), 'mon 2017-10-16 00:00')
      assert.equal(toIso(res.end), 'tue 2017-10-17 00:00')
    })
  })

  describe('Enable Date only for certain years', function () {
    it('11-01 in even years', function () {
      var fn = dateFn(tc('11-01 in even years'))
      var res = fn(2014)
      assert.equal(toIso(res.start), 'sat 2014-11-01 00:00')
      assert.equal(toIso(res.end), 'sun 2014-11-02 00:00')
    })

    it('11-01 in even years for 2015', function () {
      var fn = dateFn(tc('11-01 in even years'))
      var res = fn(2015)
      assert.ok(!res)
    })

    it('11-01 in odd years', function () {
      var fn = dateFn(tc('11-01 in odd years'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'sun 2015-11-01 00:00')
      assert.equal(toIso(res.end), 'mon 2015-11-02 00:00')
    })

    it('11-01 in odd years for 2014', function () {
      var fn = dateFn(tc('11-01 in odd years'))
      var res = fn(2014)
      assert.ok(!res)
    })

    it('11-01 in leap years for 2000', function () {
      var fn = dateFn(tc('11-01 in leap years'))
      var res = fn(2000)
      assert.equal(toIso(res.start), 'wed 2000-11-01 00:00')
      assert.equal(toIso(res.end), 'thu 2000-11-02 00:00')
    })

    it('11-01 in leap years for 2012', function () {
      var fn = dateFn(tc('11-01 in leap years'))
      var res = fn(2012)
      assert.equal(toIso(res.start), 'thu 2012-11-01 00:00')
      assert.equal(toIso(res.end), 'fri 2012-11-02 00:00')
    })

    it('11-01 in leap years for 2014', function () {
      var fn = dateFn(tc('11-01 in leap years'))
      var res = fn(2014)
      assert.ok(!res)
    })

    it('11-01 in non-leap years for 2011', function () {
      var fn = dateFn(tc('11-01 in non-leap years'))
      var res = fn(2011)
      assert.equal(toIso(res.start), 'tue 2011-11-01 00:00')
      assert.equal(toIso(res.end), 'wed 2011-11-02 00:00')
    })

    it('11-01 in non-leap years for 2012', function () {
      var fn = dateFn(tc('11-01 in non-leap years'))
      var res = fn(2012)
      assert.ok(!res)
    })

    it('tuesday after 1st monday after 11-01 in even years', function () {
      var fn = dateFn(tc('tuesday after 1st monday after 11-01 in even years'))
      var res = fn(2014)
      assert.equal(toIso(res.start), 'tue 2014-11-04 00:00')
      assert.equal(toIso(res.end), 'wed 2014-11-05 00:00')
    })

    it('tuesday after 1st monday after 11-01 in even years for 2015', function () {
      var fn = dateFn(tc('tuesday after 1st monday after 11-01 in even years'))
      var res = fn(2015)
      assert.ok(!res)
    })

    it('tuesday after 1st monday after 11-01 in odd years', function () {
      var fn = dateFn(tc('tuesday after 1st monday after 11-01 in odd years'))
      var res = fn(2015)
      assert.equal(toIso(res.start), 'tue 2015-11-03 00:00')
      assert.equal(toIso(res.end), 'wed 2015-11-04 00:00')
    })

    it('tuesday after 1st monday after 11-01 in odd years for 2014', function () {
      var fn = dateFn(tc('tuesday after 1st monday after 11-01 in odd years'))
      var res = fn(2014)
      assert.ok(!res)
    })

    it('12-01 every 6 years since 1934', function () {
      var fn = dateFn(tc('12-01 every 6 years since 1934'))
      var res = fn(2012)
      assert.equal(toIso(res.start), 'sat 2012-12-01 00:00')
      assert.equal(toIso(res.end), 'sun 2012-12-02 00:00')
    })

    it('12-01 every 6 years since 1934 for 2011', function () {
      var fn = dateFn(tc('12-01 every 6 years since 1934'))
      var res = fn(2011)
      assert.ok(!res)
    })
  })

  describe('Bridge Days', function () {
    it('09-22 if 09-21 and 09-23 is public holiday', function () {
      var rules = [
        {
          fn: dateFn(tc('09-21')),
          type: 'public'
        },
        {
          fn: dateFn(tc('09-23')),
          type: 'public'
        }
      ]
      var fn = dateFn(tc('09-22 if 09-21 and 09-23 is public holiday'), rules)
      var res = fn(2015)
      assert.equal(toIso(res.start), 'tue 2015-09-22 00:00')
      assert.equal(toIso(res.end), 'wed 2015-09-23 00:00')
    })

    it('09-22 if 09-21 and 09-23 is public holiday where 09-23 is not a holiday', function () {
      var rules = [
        {
          fn: dateFn(tc('09-21')),
          type: 'public'
        },
        {
          fn: dateFn(tc('03-12')),
          type: 'public'
        }
      ]
      var fn = dateFn(tc('09-22 if 09-21 and 09-23 is public holiday'), rules)
      var res = fn(2015)
      assert.ok(!res)
    })

    it('09-22 if 09-21 and 09-23 is public holiday where 09-23 is of type observance', function () {
      var rules = [
        {
          fn: dateFn(tc('09-21')),
          type: 'public'
        },
        {
          fn: dateFn(tc('09-23')),
          type: 'observance'
        }
      ]
      var fn = dateFn(tc('09-22 if 09-21 and 09-23 is public holiday'), rules)
      var res = fn(2015)
      assert.ok(!res)
    })

    it('09-22 if 09-21 is holiday', function () {
      var rules = [
        {
          fn: dateFn(tc('09-21')),
          type: 'public'
        },
        {
          fn: dateFn(tc('09-23')),
          type: 'public'
        }
      ]
      var fn = dateFn(tc('09-22 if 09-21 is holiday'), rules)
      var res = fn(2015)
      assert.equal(toIso(res.start), 'tue 2015-09-22 00:00')
      assert.equal(toIso(res.end), 'wed 2015-09-23 00:00')
    })

    it('09-22 if 09-21 is holiday (bad case)', function () {
      var rules = [
        {
          fn: dateFn(tc('09-23')),
          type: 'public'
        },
        {
          fn: dateFn(tc('03-12')),
          type: 'public'
        }
      ]
      var fn = dateFn(tc('09-22 if 09-21 is holiday'), rules)
      var res = fn(2015)
      assert.ok(!res)
    })
  })
})
