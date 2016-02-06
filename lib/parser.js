/**
 * @copyright 2016 (c) commenthol
 * @license ISC
 */

'use strict'

var toNumber = require('./dateFn').toNumber

/**
 * regular expressions to parse holiday statements
 */
var grammar = (function () {
  /**
   * combines different regexes
   * @private
   * @return {RegExp} combined regex
   */
  function replace (regex, opt) {
    regex = regex.source
    opt = opt || ''
    return function self (name, val) {
      if (!name) return new RegExp(regex, opt)
      val = val.source || val
      val = val.replace(/(^|[^\[])\^/g, '$1')
      regex = regex.replace(name, val)
      return self
    }
  }

  // raw rules
  var raw = {
    _weekdays: 'sunday|monday|tuesday|wednesday|thursday|friday|saturday',
    _islamicMonths: 'Muharram|Safar|Rabi al-awwal|Rabi al-thani|Jumada al-awwal|Jumada al-thani|Rajab|Shaban|Ramadan|Shawwal|Dhu al-Qidah|Dhu al-Hijjah',
    _jewishMonths: 'Nisan|Iyyar|Sivan|Tamuz|Av|Elul|Tishrei|Cheshvan|Kislev|Tevet|Shvat|Adar',
    _days: /(_weekdays)s?/,
    _direction: /(before|after|next|previous)/,
    _counts: /(\d+)(?:st|nd|rd|th)?/,
    _date: /0?(\d{1,2})-0?(\d{1,2})(?:T0?(\d{1,2}))?/,
    _time: /0?(\d{1,2}):0?(\d{1,2})/,
    duration: /^\s*\+0?(\d{1,3}[dh]?)(?:ays?|ours?)?/,
    year_rule: /^\s*(?:in (even|odd) years|every (\d+) years? since (\d{4}))/,
    easter: /^(easter|orthodox) ?([-+]?\d{1,2})?(?:days?)?/,
    islamic: /^0?(\d{1,2}) (_islamicMonths)(?:$|\s)/,
    jewish: /^0?(\d{1,2}) (_jewishMonths)/,
    day_dir_date: /^(?:_days _direction )?(?:_counts )?_days _direction _date/,
    date_if_then: /^(substitutes )?_date if ((?:(?:_weekdays),?)*) then _direction _days(?: if ((?:(?:_weekdays),?)*) then _direction _days)?(?: if ((?:(?:_weekdays),?)*) then _direction _days)?(?: if ((?:(?:_weekdays),?)*) then _direction _days)?/,
    date_if_equal_date: /^(.*?) if equal (.*?) then (.*)/,
    date_equinox: /^(?:(?:(?:_counts )?_days )?(?:(\d+)(?:d| days?)? )?_direction )?(spring|summer|autumn|winter) (?:equinox|solstice)?(?: in (.*)(?:$|\s))?/,
    date_bridge_day: /^_date if _date (?:and _date )?is (?:([^ ]+) )?holiday/,
    time: /^\s*_time(?: if _days then _time)?(?: _duration)?/,
    date: /^(?:(\d{4})-)?_date/
  }
  /* eslint-disable */
  raw._days = replace(raw._days)
    (/_weekdays/, raw._weekdays)
    ()
  raw.islamic = replace(raw.islamic, '')
    (/_islamicMonths/, raw._islamicMonths)
    ()
  raw.jewish = replace(raw.jewish, '')
    (/_jewishMonths/, raw._jewishMonths)
    ()
  raw.date_equinox = replace(raw.date_equinox, '')
    (/_counts/, raw._counts)
    (/_days/g, raw._days)
    (/_direction/g, raw._direction)
    ()
  raw.date_bridge_day = replace(raw.date_bridge_day)
    (/_date/g, raw._date)
    ()
  raw.day_dir_date = replace(raw.day_dir_date, '')
    (/_counts/, raw._counts)
    (/_days/g, raw._days)
    (/_direction/g, raw._direction)
    (/_date/, raw._date)
    ()
  raw.date_if_then = replace(raw.date_if_then, '')
    (/_date/, raw._date)
    (/_direction/g, raw._direction)
    (/_weekdays/g, raw._weekdays)
    (/_days/g, raw._days)
    ()
  raw.time = replace(raw.time, '')
    (/_days/, raw._days)
    (/_time/g, raw._time)
    ()
  raw.date = replace(raw.date)
    (/_date/, raw._date)
    ()
  /* eslint-enable */

  var i = 0
  raw.islamicMonths = {}
  raw._islamicMonths.split('|').forEach(function (m) {
    raw.islamicMonths[m] = i++
  })

  i = 0
  raw.jewishMonths = {}
  raw._jewishMonths.split('|').forEach(function (m) {
    raw.jewishMonths[m] = i++
  })

  return raw
})()

var parseFn = {
  easter: function (o) {
    var cap
    var res

    if ((cap = grammar.easter.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res = {}
      res.fn = 'easter'
      res.easter = cap.shift()
      res.days = toNumber(cap.shift()) || 0
    }
    return res
  },

  islamic: function (o) {
    var cap
    var res

    if ((cap = grammar.islamic.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res = {}
      res.fn = 'islamic'
      res.day = toNumber(cap.shift())
      res.month = grammar.islamicMonths[cap.shift()]
    }
    return res
  },

  jewish: function (o) {
    var cap
    var res

    if ((cap = grammar.jewish.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res = {}
      res.fn = 'jewish'
      res.day = toNumber(cap.shift())
      res.month = grammar.jewishMonths[cap.shift()]
    }
    return res
  },

  equinox: function (o) {
    var cap
    var res

    if ((cap = grammar.date_equinox.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res = {}
      res.fn = 'equinox'
      res.count = toNumber(cap.shift())
      res.weekday = cap.shift()
      res.days = toNumber(cap.shift())
      res.direction = cap.shift()
      res.season = cap.shift()
      res.timezone = cap.shift() || 'GMT'
    }
    return res
  },

  dateBridge: function (o) {
    var cap
    var res

    if ((cap = grammar.date_bridge_day.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()

      res = {}
      res.fn = 'dateBridge'
      res.month = toNumber(cap.shift())
      res.day = toNumber(cap.shift())
      res.hour = toNumber(cap.shift())
      res.isDates = [{
        month: toNumber(cap.shift()),
        day: toNumber(cap.shift())
      }]
      cap.shift()
      if (cap[0]) {
        res.isDates.push({
          month: toNumber(cap.shift()),
          day: toNumber(cap.shift())
        })
        cap.shift()
      }
      res.type = cap.shift()
    }
    return res
  },

  dateDir: function (o) {
    var cap
    var res

    if ((cap = grammar.day_dir_date.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res = {}
      res.fn = 'dateDir'
      res.weekday2 = cap.shift()
      res.direction2 = cap.shift()
      res.count = toNumber(cap.shift()) || 1
      res.weekday = cap.shift()
      res.direction = cap.shift()
      res.month = toNumber(cap.shift())
      res.day = toNumber(cap.shift())
      res.hour = toNumber(cap.shift())
    }
    return res
  },

  dateIfThen: function (o) {
    var cap
    var res

    if ((cap = grammar.date_if_then.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res = {}
      res.fn = 'dateIfThen'
      res.substitute = !!cap.shift()
      res.month = toNumber(cap.shift())
      res.day = toNumber(cap.shift())
      res.hour = toNumber(cap.shift())
      res.rules = []
      while (cap[0]) {
        res.rules.push({
          if: (cap.shift()).split(','),
          direction: cap.shift(),
          then: cap.shift()
        })
      }
    }
    return res
  },

  dateIfEqual: function (o) {
    var cap
    var res

    function parse (o) {
      var res
      /*eslint-disable*/
      if (res = parseFn.easter(o)) {
      } else if (res = parseFn.dateDir(o)) {
      } else if (res = parseFn.date(o)) {
      }
      /*eslint-enable*/
      return res
    }

    if ((cap = grammar.date_if_equal_date.exec(o.str))) {
      cap.shift()
      res = parse({str: cap[0]})
      if (res) {
        res.ifDate = parse({str: cap[1]})
        o.str = cap[2]
        res.thenDate = parse(o)
      }
    }
    return res
  },

  date: function (o) {
    var res
    var cap

    if ((cap = grammar.date.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res = {}
      res.year = toNumber(cap.shift())
      res.month = toNumber(cap.shift())
      res.day = toNumber(cap.shift())
      res.hour = toNumber(cap.shift())
    }
    return res
  },

  yearRule: function (o, res) {
    var cap

    if ((cap = grammar.year_rule.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res.yearRule = {
        cardinality: cap.shift(),
        every: cap.shift(),
        since: cap.shift()
      }
    }
  },

  time: function (o, res) {
    var cap

    if ((cap = grammar.time.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res.hour = toNumber(cap.shift()) || 0
      res.minute = toNumber(cap.shift()) || 0
      res.ifTime = cap.shift()
      res.thenHour = toNumber(cap.shift()) || 0
      res.thenMinute = toNumber(cap.shift()) || 0
    }
  },

  duration: function (o, res) {
    var cap

    if ((cap = grammar.duration.exec(o.str))) {
      o.str = o.str.substr(cap[0].length, o.str.length)
      cap.shift()
      res.duration = cap.shift()
    }
  }
}

/**
 * parsing grammar
 * @param {String} str
 * @return {Object} tokenized string `str`
 */
function parser (str) {
  var res
  var o = { str: str }

  /*eslint-disable*/
  if (res = parseFn.dateIfEqual(o)) {
  } else if (res = parseFn.equinox(o)) {
  } else if (res = parseFn.easter(o)) {
  } else if (res = parseFn.islamic(o)) {
  } else if (res = parseFn.jewish(o)) {
  } else if (res = parseFn.dateBridge(o)) {
  } else if (res = parseFn.dateDir(o)) {
  } else if (res = parseFn.dateIfThen(o)) {
  } else if (res = parseFn.date(o)) {
  }
  /*eslint-enable*/

  parseFn.yearRule(o, res)
  parseFn.time(o, res)
  parseFn.duration(o, res)

  return res
}
module.exports = parser
