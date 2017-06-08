/**
 * handle rule per event
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CalDate = require('caldate');
var DAYS = require('./internal/utils').DAYS;

var Rule = function () {
  /**
  * @param {CalEvent} [calEvent]
   * @param {array} [holidays]
   */
  function Rule(calEvent) {
    _classCallCheck(this, Rule);

    this.calEvent = calEvent;
  }

  /**
   * @param {CalEvent} calEvent
   */


  _createClass(Rule, [{
    key: 'setEvent',
    value: function setEvent(calEvent) {
      this.calEvent = calEvent;
      return this;
    }

    /**
     * @return {CalEvent}
     */

  }, {
    key: 'getEvent',
    value: function getEvent() {
      return this.calEvent;
    }

    /**
     * @param {string} modifier
     */

  }, {
    key: 'setModifier',
    value: function setModifier(modifier) {
      this.modifier = modifier;
    }

    /**
     * resolves rule to function
     * @param {object} rule
     */

  }, {
    key: 'resolve',
    value: function resolve(rule) {
      if (rule.rule && typeof this[rule.rule] === 'function') {
        this[rule.rule](rule);
      } else if (rule.modifier) {
        this.modifier = rule.modifier;
      }
      return this;
    }

    /**
     * @param {CalEvent} [calEvent]
     * @param {object} rule
     * {
     *   rule: "dateDir",
     *   count: 1,
     *   weekday: "tuesday",
     *   direction: "after"
     * }
     */

  }, {
    key: 'dateDir',
    value: function dateDir(rule) {
      this.calEvent.dates.forEach(function (date) {
        var offset;
        var count = rule.count - 1;
        var weekday = date.getDay();
        var ruleWeekday = DAYS[rule.weekday];

        if (rule.weekday === 'day') {
          if (rule.direction === 'before') {
            offset = (count + 1) * -1;
          } else {
            offset = count + 1;
          }
        } else {
          if (rule.direction === 'before') {
            if (weekday === ruleWeekday) {
              count++;
            }
            offset = ((7 + weekday - ruleWeekday) % 7 + count * 7) * -1;
          } else {
            offset = (7 - weekday + ruleWeekday) % 7 + count * 7;
          }
        }
        if (offset) {
          date.setOffset(offset);
        }
      });
    }

    /**
     * @param {object} rule
     * {
     *   rule: "dateIfThen",
     *   if: ["sunday"],
     *   direction: "next",
     *   then: "sunday"
     * }
     */

  }, {
    key: 'dateIfThen',
    value: function dateIfThen(rule) {
      var _this = this;

      var dates = [];

      this.calEvent.dates = this.calEvent.dates.map(function (date) {
        if (date._lock) {
          return date;
        }
        var weekday = date.getDay();
        if (~rule.if.indexOf(DAYS[weekday])) {
          if (_this.modifier === 'and') {
            dates.push(new CalDate(date));
            date.substitute = true;
          }
          date._filter = false;
          var offset = 0;
          var then = DAYS[rule.then];
          if (rule.then && then !== 'undefined') {
            if (rule.direction === 'previous') {
              offset = -1 * ((7 + weekday - then) % 7);
              if (!offset) {
                offset = -7;
              }
            } else {
              offset = (7 - weekday + then) % 7;
              if (!offset) {
                offset = 7;
              }
            }
            date.setOffset(offset);
            date._lock = true;
            if (_this.modifier === 'substitutes') date.substitute = true;
          }
          ;(rule.rules || []).forEach(function (rule) {
            switch (rule.rule) {
              case 'time':
                {
                  date.setTime(rule.hour, rule.minute);
                  break;
                }
              case 'duration':
                {
                  date.duration = rule.duration;
                  break;
                }
              default:
                {}
            }
          });
        } else if (_this.modifier === 'substitutes') {
          date._filter = true;
        }
        return date;
      });
      this.calEvent.dates = dates.concat(this.calEvent.dates);
    }
  }, {
    key: 'time',
    value: function time(rule) {
      this.calEvent.dates.forEach(function (date) {
        date.setTime(rule.hour, rule.minute);
      });
    }
  }, {
    key: 'duration',
    value: function duration(rule) {
      this.calEvent.dates.forEach(function (date) {
        date.duration = rule.duration;
      });
    }
  }, {
    key: 'bridge',
    value: function bridge() {
      return true; // needs postprocessing
    }

    /**
     * @param {object} rule
     * {
     *   rule: "year",
     *   cardinality: "leap",
     *   every: undefined,
     *   since: undefined
     * }
     */

  }, {
    key: 'year',
    value: function year(rule) {
      var _this2 = this;

      this.calEvent.dates = this.calEvent.dates.map(function (date) {
        if (rule.cardinality) {
          if (rule.cardinality === 'leap' && _this2._isLeapYear(date.year)) {
            return date;
          } else if (rule.cardinality === 'non-leap' && !_this2._isLeapYear(date.year)) {
            return date;
          } else if (rule.cardinality === 'even' && (date.year + 1) % 2) {
            return date;
          } else if (rule.cardinality === 'odd' && date.year % 2) {
            return date;
          }
        } else if (rule.every !== undefined && rule.since !== undefined) {
          var tmp = (date.year - rule.since) % rule.every;
          if (tmp === 0) {
            return date;
          }
        }
      }).filter(function (date) {
        return date;
      });
    }

    /**
     * @private
     * @return {Boolean} if true year is a leap year
     */

  }, {
    key: '_isLeapYear',
    value: function _isLeapYear(year) {
      if (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0) {
        return true;
      }
      return false;
    }
  }]);

  return Rule;
}();

module.exports = Rule;