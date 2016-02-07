'use strict'

/**
 * sample.js <country.state> <year> <langs>
 * e.g.
 * sample.js at.b 2015 1
 */
var Holidays = require('..')

if (module === require.main) {
  var cmd = {}
  var opts = {}
  var days = 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
  var args = process.argv.slice(2)
  var arg

  while ((arg = args.shift())) {
    if (arg === '--short') {
      cmd.short = true
    } else if (arg === '--lang') {
      opts.languages = args.shift()
    } else if (/^\d{4}$/.test(arg)) {
      cmd.year = arg
    } else if (/^[a-zA-Z]{2}/.test(arg)) {
      cmd.country = arg
    }
  }

  cmd.year = cmd.year || (new Date()).getFullYear()

  var hd = new Holidays(cmd.country, opts)
  var res = hd.getHolidays(cmd.year)

  if (cmd.short) {
    res = res.map((i) => {
      var d = new Date(i.date)
      var day = days[d.getDay()]
      i.type += Array(11).join(' ')
      return [day, i.date, i.type.substr(0, 10), i.name].join('   ')
    })
  }

  console.log(res)
}
