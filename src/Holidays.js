/**
 * @copyright 2015-present (c) commenthol
 * @license ISC
 */

'use strict'

const Parser = require('date-holidays-parser')
const data = require('../data/holidays.json')

/**
 * @class
 * @param {String|Object} country - if object use `{ country: {String}, state: {String}, region: {String} }`
 * @param {String} [state] - specifies state
 * @param {String} [region] - specifies region
 * @param {Object} [opts] - options
 * @param {Array|String} opts.languages - set language(s) with ISO 639-1 shortcodes
 * @param {String} opts.timezone - set timezone
 * @param {Array} opts.types - holiday types to consider
 * @example
 * ```js
 * new Holiday('US', 'la', 'no') // is the same as
 * new Holiday('us.la.no')       // is the same as
 * new Holiday({ country: 'us', state: 'la', region: 'no'})
 * ```
 */
function Holidays (country, state, region, opts) {
  if (!(this instanceof Holidays)) {
    return new Holidays(country, state, region, opts)
  }
  Parser.apply(this, [data, country, state, region, opts])
  this.init(country, state, region, opts)
}

Holidays.prototype = Object.create(Parser.prototype)
Holidays.prototype.constructor = Holidays

module.exports = Holidays
