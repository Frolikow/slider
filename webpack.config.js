'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
let pathToClean = 'public';

const path = require('path');

const common = {
  context: __dirname + '/src/',
  entry: "app.js",
  output: {
    path: path.resolve(__dirname + '/public'),
    filename: "[name].js",
    publicPath: ''
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },


  module: {
    rules:
      [
        {
          test: /\.styl$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ['css-loader', 'stylus-loader']
          })
        }, {
          test: /\.pug$/,
          loader: 'pug-loader',
          options: {
            pretty: true
          }
        }, {
          test: /\.handlebars$/,
          loader: "handlebars-loader"
        }, {
          test: /\.test.js$/,
          loader: 'ignore-loader'
        }
      ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.pug",
      inject: 'body',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(pathToClean),
    new ExtractTextPlugin('style.css'),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
    })
  ]
};
const developmentConfig = {
  devtool: 'eval',
  devServer: {
    stats: 'minimal',
    port: 9000
  }
};

module.exports = function (env) {
  if (env === 'production') {
    return common;
  }
  if (env === 'development') {
    return Object.assign(
      {},
      common,
      developmentConfig
    )
  }
};
