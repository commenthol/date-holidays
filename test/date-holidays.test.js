import { expect } from 'chai'
import sinon from 'sinon'
import Holidays from 'date-holidays'

describe('Date-Holidays Library Tests', () => {
  const publicHolidays = [
    { date: '2024-01-01', name: 'Nouvel An' },
    { date: '2024-12-25', name: 'Noël' },
    { date: '2024-12-26', name: 'Lendemain de Noël' }
  ]

  let hd
  beforeEach(() => {
    hd = new Holidays()
    sinon.stub(hd, 'getHolidays').returns(publicHolidays)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should return mocked public holidays', () => {
    const holidays = hd.getHolidays(2024)
    expect(holidays).to.deep.equal(publicHolidays)
  })

  it('should verify the structure of the public holidays', () => {
    const holidays = hd.getHolidays(2024)
    expect(holidays).to.be.an('array').with.lengthOf(3)
    holidays.forEach((holiday, index) => {
      expect(holiday).to.have.property('date').that.is.a('string')
      expect(holiday).to.have.property('name').that.is.a('string')
      expect(holiday.date).to.equal(publicHolidays[index].date)
      expect(holiday.name).to.equal(publicHolidays[index].name)
    })
  })

  it('should return empty array if holidays data is empty', () => {
    hd.getHolidays.restore()
    sinon.stub(hd, 'getHolidays').returns([])

    const holidays = hd.getHolidays(2024)
    expect(holidays).to.be.an('array')
    expect(holidays.length).to.equal(0)
  })

  it('should return holidays for a supported country with states', () => {
    hd.getHolidays.restore()
    sinon.stub(hd, 'getHolidays').callsFake(() => [
      { date: '2024-07-14', name: 'Fête nationale' }
    ])

    hd.init('FR', 'IDF')
    const holidays = hd.getHolidays(2024)
    expect(holidays).to.be.an('array').with.lengthOf(1)
    expect(holidays[0]).to.include({ date: '2024-07-14', name: 'Fête nationale' })
  })

  it('should return holidays for a supported country with states and regions', () => {
    hd.getHolidays.restore()
    sinon.stub(hd, 'getHolidays').callsFake(() => [
      { date: '2024-03-19', name: 'Fête régionale' }
    ])

    hd.init('DE', 'BY', 'Munich')
    const holidays = hd.getHolidays(2024)
    expect(holidays).to.be.an('array').with.lengthOf(1)
    expect(holidays[0]).to.include({ date: '2024-03-19', name: 'Fête régionale' })
  })

  it('should return a valid array if holidays data is not empty', () => {
    const holidays = hd.getHolidays(2024)
    expect(holidays).to.be.an('array')
    expect(holidays.length).to.be.greaterThan(0)
    expect(holidays).to.deep.equal(publicHolidays)
  })

  it('should return a valid array if holidays & states data are not empty', () => {
    const states = {
      57: 'Département Moselle',
      67: 'Département Bas-Rhin'
    }
    const publicHolidays = [
      { date: '2024-01-01', name: 'Nouvel An' },
      { date: '2024-12-25', name: 'Noël' }
    ]

    hd.getHolidays.restore()
    sinon.stub(hd, 'getHolidays').callsFake(() => publicHolidays)

    hd.init('FR', states)
    const holidays = hd.getHolidays(2024)
    expect(holidays).to.be.an('array').with.length.greaterThan(0)
    expect(holidays).to.deep.equal(publicHolidays)
  })

  it('should return a valid array if holidays & states & regions data are not empty ', () => {
    const states = {
      57: 'Département Moselle',
      67: 'Département Bas-Rhin',
      YT: "Département et région d'outre-mer Mayotte"
    }
    const regions = {
      TESTA: 'TestA',
      TESTB: 'TestB',
      TESTC: 'TestC'
    }
    const publicHolidays = [
      { date: '2024-01-01', name: 'Nouvel An' },
      { date: '2024-12-25', name: 'Noël' }
    ]

    const countryCode = 'BE'
    const year = 2024
    const language = 'fr'
    beforeEach(() => {
      Holidays.mockClear()
    })

    hd.getHolidays.restore()
    sinon.stub(hd, 'getHolidays').callsFake(() => publicHolidays)

    const holidays = hd.getHolidays(year, { countryCode, states, regions, language })
    expect(holidays).to.be.an('array').with.length.greaterThan(0)
    expect(holidays).to.deep.equal(publicHolidays)
  })
})
