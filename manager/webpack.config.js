/**
 * Created by Riven on 2016/11/15.
 */

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    entry: {
        index: ['webpack/hot/dev-server',
            'webpack-dev-server/client?http://localhost:8080',
            path.resolve(__dirname, './app/main.js')],
        //vendor: ['react','react-dom','jquery','antd']
    },
    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            {test: /\.(jpe?g|gif|png)$/, loader: 'file-loader?emitFile=false&name=[path][name].[ext]'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader"},
            {test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, query: {presets: ['es2015', 'react']},},
            { test: /\.json$/, loader: 'json-loader' }
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    babel: {
        "plugins": [["import", [{"libraryName": "antd", "style": true}]]]
    },
    plugins: [
        new CopyWebpackPlugin([ { from: './assets', to: 'static' } ]),
        //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new HtmlWebpackPlugin({
            title: 'admin',
            template: "./template.html",
            filename: 'index.html',
        }),
        ],
};