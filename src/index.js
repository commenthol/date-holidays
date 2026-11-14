/** @typedef {import('date-holidays-parser').Location} Location */
/** @typedef {import('date-holidays-parser').ActiveRange} ActiveRange */
/** @typedef {import('date-holidays-parser').HolidayOptions} HolidayOptions */
/** @typedef {import('date-holidays-parser').HolidayRuleOptions} HolidayRuleOptions */
/** @typedef {import('date-holidays-parser').Holiday} Holiday */
/** @typedef {import('date-holidays-parser').HolidayMap} HolidayMap */
/** @typedef {import('date-holidays-parser').HolidayType} HolidayType */

import { momentTimezoneAdapter } from 'caldate/moment-timezone'
import { HolidaysBase } from './Holidays.js'

class Holidays extends HolidaysBase {
  /** @type {import('caldate').TimezoneAdapter} */
  static defaultTimezoneAdapter = momentTimezoneAdapter
}

export default Holidays
