import assert from 'assert'
import { temporalTimezoneAdapter } from 'caldate'
import { momentTimezoneAdapter } from 'caldate/moment-timezone'
import BrowserHolidays from '../src/browser.js'
import NodeHolidays from '../src/index.js'

describe('browser export', function () {
  it('uses the default Temporal timezone adapter', function () {
    const holidays = new BrowserHolidays()
    assert.strictEqual(holidays.__calendarContext.timezoneAdapter, temporalTimezoneAdapter)
  })

  it('keeps moment-timezone as the Node default', function () {
    const holidays = new NodeHolidays()
    assert.strictEqual(holidays.__calendarContext.timezoneAdapter, momentTimezoneAdapter)
  })
})
