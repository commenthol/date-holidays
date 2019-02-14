(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

var tmpl = require('resig')

// Vcalendar template
var tVcalendar = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//date/holidays//NONSGML v1.0//EN',
  'METHOD:PUBLISH',
  '<%= vevents %>' +
  'END:VCALENDAR'
].join('\\n') + '\\n'

// Vevent template
var tVevent = [
  'BEGIN:VEVENT',
  'CREATED:<%= created %>',
  'LAST-MODIFIED:<%= created %>',
  'DTSTAMP:<%= created %>',
  'SUMMARY:<%= summary %>',
  'DTSTART;VALUE=DATE:<%= dtstart %>',
  'DTEND;VALUE=DATE:<%= dtend %>',
  '<% if (description) { %>' +
  'DESCRIPTION:<%= description %>',
  '<% } %>' +
  'TRANSP:<% if (busy) { %>OPAQUE<% } else { %>TRANSPARENT<% } %>',
  'UID:<%= uid %>',
  'END:VEVENT'
].join('\\n') + '\\n'

/**
 * generate a simple uid
 * @private
 * @return {String} uid
 */
function uid () {
  var uid = (Math.random() * 1e16).toString(16) +
    '@date-holidays'
  return uid
}

/**
 * prefill a number with `len` zeroes
 * @private
 * @param {Number} num
 * @param {Number} [len]
 * @return {String} prefixed number
 */
function zero (num, len) {
  len = len || 2
  var str = Array(len).join('0') + '' + num
  return str.substring(str.length - len)
}

/**
 * convert an Iso Date or String to Vcalendar Date
 * @param {Date|String} date
 * @return {String}
 * @example
 * ```
 * toIso('2016-01-02T11:29:54.925Z')
 * //> '20160102T112954Z'
 * ```
 */
function toISO (date) {
  if (typeof date === 'object') {
    date = date.toISOString()
  }
  return date
    .replace(/[:-]/g, '')
    .replace(/\.\d{3}/g, '')
}

/**
 * convert a date string using offset days to a string
 * @private
 * @param {String} str
 * @param {Number} [offset] - offset to date described by str in milliseconds
 * @return {String} date string `YYYYMMDD`
 * @example
 * ```
 * toDay('2016-01-02 05:00:01')
 * //> '2016012'
 * ```
 */
function toDay (str, offset) {
  offset = offset || 0
  // offset only full days
  offset = Math.ceil(offset / 86400000) * 86400000

  var date = +(new Date(str)) + (offset)
  date = new Date(date)
  var s = zero(date.getFullYear(), 4) +
    zero(date.getMonth() + 1) +
    zero(date.getDate())
  return s
}

/**
 * apply template on date object from `date-holidays`
 * @private
 * @param {Object} date
 * @param {Object} [opts]
 * @return {String} a single vCalendar vevent
 */
function vevent (date, opts) {
  opts = opts || {}

  if (!date) {
    return '\n'
  }

  var now = (new Date())
  var dtstart = toISO(date.start)
  var dtend = toISO(date.end)
  var note = date.note || ''
  var type = date.type || ''

  if (opts.fullday) {
    dtend = toDay(date.date, +date.end - +date.start)
    dtstart = toDay(date.date)
  }

  var event = {
    created: toISO(now),
    summary: date.name,
    dtstart: dtstart,
    dtend: dtend,
    description: type + (type && note ? ' - ' : '') + note,
    busy: (type === 'public' ? 1 : 0),
    uid: uid()
  }

  return tmpl(tVevent, event)
}

/**
 * get vCalendar
 * @param {Object} date
 * @param {Object} [opts]
 * @param
 * @return {String} vCalendar
 */
function vcalendar (dates, opts) {
  var vevents = dates.map(function (date) {
    return vevent(date, opts)
  })

  return tmpl(tVcalendar, {vevents: vevents.join('')})
}

