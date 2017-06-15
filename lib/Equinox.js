'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var solstice = require('astronomia/lib/solstice');
var julian = require('astronomia/lib/julian');
var planetpos = require('astronomia/lib/planetposition');
var earth = new planetpos.Planet(require('astronomia/data/vsop87Bearth'));

var moment = require('moment-timezone');
var CalEvent = require('./CalEvent');
var CalDate = require('caldate');

var Equinox = function (_CalEvent) {
  _inherits(Equinox, _CalEvent);

  /**
   * @param {object} [opts]
   * @param {string} opts.season - type of season (spring|summer|autumn|winter)
   * @param {number|string} opts.offset - offset in days
   */
  function Equinox(opts) {
    _classCallCheck(this, Equinox);

    opts = opts || {};

    var _this = _possibleConstructorReturn(this, (Equinox.__proto__ || Object.getPrototypeOf(Equinox)).call(this, opts));

    _this._season = opts.season;
    _this._timezone = opts.timezone || 'GMT';
    return _this;
  }

  _createClass(Equinox, [{
    key: 'inYear',
    value: function inYear(year) {
      var jde;
      switch (this._season) {
        case 'march':
          {
            jde = solstice.march2(year, earth);
            break;
          }
        case 'june':
          {
            jde = solstice.june2(year, earth);
            break;
          }
        case 'september':
          {
            jde = solstice.september2(year, earth);
            break;
          }
        case 'december':
          {
            jde = solstice.december2(year, earth);
            break;
          }
      }

      var str = new julian.Calendar().fromJDE(jde).toDate().toISOString();
      var date;
      if (/^[+-]\d{2}:\d{2}?$/.test(this._timezone)) {
        // for '+08:00' formats
        date = moment(str).utcOffset(this._timezone);
      } else {
        // for 'Asia/Shanghai' formats
        date = moment(str).tz(this._timezone); // move to timezone
      }

      var floorDate = {
        year: year,
        month: date.month() + 1,
        day: date.date()
      };

      var d = new CalDate(floorDate).setOffset(this.offset);
      this.dates.push(d);
      return this;
    }
  }]);

  return Equinox;
}(CalEvent);

module.exports = Equinox;