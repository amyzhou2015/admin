/**
 * Created by Riven on 2016/11/24.
 */

var express = require('express');
var path = require('path');

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 8080;
var publicPath = path.resolve(__dirname, 'dist');
var staticPath = path.resolve(__dirname, 'assets');

app.use('/', express.static(publicPath));
app.use('/static', express.static(staticPath));

app.get('*', function(request, response, next) {
    response.sendfile(__dirname + '/dist/index.html');
});

// We point to our static assets
//app.use(express.static(publicPath));

// And run the server
app.listen(port, function () {
    console.log('Server running on port ' + port);
});
