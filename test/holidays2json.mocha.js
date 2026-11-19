import assert from 'assert'
import fs from 'node:fs'
import Holidays2json from '../scripts/holidays2json.js'

function createBuilder (days, opts = {}) {
  const builder = new Holidays2json({ list: ['XX'], ...opts })
  builder.load = function (cc) {
    if (cc === '0') return { holidays: {} }
    if (cc === 'XX') return { holidays: { XX: { days } } }
    return {}
  }
  return builder
}

function getPlugins (days, opts = { pick: ['XX'], min: true }) {
  return createBuilder(days, opts).build().calendarPlugins
}

describe('#holidays2json', function () {
  it('finds only CalendarPlugins used in the reduced data set', function () {
    const days = {
      easter: {},
      'march solstice': {},
      '1 Nisan': {},
      '1 Ramadan': {},
      'julian 01-01': {},
      '1 Farvardin': {},
      'chinese 01-0-01': {},
      'bengali-revised 1425-1-1': {},
      'tibetan 01-01-1-0-1': {}
    }
    assert.deepStrictEqual(getPlugins(days), [
      'EasterCalendarPlugin',
      'EquinoxCalendarPlugin',
      'HebrewCalendarPlugin',
      'HijriCalendarPlugin',
      'JulianCalendarPlugin',
      'JalaaliCalendarPlugin',
      'ChineseCalendarPlugin',
      'BengaliRevisedCalendarPlugin',
      'TibetanCalendarPlugin'
    ])
    assert.deepStrictEqual(getPlugins({ '1 Ramadan': {} }), [
      'HijriCalendarPlugin'
    ])
  })

  it('writes only the required plugins for a filtered min build', function () {
    const builder = createBuilder({ '1 Ramadan': {} }, { pick: ['XX'], min: true }).build()
    const originalWriteFileSync = fs.writeFileSync
    const originalExistsSync = fs.existsSync
    const writes = new Map()
    try {
      fs.writeFileSync = (file, content) => writes.set(String(file), String(content))
      fs.existsSync = (file) => String(file).endsWith('/lib')
      builder.save()
    } finally {
      fs.writeFileSync = originalWriteFileSync
      fs.existsSync = originalExistsSync
    }

    const source = [...writes].find(([file]) => file.endsWith('/src/plugins.js'))[1]
    const commonjs = [...writes].find(([file]) => file.endsWith('/lib/plugins.cjs'))[1]
    assert.match(source, /HijriCalendarPlugin/)
    assert.doesNotMatch(source, /EasterCalendarPlugin/)
    assert.match(commonjs, /HijriCalendarPlugin/)
    assert.doesNotMatch(commonjs, /EasterCalendarPlugin/)
  })
})
