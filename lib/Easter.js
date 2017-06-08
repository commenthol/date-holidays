'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var easter = require('date-easter');
var CalEvent = require('./CalEvent');
var CalDate = require('caldate');

var Easter = function (_CalEvent) {
  _inherits(Easter, _CalEvent);

  /**
   * @param {object} [opts]
   * @param {string} opts.type - type of eastern (easter|orthodox)
   * @param {number|string} opts.offset - offset in days
   */
  function Easter(opts) {
    _classCallCheck(this, Easter);

    opts = opts || {};

    var _this = _possibleConstructorReturn(this, (Easter.__proto__ || Object.getPrototypeOf(Easter)).call(this, opts));

    _this._fn = easter.easter;
    if (opts.type === 'orthodox') {
      _this._fn = easter.orthodoxEaster;
    }
    return _this;
  }

  _createClass(Easter, [{
    key: 'inYear',
    value: function inYear(year) {
      var d = new CalDate(this._fn(year)).setOffset(this.offset);
      this.dates.push(d);
      return this;
    }
  }]);

  return Easter;
}(CalEvent);

module.exports = Easter;