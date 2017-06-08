'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var julian = require('astronomia/lib/julian');
var CalEvent = require('./CalEvent');
var CalDate = require('caldate');

var Julian = function (_CalEvent) {
  _inherits(Julian, _CalEvent);

  function Julian() {
    _classCallCheck(this, Julian);

    return _possibleConstructorReturn(this, (Julian.__proto__ || Object.getPrototypeOf(Julian)).apply(this, arguments));
  }

  _createClass(Julian, [{
    key: 'inYear',
    value: function inYear(year) {
      if (this.opts.year && this.opts.year !== year) {
        return this;
      }
      var cal = new julian.CalendarJulian(year, this.opts.month, this.opts.day).toGregorian();
      var d = new CalDate(cal).setOffset(this.offset);
      this.dates.push(d);
      return this;
    }
  }]);

  return Julian;
}(CalEvent);

module.exports = Julian;