/**
 * Created by Riven on 2016/11/24.
 */

var express = require('express');
var path = require('path');
var compression = require('compression');
var app = express();

app.use(compression());

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 8080;
var publicPath = path.resolve(__dirname, 'dist');
var staticPath = path.resolve(__dirname, 'assets');

app.use('/', express.static(publicPath, {maxage: '1111111111h'}));
app.use('/static', express.static(staticPath, {maxage: '1111111111h'}));


app.get('*', function (request, response, next) {
    response.sendfile(__dirname + '/dist/index.html');
});


app.listen(port, function () {
    console.log('Server running on port ' + port);
});
