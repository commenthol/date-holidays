'use strict'

const easter = require('date-easter')
const CalEvent = require('./CalEvent')
const CalDate = require('caldate')

class Easter extends CalEvent {
  /**
   * @param {object} [opts]
   * @param {string} opts.type - type of eastern (easter|orthodox)
   * @param {number|string} opts.offset - offset in days
   */
  constructor (opts) {
    opts = opts || {}
    super(opts)

    this._fn = easter.easter
    if (opts.type === 'orthodox') {
      this._fn = easter.orthodoxEaster
    }
  }

  inYear (year) {
    const d = (new CalDate(this._fn(year))).setOffset(this.offset)
    this.dates.push(d)
    return this
  }
}
module.exports = Easter
