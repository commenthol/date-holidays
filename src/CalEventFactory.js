/* eslint spaced-comment:0 */

'use strict'

const CalEvent = require('./CalEvent')
const Easter = require('./Easter')

// --- pre-processor instructions for prepin ---
// #ifndef nojulian
const Julian = require('./Julian')
// #endif
// #ifndef nohebrew
const Hebrew = require('./Hebrew')
// #endif
// #ifndef noislamic
const Hijri = require('./Hijri')
// #endif
// #ifndef noequinox
const Equinox = require('./Equinox')
// #endif
// #ifndef nochinese
const Chinese = require('./Chinese')
// #endif

class CalEventFactory {
  constructor (opts) {
    switch (opts.fn) {
      case 'easter':
        return new Easter(opts)
        // #ifndef nojulian
      case 'julian':
        return new Julian(opts)
        // #endif
        // #ifndef nohebrew
      case 'hebrew':
        return new Hebrew(opts)
        // #endif
        // #ifndef noislamic
      case 'islamic':
        return new Hijri(opts)
        // #endif
        // #ifndef noequinox
      case 'equinox':
        return new Equinox(opts)
        // #endif
        // #ifndef nochinese
      case 'chinese':
      case 'korean':
      case 'vietnamese':
        return new Chinese(opts)
        // #endif
      default:
        return new CalEvent(opts)
    }
  }
}
module.exports = CalEventFactory
