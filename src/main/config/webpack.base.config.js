 'use strict';
 
 const path = require('path');
 const HTMLWebpackPlugin = require('html-webpack-plugin');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 const webpack = require('webpack');

module.exports = {
  output: {
    path: path.resolve(__dirname, '../../../dist/main'),
    filename: '[name].js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin()
  ]
};