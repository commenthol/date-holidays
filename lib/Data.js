/**
 * @copyright 2015 (c) commenthol
 * @license ISC
 */

'use strict'

var m = require('mergee')
var _data = require('../data/holidays.json')

/**
 * Handler for holiday data provided in the Json file
 * @class
 * @param {Object} [opts]
 * @param {Object} opts.optional - include optional holidays
 */
function Data (country, state, region, data) {
  if (!(this instanceof Data)) {
    return new Data(country, state, region, data)
  }
  if (typeof region === 'object') {
    data = region
    region = null
  } else if (typeof state === 'object') {
    data = state
    state = null
  }

  this.opts = Data.splitName(country, state, region)
  this.data = data || _data
}
module.exports = Data

Data.prototype = {

  /**
   * get all countries from the data
   * @return {Object} shortcode-name value pairs. E.g. `{ AT: 'Österreich', ... }`
   */
  getCountries: function () {
    var o = {}
    var countries = this.data.holidays
    Object.keys(countries).forEach(function (k) {
      o[k] = countries[k].name || k
    })
    return o
  },

  /**
   * get all states for a given country from the data
   * @param {String} country
   * @return {Object} shortcode-name value pairs. E.g. `{ b: 'Burgenland', ... }`
   */
  getStates: function (country) {
    country = country.toUpperCase()
    var o = {}
    var states = m.get(this.data, ['holidays', country, 'states']) || m.get(this.data, ['holidays', country, 'regions'])
    if (states) {
      Object.keys(states).forEach(function (k) {
        o[k] = states[k].name || k
      })
      return o
    }
  },

  /**
   * get all regions for a given country/ state from the data
   * @param {String} country
   * @param {String} state
   * @return {Object} shortcode-name value pairs.
   */
  getRegions: function (country, state) {
    var tmp
    if ((tmp = Data.splitName(country, state))) {
      state = tmp.state
      country = tmp.country
    }
    country = country.toUpperCase()
    var o = {}
    var regions = m.get(this.data, ['holidays', country, 'states', state, 'regions'])

    if (regions) {
      Object.keys(regions).forEach(function (k) {
        o[k] = regions[k].name || k
      })
      return o
    }
  },

  /**
   * get languages for selected country, state, region
   * @return {Array} containing ISO 639-1 language shortcodes
   */
  getLanguages: function () {
    return this._getValue('langs')
  },

  /**
   * get default day off as weekday
   * @return {String} weekday of day off
   */
  getDayOff: function () {
    return this._getValue('dayoff')
  },

  /**
   * get timezones for country, state, region
   * @return {Array} of {String}s containing the timezones
   */
  getTimezones: function () {
    return this._getValue('zones')
  },

  /**
   * get list of holidays for country/ state/ region
   * @return {Object} holidayname <-> unparsed rule or date pairs
   */
  getHolidays: function () {
    var self = this
    var tmp
    var o

    if (!(this.opts && this.opts.country)) {
      return
    }

    var country = this.opts.country.toUpperCase()
    var state = this.opts.state
    var region = this.opts.region

    if ((tmp = this.data.holidays[country])) {
      o = {}
      this._assign(o, tmp)
      if ((state && tmp.regions && (tmp = tmp.regions[state])) ||
          (state && tmp.states && (tmp = tmp.states[state]))
      ) {
        this._assign(o, tmp)
        if (region && tmp.regions && (tmp = tmp.regions[region])) {
          this._assign(o, tmp)
        }
      }
      Object.keys(o).forEach(function (key) {
        // assign name references with `_name`
        var _name = o[key]._name
        if (_name && self.data.names[_name]) {
          delete o[key]._name
          o[key] = m.merge({}, self.data.names[_name], o[key])
        }
      })
    }
    return o
  },

  /**
   * get name for substitute name
   * @return {Object} translations of substitute day names
   */
  getSubstitueNames: function () {
    return m.get(this.data, ['names', 'substitutes', 'name'])
  },

  /**
   * helper to assign objects based on properties
   * @private
   * @param {Object} out - object where obj gets assigned into
   * @param {Object} obj - input obj
   * @return {Object}
   */
  _assign: function (out, obj) {
    var days
    if (obj._days) { // resolve reference
      days = m.assign({}, m.get(this.data, ['holidays'].concat(obj._days, 'days')), obj.days)
    }
    if (obj.days) {
      days = days || obj.days
      Object.keys(days).forEach(function (p) {
        if (days[p] === false) { // remove rules
          if (out[p]) {
            delete out[p]
          }
          return
        }
        out[p] = m.assign({}, out[p], days[p])
        if (!days[p].type) {
          out[p].type = 'public'
        }
      })
    }
    return out
  },

  /**
   * get a object from the data tree
   * @private
   * @param {String} key - key to look at
   * @return {Object} return object
   */
  _getValue: function (key) {
    return (
      m.get(this.data, ['holidays', this.opts.country, 'states', this.opts.state, key]) ||
      m.get(this.data, ['holidays', this.opts.country, key])
    )
  }
}

// static functions
/**
 * split country state names if they appear in concatenated format e.g. 'at.b'
 * @param {String|Object} country
 * @param {String} [state]
 * @param {String} [region]
 * @return {Object}
 */
Data.splitName = function (country, state, region) {
  if (!country) {
    return
  } else if (typeof country === 'object' && country.country) {
    return country
  }
  var o = {}
  var a = country.split('.')
  o.country = a.shift().toUpperCase()
  o.state = a.shift() || state
  o.region = a.shift() || region
  return o
}

