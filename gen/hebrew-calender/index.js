'use strict'

/**
 * provides a mapping of hebrew calendar dates per gregorian year.
 * ```js
 * // gregorian year: [ jewish months ]
 * // each 1st day of an jewish month is expressed with a gregorian
 * // month and date
 * { year: [[M,D], ... [M,D], year + 1: {} ... }
 * ```
 */

var Hebcal = require('hebcal')
var _ = require('mergee')

var out = {}

for (let y = 1969; y <= 2100; y++) {
  var yd = 5730 - 1970 // difference between jewish and gregorian years
  var iy = yd + y

  for (let im = 1; im <= 12; im++) {
    var m = new Hebcal.HDate(1, im, iy).greg();

    var my = m.getFullYear()
    var mm = im - 1

    if (!out[my]) {
      out[my] = []
    }

    if (out[my][mm]) {
      // ~ console.log('//', my, mm, m.getMonth(), m.getDate())
      out[my][mm] = out[my][mm].concat([m.getMonth(), m.getDate()])
    } else {
      out[my][mm] = [m.getMonth(), m.getDate()]
    }
  }
}
console.log('/*eslint-disable*/\nmodule.exports=' + JSON.stringify(out).replace(/"/g,''))
// ~ console.log(out)

process.exit()