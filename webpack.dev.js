// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      BASE_URL: JSON.stringify('https://localhost:7072')
    }),
  ],
}); 