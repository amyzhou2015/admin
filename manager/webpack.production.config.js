/**
 * Created by Riven on 2016/11/24.
 */

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var isProduction = function () {
    return process.env.NODE_ENV === 'production';
};

module.exports = {
    entry: {
        app: [path.resolve(__dirname, './app/main.js')],
        //vendor: ['react','react-router','react-dom','antd']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'app.[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:5].chunk.js',
    },
    module: {
        loaders: [
            {test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            {test: /\.(jpe?g|gif|png)$/, loader: 'file-loader?emitFile=false&name=[path][name].[ext]'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader"},
            {test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, query: {presets: ['es2015', 'react']},},
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    babel: {
        "plugins": [["import", [{"libraryName": "antd", "style": true}]]]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            test: /(\.jsx|\.js)$/,
            compress: {
                warnings: false
            },
        }),
        //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new HtmlWebpackPlugin({
         title: 'admin',
         template: "./template.html",
         filename: 'index.html',
         }),
    ]
};