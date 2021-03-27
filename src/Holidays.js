/**
 * @copyright 2015-present (c) commenthol
 * @license ISC
 */

import HolidaysParser from 'date-holidays-parser'

import { data } from './data.js'

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
export class Holidays extends HolidaysParser {
  constructor (country, state, region, opts) {
    super(data, country, state, region, opts)
  }
}
