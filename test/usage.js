/**
 * sample script to show usage of module
 */

'use strict'

if (require.main === module) {
  var Holidays = require('..')
  var hd = new Holidays()

  // get supported countries
  console.log(hd.getCountries())
  /* >
  { AD: 'Andorra',
    ...
    US: 'United States' }
  */

  // get supported states e.g. for US
  console.log(hd.getStates('US'))
  /* >
  { al: 'Alabama',
    ...
    wy: 'Wyoming' }
  */

  // get supported regions e.g. for US, Lousiana
  console.log(hd.getRegions('US', 'la'))
  /* >
  { no: 'New Orleans' }
   */

  // initialize holidays for US, Lousiana, New Orleans
  hd.init('US', 'la', 'no')
  // or using a new instance
  hd = new Holidays('US', 'la', 'no')

  // get all holidays for the year 2016
  console.log(hd.getHolidays(2016))
  /* >
  [ { date: '2016-01-01 00:00:00',
      start: Fri Jan 01 2016 00:00:00 GMT-0600 (CST),
      end: Sat Jan 02 2016 00:00:00 GMT-0600 (CST),
      name: 'New Year\'s Day',
      type: 'public' },
    ...
    { date: '2016-11-24 00:00:00',
      start: Thu Nov 24 2016 00:00:00 GMT-0600 (CST),
      end: Fri Nov 25 2016 00:00:00 GMT-0600 (CST),
      name: 'Thanksgiving Day',
      type: 'public' },
    ...
    { date: '2016-12-26 00:00:00',
      start: Mon Dec 26 2016 00:00:00 GMT-0600 (CST),
      end: Tue Dec 27 2016 00:00:00 GMT-0600 (CST),
      name: 'Christmas Day (substitute day)',
      type: 'public' } ]
  */

  // check for holiday while respecting timezones
  console.log(hd.isHoliday(new Date('2016-02-09 00:00:00 GMT+0000')))
  // > false

  console.log(hd.isHoliday(new Date('2016-02-09 10:00:00 GMT-0600')))
  /* >
  { date: '2016-02-09 00:00:00',
    start: Tue Feb 09 2016 00:00:00 GMT-0600 (CST),
    end: Wed Feb 10 2016 00:00:00 GMT-0600 (CST),
    name: 'Mardi Gras',
    type: 'public' }
  */
}
