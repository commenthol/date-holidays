/**
 * @copyright 2015-present (c) commenthol
 * @license ISC
 */

import HolidaysParser from 'date-holidays-parser'
import { plugins } from './plugins.js'

import { data } from './data.js'

/** @typedef {import('date-holidays-parser').Location} Location */
/** @typedef {import('caldate').TimezoneAdapter} TimezoneAdapter */
/** @typedef {import('date-holidays-parser').HolidaysOptions} HolidaysOptions */

/**
 * @class
 * @param {object} data - holiday data object - see data/holidays.json
 * @param {string|Location|HolidaysOptions} [country] - country code, location object, or options
 * @param {string|HolidaysOptions} [state] - state or options
 * @param {string|HolidaysOptions} [region] - region or options
 * @param {HolidaysOptions} [opts] - options
 * @example
 * ```js
 * new Holiday('US', 'la', 'no') // is the same as
 * new Holiday('us.la.no')       // is the same as
 * new Holiday({ country: 'us', state: 'la', region: 'no'})
 * ```
 */
export class HolidaysBase extends HolidaysParser {
  /** @type {TimezoneAdapter|undefined} */
  static defaultTimezoneAdapter

  /**
   * @param {string|Location|HolidaysOptions} [country]
   * @param {string|HolidaysOptions} [state]
   * @param {string|HolidaysOptions} [region]
   * @param {HolidaysOptions} [opts]
   */
  constructor (country, state, region, opts) {
    if (region && typeof region === 'object') {
      opts = region
      region = undefined
    } else if (state && typeof state === 'object') {
      opts = state
      state = undefined
    } else if (
      country &&
      typeof country === 'object' &&
      !('country' in country)
    ) {
      opts = country
      country = undefined
    }

    opts = opts || {}
    opts = {
      ...opts,
      plugins: opts.plugins === undefined ? plugins : opts.plugins,
      timezoneAdapter:
        opts.timezoneAdapter ?? /** @type {typeof HolidaysBase} */ (new.target).defaultTimezoneAdapter
    }
    super(data, country, state, region, opts)
  }
}
