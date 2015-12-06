'use strict'

/**
 * sample.js <country.state> <year> <langs>
 * e.g.
 * sample.js at.b 2015 1
 */
if (module === require.main) {
  var args = process.argv.slice(2)
  var o

  if (args[2]) {
    if (/^{/.test(args[2])) {
      o = JSON.parse(args[2])
    } else {
      o = { languages: args[2] }
    }
  }

  var Holidays = require('..')
  var country = args[0] || 'us.Hawaii'

  var hd = new Holidays(country, o)
  var res = hd.getHolidays(args[1] || (new Date()).getFullYear())

  console.log(res)
}
