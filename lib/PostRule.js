'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = {
  get: require('lodash.get')
};
var CalEvent = require('./CalEvent');
var Parser = require('./Parser');

var PostRule = function () {
  /**
   * @param {String} ruleStr
   * @param {Object} opts
   * @param {Array} [holidays]
   */
  function PostRule(ruleStr, opts, holidays) {
    _classCallCheck(this, PostRule);

    this.opts = opts;
    this.ruleStr = ruleStr;
    this.ruleSet = holidays && holidays[ruleStr];
    this.holidays = holidays;
    this.events = [];
  }

  _createClass(PostRule, [{
    key: 'push',
    value: function push(calEvent) {
      this.events.push(calEvent);
    }
  }, {
    key: 'getEvent',
    value: function getEvent(year) {
      var active = this.ruleSet && this.ruleSet.active;
      this.disable(year);
      var ev = this.events[0];
      ev.filter(year, active);
      return ev;
    }

    /**
     * @param {Array} rule
     */

  }, {
    key: 'resolve',
    value: function resolve(rule, year) {
      if (rule.rule && typeof this[rule.rule] === 'function') {
        this[rule.rule](rule, year);
      }
    }

    /**
     * @param {CalEvent} [calEvent]
     */

  }, {
    key: 'bridge',
    value: function bridge(rule, year) {
      var found = new Array(this.events.length).fill(false);
      found[0] = true;
      var type = rule.type || 'public';

      // get all holidays of the given year
      for (var ruleStr in this.holidays) {
        var dateFn = this.holidays[ruleStr].fn;
        if (dateFn && dateFn.ruleStr !== this.ruleStr) {
          var tmpEv = dateFn.inYear(year);
          var tmpEvType = _.get(tmpEv, 'opts.type') || 'public';
          for (var i = 1; i < this.events.length; i++) {
            if (found[i]) continue;
            var isEqualDate = tmpEv.event.isEqualDate(this.events[i]);
            if (isEqualDate && tmpEvType === type) {
              found[i] = true;
            }
          }
        }
        if (!~found.indexOf(false)) {
          // pre-exit if all found
          break;
        }
      }

      if (~found.indexOf(false)) {
        this.events[0].reset();
      }
    }
  }, {
    key: 'disable',
    value: function disable(year) {
      var ev = this.events[0];
      var tmpEv = this._findEventInYear(year, this.opts.disable);
      if (tmpEv) {
        if (tmpEv.isEqualDate(ev)) {
          ev.reset();
          tmpEv = this._findEventInYear(year, this.opts.enable);
          if (tmpEv) this.events[0] = tmpEv;
        }
      }
    }
  }, {
    key: '_findEventInYear',
    value: function _findEventInYear(year, arr) {
      arr = arr || [];
      var parser = new Parser();
      for (var i in arr) {
        var p = parser.parse(arr[i]);
        if (p && p[0] && p[0].year && p[0].year === year) {
          return new CalEvent(p[0]).inYear(p[0].year);
        }
      }
    }
  }]);

  return PostRule;
}();

module.exports = PostRule;