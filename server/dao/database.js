var mysql = require('mysql'),
    settings = require('./settings');

var pool = mysql.createPool({
    host: settings.mysql.host,
    user: settings.mysql.user,
    password: settings.mysql.password,
    database: settings.mysql.database
});

exports.query = function(sql, cb) {
    pool.getConnection(function(err, connection) {
        connection.release();
        if (err) throw err;
        connection.query(sql, function(err, rows, fields) {
            console.log('connection sql success');
            cb(err, rows, fields);
        });
    });

};