/**
 * Run with `npm run webpack`
 */

const path = require('path')
const webpack = require('webpack')
const { createVariants } = require('parallel-webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const rimraf = require('rimraf').sync

const doAnalyze = process.env.npm_lifecycle_event === 'webpack:analyze'

const variants = doAnalyze
  ? {
    target: ['commonjs2']
  }
  : {
    minified: [true],
    target: [
      ['commonjs2', 'index'],
      ['umd', 'umd']
    ]
  }

rimraf('./dist')

function createConfig (options) {
  const plugins = [
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
  if (doAnalyze) {
    plugins.push(new BundleAnalyzerPlugin())
  }

  return {
    mode: 'production',
    devtool: 'sourcemap',
    entry: {
      'date.holidays': [
        '@babel/polyfill',
        './src/index.js'
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: options.target[1] +
                (options.minified ? '.min' : '') +
                '.js',
      library: 'Holidays',
      libraryTarget: options.target[0]
    },
    resolve: {
      // mainFields: ['browser', 'main', 'module']
    },
    optimization: {
      minimize: options.minified
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }]
    },
    plugins
  }
}

module.exports = createVariants(variants, createConfig)
