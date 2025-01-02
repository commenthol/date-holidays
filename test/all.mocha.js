import fs from 'fs'
import path from 'path'
import assert from 'assert'
import Holidays from '../src/index.js'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

let writetests
let _countries

const WEEKDAYS = 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')

// regenerate tests with `mocha test/all.mocha.js --writetests`
function options (argv) {
  function isOpt (a, s, l) {
    return (s === a || l === a)
  }

  for (let i = 0; i < argv.length; i++) {
    if (isOpt(argv[i], '-c', '--countries')) {
      const c = argv[++i].toUpperCase().split(',')
      _countries = {}
      for (const j in c) {
        _countries[c[j]] = c[j]
      }
    } else if (isOpt(argv[i], '-y', '--year')) {
      years = argv[++i].split(',')
    } else if (isOpt(argv[i], '-w', '--writetests')) {
      process.env.TEST_XXL = true
      writetests = true
    }
  }
}
options(process.argv.splice(2))

let years = process.env.TEST_XXL
  ? [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027]
  : [2021, 2022, 2023, 2024, 2025, 2026, 2027]

function filename (name) {
  const file = path.join(__dirname, 'fixtures', name + '.json')
  return file
}

const SORTORDER = ['date', 'start', 'end', 'name', 'type', 'note', 'substitute']

const sortObj = item => {
  const o = {}
  const keys = Object.keys(item).sort()
  SORTORDER.forEach(key => {
    if (key in item) o[key] = item[key]
  })
  keys.forEach(key => {
    if (!o[key]) o[key] = item[key]
  })
  return o
}

const sortItems = (items) => items
  .map(sortObj)
  .sort((a, b) => {
    const aStart = +a.start
    const bStart = +b.start
    if (aStart === bStart) {
      return a.name.localeCompare(b.name)
    } else {
      return aStart - bStart
    }
  })

function addWeekday (arr) {
  if (!Array.isArray(arr)) return arr
  return arr.map((item) => {
    if (item.date) {
      item._weekday = WEEKDAYS[new Date(item.date).getDay()]
    }
    return item
  })
}

function writeFile (name, obj) {
  if (writetests) {
    const file = filename(name)
    fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8')
  }
}

function test (year, country, state, region) {
  const name = country + (state ? '-' + state : '') + (region ? '-' + region : '') + '-' + year

  it(name, function (done) {
    const hd = new Holidays(country, state, region)
    let res = hd.getHolidays(year)

    for (const i in res) {
      assert.ok(typeof res[i].name === 'string', 'translation missing for rule ' + i + ': ' + JSON.stringify(res[i]))
    }

    res = addWeekday(sortItems(res))
    // res = addWeekday(res)

    writeFile(name, res)
    fs.readFile(filename(name), 'utf8', function (err, exp) {
      assert.ok(!err, '' + err)
      assert.strictEqual(JSON.stringify(res, null, 2), exp)
      done()
    })
  })
}

describe('#All Holidays', function () {
  years.forEach(function (year) {
    const countries = _countries || new Holidays().getCountries()

    Object.keys(countries).forEach(function (country) {
      describe(year + ':' + country, function () {
        test(year, country)

        const states = new Holidays().getStates(country)

        if (states) {
          Object.keys(states).forEach(function (state) {
            test(year, country, state)

            describe(state, function () {
              const regions = new Holidays().getRegions(country, state)

              if (regions) {
                Object.keys(regions).forEach(function (region) {
                  test(year, country, state, region)
                })
              }
            })
          })
        }
      })
    })
  })
})
