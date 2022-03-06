/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// see https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-overview

const plugins = []
const ANALYZE_BUNDLE = process.env.REACT_APP_ANALYZE_BUNDLE

if (ANALYZE_BUNDLE) {
  plugins.push(new BundleAnalyzerPlugin())
}

module.exports = {
  babel: {
    plugins: [
      '@babel/plugin-proposal-nullish-coalescing-operator',
      [
        '@simbathesailor/babel-plugin-use-what-changed',
        {
          active: process.env.NODE_ENV === 'development', // boolean
        },
      ],
    ],
  },
  webpack: {
    plugins,
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      'bn.js': path.resolve(__dirname, 'node_modules/bn.js/lib/bn.js'),
    },
    // https://webpack.js.org/configuration
    configure: (webpackConfig) => ({
      ...webpackConfig,
      resolve: {
        ...webpackConfig.resolve,
        modules: [path.resolve(__dirname, 'src/custom'), ...webpackConfig.resolve.modules],
      },
    }),
  },
}
