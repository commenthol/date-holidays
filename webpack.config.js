/**
 * Run with `npm run webpack`
 */

const path = require('path')
const webpack = require('webpack')
const createVariants = require('parallel-webpack').createVariants
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer') // eslint-disable-line

function createConfig (options) {
  return {
    mode: 'production',
    // mode: 'development',
    devtool: 'sourcemap',
    entry: {
      'date.holidays': ['babel-polyfill', './src/index.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'date.holidays.' + options.target + '.js',
      library: 'Holidays',
      libraryTarget: options.target
    },
    resolve: {
      // mainFields: ['browser', 'main', 'module']
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
              presets: ['babel-preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      // ---- do not bundle moment locales
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // ---- do not bundle astronomia vsop planet data
      new webpack.IgnorePlugin(/^\.\/vsop87B[^e].*$/)
      // ---- using a custom set of timezones
      // new webpack.NormalModuleReplacementPlugin(
      //   /moment-timezone\/data\/packed\/latest\.json/,
      //   require.resolve('./timezones.json')
      // )
    ]
  }
}

module.exports = createVariants({
  target: [
    'commonjs2',
    'umd'
  ]
}, createConfig)
