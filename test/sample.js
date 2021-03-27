/**
 * sample.js <country.state> <year> <langs>
 * e.g.
 * sample.js at.b 2015 1
 */
import { fileURLToPath } from 'url'
import Holidays from '../src/index.js'

const days = 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
function weekday (i) {
  return days[new Date(i.date).getDay()]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = {}
  const opts = {}
  const args = process.argv.slice(2)
  let arg

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

  const hd = new Holidays(cmd.country, opts)
  let res = hd.getHolidays(cmd.year)

  if (cmd.short) {
    res = res.map(function (i) {
      const day = weekday(i)
      i.type += Array(11).join(' ')
      return [day, i.date, i.type.substr(0, 10), i.name].join('   ')
    })
  } else {
    res = res.map(function (i) {
      i._weekday = weekday(i)
      return i
    })
  }

  console.log(res)
}
