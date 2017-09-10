'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = {
  get: require('lodash.get'),
  merge: require('lodash.merge')
};
var _data = require('../data/holidays.json');

/**
 * Handler for holiday data provided in the Json file
 * @class
 * @param {Object} [opts]
 * @param {Object} opts.optional - include optional holidays
 */

var Data = function () {
  function Data(country, state, region, data) {
    _classCallCheck(this, Data);

    if (!(this instanceof Data)) {
      return new Data(country, state, region, data);
    }
    if ((typeof region === 'undefined' ? 'undefined' : _typeof(region)) === 'object') {
      data = region;
      region = null;
    } else if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) === 'object') {
      data = state;
      state = null;
    }

    this.opts = Data.splitName(country, state, region);
    this.data = data || _data;
  }

  /**
   * get all countries from the data
   * @param {String} lang - Iso-639 shortcode
   * @return {Object} shortcode-name value pairs. E.g. `{ AT: 'Österreich', ... }`
   */


  _createClass(Data, [{
    key: 'getCountries',
    value: function getCountries(lang) {
      var _this = this;

      var o = {};
      var countries = this.data.holidays || {};
      Object.keys(countries).forEach(function (k) {
        o[k] = _this._name(countries, k, lang);
      });
      return o;
    }

    /**
     * get all states for a given country from the data
     * @param {String} country
     * @param {String} [lang] - Iso-639 shortcode
     * @return {Object} shortcode-name value pairs. E.g. `{ b: 'Burgenland', ... }`
     */

  }, {
    key: 'getStates',
    value: function getStates(country, lang) {
      var _this2 = this;

      country = country.toUpperCase();
      var o = {};
      var states = _.get(this.data, ['holidays', country, 'states']) || _.get(this.data, ['holidays', country, 'regions']);
      if (states) {
        Object.keys(states).forEach(function (k) {
          o[k] = _this2._name(states, k, lang);
        });
        return o;
      }
    }

    /**
     * get all regions for a given country/ state from the data
     * @param {String} country
     * @param {String} state
     * @param {String} [lang] - Iso-639 shortcode
     * @return {Object} shortcode-name value pairs.
     */

  }, {
    key: 'getRegions',
    value: function getRegions(country, state, lang) {
      var _this3 = this;

      var tmp;
      if (tmp = Data.splitName(country, state)) {
        state = tmp.state;
        country = tmp.country;
      }
      country = country.toUpperCase();
      var o = {};
      var regions = _.get(this.data, ['holidays', country, 'states', state, 'regions']);

      if (regions) {
        Object.keys(regions).forEach(function (k) {
          o[k] = _this3._name(regions, k, lang);
        });
        return o;
      }
    }

    /**
     * @private
     */

  }, {
    key: '_name',
    value: function _name(obj, key, lang) {
      lang = lang || obj[key].langs && obj[key].langs[0];
      var name = void 0;
      var tmp = void 0;
      if (tmp = obj[key].names) {
        if (!(lang && (name = tmp[lang]))) {
          name = tmp[Object.keys(tmp)[0]];
        }
      }
      return name || obj[key].name || key;
    }

    /**
     * get languages for selected country, state, region
     * @return {Array} containing ISO 639-1 language shortcodes
     */

  }, {
    key: 'getLanguages',
    value: function getLanguages() {
      return this._getValue('langs');
    }

    /**
     * get default day off as weekday
     * @return {String} weekday of day off
     */

  }, {
    key: 'getDayOff',
    value: function getDayOff() {
      return this._getValue('dayoff');
    }

    /**
     * get timezones for country, state, region
     * @return {Array} of {String}s containing the timezones
     */

  }, {
    key: 'getTimezones',
    value: function getTimezones() {
      return this._getValue('zones');
    }

    /**
     * get list of holidays for country/ state/ region
     * @return {Object} holidayname <-> unparsed rule or date pairs
     */

  }, {
    key: 'getHolidays',
    value: function getHolidays() {
      var self = this;
      var rules;

      if (!(this.opts && this.opts.country)) {
        return;
      }

      var country = this.opts.country.toUpperCase();
      var state = this.opts.state;
      var region = this.opts.region;
      var tmp = _.get(this.data, ['holidays', country]);

      if (tmp) {
        rules = {};
        this._assign(rules, tmp);
        if (state && tmp.regions && (tmp = tmp.regions[state]) || state && tmp.states && (tmp = tmp.states[state])) {
          this._assign(rules, tmp);
          if (region && tmp.regions && (tmp = tmp.regions[region])) {
            this._assign(rules, tmp);
          }
        }
        Object.keys(rules).forEach(function (key) {
          // assign name references with `_name`
          var _name = rules[key]._name;
          if (_name && self.data.names[_name]) {
            delete rules[key]._name;
            rules[key] = _.merge({}, self.data.names[_name], rules[key]);
          }
        });
      }

      return rules;
    }

    /**
     * get name for substitute name
     * @return {Object} translations of substitute day names
     */

  }, {
    key: 'getSubstitueNames',
    value: function getSubstitueNames() {
      return _.get(this.data, ['names', 'substitutes', 'name']);
    }

    /**
     * helper to assign objects based on properties
     * @private
     * @param {Object} out - object where obj gets assigned into
     * @param {Object} obj - input obj
     * @return {Object}
     */

  }, {
    key: '_assign',
    value: function _assign(out, obj) {
      var days;
      if (obj._days) {
        // resolve reference
        days = Object.assign({}, _.get(this.data, ['holidays'].concat(obj._days, 'days')), obj.days);
      }
      if (obj.days) {
        days = days || obj.days;
        Object.keys(days).forEach(function (p) {
          if (days[p] === false) {
            // remove rules
            if (out[p]) {
              delete out[p];
            }
            return;
          }
          out[p] = Object.assign({}, out[p], days[p]);
          if (!days[p].type) {
            out[p].type = 'public';
          }
        });
      }
      return out;
    }

    /**
     * get a object from the data tree
     * @private
     * @param {String} key - key to look at
     * @return {Object} return object
     */

  }, {
    key: '_getValue',
    value: function _getValue(key) {
      return _.get(this.data, ['holidays', this.opts.country, 'states', this.opts.state, key]) || _.get(this.data, ['holidays', this.opts.country, key]);
    }
  }]);

  return Data;
}();

module.exports = Data;

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
    return;
  } else if ((typeof country === 'undefined' ? 'undefined' : _typeof(country)) === 'object' && country.country) {
    return country;
  }
  var o = {};
  var a = country.split(/[.-]/);
  o.country = a.shift().toUpperCase();
  o.state = (a.shift() || state || '').toUpperCase();
  o.region = (a.shift() || region || '').toUpperCase();
  return o;
};