/**
 * @copyright 2016 (c) commenthol
 * @license ISC
 */

'use strict'

var _ = require('lodash')
var easter = require('date-easter')
var moonbeams = require('moonbeams')
var moment = require('moment-timezone')

var hijriCal = require('./hijri-calendar')
var hebrewCal = require('./hebrew-calendar')

var DAYS = (function () {
  var o = {}
  var i = 0
  'sunday|monday|tuesday|wednesday|thursday|friday|saturday'
    .split('|')
    .forEach(function (day) {
      o[day] = i++
    })
  return o
})()

/**
 * return a date function
 * @param {Object}
 * @param {Array} [rules]
 * @return {Function} `function (year) {}` - returns {Object} Date
 */
function dateFn (obj, rules) {
  var fn
  obj = obj || {}

  if (obj.fn === 'easter') {
    var easterFn = easter.easter
    if (obj.easter === 'orthodox') {
      easterFn = easter.orthodoxEaster
    }
    fn = _easterFn(easterFn, obj)
  } else if (obj.fn === 'islamic') {
    fn = _mappingFn(hijriCal, -6, obj)
  } else if (obj.fn === 'jewish') {
    fn = _mappingFn(hebrewCal, -6, obj)
  } else if (obj.fn === 'equinox') {
    fn = _equinox(obj)
  } else if (obj.fn === 'dateBridge') {
    fn = _dateBridge(obj, rules)
  } else if (obj.fn === 'dateDir') {
    fn = _dateDir(obj)
  } else if (obj.fn === 'dateIfThen') {
    fn = _dateIfThen(obj)
  } else if (obj.month && obj.day) {
    fn = _date(obj)
  }
  return fn
}
module.exports = dateFn

/**
 * convert string to number
 * @private
 * @param {String} str
 * @return {Number} converted number or undefined
 */
function toNumber (str) {
  var num = parseInt(str, 10)
  if (!isNaN(num)) {
    return num
  }
}
dateFn.toNumber = toNumber

/**
 * convert a date into a string
 * @param {Date} date
 * @return {String} e.g. `2015-12-31 12:00:10`
 */
function toString (date) {
  var year = zero(date.getFullYear(), 4)
  var month = zero(date.getMonth() + 1)
  var day = zero(date.getDate())
  var hours = zero(date.getHours())
  var minutes = zero(date.getMinutes())
  var seconds = zero(date.getSeconds())

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}
dateFn.toString = toString

/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
function zero (number, len) {
  len = len || 2
  number = Array(len).join('0') + number
  return number.substr(number.length - len, len)
}

/**
 * convert to internal date format
 */
function toDate (date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  }
}

/**
 * calculate offset days for date `d`
 * @param {Number} year
 * @param {Object} d - `{ month: {Number}, day: {Number}, hour: {Number} }`
 * @param {Number} offset - offset in days
 * @return {Date}
 */
function offsetDays (year, d, offset) {
  offset = offset || 0
  return new Date(year, d.month - 1, d.day + offset, (d.hour || 0), (d.minute || 0), 0, 0)
}
dateFn.offsetDays = offsetDays

function offsetDaysEnd (year, d, offset) {
  offset = offset || 0
  var endHour = (d.hour || 0)
  var endMinute = (d.minute || 0)
  if (d.duration) {
    var tmp = d.duration.replace(/^(\d+)[hd]?/, '$1')
    tmp = toNumber(tmp)
    if (tmp) {
      if (/d$/.test(d.duration)) {
        offset += tmp
      } else {
        endHour += tmp
      }
    }
  } else {
    endHour = 24
    endMinute = 0
  }
  return new Date(year, d.month - 1, d.day + offset, endHour, endMinute, 0, 0)
}

/**
 * @private
 * @return {Function} `function (year) {}` - returns {Object} Date
 */
function _easterFn (easterFn, d) {
  _toNumbers(d)
  return function (year) {
    d = _.assign(d, easterFn(year))
    d = _time(d, year)
    return {
      start: offsetDays(year, d, d.days),
      end: offsetDaysEnd(year, d, d.days)
    }
  }
}

/**
 * @private
 * @return {Function} `function (year) {}` - returns {Object} Date
 */
function _mappingFn (map, offsetHours, d) {
  d.day = toNumber(d.day)
  d.hour = (toNumber(d.hour) || 0) + offsetHours
  d.duration = d.duration || '24'

  return function (year) {
    var dd
    var start
    var firstDays
    var out = []

    if (!(map[year] && map[year + 1] && map[year - 1])) {
      return false
    }

    for (var y = year - 1; y <= year + 1; y++) {
      firstDays = map[y][d.month]
      for (var i = 0; i < firstDays.length; i += 2) {
        dd = _.assign({}, d, { month: firstDays[i] + 1, day: firstDays[i + 1] })
        start = offsetDays(y, dd, d.day - 1)
        if (start.getFullYear() === year) {
          dd = _time(dd, year)
          out.push({
            start: offsetDays(y, dd, d.day - 1),
            end: offsetDaysEnd(y, dd, d.day - 1)
          })
        }
      }
    }
    return out
  }
}

