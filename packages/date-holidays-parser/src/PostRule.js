'use strict'

const _ = {
  get: require('lodash.get')
}
const CalEvent = require('./CalEvent')
const Parser = require('./Parser')

class PostRule {
  /**
   * @param {String} ruleStr
   * @param {Object} opts
   * @param {Array} [holidays]
   */
  constructor (ruleStr, opts, holidays) {
    this.opts = opts
    this.ruleStr = ruleStr
    this.ruleSet = holidays && holidays[ruleStr]
    this.holidays = holidays
    this.events = []
  }

  push (calEvent) {
    this.events.push(calEvent)
  }

  getEvent (year) {
    let active = this.ruleSet && this.ruleSet.active
    this.disable(year)
    const ev = this.events[0]
    ev.filter(year, active)
    return ev
  }

  /**
   * @param {Array} rule
   */
  resolve (rule, year) {
    if (rule.rule && typeof this[rule.rule] === 'function') {
      this[rule.rule](rule, year)
    }
  }

  /**
   * @param {CalEvent} [calEvent]
   */
  bridge (rule, year) {
    const found = new Array(this.events.length).fill(false)
    found[0] = true
    const type = rule.type || 'public'

    // get all holidays of the given year
    for (let ruleStr in this.holidays) {
      let dateFn = this.holidays[ruleStr].fn
      if (dateFn && dateFn.ruleStr !== this.ruleStr) {
        let tmpEv = dateFn.inYear(year)
        let tmpEvType = _.get(tmpEv, 'opts.type') || 'public'
        for (let i = 1; i < this.events.length; i++) {
          if (found[i]) continue
          let isEqualDate = tmpEv.event.isEqualDate(this.events[i])
          if (isEqualDate && tmpEvType === type) {
            found[i] = true
          }
        }
      }
      if (!~found.indexOf(false)) { // pre-exit if all found
        break
      }
    }

    if (~found.indexOf(false)) {
      this.events[0].reset()
    }
  }

  disable (year) {
    const ev = this.events[0]
    let tmpEv = this._findEventInYear(year, this.opts.disable)
    if (tmpEv) {
      if (tmpEv.isEqualDate(ev)) {
        ev.reset()
        tmpEv = this._findEventInYear(year, this.opts.enable)
        if (tmpEv) this.events[0] = tmpEv
      }
    }
  }

  _findEventInYear (year, arr) {
    arr = arr || []
    const parser = new Parser()
    for (let i in arr) {
      const p = parser.parse(arr[i])
      if (p && p[0] && p[0].year && p[0].year === year) {
        return new CalEvent(p[0]).inYear(p[0].year)
      }
    }
  }
}
module.exports = PostRule
