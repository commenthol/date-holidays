(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var tVcalendar = function tVcalendar(vevents) {
  return 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//date/holidays//NONSGML v1.0//EN\nMETHOD:PUBLISH\n' + vevents.join('') + 'END:VCALENDAR\n';
};

var tVevent = function tVevent(event) {
  return 'BEGIN:VEVENT\nCREATED:' + event.created + '\nLAST-MODIFIED:' + event.created + '\nDTSTAMP:' + event.created + '\nSUMMARY:' + event.summary + '\nDTSTART;VALUE=DATE:' + event.dtstart + '\nDTEND;VALUE=DATE:' + event.dtend + (event.description ? '\nDESCRIPTION:' + event.description : '\n') + '\nTRANSP:' + (event.busy ? 'OPAQUE' : 'TRANSPARENT') + '\nUID:' + event.uid + '\nEND:VEVENT\n';
};

module.exports = {
  tVcalendar: tVcalendar,
  tVevent: tVevent
};
},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('./templates'),
    tVcalendar = _require.tVcalendar,
    tVevent = _require.tVevent;

var random = function random() {
  return Math.random().toString(16).substr(2);
};

/**
 * generate a simple uid
 * @private
 * @return {String} uid
 */
function uid() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

  var str = '';
  while (str.length < len) {
    str += random();
  }return str.substr(0, len) + '@date-holidays';
}

/**
 * prefill a number with `len` zeroes
 * @private
 * @param {Number} num
 * @param {Number} [len]
 * @return {String} prefixed number
 */
function zero(num) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var str = Array(len).join('0') + '' + num;
  return str.substring(str.length - len);
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
function toISO(date) {
  if ((typeof date === 'undefined' ? 'undefined' : _typeof(date)) === 'object') {
    date = date.toISOString();
  }
  return date.replace(/[:-]/g, '').replace(/\.\d{3}/g, '');
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
function toDay(str) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  // offset only full days
  offset = Math.ceil(offset / 86400000) * 86400000;

  var ticks = +new Date(str) + offset;
  var date = new Date(ticks);
  var s = zero(date.getFullYear(), 4) + zero(date.getMonth() + 1) + zero(date.getDate());
  return s;
}

/**
 * apply template on date object from `date-holidays`
 * @private
 * @param {Object} date
 * @param {Object} [opts]
 * @param {Boolean} [opts.fullday] - if `true` then event is treated to be on complete day
 * @return {String} a single vCalendar vevent
 */
function vevent(date) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!date) {
    return '\n';
  }

  var now = new Date();
  var dtstart = toISO(date.start);
  var dtend = toISO(date.end);
  var note = date.note || '';
  var type = date.type || '';

  if (opts.fullday) {
    dtend = toDay(date.date, +date.end - +date.start);
    dtstart = toDay(date.date);
  }

  var event = {
    created: toISO(now),
    summary: date.name,
    dtstart: dtstart,
    dtend: dtend,
    description: type + (type && note ? ' - ' : '') + note,
    busy: type === 'public',
    uid: uid()
  };

  return tVevent(event);
}

/**
 * get vCalendar
 * @param {Object} date
 * @param {Object} [opts]
 * @return {String} vCalendar
 */
function vcalendar(dates, opts) {
  var vevents = dates.map(function (date) {
    return vevent(date, opts);
  });
  return tVcalendar(vevents);
}

