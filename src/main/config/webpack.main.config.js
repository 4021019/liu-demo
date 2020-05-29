'use strict';
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const envMode = process.env.NODE_ENV || 'development';
console.log(`当前main打包模式: ${envMode}`);

module.exports = merge.smart(baseConfig, {
  target: 'electron-main',
  entry: {
    main: './src/main/main.ts',
    preload: './src/main/preload.js',
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.ts$/,
  //       use: 'ts-loader',
  //       ex: /node_modules|pages|models|config|layouts|components/
  //     }
  //   ],
  // },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(envMode),
    }),
  ],
  mode: envMode,
});
