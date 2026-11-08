/**
 * @copyright 2015-present (c) commenthol
 * @license ISC
 */

import HolidaysParser from 'date-holidays-parser'

import { data } from './data.js'

/** @typedef {import('date-holidays-parser').Location} Location */
/** @typedef {import('date-holidays-parser').HolidayOptions} HolidayOptions */

/**
 * @class
 * @param {object} data - holiday data object - see data/holidays.json
 * @param {string|Location} [country] - country code or location object
 * @param {string} [state] - specifies state
 * @param {string} [region] - specifies region
 * @param {HolidayOptions} [opts] - options
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
