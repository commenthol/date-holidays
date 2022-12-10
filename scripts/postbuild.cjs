/**
 * get rid of this script if module will be switched to pure ESM with only named
 * exports
 */

const path = require('path')
const fs = require('fs')

const indexCjs = `
var Holidays = require('./Holidays.cjs');

module.exports = Holidays.Holidays;
module.exports.default = Holidays.Holidays;
`

fs.writeFileSync(path.resolve(__dirname, '../lib/index.cjs'), indexCjs, 'utf8')
