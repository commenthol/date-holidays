import Holidays from 'date-holidays';

const hd = new Holidays();
hd.init('US');

hd.isHoliday(new Date('2019-01-01')); // $ExpectType false | Holiday[]
hd.isHoliday(new Date('2019-02-01')); // $ExpectType false | Holiday[]
hd.getHolidays(); // $ExpectType Holiday[]
