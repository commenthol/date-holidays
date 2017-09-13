'use strict'

/**
 * provides a mapping of islamic calendar dates per gregorian year
 * the islamic calender year being shorter than the gregorian year the
 * start of an islamic month may show up twice with a gregorian date
 * ```js
 * // gregorian year: [ islamic months ]
 * // each 1st day of an islamic month is expressed with a gregorian
 * // month `M` and date `D` and the islamic year `iY`
 * { year: {number}, <year>: [[M,D,iY], ... [M,D,iY,M,D,iY]], <year + 1>: {} ... }
 * ```
 * > Note: The library moment-hijri currently only provides dates between
 * > 1936 and 2080 which should be sufficient for our needs
 */

var moment = require('moment-hijri')

var out = {}

// only years 1936 ... 2080 are supported by moment-hijri
for (let y = 1969; y <= 2080; y++) {
  var iy = y - 580

  if (!out.year) {
    out.year = iy
  }
  var iyy = iy - out.year

  for (let im = 1; im <= 12; im++) {
    var m = moment(iy + '/' + im + '/1', 'iYYYY/iM/iD')

    var my = m.year()
    var mm = m.iMonth()

    if (!out[my]) {
      out[my] = []
    }

    if (out[my][mm]) {
      out[my][mm] = out[my][mm].concat([m.month(), m.date(), iyy])
    } else {
      out[my][mm] = [m.month(), m.date(), iyy]
    }
  }
}
console.log('/*eslint-disable*/\nmodule.exports=' + JSON.stringify(out).replace(/"/g, ''))
// console.log(out)
