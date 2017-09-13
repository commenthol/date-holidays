'use strict'

const solstice = require('astronomia/lib/solstice')
const julian = require('astronomia/lib/julian')
const planetpos = require('astronomia/lib/planetposition')
const earth = new planetpos.Planet(require('astronomia/data/vsop87Bearth'))

const moment = require('moment-timezone')
const CalEvent = require('./CalEvent')
const CalDate = require('caldate')

class Equinox extends CalEvent {
  /**
   * @param {object} [opts]
   * @param {string} opts.season - type of season (spring|summer|autumn|winter)
   * @param {number|string} opts.offset - offset in days
   */
  constructor (opts) {
    opts = opts || {}
    super(opts)

    this._season = opts.season
    this._timezone = opts.timezone || 'GMT'
  }

  inYear (year) {
    let jde
    switch (this._season) {
      case 'march': {
        jde = solstice.march2(year, earth)
        break
      }
      case 'june': {
        jde = solstice.june2(year, earth)
        break
      }
      case 'september': {
        jde = solstice.september2(year, earth)
        break
      }
      case 'december': {
        jde = solstice.december2(year, earth)
        break
      }
    }

    const str = new julian.Calendar().fromJDE(jde).toDate().toISOString()
    let date
    if (/^[+-]\d{2}:\d{2}?$/.test(this._timezone)) { // for '+08:00' formats
      date = moment(str).utcOffset(this._timezone)
    } else { // for 'Asia/Shanghai' formats
      date = moment(str).tz(this._timezone) // move to timezone
    }

    const floorDate = {
      year: year,
      month: date.month() + 1,
      day: date.date()
    }

    const d = new CalDate(floorDate).setOffset(this.offset)
    this.dates.push(d)
    return this
  }
}
module.exports = Equinox
