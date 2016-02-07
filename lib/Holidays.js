/**
 * @copyright 2016 (c) commenthol
 * @license ISC
 */

'use strict'

var m = require('mergee')
var moment = require('moment-timezone')
var Data = require('./Data')
var dateFn = require('./dateFn')
var parser = require('./parser')

var TYPES = ['public', 'bank', 'school', 'optional', 'observance']

/**
 * @class
 * @param {String|Object} country - if object use `{ country: {String}, state: {String}, region: {String} }`
 * @param {String} [state] - specifies state
 * @param {String} [region] - specifies region
 * @param {Object} [opts] - options
 * @param {Array|String} opts.languages - set language(s) with ISO 639-1 shortcodes
 * @param {String} opts.timezone - set timezone
 * @param {Array} opts.types - holiday types to consider
 * @example
 * ```js
 * new Holiday('US', 'la', 'no') // is the same as
 * new Holiday('us.la.no')       // is the same as
 * new Holiday({ country: 'us', state: 'la', region: 'no'})
 * ```
 */
function Holidays (country, state, region, opts) {
  if (!(this instanceof Holidays)) {
    return new Holidays(country, state, region, opts)
  }
  this.init(country, state, region, opts)
}
module.exports = Holidays

Holidays.prototype = {
  /**
   * initialize holidays for a country/state/region
   * @param {String|Object} country - if object use `{ country: {String}, state: {String}, region: {String} }`
   * @param {String} [state] - specifies state
   * @param {String} [region] - specifies region
   * @param {Object} [opts] - options
   * @param {Array|String} opts.languages - set language(s) with ISO 639-1 shortcodes
   * @param {String} opts.timezone - set timezone
   * @param {Array} opts.types - holiday types to consider
   */
  init: function (country, state, region, opts) {
    var self = this

    // reset settings
    this.__conf = null
    this.holidays = {}
    this.setLanguages()

    if (typeof region === 'object') {
      opts = region
      region = null
    } else if (typeof state === 'object') {
      opts = state
      state = null
    }
    opts = opts || {}
    this._setTypes(opts.types)

    this.__conf = Data.splitName(country, state, region)
    if (this.__conf) {
      this.__data = new Data(this.__conf, opts.data)
      if (opts.languages) {
        this.setLanguages(opts.languages)
      } else {
        this.setLanguages(this.__data.getLanguages())
      }
      var holidays = this.__data.getHolidays()
      if (holidays) {
        this.__timezone = opts.timezone || this.__data.getTimezones()[0]
        Object.keys(holidays).forEach(function (rule) {
          self.setHoliday(rule, holidays[rule])
        })
        return true
      }
    } else {
      this.__data = new Data(null, opts.data)
    }
  },

  /**
   * set (custom) holiday
   * @param {String} rule - rule for holiday (check supported grammar) or date in ISO Format, e.g. 12-31 for 31th Dec
   * @param {Object|String} [opts] - holiday options, if String then opts is used as name
   * @param {Object} opts.name - translated holiday names e.g. `{ en: 'name', es: 'nombre', ... }`
   * @param {String} opts.type - holiday type `public|bank|school|observance`
   * @return {Boolean} if holiday could be set returns `true`
   */
  setHoliday: function (rule, opts) {
    // remove days
    if (opts === false) {
      if (this.holidays[rule]) {
        this.holidays[rule] = false
        return true
      }
      return false
    }

    // assign a name to rule
    if (!opts || typeof opts === 'string') {
      opts = opts || rule
      var lang = this.getLanguages()[0]
      opts = m.set({type: 'public'}, ['name', lang], opts)
    }

    // check for supported type
    if (!this._hasType(opts.type)) {
      return false
    }

    this.holidays[rule] = opts

    var fn = dateFn(parser(rule), this.holidays)
    if (fn) {
      this.holidays[rule].fn = fn
      return true
    }
    return false
  },

  /**
   * get all holidays for `year` with names using prefered `language`
   * @param {String|Date} [year] - if omitted current year is choosen
   * @param {String} [language] - ISO 639-1 code for language
   * @return {Array} of found holidays in given year sorted by Date:
   * ```
   * {String} date - ISO Date String of (start)-date in local format
   * {Date} start - start date of holiday
   * {Date} end - end date of holiday
   * {String} name - name of holiday using `language` (if available)
   * {String} type - type of holiday `public|bank|school|observance`
   * ```
   */
  getHolidays: function (year, language) {
    year = this._toYear(year)

    var self = this
    var arr = []
    var langs = this.getLanguages()
    if (language) {
      langs.unshift(language)
    }

    Object.keys(this.holidays).map(function (rule) {
      if (typeof self.holidays[rule].fn === 'function') {
        self._dateByRule(year, rule).forEach(function (o) {
          arr.push(self._translate(o, langs))
        })
      }
    })

    // sort by date
    arr = arr.sort(function (a, b) {
      return (+a.start) - (+b.start)
    })

    return arr
  },

  /**
   * check whether `date` is a holiday or not
   * @param {Date} [date]
   * @return {Object} holiday:
   * ```
   * {String} date - ISO Date String of (start)-date in local format
   * {Date} start - start date of holiday
   * {Date} end - end date of holiday
   * {String} name - name of holiday using `language` (if available)
   * {String} type - type of holiday `public|bank|school|observance`
   * ```
   */
  isHoliday: function (date) {
    date = date || new Date()
    var hd
    var year = this._toYear(date)
    var rules = Object.keys(this.holidays)
    for (var i in rules) {
      hd = [].concat(this._dateByRule(year, rules[i]))
      for (var j in hd) {
        if (hd[j] && date >= hd[j].start && date < hd[j].end) {
          return this._translate(hd[j])
        }
      }
    }
    return false
  },

  /**
   * move `date` into a different `timezone`
   * @param {Date} date - date to move
   * @param {String} [timezone] - timezone from `moment-timezone`, if omitted initially set timezone is used
   * @return {Date} moved date
   */
  moveToTimezone: function (date, timezone) {
    timezone = timezone || this.__timezone
    if (!timezone) {
      return date
    }
    return new Date(moment.tz(dateFn.toString(date), timezone).format())
  },

  /**
   * Query for available Countries, States, Regions
   * @param {String} [country]
   * @param {String} [state]
   * @return {Object} shortcode, name pairs of supported countries, states, regions
   */
  query: function (country, state) {
    var o = Data.splitName(country, state)
    if (!o || !o.country) {
      return this.getCountries()
    } else if (!o.state) {
      return this.getStates(o.country)
    } else {
      return this.getRegions(o.country, o.state)
    }
  },

  /**
   * get supported countries
   * @param {String} lang - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported countries
   * ```js
   * { AD: 'Andorra',
   *   US: 'United States' }
   * ```
   */
  getCountries: function (lang) {
    return this.__data.getCountries(lang)
  },

  /**
   * get supported states for a given country
   * @param {String} country - shortcode of country
   * @return {Object} shortcode, name pairs of supported states, regions
   * ```js
   * { al: 'Alabama', ...
   *   wy: 'Wyoming' }
   * ```
   */
  getStates: function (country) {
    return this.__data.getStates(country)
  },

  /**
   * get supported regions for a given country, state
   * @param {String} country - shortcode of country
   * @param {String} state - shortcode of state
   * @return {Object} shortcode, name pairs of supported regions
   * ```js
   * { no: 'New Orleans' }
   * ```
   */
  getRegions: function (country, state) {
    return this.__data.getRegions(country, state)
  },

  /**
   * get timezones for country, state, region
   * @return {Array} of {String}s containing the timezones
   */
  getTimezones: function () {
    if (this.__data) {
      return this.__data.getTimezones()
    }
  },

  /**
   * sets timezone
   * @param {String} timezone - see `moment-timezone`
   * if `timezone` is `undefined` then all dates are considered local dates
   */
  setTimezone: function (timezone) {
    this.__timezone = timezone
  },

  /**
   * get languages for selected country, state, region
   * @return {Array} containing ISO 639-1 language shortcodes
   */
  getLanguages: function () {
    return this.__languages
  },

  /**
   * set language(s) for holiday names
   * @param {Array|String} language
   * @return {Array} set languages
   */
  setLanguages: function (language) {
    if (typeof language === 'string') {
      language = [ language ]
    }
    var tmp = {}
    this.__languages = [].concat(
        language,
        'en',
        (this.__conf ? this.__data.getLanguages() : [])
      ).filter(function (l) { // filter out duplicates
        if (!l || tmp[l]) {
          return false
        }
        tmp[l] = 1
        return true
      })
  },

  /**
   * get default day off as weekday
   * @return {String} weekday of day off
   */
  getDayOff: function () {
    if (this.__conf) {
      return this.__data.getDayOff()
    }
  },

  /**
   * @private
   * @param {Number} year
   * @param {String} rule
   * @param {Array} languages
   */
  _dateByRule: function (year, rule) {
    var o
    var a = []
    var date
    var _rule = this.holidays[rule]

    var _date = [].concat(_rule.fn(year))
    for (var i in _date) {
      if ((date = this._disable(_date[i], _rule.disable, _rule.enable))) {
        o = {
          date: dateFn.toString(date.start),
          start: this.moveToTimezone(date.start),
          end: this.moveToTimezone(date.end)
        }
        o = m.merge({}, o, m.omit(_rule, ['fn', 'enable', 'disable']))
        a.push(o)
      }
    }
    return a
  },

  /**
   * translate holiday object `o` to a language
   * @private
   * @param {Object} o
   * @param {Array} langs - languages for translation
   * @return {Object} translated holiday object
   */
  _translate: function (o, langs) {
    if (o && typeof o.name === 'object') {
      langs = langs || this.getLanguages()
      var name
      var subst
      for (var i in langs) {
        if ((name = o.name[langs[i]])) {
          o.name = name
          break
        }
      }
      if (o.substitute) {
        for (i in langs) {
          subst = this.__data.getSubstitueNames()
          if ((name = subst[langs[i]])) {
            o.name += ' (' + name + ')'
            break
          }
        }
      }
    }
    return o
  },

  /**
   * @param {Date} date
   * @param {Array} disableDates
   * @param {Array} enableDates
   */
  _disable: function (date, disableDates, enableDates) {
    var i
    var flag
    var d
    var diff

    if (date && date.start && date.end) {
      for (i in disableDates) {
        d = new Date(disableDates[i] + ' 00:00:00')
        d.setHours(date.start.getHours())
        d.setMinutes(date.start.getMinutes() + 1)
        if (d >= date.start && d < date.end) {
          flag = true
          break
        }
      }
      if (flag) {
        if (enableDates) {
          for (i in enableDates) {
            d = new Date(enableDates[i] + ' 00:00:00')
            if (d.getFullYear() === date.start.getFullYear()) {
              diff = (+date.end) - (+date.start)
              date.start.setMonth(d.getMonth())
              date.start.setDate(d.getDate())
              date.end = new Date((+date.start) + diff)
            }
          }
        } else {
          date = false
        }
      }
      return date
    }
  },

  /**
   * extract or set year
   * @private
   * @param {Number|Date|String} year
   * @return {Number} year
   */
  _toYear: function (year) {
    if (!year) {
      year = new Date().getFullYear()
    } else if (year instanceof Date) {
      year = year.getFullYear()
    } else if (typeof year === 'string') {
      year = dateFn.toNumber(year)
    }
    return year
  },

  /**
   * set holiday types
   * @private
   * @param {Array} [t] - holiday types
   * @return {Object} new array of types
   */
  _setTypes: function (t) {
    t = t || []
    var types = {}
    TYPES.map(function (type) {
      for (var i in t) {
        if (type !== t[i]) {
          return
        }
      }
      types[type] = 1
    })
    this.__types = types
  },

  /**
   * check for supported holiday type
   * @private
   * @param {String} type
   * @return {Boolean}
   */
  _hasType: function (type) {
    return !!this.__types[type]
  }
}
