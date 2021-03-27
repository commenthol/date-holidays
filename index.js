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
  const g = { year: thisYear(), country: 'CA', language: 'fr' }
  const n = {}
  const selects = {
    year: select('year'),
    country: select('country', selectState),
    state: select('state', selectRegion),
    region: select('region'),
    language: select('language')
  }

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

  function duration (ms) {
    const days = (ms / DAY) | 0
    const hours = (ms - (days * DAY)) / HOUR | 0
    let str = days ? days + 'd ' : ''
    str += hours ? hours + 'h' : ''
    return str
  }

  function select (id, fn) {
    const el = document.getElementById(id)
    const self = {
      opts: {},
      onChange: function (ev) {
        self.selected = ev.target.value
        g[id] = self.selected
        n[id] = ev.target.selectedOptions && ev.target.selectedOptions[0].text
        if (id === 'country') {
          g.language = undefined
          ;['state', 'region'].forEach(function (i) {
            n[i] = g[i] = undefined
            select(i).disable()
          })
        } else if (id === 'state') {
          ;['region'].forEach(function (i) {
            n[i] = g[i] = undefined
            select(i).disable()
          })
        }
        route()
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
    const obj = {}
    const year = g.year
    for (let i = year - 5; i <= year + 5; i++) {
      obj[i] = i
    }
    selects.year.render(obj, year)
  }
  function selectCountry () {
    const hd = new Holidays()
    const cs = hd.getCountries(g.language)
    g.country = cs[g.country] ? g.country : 'CA'
    n.country = cs[g.country]
    selects.country.render(cs, g.country)
  }
  function selectState () {
    const hd = new Holidays()
    const cs = hd.getStates(g.country)
    g.state = cs && cs[g.state] ? g.state : ''
    n.state = cs && cs[g.state]
    selects.state.render(cs, g.state)
  }
  function selectRegion () {
    const hd = new Holidays()
    const cs = hd.getRegions(g.country, g.state)
    g.region = cs && cs[g.region] ? g.region : ''
    n.state = cs && cs[g.region]
    selects.region.render(cs, g.region)
  }
  function selectLanguage () {
    const hd = new Holidays()
    hd.init(g.country)
    const cs = hd.getLanguages()
    g.language = cs.includes(g.language) ? g.language : cs[0]
    const cso = cs.reduce((o, k) => { o[k] = k; return o }, {})
    selects.language.render(cso, g.language)
  }

  function renderContent () {
    const hd = new Holidays(g.country, g.state, g.region, { languages: g.language })
    const holidays = g.holidays = hd.getHolidays(g.year)
    let count = 0
    const table = [
      '<table>',
      '<thead><tr><th>',
      ['#', 'weekday', 'date', 'duration', 'name', 'type'].join('</th><th>'),
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
          d.type
        ].join('</td><td>') + '</td></tr>'
      }).join(''),
      '</tbody>',
      '</table>',
      '<p class="download">',
      '<label for="fullday"><input id="fullday" checked type="checkbox">Full day entries</label><br>',
      '<a id="download">Download calendar!</a>',
      '</p>'
    ].join('')
    document.getElementById('content').innerHTML = table
    document.getElementById('download').addEventListener('click', onDownload)
  }

  function download (filename, dates) {
    const fullday = document.getElementById('fullday').checked
    const el = document.createElement('a')
    el.setAttribute('href', 'data:text/calendar;charset=utf-8,' +
      encodeURIComponent(vcalendar(dates, { fullday: fullday })))
    el.setAttribute('download', filename)

    el.style.display = 'none'
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }
  function onDownload () {
    const filename = [g.year, n.country, n.state, n.region, g.language]
      .filter(Boolean).join('-') + '.ics'
    download(filename, g.holidays)
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
    selectYear()
    selectCountry()
    selectLanguage()
    selectState()
    selectRegion()
    renderContent()
  }

  window.addEventListener('hashchange', router, false)
  router()
}())

},{"date-holidays-ical/lib/vcalendar":2}]},{},[3]);
