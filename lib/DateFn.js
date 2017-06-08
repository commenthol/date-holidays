'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = require('./Parser');
var Rule = require('./Rule');
var PostRule = require('./PostRule');
var CalEventFactory = require('./CalEventFactory');

/**
 * handles one rule
 */

var DateFn = function () {
  /**
   * @param {string} rule - unparsed rule
   * @param {array} holidays - all holidays rules (required for bridge day calculations)
   */
  function DateFn(ruleStr, holidays) {
    _classCallCheck(this, DateFn);

    var parser = new Parser();
    this.ruleStr = ruleStr;
    this.rules = parser.parse(ruleStr);
    this.ok = !parser.error;
    this.holidays = holidays;
    this.opts = holidays ? holidays[ruleStr] : {};
    this.event = undefined;
  }

  _createClass(DateFn, [{
    key: 'inYear',
    value: function inYear(year) {
      var ruleFn; // current rule
      var postProc = new PostRule(this.ruleStr, this.opts, this.holidays);

      this.rules.forEach(function (rule) {
        var calEvent;
        if (rule.fn) {
          calEvent = new CalEventFactory(rule).inYear(year - 1) // run over neighboring dates to catch overlaps
          .inYear(year).inYear(year + 1);
          postProc.push(calEvent);
          ruleFn = new Rule(calEvent);
        } else {
          if (ruleFn.resolve(rule)) {
            postProc.resolve(rule, year);
          }
        }
      });

      this.event = postProc.getEvent(year);
      return this;
    }
  }, {
    key: 'get',
    value: function get(timezone) {
      var res = this.event.get(timezone);
      return res;
    }
  }]);

  return DateFn;
}();

module.exports = DateFn;