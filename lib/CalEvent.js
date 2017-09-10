'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./internal/utils'),
    isDate = _require.isDate;

var CalDate = require('caldate');

var CalEvent = function () {
  function CalEvent(opts) {
    _classCallCheck(this, CalEvent);

    opts = opts || {};
    this.substitute = opts.substitute;
    this.opts = opts;
    this.offset = opts.offset;
    this.dates = [];
    if (isDate(opts)) {
      this.opts = new CalDate(opts);
    }
  }

  _createClass(CalEvent, [{
    key: 'inYear',
    value: function inYear(year) {
      var d = new CalDate(this.opts).setOffset(this.offset);
      if (!(d.year && d.year !== year)) {
        d.year = year;
        this.dates.push(d);
      }
      return this;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.dates = [];
    }
  }, {
    key: 'isEqualDate',
    value: function isEqualDate(calEvent) {
      var res = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.dates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var thisDate = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = calEvent.dates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var date = _step2.value;

              res |= thisDate.isEqualDate(date);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return !!res;
    }

    /**
     * @param {Number} year - year to filter
     * @param {Object[]} active - definition of active ranges `{from: {Date}, [to]: {Date}}`
     * @return {this} for chaining
     */

  }, {
    key: 'filter',
    value: function filter(year, active) {
      function isActive(date) {
        if (!active) {
          if (date.year === year) {
            return true;
          } else {
            return false;
          }
        }
        var _date = date.toDate();
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = active[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var a = _step3.value;
            var from = a.from,
                to = a.to;

            if (date.year === year && (from && to && from <= _date && to > _date || from && !to && from <= _date)) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }

      this.dates = this.dates.filter(function (date) {
        if (!date._filter && isActive(date)) {
          return date;
        }
      });

      return this;
    }
  }, {
    key: 'push',
    value: function push(calEvent) {
      if (calEvent && Array.isArray(calEvent.dates)) {
        this.dates = this.dates.concat(calEvent.dates);
      }
    }
  }, {
    key: 'get',
    value: function get(timezone) {
      var _this = this;

      var arr = this.dates.map(function (date) {
        var o = {
          date: date.toString(),
          start: date.toTimezone(timezone),
          end: date.toEndDate().toTimezone(timezone)
        };
        _this._addSubstitute(date, o);
        return o;
      });
      return arr;
    }
  }, {
    key: '_addSubstitute',
    value: function _addSubstitute(date, obj) {
      if (this.substitute || date.substitute) obj.substitute = true;
    }
  }]);

  return CalEvent;
}();

module.exports = CalEvent;