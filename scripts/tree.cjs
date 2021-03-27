#!/usr/bin/env node

/**
 * draw tree of supported countries, states, regions
 */
function tree (stream) {
  const draw = [
    '├── ',
    '└── ',
    '│   ',
    '    '
  ]

  const Holidays = require('..')

  const countries = new Holidays().getCountries()
  const countriesLen = Object.keys(countries).length - 1

  stream.write('Countries: ' + (countriesLen + 1) + '\n')

  Object.keys(countries).forEach((country, i) => {
    const d = (i === countriesLen ? draw[1] : draw[0])
    stream.write(d + country + ': ' + countries[country] + '\n')

    const states = new Holidays().getStates(country)
    if (states) {
      const statesLen = Object.keys(states).length - 1
      Object.keys(states).forEach((state, j) => {
        let d = (i === countriesLen ? draw[3] : draw[2])
        d += (j === statesLen ? draw[1] : draw[0])
        stream.write(d + state + ': ' + states[state] + '\n')

        const regions = new Holidays().getRegions(country, state)
        if (regions) {
          const regionsLen = Object.keys(regions).length - 1
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
