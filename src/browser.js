import { temporalTimezoneAdapter } from 'caldate'
import { HolidaysBase } from './Holidays.js'

class Holidays extends HolidaysBase {
  /** @type {import('caldate').TimezoneAdapter} */
  static defaultTimezoneAdapter = temporalTimezoneAdapter
}

export default Holidays
