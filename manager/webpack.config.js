/**
 * Created by Riven on 2016/11/15.
 */

var path = require('path');
//var HtmlWebpackPlugin = require('html-webpack-plugin');

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
            {test: /\.(jpe?g|gif|png)$/, loader: 'file-loader?emitFile=false&name=[path][name].[ext]'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader"},
            {test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, query: {presets: ['es2015', 'react']},}
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
    /*plugins: [new HtmlWebpackPlugin({
     title: 'My',
     template:"build/template.html",
     filename: 'index.html'
     })]*/
};