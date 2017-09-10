/* global Holidays */

;(function () {
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  var year = new Date().getFullYear()
  var g = {year: year}

  function select (id, fn) {
    var el = document.getElementById(id)
    var self = {
      opts: {},
      onChange: function (ev) {
        self.selected = ev.target.value
        g[id] = self.selected
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
  function selectCountry (code) {
    var hd = new Holidays()
    var cs = hd.getCountries()
    var s = select('country', selectState)
    s.render(cs, code)
    if (code) s.onChange({target: {value: code}})
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
    var holidays = hd.getHolidays(g.year)
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
      '</table>'
    ].join('')
    document.getElementById('content').innerHTML = table
  }

  selectYear()
  selectCountry('CA')
}())
