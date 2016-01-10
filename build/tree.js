'use strict'

/**
 * draw tree of supported countries, states, regions
 */
function tree (stream) {
  var draw = [
    '├── ',
    '└── ',
    '│   ',
    '    '
  ]

  var Holidays = require('..')

  var countries = Holidays().getCountries()
  var countriesLen = Object.keys(countries).length - 1

  stream.write('Countries: ' + (countriesLen + 1) + '\n')

  Object.keys(countries).forEach((country, i) => {
    let d = (i === countriesLen ? draw[1] : draw[0])
    stream.write(d + country + ': ' + countries[country] + '\n')

    let states = Holidays().getStates(country)
    if (states) {
      let statesLen = Object.keys(states).length - 1
      Object.keys(states).forEach((state, j) => {
        let d = (i === countriesLen ? draw[3] : draw[2])
        d += (j === statesLen ? draw[1] : draw[0])
        stream.write(d + state + ': ' + states[state] + '\n')

        let regions = Holidays().getRegions(country, state)
        if (regions) {
          let regionsLen = Object.keys(regions).length - 1
          Object.keys(regions).forEach((region, k) => {
            let d = (i === countriesLen ? draw[3] : draw[2])
            d += (j === statesLen ? draw[3] : draw[2])
            d += (k === regionsLen ? draw[1] : draw[0])
            stream.write(d + region + ': ' + regions[region] + '\n')
          })
        }
      })
    }
  })
}
module.exports = tree

if (module === require.main) {
  tree(process.stdout)
}