module.exports = vcalendar

},{"resig":2}],2:[function(require,module,exports){
module.exports = (function() {
  var cache = {};

  function tmpl(str, data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
      tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'") + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
  };

  return tmpl;
})();

},{}],3:[function(require,module,exports){
/* global Holidays */

;(function () {
  var vcalendar = require('date-holidays-ical/lib/vcalendar')

  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  var year = new Date().getFullYear()
  var g = { year: year }
  var n = {}

  function select (id, fn) {
    var el = document.getElementById(id)
    var self = {
      opts: {},
      onChange: function (ev) {
        self.selected = ev.target.value
        g[id] = self.selected
        n[id] = ev.target.selectedOptions && ev.target.selectedOptions[0].text
        if (id === 'country') {
          ;['state', 'region'].forEach(function (i) {
            g[i] = undefined
            select(i).disable()
          })
        } else if (id === 'state') {
          ;['region'].forEach(function (i) {
            g[i] = undefined
            select(i).disable()
          })
        }
        renderContent()
        fn && fn()
      },
      disable: function () {
        el.style = 'display:none'
      },
      render: function (obj, selected) {
        self.selected = selected
        if (!obj) {
          el.style = 'display:none'
        } else {
          el.style = 'display:block'
          el.innerHTML =
          (selected ? '' : '<option>--</option>') +
          Object.keys(obj).map(function (i) {
            return [
              '<option value="', i, '"',
              i == self.selected ? ' selected' : '', // eslint-disable-line eqeqeq
              '>', obj[i], '</option>'
            ].join('')
          }).join('')
        }
      }
    }
    el.addEventListener('change', self.onChange)
    return self
  }

  function selectYear () {
    var obj = {}
    for (var i = year; i < year + 10; i++) {
      obj[i] = i
    }
    select('year').render(obj, year)
  }
  function selectCountry (code, name) {
    var hd = new Holidays()
    var cs = hd.getCountries()
    var s = select('country', selectState)
    s.render(cs, code)
    if (code) s.onChange({ target: { value: code, selectedOptions: [ { text: name } ] } })
  }
  function selectState () {
    var hd = new Holidays()
    var cs = hd.getStates(g.country)
    select('state', selectRegion).render(cs)
  }
  function selectRegion () {
    var hd = new Holidays()
    var cs = hd.getRegions(g.country, g.state)
    select('region').render(cs)
  }

  function renderContent () {
    var hd = new Holidays(g.country, g.state, g.region)
    var holidays = g.holidays = hd.getHolidays(g.year)
    var count = 0
    var table = [
      '<table>',
      '<thead><tr><th>',
      ['#', 'weekday', 'date', 'name', 'type'].join('</th><th>'),
      '</th></tr></thead>',
      '<tbody>',
      Object.keys(holidays).map(function (i) {
        var d = holidays[i]
        return '<tr><td>' + [
          count++,
          WEEKDAYS[d.start.getDay()],
          d.date,
          d.name,
          d.type
        ].join('</td><td>') + '</td></tr>'
      }).join(''),
      '</tbody>',
      '</table>',
      '<p id="download"><a>Download calendar!</a></p>'
    ].join('')
    document.getElementById('content').innerHTML = table
    document.getElementById('download').addEventListener('click', onDownload)
  }

  function download (filename, dates) {
    var el = document.createElement('a')
    el.setAttribute('href', 'data:text/calendar;charset=utf-8,' +
      encodeURIComponent(vcalendar(dates)))
    el.setAttribute('download', filename)

    el.style.display = 'none'
    document.body.appendChild(el)

    el.click()

    document.body.removeChild(el)
  }
  function onDownload () {
    var filename = [g.year, n.country, n.state, n.region]
      .filter(function (i) { return i }).join('-') + '.ics'
    download(filename, g.holidays)
  }

  selectYear()
  selectCountry('CA', 'Canada')
}())

},{"date-holidays-ical/lib/vcalendar":1}]},{},[3]);
