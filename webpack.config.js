'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let pathToClean = 'public';

const path = require('path');

const common = {
  context: __dirname + '/src/',
  entry: "index.js",
  output: {
    path: __dirname + '/public',
    filename: "bundle/[name].js",
    publicPath: '/'
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },

  module: {
    rules:
      [{
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }, {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      }, {
        test: /\.(ttf|eot|woff|woff2|png|jpg|jpeg|svg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }]
      }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.pug",
      inject: 'head',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(pathToClean),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
    })
  ]
};

const developmentConfig = {
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