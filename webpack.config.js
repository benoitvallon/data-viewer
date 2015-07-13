'use strict';

var webpack = require('webpack');

module.exports = {
  entry: './public/javascripts/main.js',
  output: {
    path: __dirname,
    filename: './public/javascripts/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jsx-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
};
