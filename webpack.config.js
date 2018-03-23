/**
 * Run with `npm run webpack`
 */

const path = require('path')
const webpack = require('webpack')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer') // eslint-disable-line

module.exports = {
  mode: 'production',
  // mode: 'development',
  devtool: 'sourcemap',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'Holidays',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: 'babel-loader'
    }]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    // ---- do not bundle moment locales
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // ---- do not bundle astronomia vsop planet data
    new webpack.IgnorePlugin(/^\.\/vsop87B.*$/)
    // ---- using a custom set of timezones
    // new webpack.NormalModuleReplacementPlugin(
    //   /moment-timezone\/data\/packed\/latest\.json/,
    //   require.resolve('./timezones.json')
    // )
  ]
}
