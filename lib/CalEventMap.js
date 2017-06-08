'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CalEvent = require('./CalEvent');
var CalDate = require('caldate');

/**
 * Mapper class for mapped calenders like hijri and hebrew
 * `this.calender` needs to be set in child classes
 */

var CalEventMap = function (_CalEvent) {
  _inherits(CalEventMap, _CalEvent);

  function CalEventMap(opts) {
    _classCallCheck(this, CalEventMap);

    var _this = _possibleConstructorReturn(this, (CalEventMap.__proto__ || Object.getPrototypeOf(CalEventMap)).call(this, opts));

    _this.calendar = {};
    return _this;
  }

  _createClass(CalEventMap, [{
    key: 'inYear',
    value: function inYear(year) {
      if (!(this.calendar[year] && this.calendar[year + 1] && this.calendar[year - 1])) {
        return this;
      }

      for (var y = year - 1; y <= year + 1; y++) {
        // resolve date in `calendar` as gregorian date
        var firstDays = this.calendar[y][this.opts.month - 1];
        // firstDays `[M, D, diffYear]`
        for (var i = 0; i < firstDays.length; i += 3) {
          if (this.opts.year) {
            var calYear = this.calendar.year + firstDays[i + 2];
            if (this.opts.year !== calYear) {
              break;
            }
          }
          var d = new CalDate({
            year: y,
            month: firstDays[i] + 1,
            day: firstDays[i + 1]
          }).setOffset(this.opts.day - 1);

          if (d.year === year) {
            this.dates.push(d);
          }
        }
      }
      return this;
    }
  }]);

  return CalEventMap;
}(CalEvent);

module.exports = CalEventMap;