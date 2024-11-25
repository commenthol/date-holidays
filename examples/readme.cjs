const Holidays = require('..')
const hd = new Holidays()

// get supported countries
const countries = hd.getCountries()
console.log(countries)

// get supported states e.g. for DE
const states = hd.getStates('DE')
console.log(states)

// get supported regions e.g. for DE, Bayern
const regions = hd.getRegions('DE', 'by')
console.log(regions)

// initialize holidays for DE, Bayern, Stadt Augsburg
hd.init('DE', 'by', 'a')
// or using a new instance
// hd = nesw Holidays('DE', 'by', 'a')

// get all holidays for the year 2016
const holidays = hd.getHolidays(2016)
console.log(holidays)
