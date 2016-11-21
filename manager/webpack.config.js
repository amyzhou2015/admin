/**
 * Created by Riven on 2016/11/15.
 */

var path = require('path');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, './app/main.js'),
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      {test: /\.css$/,loader: 'style!css'},
      {test: /\.less$/, loader: 'style!css!less'},
      { test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader" },
      {test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
};