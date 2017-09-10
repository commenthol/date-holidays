'use strict'

/**
 * {
 *   0: 'sunday', ...
 *   sunday: 0, ...
 * }
 */
exports.DAYS = (function () {
  var o = {}
  'sunday|monday|tuesday|wednesday|thursday|friday|saturday'
    .split('|')
    .forEach((name, idx) => {
      o[name] = idx
      o[idx] = name
    })
  return o
})()

function objectToString (o) {
  return Object.prototype.toString.call(o)
}

var isObject = exports.isObject = function isObject (arg) {
  return typeof arg === 'object' && arg !== null
}

exports.isDate = function isDate (d) {
  return isObject(d) && objectToString(d) === '[object Date]'
}

/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
exports.pad0 = function pad0 (number, len) {
  len = len || 2
  number = Array(len).join('0') + number.toString()
  return number.substr(number.length - len, len)
}

/**
 * convert string to number
 * @private
 * @param {String} str
 * @return {Number} converted number or undefined
 */
var toNumber = exports.toNumber = function toNumber (str) {
  var num = parseInt(str, 10)
  if (!isNaN(num)) {
    return num
  }
}

/**
 * extract or set year
 * @private
 * @param {Number|Date|String} year
 * @return {Number} year
 */
exports.toYear = function toYear (year) {
  if (!year) {
    year = new Date().getFullYear()
  } else if (year instanceof Date) {
    year = year.getFullYear()
  } else if (typeof year === 'string') {
    year = toNumber(year)
  }
  return year
}

/**
* convert string to Date.
* 2017        : year = 2017, month = 1, day = 1
* '2017-07'   : year = 2017, month = 7, day = 1
* '2017-07-03': year = 2017, month = 7, day = 3
* @param {String} str
* @param {Boolean} isUTC - return date in UTC
* @return {Date}
*/
exports.toDate = function toDate (str, isUTC) {
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?.*$/.exec((str || '').toString())
  if (m) {
    m.shift()
    let [year, month, day] = m.map((num) => parseInt(num || 1, 10))
    if (isUTC) {
      return new Date(Date.UTC(year, month - 1, day))
    } else {
      return new Date(year, month - 1, day)
    }
  }
}