/**
 */
function _equinox (d) {
  var season = {
    spring: 0,
    summer: 1,
    autumn: 2,
    winter: 3
  }
  d.days = d.days || 0

  return function (year) {
    var jd = moonbeams.season(season[d.season], year)
    var mbdate = moonbeams.jdToCalendar(jd)
    var mbhour = moonbeams.dayToHms(mbdate.day)

    // str is needed to get date in GMT
    var str = zero(mbdate.year, 4) + '-' +
      zero(mbdate.month) + '-' +
      zero(Math.floor(mbdate.day)) + 'T' +
      zero(mbhour.hour) + ':' +
      zero(mbhour.minute) + ':' +
      zero(mbhour.second) + 'Z'

    var date = moment(str).tz(d.timezone)

    var d1 = _.assign({}, d, { month: date.month() + 1, day: date.date() })
    d1 = _time(d1, year)

    if (d1.weekday) {
      return _dateDir(d1)(year)
    } else {
      var offset = d1.days * (d.direction === 'after' ? 1 : -1)
      return {
        start: offsetDays(year, d1, offset),
        end: offsetDaysEnd(year, d1, offset)
      }
    }
  }
}

/**
 * @private
 * @param {Object} d - parsed object
 * ```
 * {
 *   fn: 'dateBridge',
 *   month: '9',
 *   day: '22',
 *   hour: undefined,
 *   isDates: [
 *     { month: '9', day: '21' },
 *     { month: '9', day: '23' }
 *   ],
 *   type: 'public'
 * }
 * ```
 * @return {Function} `function (year) {}` - returns {Object} Date
 */
function _dateBridge (d, rules) {
  _toNumbers(d)

  for (var i in d.isDates) {
    ['month', 'day'].forEach(function (p) {
      d.isDates[i][p] = toNumber(d.isDates[i][p])
    })
  }

  function F (year) {
    var ok = {}
    var tmp
    var i
    var j

    if (!rules) {
      return false
    }

    // calculate the holidays for year
    for (i in rules) {
      if (F !== rules[i].fn) { // prevent recursion for this function
        tmp = rules[i].fn(year)
        if (tmp && (tmp = tmp.start)) {
          tmp.month = tmp.getMonth() + 1
          tmp.day = tmp.getDate()
          for (j in d.isDates) {
            if (tmp.month === d.isDates[j].month &&
              tmp.day === d.isDates[j].day
            ) {
              if (!d.type || d.type === rules[i].type) {
                ok[tmp.month + '-' + tmp.day] = 1
              }
            }
          }
        }
      }
    }

    if (d.isDates.length === Object.keys(ok).length) {
      return _dateDir(d)(year)
    }

    return false
  }

  return F
}

/**
 * @private
 * @param {Object} d - parsed object
 * ```
 * {
 *    fn: 'dateDir',
 *    count: '1',
 *    weekday: 'monday',
 *    direction: 'after',
 *    month: '05',
 *    day: '01'
 *  }
 * ```
 * @return {Function} `function (year) {}` - returns {Object} Date
 */
function _dateDir (d) {
  d.weekday = DAYS[d.weekday]
  d.weekday2 = d.weekday2 ? DAYS[d.weekday2] : undefined
  _toNumbers(d)

  return function (year) {
    var offset
    var date = offsetDays(year, d, 0)
    var weekday = date.getDay()
    var count = d.count - 1
    if (!_yearRule(d, year)) {
      return
    }
    if (d.direction === 'before') {
      if (weekday === d.weekday) {
        count++
      }
      offset = ((7 + weekday - d.weekday) % 7 + count * 7) * -1
    } else {
      offset = ((7 - weekday + d.weekday) % 7 + count * 7)
    }
    if (d.weekday2 !== undefined) {
      offset += _weekday2(d)
    }
    d = _time(d, year)
    return {
      start: offsetDays(year, d, offset),
      end: offsetDaysEnd(year, d, offset)
    }
  }
}

/**
 * @private
 * @param {Object} d - parsed object
 * ```
 * {
 *   fn: 'dateIfThen',
 *   month: '5',
 *   day: '6',
 *   if: [ 'wednesday' ],
 *   direction: 'previous',
 *   then: 'wednesday'
 * }
 * ```
 * @return {Function} `function (year) {}` - returns {Object} Date
 */
