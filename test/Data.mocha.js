/* global describe, it */

'use strict'

const assert = require('assert')
const Data = require('../src/Data')

// reformat days
function getDays (obj, lang) {
  var res = {}
  Object.keys(obj).forEach(function (p) {
    var arr = []
    var name
    arr.push(obj[p].type)

    for (var i in lang) {
      if ((name = obj[p].name[lang[i]])) {
        arr.push(name)
        break
      }
    }

    res[p] = arr
  })
  return res
}

describe('#Data', function () {
  describe('static functions', function () {
    it('can get list of supported countries', function () {
      var obj = new Data().getCountries()
      assert.equal(typeof obj, 'object')
      assert.equal(obj.AT, 'Österreich')
      assert.equal(obj.CH, 'Schweiz')
      assert.equal(obj.DE, 'Deutschland')
      assert.equal(obj.ES, 'España')
      assert.equal(obj.GR, 'Ελλάδα')
    })

    it('can get list of supported states for AT', function () {
      var obj = new Data().getStates('at')
      assert.equal(typeof obj, 'object')
      assert.deepEqual(obj, {
        '1': 'Burgenland',
        '2': 'Kärnten',
        '3': 'Niederösterreich',
        '4': 'Oberösterreich',
        '5': 'Land Salzburg',
        '6': 'Steiermark',
        '7': 'Tirol',
        '8': 'Vorarlberg',
        '9': 'Wien'
      })
    })

    it('can get list of supported states for AT in en', function () {
      var obj = new Data().getStates('at', 'en')
      assert.equal(typeof obj, 'object')
      assert.deepEqual(obj, {
        '1': 'Burgenland',
        '2': 'Carinthia',
        '3': 'Lower Austria',
        '4': 'Upper Austria',
        '5': 'Salzburg',
        '6': 'Styria',
        '7': 'Tyrol',
        '8': 'Vorarlberg',
        '9': 'Vienna'
      })
    })

    it('can get a list of supported regions for DE-BY', function () {
      var obj = new Data().getRegions('DE-BY')
      assert.equal(typeof obj, 'object')
      assert.deepEqual(obj, {
        A: 'Stadt Augsburg',
        EVANG: 'Überwiegend evangelische Gemeinden'
      })
    })
  })

  describe('can get list of holidays for a country', function () {
    it('for FR', function () {
      var obj = new Data('fr').getHolidays()
      var res = getDays(obj, ['fr'])
      var exp = { '01-01': [ 'public', 'Nouvel An' ],
        'easter 1': [ 'public', 'Lundi de Pâques' ],
        '05-01': [ 'public', 'Fête du travail' ],
        '05-08': [ 'public', 'Fête de la Victoire 1945' ],
        'easter 39': [ 'public', 'Ascension' ],
        'easter 49': [ 'public', 'Pentecôte' ],
        'easter 50': [ 'public', 'Lundi de Pentecôte' ],
        'sunday before 06-01': [ 'observance', 'Fête des Mères' ],
        '07-14': [ 'public', 'Fête Nationale de la France' ],
        '08-15': [ 'public', 'Assomption' ],
        '11-01': [ 'public', 'Toussaint' ],
        '11-11': [ 'public', 'Armistice 1918' ],
        '12-25': [ 'public', 'Noël' ]
      }
      // ~ console.log(res)
      assert.deepEqual(res, exp)
    })
  })

  describe('can get list of holidays for a state', function () {
    it('for FR-67', function () {
      var obj = new Data('FR-67').getHolidays()
      var res = getDays(obj, ['fr'])
      var exp = { '01-01': [ 'public', 'Nouvel An' ],
        'easter 1': [ 'public', 'Lundi de Pâques' ],
        '05-01': [ 'public', 'Fête du travail' ],
        '05-08': [ 'public', 'Fête de la Victoire 1945' ],
        'easter 39': [ 'public', 'Ascension' ],
        'easter 49': [ 'public', 'Pentecôte' ],
        'easter 50': [ 'public', 'Lundi de Pentecôte' ],
        'sunday before 06-01': [ 'observance', 'Fête des Mères' ],
        '07-14': [ 'public', 'Fête Nationale de la France' ],
        '08-15': [ 'public', 'Assomption' ],
        '11-01': [ 'public', 'Toussaint' ],
        '11-11': [ 'public', 'Armistice 1918' ],
        '12-25': [ 'public', 'Noël' ],
        'easter -2': [ 'public', 'Vendredi saint' ],
        '12-26': [ 'public', 'Lendemain de Noël' ]
      }
      // ~ console.log(res)
      assert.deepEqual(res, exp)
    })
  })

  describe('can get list of holidays by region', function () {
    var exp = {
      '01-01': [ 'public', 'Neujahr' ],
      '02-14': [ 'observance', 'Valentinstag' ],
      'easter -52': [ 'observance', 'Weiberfastnacht' ],
      'easter -48': [ 'observance', 'Rosenmontag' ],
      'easter -47 14:00': [ 'bank', 'Faschingsdienstag' ],
      'easter -46': [ 'observance', 'Aschermittwoch' ],
      'easter -3': [ 'observance', 'Gründonnerstag' ],
      'easter -2': [ 'public', 'Karfreitag' ],
      easter: [ 'observance', 'Ostersonntag' ],
      'easter 1': [ 'public', 'Ostermontag' ],
      '05-01': [ 'public', 'Maifeiertag' ],
      '2nd sunday in May': [ 'observance', 'Muttertag' ],
      'easter 39': [ 'public', 'Christi Himmelfahrt' ],
      'easter 49': [ 'observance', 'Pfingstsonntag' ],
      'easter 50': [ 'public', 'Pfingstmontag' ],
      '10-03': [ 'public', 'Tag der Deutschen Einheit' ],
      '11-01': [ 'public', 'Allerheiligen' ],
      '11-02': [ 'observance', 'Allerseelen' ],
      '11-11': [ 'observance', 'Sankt Martin (Faschingsbeginn)' ],
      'wednesday before 11-23': [ 'school', 'Buß- und Bettag' ],
      '12-24 14:00 if sunday then 00:00': [ 'bank', 'Heiliger Abend' ],
      '12-25': [ 'public', '1. Weihnachtstag' ],
      '12-26': [ 'public', '2. Weihnachtstag' ],
      '12-31 14:00 if sunday then 00:00': [ 'bank', 'Silvester' ],
      '01-06': [ 'public', 'Heilige Drei Könige' ],
      '02-02': [ 'observance', 'Lichtmess' ],
      'easter 60': [ 'public', 'Fronleichnam' ],
      '08-15': [ 'public', 'Mariä Himmelfahrt' ],
      '08-08': [ 'public', 'Augsburger Friedensfest' ],
      '6th sunday before 12-25': [ 'observance', 'Volkstrauertag' ],
      '5th sunday before 12-25': [ 'observance', 'Totensonntag' ],
      '2017-10-31': [ 'public', 'Reformationstag' ]
    }

    it('for DE BY A', function () {
      var obj = new Data('DE', 'BY', 'A').getHolidays()
      var res = getDays(obj, ['de'])
      // console.log(res)
      assert.deepEqual(res, exp)
    })

    it('for DE-BY-A', function () {
      var obj = new Data('DE-BY-A').getHolidays()
      var res = getDays(obj, ['de'])
      assert.deepEqual(res, exp)
    })

    it('for {DE BY A}', function () {
      var obj = new Data({country: 'DE', state: 'BY', region: 'A'}).getHolidays()
      var res = getDays(obj, ['de'])
      assert.deepEqual(res, exp)
    })
  })

  it.skip('devel', function () {
    var obj = new Data('gb.sc').getHolidays()
    console.log(obj)
    var res = getDays(obj, ['en'])
    console.log(res)
  })
})
