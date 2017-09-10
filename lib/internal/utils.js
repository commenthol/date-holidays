'use strict';

/**
 * {
 *   0: 'sunday', ...
 *   sunday: 0, ...
 * }
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.DAYS = function () {
  var o = {};
  'sunday|monday|tuesday|wednesday|thursday|friday|saturday'.split('|').forEach(function (name, idx) {
    o[name] = idx;
    o[idx] = name;
  });
  return o;
}();

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

var isObject = exports.isObject = function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
};

exports.isDate = function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
};

/**
 * pad number with `0`
 * @param {number} number
 * @param {number} [len] - length
 * @return {string} padded string
 */
exports.pad0 = function pad0(number, len) {
  len = len || 2;
  number = Array(len).join('0') + number.toString();
  return number.substr(number.length - len, len);
};

/**
 * convert string to number
 * @private
 * @param {String} str
 * @return {Number} converted number or undefined
 */
var toNumber = exports.toNumber = function toNumber(str) {
  var num = parseInt(str, 10);
  if (!isNaN(num)) {
    return num;
  }
};

/**
 * extract or set year
 * @private
 * @param {Number|Date|String} year
 * @return {Number} year
 */
exports.toYear = function toYear(year) {
  if (!year) {
    year = new Date().getFullYear();
  } else if (year instanceof Date) {
    year = year.getFullYear();
  } else if (typeof year === 'string') {
    year = toNumber(year);
  }
  return year;
};

/**
* convert string to Date.
* 2017        : year = 2017, month = 1, day = 1
* '2017-07'   : year = 2017, month = 7, day = 1
* '2017-07-03': year = 2017, month = 7, day = 3
* @param {String} str
* @param {Boolean} isUTC - return date in UTC
* @return {Date}
*/
exports.toDate = function toDate(str, isUTC) {
  var m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?.*$/.exec((str || '').toString());
  if (m) {
    m.shift();

    var _m$map = m.map(function (num) {
      return parseInt(num || 1, 10);
    }),
        _m$map2 = _slicedToArray(_m$map, 3),
        year = _m$map2[0],
        month = _m$map2[1],
        day = _m$map2[2];

    if (isUTC) {
      return new Date(Date.UTC(year, month - 1, day));
    } else {
      return new Date(year, month - 1, day);
    }
  }
};