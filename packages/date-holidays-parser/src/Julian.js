'use strict'

const julian = require('astronomia/lib/julian')
const CalEvent = require('./CalEvent')
const CalDate = require('caldate')

class Julian extends CalEvent {
  inYear (year) {
    if (this.opts.year && this.opts.year !== year) {
      return this
    }
    const cal = new julian.CalendarJulian(year, this.opts.month, this.opts.day).toGregorian()
    const d = (new CalDate(cal)).setOffset(this.offset)
    this.dates.push(d)
    return this
  }
}
module.exports = Julian
