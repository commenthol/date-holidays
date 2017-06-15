'use strict'

const moment = require('moment-timezone')
const pad0 = require('../../src/internal/utils').pad0

const toIso = exports.toIso = function toIso (date) {
  var days = 'sun,mon,tue,wed,thu,fri,sat'.split(',')

  var y = pad0(date.getFullYear(), 4)
  var m = pad0(date.getMonth() + 1, 2)
  var d = pad0(date.getDate(), 2)
  var H = pad0(date.getHours(), 2)
  var M = pad0(date.getMinutes(), 2)
  var t = days[date.getDay()]

  return t + ' ' + y + '-' + m + '-' + d + ' ' + H + ':' + M
}

exports.fixResult = function fixResult (arr) {
  return arr.map((item) => {
    return Object.assign({}, item, {
      start: toIso(item.start),
      end: toIso(item.end)
    })
  })
}

function toString (date) {
  var year = pad0(date.getFullYear(), 4)
  var month = pad0(date.getMonth() + 1)
  var day = pad0(date.getDate())
  var hours = pad0(date.getHours())
  var minutes = pad0(date.getMinutes())
  var seconds = pad0(date.getSeconds())

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

exports.moveToTimezone = function (date, timezone) {
  if (!timezone) {
    return date
  }
  return new Date(moment.tz(toString(date), timezone).format())
}
