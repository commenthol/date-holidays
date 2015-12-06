'use strict'

function pre (num, len) {
  var zero = '0000'
  var str = '' + zero + num
  str = str.substr(str.length - len, len)
  return str
}

function toIso (date) {
  var days = 'sun,mon,tue,wed,thu,fri,sat'.split(',')

  var y = pre(date.getFullYear(), 4)
  var m = pre(date.getMonth() + 1, 2)
  var d = pre(date.getDate(), 2)
  var H = pre(date.getHours(), 2)
  var M = pre(date.getMinutes(), 2)
  var t = days[date.getDay()]

  return t + ' ' + y + '-' + m + '-' + d + ' ' + H + ':' + M
}
exports.toIso = toIso
