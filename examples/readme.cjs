const Holidays = require('..')
const hd = new Holidays()

// get supported countries
const countries = hd.getCountries()
console.log(countries)

// get supported states e.g. for US
const states = hd.getStates('US')
console.log(states)

// get supported regions e.g. for US, Lousiana
const regions = hd.getRegions('US', 'la')
console.log(regions)

// initialize holidays for US, Lousiana, New Orleans
hd.init('US', 'la', 'no')
// or using a new instance
// hd = new Holidays('US', 'la', 'no')

// get all holidays for the year 2016
const holidays = hd.getHolidays(2016)
console.log(holidays)
