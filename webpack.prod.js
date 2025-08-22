const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

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
  plugins: [
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('https://codedstrings.somee.com')
    }),
  ],
});