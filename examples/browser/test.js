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
