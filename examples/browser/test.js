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