module.exports = vcalendar;
},{"./templates":1}],3:[function(require,module,exports){
;(function () {
  const vcalendar = require('date-holidays-ical/lib/vcalendar')

  const DAY = 86400000
  const HOUR = 3600000

  const Holidays = window.Holidays.default
  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const thisYear = () => new Date().getFullYear()
  const g = { year: thisYear(), country: 'CA', language: 'fr', isFullDay: true }
  const n = {}

  function escapeHtml (string) {
    return (string || '')
      .replace(/&amp;/g, '&')
      .replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag]))
  }

  function h (el, props = {}, children = []) {
    if (typeof el === 'function') {
      return el({ ...props, children })
    }
    const $ = document.createElement(el)
    Object.entries(props).forEach(([prop, val]) => {
      if (prop.indexOf('on') === 0) {
        $.addEventListener(prop.substring(2).toLowerCase(), val)
      } else if (prop === 'style') {
        Object.entries(val).forEach(([p, v]) => { $.style[p] = v })
      } else {
        $[prop] = val
      }
    })
    for (const child of [].concat(children)) {
      child && $.append(child)
    }
    return $
  }

  function duration (ms) {
    const days = (ms / DAY) | 0
    const hours = (ms - (days * DAY)) / HOUR | 0
    let str = days ? days + 'd ' : ''
    str += hours ? hours + 'h' : ''
    return str
  }

  function Select ({ options, selected, id }) {
    if (!options) return null
    const onChange = (ev) => {
      g[id] = ev.target.value
      n[id] = ev.target.selectedOptions && ev.target.selectedOptions[0].text
      if (id === 'country') {
        g.language = undefined
        ;['state', 'region'].forEach(function (i) {
          n[i] = g[i] = undefined
        })
      } else if (id === 'state') {
        ;['region'].forEach(function (i) {
          n[i] = g[i] = undefined
        })
      }
      route()
    }

    return h('div', {},
      h('select',
        { onChange },
        Object.entries(options).reduce((a, [value, label]) => {
          a.push(h(
            'option',
            { value, selected: value == selected }, // eslint-disable-line eqeqeq
            label
          ))
          return a
        }, ['state', 'region'].includes(id) ? [h('option', {}, '--')] : []))
    )
  }

  function SelectYear () {
    const selected = g.year
    const options = {}
    for (let i = selected - 5; i <= selected + 5; i++) {
      options[i] = i
    }
    return h(Select, { options, selected, id: 'year' })
  }

  function SelectCountry () {
    const hd = new Holidays()
    const options = hd.getCountries(g.language)
    const selected = g.country = options[g.country] ? g.country : 'CA'
    n.country = options[g.country]
    return h(Select, { options, selected, id: 'country' })
  }

  function SelectState () {
    const hd = new Holidays()
    const options = hd.getStates(g.country)
    const selected = g.state = options && options[g.state] ? g.state : ''
    n.state = options && options[g.state]
    return h(Select, { options, selected, id: 'state' })
  }

  function SelectRegion () {
    const hd = new Holidays()
    const options = hd.getRegions(g.country, g.state)
    const selected = g.region = options && options[g.region] ? g.region : ''
    n.state = options && options[g.region]
    return h(Select, { options, selected, id: 'region' })
  }

  function SelectLanguage () {
    const hd = new Holidays()
    hd.init(g.country)
    const cs = hd.getLanguages()
    const selected = g.language = cs.includes(g.language) ? g.language : cs[0]
    const options = cs.reduce((o, k) => { o[k] = k; return o }, {})
    return h(Select, { options, selected, id: 'language' })
  }

  function Table () {
    const hd = new Holidays(g.country, g.state, g.region, { languages: g.language })
    const holidays = g.holidays = hd.getHolidays(g.year)
    let count = 0
    const table = [
      '<thead><tr><th>',
      ['#', 'weekday', 'date', 'duration', 'name', 'type', 'note'].join('</th><th>'),
      '</th></tr></thead>',
      '<tbody>',
      Object.keys(holidays).map(function (i) {
        const d = holidays[i]
        const _date = d.date.replace(/^(\d+-\d+-\d+ \d+:\d+:\d+).*$/, '$1')
        return '<tr><td>' + [
          count++,
          WEEKDAYS[new Date(_date).getDay()],
          d.date,
          duration(d.end - d.start),
          d.name,
          d.type,
          d.note
        ].join('</td><td>') + '</td></tr>'
      }).join(''),
      '</tbody>'
    ].join('')
    return h('table', { innerHTML: table })
  }

  function Download ({ isFullDay }) {
    const handleDownload = () => {
      const filename = [g.year, n.country, n.state, n.region, g.language].filter(Boolean).join('-') + '.ics'
      download(filename, g.holidays, isFullDay)
    }
    const handleFullday = (ev) => {
      g.isFullDay = isFullDay = !isFullDay
    }
    return h('p',
      { className: 'download' },
      [
        h('label', { for: 'fullday' }, [
          h('input', {
            id: 'fullday',
            checked: isFullDay,
            type: 'checkbox',
            onChange: handleFullday
          }),
          'Full day entries'
        ]),
        h('br'),
        h('a', { onclick: handleDownload }, ['Download calendar!'])
      ]
    )
  }

  function download (filename, dates, isFullDay) {
    const el = h('a', {
      style: { display: 'none' },
      href: 'data:text/calendar;charset=utf-8,' + encodeURIComponent(vcalendar(dates, { fullday: isFullDay })),
      download: filename
    })
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }

  function renderContent () {
    const $ = document.getElementById('content')
    $.innerHTML = ''
    $.append(h('div', {}, [
      h('section', {}, [
        h(SelectYear),
        h(SelectCountry),
        h(SelectState),
        h(SelectRegion),
        h(SelectLanguage)
      ]),
      h(Table),
      h(Download, { isFullDay: g.isFullDay })
    ]))
  }

  function route () {
    const { language = '-', year, country, state = '', region = '' } = g
    window.location.hash = '#' + [language, year, country, state, region].filter(Boolean).join('/')
  }

  function router () {
    const { hash } = window.location
    if (hash && hash.length > 1) {
      let [language, year, country, state, region] = hash.substring(1).split('/').map(escapeHtml)
      if (isNaN(Number(year))) year = thisYear()
      if (language === '-') language = undefined
      Object.assign(g, { language, year: Number(year), country, state, region })
    }
    renderContent()
  }

  window.addEventListener('hashchange', router, false)
  router()
}())

},{"date-holidays-ical/lib/vcalendar":2}]},{},[3]);
