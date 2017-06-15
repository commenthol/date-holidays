'use strict'

const Parser = require('./Parser')
const Rule = require('./Rule')
const PostRule = require('./PostRule')
const CalEventFactory = require('./CalEventFactory')

/**
 * handles one rule
 */
class DateFn {
  /**
   * @param {string} rule - unparsed rule
   * @param {array} holidays - all holidays rules (required for bridge day calculations)
   */
  constructor (ruleStr, holidays) {
    var parser = new Parser()
    this.ruleStr = ruleStr
    this.rules = parser.parse(ruleStr)
    this.ok = !parser.error
    this.holidays = holidays
    this.opts = holidays ? holidays[ruleStr] : {}
    this.event = undefined
  }

  inYear (year) {
    var ruleFn // current rule
    var postProc = new PostRule(this.ruleStr, this.opts, this.holidays)

    this.rules.forEach((rule) => {
      var calEvent
      if (rule.fn) {
        calEvent = new CalEventFactory(rule)
        .inYear(year - 1) // run over neighboring dates to catch overlaps
        .inYear(year)
        .inYear(year + 1)
        postProc.push(calEvent)
        ruleFn = new Rule(calEvent)
      } else {
        if (ruleFn.resolve(rule)) {
          postProc.resolve(rule, year)
        }
      }
    })

    this.event = postProc.getEvent(year)
    return this
  }

  get (timezone) {
    var res = this.event.get(timezone)
    return res
  }
}
module.exports = DateFn
