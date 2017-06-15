'use strict'

const isDate = require('./internal/utils').isDate
const CalDate = require('caldate')

class CalEvent {
  constructor (opts) {
    opts = opts || {}
    this.substitute = opts.substitute
    this.opts = opts
    this.offset = opts.offset
    this.dates = []
    if (isDate(opts)) {
      this.opts = new CalDate(opts)
    }
  }

  inYear (year) {
    var d = (new CalDate(this.opts)).setOffset(this.offset)
    if (!(d.year && d.year !== year)) {
      d.year = year
      this.dates.push(d)
    }
    return this
  }

  reset () {
    this.dates = []
  }

  isEqualDate (calEvent) {
    var res = false
    for (var thisDate of this.dates) {
      for (var date of calEvent.dates) {
        res |= thisDate.isEqualDate(date)
      }
    }
    return !!res
  }

  /**
   * @param {Number} year - year to filter
   * @param {Object[]} active - definition of active ranges `{from: {Number}, [to]: {Number}}`
   */
  filter (year, active) {
    var diff
    var isActive = true
    if (active) {
      isActive = false
      active.forEach((a) => {
        if (
          (a.from && a.to && a.from <= year && a.to >= year) ||
          (a.from && !a.to && a.from <= year)
        ) {
          isActive = true
        }
      })
    }
    this.dates = this.dates.filter((date) => {
      if (!isActive || year !== date.year || date._filter) {
        diff = year - date.year
      } else {
        return date
      }
    })
    return diff
  }

  push (calEvent) {
    if (calEvent && Array.isArray(calEvent.dates)) {
      this.dates = this.dates.concat(calEvent.dates)
    }
  }

  get (timezone) {
    var arr = this.dates.map((date) => {
      var o = {
        date: date.toString(),
        start: date.toTimezone(timezone),
        end: date.toEndDate().toTimezone(timezone)
      }
      this._addSubstitute(date, o)
      return o
    })
    return arr
  }

  _addSubstitute (date, obj) {
    if (this.substitute || date.substitute) obj.substitute = true
  }
}
module.exports = CalEvent
