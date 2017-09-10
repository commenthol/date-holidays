/**
 * @copyright 2016 (c) commenthol
 * @license ISC
 */

'use strict'

const _ = {
  merge: require('lodash.merge'),
  omit: require('lodash.omit'),
  set: require('lodash.set')
}
const {toYear, toDate} = require('./internal/utils')
const Data = require('./Data')
const DateFn = require('./DateFn')

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
   * @param {Object} [opts.data] - holiday data object - see data/holidays.json
   */
  init (country, state, region, opts) {
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
   * @throws {TypeError}
   * @return {Boolean} if holiday could be set returns `true`
   */
  setHoliday (rule, opts) {
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
      opts = _.set({type: 'public'}, ['name', lang], opts)
    }

    // convert active properties to Date
    if (opts.active) {
      if (!Array.isArray(opts.active)) {
        throw TypeError('.active is not of type Array: ' + rule)
      }
      opts.active = opts.active.map((a) => {
        let from = toDate(a.from)
        let to = toDate(a.to)
        if (!(from || to)) {
          throw TypeError('.active needs .from or .to property: ' + rule)
        }
        return {from, to}
      })
    }

    // check for supported type
    if (!this._hasType(opts.type)) {
      return false
    }

    this.holidays[rule] = opts

    var fn = new DateFn(rule, this.holidays)
    if (fn.ok) {
      this.holidays[rule].fn = fn
      return true
    } else {
      // throw Error('could not parse rule: ' + rule) // NEXT
      console.log('could not parse rule: ' + rule)
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
  getHolidays (year, language) {
    year = toYear(year)

    var _this = this
    var arr = []
    var langs = this.getLanguages()
    if (language) {
      langs.unshift(language)
    }

    Object.keys(this.holidays).forEach(function (rule) {
      if (_this.holidays[rule].fn) {
        _this._dateByRule(year, rule).forEach(function (o) {
          arr.push(_this._translate(o, langs))
        })
      }
    })

    // sort by date
    arr = arr.sort(function (a, b) {
      return (+a.start) - (+b.start)
    })
    .map(function (a, i) {
      var b = arr[i + 1]
      if (b && (a.name === b.name) && (+a.start) === (+b.start)) {
        for (var type of TYPES) {
          if (type === a.type || type === b.type) {
            a.filter = true
            b.type = type
            break
          }
        }
      }
      return a
    })
    .filter(function (a) {
      if (!a.filter) return a
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
  isHoliday (date) {
    date = date || new Date()
    var hd
    var year = toYear(date)
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
   * Query for available Countries, States, Regions
   * @param {String} [country]
   * @param {String} [state]
   * @param {String} [lang] - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported countries, states, regions
   */
  query (country, state, lang) {
    var o = Data.splitName(country, state)
    if (!o || !o.country) {
      return this.getCountries(lang)
    } else if (!o.state) {
      return this.getStates(o.country, lang)
    } else {
      return this.getRegions(o.country, o.state, lang)
    }
  },

  /**
   * get supported countries
   * @param {String} [lang] - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported countries
   * ```js
   * { AD: 'Andorra',
   *   US: 'United States' }
   * ```
   */
  getCountries (lang) {
    return this.__data.getCountries(lang)
  },

  /**
   * get supported states for a given country
   * @param {String} country - shortcode of country
   * @param {String} [lang] - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported states, regions
   * ```js
   * { al: 'Alabama', ...
   *   wy: 'Wyoming' }
   * ```
   */
  getStates (country, lang) {
    return this.__data.getStates(country, lang)
  },

  /**
   * get supported regions for a given country, state
   * @param {String} country - shortcode of country
   * @param {String} state - shortcode of state
   * @param {String} [lang] - ISO-639 language shortcode
   * @return {Object} shortcode, name pairs of supported regions
   * ```js
   * { no: 'New Orleans' }
   * ```
   */
  getRegions (country, state, lang) {
    return this.__data.getRegions(country, state, lang)
  },

  /**
   * get timezones for country, state, region
   * @return {Array} of {String}s containing the timezones
   */
  getTimezones () {
    if (this.__data) {
      return this.__data.getTimezones()
    }
  },

  /**
   * sets timezone
   * @param {String} timezone - see `moment-timezone`
   * if `timezone` is `undefined` then all dates are considered local dates
   */
  setTimezone (timezone) {
    this.__timezone = timezone
  },

  /**
   * get languages for selected country, state, region
   * @return {Array} containing ISO 639-1 language shortcodes
   */
  getLanguages () {
    return this.__languages
  },

  /**
   * set language(s) for holiday names
   * @param {Array|String} language
   * @return {Array} set languages
   */
  setLanguages (language) {
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
  getDayOff () {
    if (this.__conf) {
      return this.__data.getDayOff()
    }
  },

  /**
   * @private
   * @param {Number} year
   * @param {String} rule
   */
  _dateByRule (year, rule) {
    var _rule = this.holidays[rule]
    var dates = _rule.fn.inYear(year).get(this.__timezone)

    dates = dates.map((date) => {
      var odate = _.merge({},
        _.omit(date, ['substitute']),
        _.omit(_rule, ['fn', 'enable', 'disable', 'substitute', 'active'])
      )
      if (_rule.substitute && date.substitute) {
        odate.substitute = true
      }
      return odate
    })

    return dates
  },

  /**
   * translate holiday object `o` to a language
   * @private
   * @param {Object} o
   * @param {Array} langs - languages for translation
   * @return {Object} translated holiday object
   */
  _translate (o, langs) {
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
   * set holiday types
   * @private
   * @param {Array} [t] - holiday types
   * @return {Object} new array of types
   */
  _setTypes (t) {
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
  _hasType (type) {
    return !!this.__types[type]
  }
}