function _dateIfThen (d) {
  var rules = {}
  d.rules.forEach(function (obj) {
    obj.if.forEach(function (wd) {
      rules[DAYS[wd]] = {
        direction: obj.direction,
        then: DAYS[obj.then]
      }
    })
  })

  return function (year) {
    var arr = []
    var dArr = [d]

    if (d.other) {
      var tmp = [].concat(dateFn(d.other)(year))
      dArr = tmp.map(function (t) {
        var _d
        var date = t.start

        // calendar days which start at sunset
        if (d.other.fn === 'islamic' ||
          d.other.fn === 'jewish'
        ) {
          date = t.end
        }

        _d = _.assign({}, d, toDate(date))
        _d.hour = 0
        _d.minute = 0

        if (d.observeBoth) {
          arr.push(t)
        }
        return _d
      })
    } else {
      if (d.observeBoth) {
        arr.push({
          start: offsetDays(year, d),
          end: offsetDaysEnd(year, d)
        })
      }
    }

    arr = arr.concat(dArr.map(function (d) {
      var o
      var offset = 0
      var date = offsetDays(year, d, 0)
      var weekday = date.getDay()

      if (rules[weekday]) {
        if (rules[weekday].direction === 'previous') {
          offset = -1 * ((7 + weekday - rules[weekday].then) % 7)
          if (!offset) {
            offset = -7
          }
        } else {
          offset = ((7 - weekday + rules[weekday].then) % 7)
          if (!offset) {
            offset = 7
          }
        }
      } else if (d.substitute || d.observeBoth) {
        return false
      }
      d = _time(d, year)
      o = {
        start: offsetDays(year, d, offset),
        end: offsetDaysEnd(year, d, offset)
      }
      if (d.substitute || d.observeBoth) {
        o.substitute = true
      }
      return o
    })
    .filter(function (d) {
      return d
    })
    )

    return arr
  }
}

/**
 * @private
 * @return {Boolean} if true year is a leap year
 */
function _isLeapYear (year) {
  if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
    return true
  }
  return false
}

/**
 * @private
 * @return {Boolean} if true year matches rule
 */
function _yearRule (d, year) {
  var tmp
  if (d.yearRule && d.yearRule.cardinality) {
    if (d.yearRule.cardinality === 'leap' && _isLeapYear(year)) {
      return true
    } else if (d.yearRule.cardinality === 'non-leap' && !_isLeapYear(year)) {
      return true
    } else if (d.yearRule.cardinality === 'even' && (year + 1) % 2) {
      return true
    } else if (d.yearRule.cardinality === 'odd' && year % 2) {
      return true
    } else {
      return false
    }
  } else if (d.yearRule && d.yearRule.every && d.yearRule.since) {
    tmp = (year - toNumber(d.yearRule.since)) % toNumber(d.yearRule.every)
    if (tmp === 0) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

/**
 * calulates distance between weekday and secend weekday
 * @private
 * @param {Object} d
 * @param {Number} d.weekday - weekday to start with
 * @param {Number} d.weekday2 - weekday to end with
 * @param {String} d.direction2 - direction to go (before/after)
 * @return {Number} offset in days
 */
function _weekday2 (d) {
  if (d.direction2 === 'after') {
    if (d.weekday >= d.weekday2) {
      d.weekday2 += 7
    }
  } else {
    if (d.weekday <= d.weekday2) {
      d.weekday += 7
    }
  }
  var offset = (d.weekday2 - d.weekday)
  return offset
}

/**
 * @private
 * @param {Object} d - parsed object
 * ```
 * {
 *   hour: '14',
 *   minute: '0'
 *   ifTime: 'sunday',
 *   thenHour: '0',
 *   thenMinute: '0'
 * }
 * ```
 * @return {Function} `function (year) {}` - returns {Object} d
 */
function _time (d, year) {
  d.ifTime = DAYS[d.ifTime]
  var date = offsetDays(year, d, 0)
  if (date.getDay() === d.ifTime) {
    ;['thenHour', 'thenMinute'].forEach(function (key) {
      d[key] = toNumber(d[key]) || 0
    })
    d.hour = d.thenHour
    d.minute = d.thenMinute
  }
  return d
}

/**
 * @private
 * @param {Object} d - parsed object
 * ```
 * {
 *   year: '2011',
 *   month: '05',
 *   day: '07',
 *   hour: '12'
 * }
 * ```
 * @return {Function} `function (year) {}` - returns {Object} Date
 */
function _date (d) {
  _toNumbers(d)
  return function (year) {
    if (d.year && d.year !== year) {
      return
    }
    if (!_yearRule(d, year)) {
      return
    }
    d = _time(d, year)
    return {
      start: offsetDays(year, d, 0),
      end: offsetDaysEnd(year, d, 0)
    }
  }
}

/**
 */
function _toNumbers (d) {
  ;['count', 'days', 'year', 'month', 'day', 'hour', 'minute'].forEach(function (key) {
    d[key] = toNumber(d[key]) || 0
  })
}
