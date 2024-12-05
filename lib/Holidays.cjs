'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var HolidaysParser = require('date-holidays-parser');
var data = require('./data.cjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var HolidaysParser__default = /*#__PURE__*/_interopDefaultLegacy(HolidaysParser);

/**
 * @copyright 2015-present (c) commenthol
 * @license ISC
 */

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
class Holidays extends HolidaysParser__default["default"] {
  constructor (country, state, region, opts) {
    super(data.data, country, state, region, opts);
  }
}

exports.Holidays = Holidays;
