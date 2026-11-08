import Holidays, { type HolidaysTypes } from 'date-holidays';

type Equal<T, U> = (<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2) ? true : false;
const expectType = <T extends true>() => {};

const hd = new Holidays('AD');

const initResult = hd.init('US');
expectType<Equal<typeof initResult, void>>();

const newYearHoliday = hd.isHoliday(new Date('2019-01-01'));
expectType<Equal<typeof newYearHoliday, HolidaysTypes.Holiday[] | false>>();
const februaryHoliday = hd.isHoliday(new Date('2019-02-01'));
expectType<Equal<typeof februaryHoliday, HolidaysTypes.Holiday[] | false>>();

const holidays = hd.getHolidays();
expectType<Equal<typeof holidays, HolidaysTypes.Holiday[]>>();
