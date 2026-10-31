import assert from 'assert'
import Holidays from '../src/index.js'

describe('VN holiday rules', function () {
  const hd = new Holidays('VN')
  const holidays = hd.getHolidays(2026)

  function holiday (rule) {
    const matches = holidays.filter(item => item.rule === rule)
    assert.strictEqual(matches.length, 1, rule)
    return matches[0]
  }

  for (const year of [2025, 2026, 2027]) {
    it(`applies Culture Day only from 2026 (${year})`, function () {
      const matches = hd.getHolidays(year).filter(item => item.date.startsWith(`${year}-11-24`))
      assert.deepStrictEqual(matches.map(item => [item.name, item.type]), year < 2026
        ? []
        : [['Ngày Văn hóa Việt Nam', 'public']])
      if (matches.length) assert.strictEqual(+matches[0].end - +matches[0].start, 86400000)
    })
  }

  for (const year of [2021, 2022, 2026]) {
    it(`uses the historical Book Day name without duplicates (${year})`, function () {
      const matches = hd.getHolidays(year).filter(item => item.rule.startsWith('04-21'))
      assert.ok(matches.every(item => item.date === `${year}-04-21 00:00:00`))
      assert.deepStrictEqual(matches.map(item => [item.name, item.type]), [[
        year < 2022 ? 'Ngày Sách Việt Nam' : 'Ngày Sách và Văn hóa đọc Việt Nam',
        'observance'
      ]])
    })
  }

  it('separates New Year’s Eve from the five-day public holiday', function () {
    const eve = holiday('1 day before vietnamese 1-0-1')
    assert.strictEqual(eve.name, 'Giao thừa tết Nguyên đán')
    assert.strictEqual(eve.type, 'observance')
    assert.strictEqual(eve.date, '2026-02-16 00:00:00')
    assert.strictEqual(+eve.end - +eve.start, 86400000)

    const period = holiday('1 day before vietnamese 1-0-1 P5D')
    assert.strictEqual(period.name, 'Kỳ nghỉ tết Nguyên đán')
    assert.strictEqual(period.type, 'public')
    assert.strictEqual(period.start.toISOString(), '2026-02-15T17:00:00.000Z')
    assert.strictEqual(period.end.toISOString(), '2026-02-20T17:00:00.000Z')
    assert.strictEqual(+period.end - +period.start, 5 * 86400000)
    assert.ok(period.note.includes('employer'))

    const firstDay = holiday('vietnamese 1-0-1')
    assert.strictEqual(firstDay.name, 'Tết Nguyên đán')
    assert.strictEqual(firstDay.date, '2026-02-17 00:00:00')
    assert.strictEqual(firstDay.type, 'public')
    assert.strictEqual(+firstDay.end - +firstDay.start, 86400000)
  })

  it('includes all five Tet days and excludes both surrounding instants for public holidays', function () {
    const publicHolidays = new Holidays('VN', { types: ['public'] })
    assert.strictEqual(publicHolidays.isHoliday(new Date('2026-02-15T23:59:59.999+07:00')), false)
    for (const day of [16, 17, 18, 19, 20]) {
      const matches = publicHolidays.isHoliday(new Date(`2026-02-${day}T00:00:00+07:00`))
      assert.ok(matches.some(item => item.start.toISOString() === '2026-02-15T17:00:00.000Z' &&
        item.end.toISOString() === '2026-02-20T17:00:00.000Z'))
      assert.ok(matches.every(item => item.type === 'public'))
    }
    assert.ok(publicHolidays.isHoliday(new Date('2026-02-20T23:59:59.999+07:00')))
    assert.strictEqual(publicHolidays.isHoliday(new Date('2026-02-21T00:00:00+07:00')), false)
  })

  const lunarDates = [
    ['vietnamese 5-01 solarterm', '04-05', 'observance'],
    ['vietnamese 3-0-3', '04-19', 'observance'],
    ['vietnamese 3-0-10', '04-26', 'public'],
    ['vietnamese 4-0-15', '05-31', 'observance'],
    ['vietnamese 7-0-15', '08-27', 'observance'],
    ['vietnamese 8-0-15', '09-25', 'observance']
  ]
  for (const [rule, date, type] of lunarDates) {
    it(`calculates ${rule} on 2026-${date}`, function () {
      const item = holiday(rule)
      assert.strictEqual(item.date, `2026-${date} 00:00:00`)
      assert.strictEqual(item.type, type)
      assert.strictEqual(+item.end - +item.start, 86400000)
    })
  }

  const observances = [
    ['01-09', 'Ngày truyền thống học sinh, sinh viên Việt Nam'],
    ['02-27', 'Ngày Thầy thuốc Việt Nam'],
    ['03-26', 'Ngày thành lập Đoàn TNCS Hồ Chí Minh'],
    ['03-27', 'Ngày Thể thao Việt Nam'],
    ['06-21', 'Ngày Báo chí cách mạng Việt Nam'],
    ['07-28', 'Ngày thành lập Công đoàn Việt Nam'],
    ['10-02', 'Ngày Khuyến học Việt Nam'],
    ['10-13', 'Ngày Doanh nhân Việt Nam'],
    ['11-09', 'Ngày Pháp luật Việt Nam'],
    ['11-18', 'Ngày hội Đại đoàn kết toàn dân tộc'],
    ['11-23', 'Ngày Di sản văn hóa Việt Nam'],
    ['12-26', 'Ngày Dân số Việt Nam']
  ]
  for (const [date, name] of observances) {
    it(`includes ${date} as a one-day observance`, function () {
      const item = holiday(date)
      assert.strictEqual(item.date, `2026-${date} 00:00:00`)
      assert.strictEqual(item.name, name)
      assert.strictEqual(item.type, 'observance')
      assert.strictEqual(+item.end - +item.start, 86400000)
    })
  }

  it('provides Vietnamese and English names for every event', function () {
    const en = new Holidays('VN', { languages: ['en'] }).getHolidays(2026)
    assert.strictEqual(en.length, holidays.length)
    for (const item of holidays) {
      assert.ok(item.name.trim(), item.rule)
      const translated = en.find(other => other.rule === item.rule)
      assert.ok(translated && translated.name.trim(), item.rule)
      assert.notStrictEqual(translated.name, item.name, item.rule)
    }
  })

  it('does not include organization-specific extra days off', function () {
    const publicHolidays = new Holidays('VN', { types: ['public'] })
    for (const date of ['01-02', '04-27', '08-31', '09-01', '09-03']) {
      assert.strictEqual(publicHolidays.isHoliday(new Date(`2026-${date}T12:00:00+07:00`)), false, date)
    }
  })

  it('overrides shared Vietnamese names only for Vietnam', function () {
    assert.strictEqual(holiday('03-08').name, 'Ngày Quốc tế Phụ nữ')
    assert.strictEqual(holiday('05-01').name, 'Ngày Quốc tế Lao động')
    const ug = new Holidays('UG', { languages: ['vi'] }).getHolidays(2026)
    assert.strictEqual(ug.find(item => item.rule === '03-08').name, 'Quốc tế Phụ nữ')
    assert.strictEqual(ug.find(item => item.rule === '05-01').name, 'Quốc tế Lao động')
  })

  it('returns 43 events in 2026 with eight public holiday records', function () {
    assert.strictEqual(holidays.length, 43)
    assert.strictEqual(holidays.filter(item => item.type === 'public').length, 8)
    assert.strictEqual(holidays.filter(item => item.type === 'observance').length, 35)
  })
})
