import { expect } from 'tstyche'
import Holidays, { type HolidaysTypes } from 'date-holidays';

const hd = new Holidays();

expect(hd.init('US')).type.toBe<void>();

expect(hd.isHoliday(new Date('2019-01-01'))).type.toBe<HolidaysTypes.Holiday[] | false>();
expect(hd.isHoliday(new Date('2019-02-01'))).type.toBe<HolidaysTypes.Holiday[] | false>();
expect(hd.getHolidays()).type.toBe<HolidaysTypes.Holiday[]>();
