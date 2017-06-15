'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CalChinese = require('date-chinese');
var CalEvent = require('./CalEvent');
var CalDate = require('caldate');

var Chinese = function (_CalEvent) {
  _inherits(Chinese, _CalEvent);

  /**
   * @param {object} [opts]
   */
  function Chinese(opts) {
    _classCallCheck(this, Chinese);

    opts = opts || {};

    var _this = _possibleConstructorReturn(this, (Chinese.__proto__ || Object.getPrototypeOf(Chinese)).call(this, opts));

    switch (opts.fn) {
      case 'chinese':
        _this.cal = new CalChinese.CalendarChinese();
        break;
      case 'korean':
        _this.cal = new CalChinese.CalendarKorean();
        break;
      case 'vietnamese':
        _this.cal = new CalChinese.CalendarVietnamese();
        break;
    }
    return _this;
  }

  _createClass(Chinese, [{
    key: 'inYear',
    value: function inYear(year) {
      var d = void 0;
      var jde = void 0;
      var date = void 0;
      var opts = this.opts;
      if (opts.solarterm) {
        jde = this.cal.solarTerm(opts.solarterm, year);
        date = this.cal.fromJDE(jde).toGregorian();
        d = new CalDate(date).setOffset(opts.day - 1);
      } else {
        this.cal.set(opts.cycle, opts.year, opts.month, opts.leapMonth, opts.day);
        jde = this.cal.toJDE(year);
        date = this.cal.fromJDE(jde).toGregorian();
        d = new CalDate(date);
      }

      this.dates.push(d);
      return this;
    }
  }]);

  return Chinese;
}(CalEvent);

module.exports = Chinese;