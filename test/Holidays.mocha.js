'use strict'

/* global describe, it */

var assert = require('assert')
var Holidays = require('..')

var toIso = require('./lib/helper').toIso

describe('#Holidays', function () {
  describe('can query', function () {
    it('for countries', function () {
      var hd = new Holidays()
      var res = hd.getCountries()
      assert.ok(typeof res === 'object')
      assert.equal(res.DE, 'Deutschland')
    })

    it('for states of a country', function () {
      var hd = new Holidays()
      var res = hd.getStates('de')
      var exp = {
        bb: 'Brandenburg',
        bw: 'Baden Würtemberg',
        by: 'Bayern',
        hb: 'Hansestadt Bremen',
        he: 'Hessen',
        hh: 'Hansestadt Hamburg',
        mv: 'Mecklenburg Vorpommern',
        ni: 'Niedersachsen',
        nw: 'Nordrhein-Westfalen',
        rp: 'Rheinland-Pfalz',
        sh: 'Schleswig-Holstein',
        sl: 'Saarland',
        sn: 'Sachsen',
        st: 'Sachsen-Anhalt',
        th: 'Thüringen'
      }
      assert.deepEqual(res, exp)
    })

    it('for regions', function () {
      var hd = new Holidays()
      var res = hd.getRegions('de', 'by')
      var exp = { a: 'Stadt Augsburg',
        evang: {
          de: 'Überwiegend evangelische Gemeinden',
          en: 'Predominantly protestant communities'
        }}
      assert.deepEqual(res, exp)
    })

    it('for timezones', function () {
      var hd = new Holidays('US')
      var res = hd.getTimezones()
      var exp = [
        'America/New_York',
        'America/Detroit',
        'America/Kentucky/Louisville',
        'America/Kentucky/Monticello',
        'America/Indiana/Indianapolis',
        'America/Indiana/Vincennes',
        'America/Indiana/Winamac',
        'America/Indiana/Marengo',
        'America/Indiana/Petersburg',
        'America/Indiana/Vevay',
        'America/Chicago',
        'America/Indiana/Tell_City',
        'America/Indiana/Knox',
        'America/Menominee',
        'America/North_Dakota/Center',
        'America/North_Dakota/New_Salem',
        'America/North_Dakota/Beulah',
        'America/Denver',
        'America/Boise',
        'America/Phoenix',
        'America/Los_Angeles',
        'America/Metlakatla',
        'America/Anchorage',
        'America/Juneau',
        'America/Sitka',
        'America/Yakutat',
        'America/Nome',
        'America/Adak',
        'Pacific/Honolulu'
      ]
      assert.deepEqual(res, exp)
    })

    it('for languages', function () {
      var hd = new Holidays('BE')
      var res = hd.getLanguages()
      var exp = ['fr', 'nl', 'de', 'en']
      assert.deepEqual(res, exp)
    })

    it('for languages with no country set', function () {
      var hd = new Holidays()
      var res = hd.getLanguages()
      var exp = [ 'en' ]
      assert.deepEqual(res, exp)
    })

    it('for languages after init', function () {
      var hd = new Holidays()
      hd.init('BE')
      var res = hd.getLanguages()
      var exp = ['fr', 'nl', 'de', 'en']
      assert.deepEqual(res, exp)
    })

    it('for dayoff', function () {
      var hd = new Holidays('BE')
      var res = hd.getDayOff()
      var exp = 'sunday'
      assert.equal(res, exp)
    })

    it('for dayoff with no country set', function () {
      var hd = new Holidays()
      var res = hd.getDayOff()
      var exp
      assert.equal(res, exp)
    })

    it('for all countries', function () {
      var hd = new Holidays()
      var res = hd.query()
      assert.ok(typeof res === 'object')
      assert.equal(res.AT, 'Österreich')
    })

    it('for all states of AT', function () {
      var hd = new Holidays()
      var res = hd.query('AT')
      assert.ok(typeof res === 'object')
      assert.equal(res.b, 'Burgenland')
    })

    it('for all regions of DE by', function () {
      var hd = new Holidays()
      var res = hd.query('DE', 'by')
      assert.ok(typeof res === 'object')
      assert.equal(res.a, 'Stadt Augsburg')
    })

    it('for all regions of DE.by', function () {
      var hd = new Holidays()
      var res = hd.query('DE.by')
      assert.ok(typeof res === 'object')
      assert.equal(res.a, 'Stadt Augsburg')
    })
  })

  describe('can set', function () {
    it('a custom holiday on 06-22', function () {
      var hd = new Holidays()
      var res = hd.setHoliday('06-22')
      assert.ok(res)
      res = hd.isHoliday(new Date('2011-06-22 00:00'))
      var exp = {
        date: '2011-06-22 00:00:00',
        start: new Date('2011-06-22 00:00:00'),
        end: new Date('2011-06-23 00:00:00'),
        name: '06-22',
        type: 'public'
      }
      assert.ok(res)
      assert.deepEqual(res, exp)
    })

    it('a holiday to false such removing', function () {
      var hd = new Holidays('it')
      hd.setHoliday('01-01', false)
      assert.ok(!hd.holidays['01-01'])
    })
  })

  describe('can not set', function () {
    it('a holiday with wrong grammar', function () {
      var hd = new Holidays()
      var res = hd.setHoliday('bad-06-22')
      assert.ok(!res)
    })

    it('an undefined holiday to false', function () {
      var hd = new Holidays('it')
      var res = hd.setHoliday('13-01', false)
      assert.ok(!res)
    })
  })

  describe('can get list of holidays', function () {
    var expDe2015En = {
      'New Year\'s Day': 'thu 2015-01-01 00:00',
      'Women\'s Carnival Day': 'thu 2015-02-12 00:00',
      'Valentine\'s Day': 'sat 2015-02-14 00:00',
      'Shrove Monday': 'mon 2015-02-16 00:00',
      'Shrove Tuesday': 'tue 2015-02-17 14:00',
      'Ash Wednesday': 'wed 2015-02-18 00:00',
      'Maundy Thursday': 'thu 2015-04-02 00:00',
      'Good Friday': 'fri 2015-04-03 00:00',
      'Easter Sunday': 'sun 2015-04-05 00:00',
      'Easter Monday': 'mon 2015-04-06 00:00',
      'Labour Day': 'fri 2015-05-01 00:00',
      'Mother\'s Day': 'sun 2015-05-10 00:00',
      'Ascension Day': 'thu 2015-05-14 00:00',
      Pentecost: 'sun 2015-05-24 00:00',
      'Whit Monday': 'mon 2015-05-25 00:00',
      'National Holiday': 'sat 2015-10-03 00:00',
      'All Saints\' Day': 'sun 2015-11-01 00:00',
      'All Souls\' Day': 'mon 2015-11-02 00:00',
      'Saint Martin': 'wed 2015-11-11 00:00',
      'Day of Prayer and Repentance': 'wed 2015-11-18 00:00',
      'Christmas Eve': 'thu 2015-12-24 14:00',
      'Christmas Day': 'fri 2015-12-25 00:00',
      Boxingday: 'sat 2015-12-26 00:00',
      'New Year\'s Eve': 'thu 2015-12-31 14:00'
    }

    it('for current year', function () {
      var hd = new Holidays('at')
      var res = hd.getHolidays()[0]
      var str = (new Date()).getFullYear() + '-01-01 00:00:00'
      var exp = hd.moveToTimezone(new Date(str), 'Europe/Vienna')
      assert.equal(toIso(res.start), toIso(exp))
    })

    it('for year 2016 using a string', function () {
      var hd = new Holidays('at')
      var res = hd.getHolidays('2016')[0]
      var str = '2016-01-01 00:00:00'
      var exp = hd.moveToTimezone(new Date(str), 'Europe/Vienna')
      assert.equal(toIso(res.start), toIso(exp))
    })

    it('for year 2016 using a number', function () {
      var hd = new Holidays('at')
      var res = hd.getHolidays(2016)[0]
      var str = '2016-01-01 00:00:00'
      var exp = hd.moveToTimezone(new Date(str), 'Europe/Vienna')
      assert.equal(toIso(res.start), toIso(exp))
    })

    it('of German holidays for 2015', function () {
      var hd = new Holidays('de')
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.getHolidays(2015)
      var tmp = {}
      var exp = {
        Neujahr: 'thu 2015-01-01 00:00',
        'Valentinstag': 'sat 2015-02-14 00:00',
        Weiberfastnacht: 'thu 2015-02-12 00:00',
        Rosenmontag: 'mon 2015-02-16 00:00',
        Faschingsdienstag: 'tue 2015-02-17 14:00',
        Aschermittwoch: 'wed 2015-02-18 00:00',
        'Gründonnerstag': 'thu 2015-04-02 00:00',
        Karfreitag: 'fri 2015-04-03 00:00',
        Ostersonntag: 'sun 2015-04-05 00:00',
        Ostermontag: 'mon 2015-04-06 00:00',
        Maifeiertag: 'fri 2015-05-01 00:00',
        'Christi Himmelfahrt': 'thu 2015-05-14 00:00',
        Pfingstsonntag: 'sun 2015-05-24 00:00',
        Pfingstmontag: 'mon 2015-05-25 00:00',
        'Tag der Deutschen Einheit': 'sat 2015-10-03 00:00',
        Allerheiligen: 'sun 2015-11-01 00:00',
        Allerseelen: 'mon 2015-11-02 00:00',
        'Sankt Martin (Faschingsbeginn)': 'wed 2015-11-11 00:00',
        'Buß- und Bettag': 'wed 2015-11-18 00:00',
        'Heiliger Abend': 'thu 2015-12-24 14:00',
        '1. Weihnachtstag': 'fri 2015-12-25 00:00',
        '2. Weihnachtstag': 'sat 2015-12-26 00:00',
        Silvester: 'thu 2015-12-31 14:00',
        'Muttertag': 'sun 2015-05-10 00:00'
      }

      res.forEach(function (p) {
        tmp[p.name] = toIso(p.start)
      })
      // ~ console.log(tmp)
      assert.deepEqual(tmp, exp)
    })

    it('of public German holidays for 2015', function () {
      var hd = new Holidays('de', {types: ['public']})
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.getHolidays(2015)
      var tmp = {}
      var exp = {
        Neujahr: 'thu 2015-01-01 00:00',
        Karfreitag: 'fri 2015-04-03 00:00',
        Ostersonntag: 'sun 2015-04-05 00:00',
        Ostermontag: 'mon 2015-04-06 00:00',
        Maifeiertag: 'fri 2015-05-01 00:00',
        'Christi Himmelfahrt': 'thu 2015-05-14 00:00',
        Pfingstsonntag: 'sun 2015-05-24 00:00',
        Pfingstmontag: 'mon 2015-05-25 00:00',
        'Tag der Deutschen Einheit': 'sat 2015-10-03 00:00',
        '1. Weihnachtstag': 'fri 2015-12-25 00:00',
        '2. Weihnachtstag': 'sat 2015-12-26 00:00'
      }

      res.forEach(function (p) {
        tmp[p.name] = toIso(p.start)
      })
      // ~ console.log(tmp)
      assert.deepEqual(tmp, exp)
    })

    it('of German holidays for 2015 in english', function () {
      var hd = new Holidays('de', {languages: ['en']})
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.getHolidays(2015)
      var tmp = {}
      var exp = expDe2015En

      res.forEach(function (p) {
        tmp[p.name] = toIso(p.start)
      })
      // ~ console.log(tmp)
      assert.deepEqual(tmp, exp)
    })

    it('of German holidays for 2015 in english #2', function () {
      var hd = new Holidays('de')
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.getHolidays(2015, 'en')
      var tmp = {}
      var exp = expDe2015En

      res.forEach(function (p) {
        tmp[p.name] = toIso(p.start)
      })
      // ~ console.log(tmp)
      assert.deepEqual(tmp, exp)
    })

    it('of German holidays for 2015 in english #3', function () {
      var hd = new Holidays('de')
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      hd.setLanguages('en')
      var res = hd.getHolidays(2015)
      var tmp = {}
      var exp = expDe2015En

      res.forEach(function (p) {
        tmp[p.name] = toIso(p.start)
      })
      // ~ console.log(tmp)
      assert.deepEqual(tmp, exp)
    })
  })

  describe('can check', function () {
    it('if now is a holiday in France without exception', function () {
      var hd = new Holidays('fr')
      hd.isHoliday()
      assert.ok(true)
    })

    it('if 2015-01-01 is a holiday in Spain and return `Año Nuevo`', function () {
      var hd = new Holidays('es')
      var res = hd.isHoliday(new Date('2015-01-01T12:00'))
      assert.equal(res.name, 'Año Nuevo')
    })

    it('if 2015-01-01 is holiday in Iceland', function () {
      var hd = new Holidays('is')
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.isHoliday(new Date('2015-01-01'))
      assert.ok(res)
    })

    it('if 2013-12-31:10:00 is yet not a holiday in Germany', function () {
      var hd = new Holidays('de.th')
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.isHoliday(new Date('2013-12-31 10:00'))
      assert.ok(!res)
    })

    it('if 2014-12-31:14:00 is a holiday in Germany Thüringen', function () {
      var hd = new Holidays('de.th')
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.isHoliday(new Date('2014-12-31 14:00'))
      assert.ok(res)
    })

    it('if 2017-12-24:16:00 is a holiday in Germany', function () {
      var hd = new Holidays('de', { observance: true })
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.isHoliday(new Date('2017-12-24 16:00'))
      assert.ok(res)
    })

    it('if 2017-12-24:16:00 is a holiday in Germany Brandenburg', function () {
      var hd = new Holidays('de', 'bb', { observance: true })
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.isHoliday(new Date('2017-12-24 16:00'))
      assert.ok(res)
    })

    it('if Festa Nazionale 2011 was a holiday in Italy', function () {
      var hd = new Holidays('it')
      hd.setTimezone() // use local time to pass tests in other timezone other than `Europe/Berlin`
      var res = hd.isHoliday(new Date('2011-03-17 00:00'))
      assert.ok(res)
      assert.equal(res.name, 'Festa Nazionale 2011')
    })

    it('if 2015-12-07 can be disabled', function () {
      var hd = new Holidays()
      hd.setHoliday('1st monday after 12-01', {
        disable: ['2015-12-07'],
        name: {
          en: 'test'
        },
        type: 'public'
      })
      var res = hd.isHoliday(new Date('2015-12-07 00:00'))
      assert.ok(!res)
    })

    it('if 2015-12-07 can be disabled and moved to 2015-12-05', function () {
      var hd = new Holidays()
      hd.setHoliday('1st monday after 12-01', {
        disable: ['2015-12-07'],
        enable: ['2015-12-05'],
        name: {
          en: 'test'
        },
        type: 'public'
      })
      var d = new Date('2015-12-05 00:00')
      var res = hd.isHoliday(d)
      assert.equal(toIso(res.start), 'sat 2015-12-05 00:00')
      assert.equal(toIso(res.end), 'sun 2015-12-06 00:00')
    })

    it('if 2015-12-07 can not be disabled for 2016', function () {
      var hd = new Holidays()
      hd.setHoliday('1st monday after 12-01', {
        disable: ['2015-12-07'],
        enable: ['2015-12-05'],
        name: {
          en: 'test'
        },
        type: 'public'
      })
      var d = new Date('2016-12-05 00:00')
      var res = hd.isHoliday(d)
      assert.equal(toIso(res.start), 'mon 2016-12-05 00:00')
      assert.equal(toIso(res.end), 'tue 2016-12-06 00:00')
    })
  })
})
