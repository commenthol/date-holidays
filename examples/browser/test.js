;(function () {
  const vcalendar = require('date-holidays-ical/lib/vcalendar')

  const DAY = 86400000
  const HOUR = 3600000

  const Holidays = window.Holidays.default
  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const year = new Date().getFullYear()
  const g = { year: year }
  const n = {}

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
    const obj = {}
    for (let i = year; i < year + 10; i++) {
      obj[i] = i
    }
    select('year').render(obj, year)
  }
  function selectCountry (code, name) {
    const hd = new Holidays()
    const cs = hd.getCountries()
    const s = select('country', selectState)
    s.render(cs, code)
    if (code) s.onChange({ target: { value: code, selectedOptions: [{ text: name }] } })
  }
  function selectState () {
    const hd = new Holidays()
    const cs = hd.getStates(g.country)
    select('state', selectRegion).render(cs)
  }
  function selectRegion () {
    const hd = new Holidays()
    const cs = hd.getRegions(g.country, g.state)
    select('region').render(cs)
  }

  function renderContent () {
    const hd = new Holidays(g.country, g.state, g.region)
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
    const filename = [g.year, n.country, n.state, n.region]
      .filter(function (i) { return i }).join('-') + '.ics'
    download(filename, g.holidays)
  }

  selectYear()
  selectCountry('CA', 'Canada')
}())
