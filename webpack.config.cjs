/**
 * Run with `npm run webpack`
 */

const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const rimraf = require('rimraf').sync

const doAnalyze = process.env.npm_lifecycle_event === 'webpack:analyze'

const variants = doAnalyze
  ? {
      target: [
        ['commonjs2', 'index']
      ]
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
    new webpack.IgnorePlugin({
      checkResource (resource, context) {
        // ---- do not bundle astronomia vsop planet data
        if (/\/astronomia\/data$/.test(context)) {
          return !['./deltat.js', './vsop87Bearth.js'].includes(resource)
        }
        // ---- do not bundle moment locales
        if (/\/moment\/locale$/.test(context)) {
          return true
        }
        return false
      }
    })
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
    devtool: 'source-map',
    entry: {
      'date.holidays': [
        // '@babel/polyfill',
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
        // exclude: /node_modules/,
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

const createVariants = (variants, createConfig) => {
  const targets = variants.target.reduce((a, target) => {
    a.push({ target })
    return a
  }, [])

  let configs = Object.entries(variants).reduce((a, [key, val]) => {
    if (key !== 'target') {
      val.forEach(v => {
        targets.forEach(({ target }) => {
          a.push({ target, [key]: v })
        })
      })
    }
    return a
  }, [])

  if (!configs.length) {
    configs = targets
  }

  return configs.map(opts => createConfig(opts))
}

module.exports = createVariants(variants, createConfig)

if (module === require.main) {
  console.log(module.exports)
}
