const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
//   output: {
//     filename: '[name].[contenthash].js',
//   },
//   optimization: {
//     minimize: true,
//     splitChunks: {
//       chunks: 'all',
//     },
//   },
});