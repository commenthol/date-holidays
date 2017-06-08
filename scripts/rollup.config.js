const json = require('rollup-plugin-json')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')

module.exports = {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [ json(), commonjs(), resolve() ],
  dest: 'bundle.js'
}
