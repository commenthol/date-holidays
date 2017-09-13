'use strict'

const {isDate} = require('./internal/utils')
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
    const d = (new CalDate(this.opts)).setOffset(this.offset)
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
    let res = false
    for (const thisDate of this.dates) {
      for (const date of calEvent.dates) {
        res |= thisDate.isEqualDate(date)
      }
    }
    return !!res
  }

  /**
   * @param {Number} year - year to filter
   * @param {Object[]} active - definition of active ranges `{from: {Date}, [to]: {Date}}`
   * @return {this} for chaining
   */
  filter (year, active) {
    function isActive (date) {
      if (!active) {
        if (date.year === year) {
          return true
        } else {
          return false
        }
      }
      const _date = date.toDate()
      for (let a of active) {
        const {from, to} = a
        if (
          date.year === year &&
          ((from && to && from <= _date && to > _date) ||
          (from && !to && from <= _date) ||
          (!from && to && to > _date))
        ) {
          return true
        }
      }
    }

    this.dates = this.dates.filter((date) => {
      if (!date._filter && isActive(date)) {
        return date
      }
    })

    return this
  }

  push (calEvent) {
    if (calEvent && Array.isArray(calEvent.dates)) {
      this.dates = this.dates.concat(calEvent.dates)
    }
  }

  get (timezone) {
    const arr = this.dates.map((date) => {
      const o = {
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
