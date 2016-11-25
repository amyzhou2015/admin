/**
 * Created by Riven on 2016/11/25.
 */

var express = require('express');
var router = express.Router();
var database = require('../../dao/database')
var crypto = require('crypto');

function getToken(userName, password) {
    var buf = crypto.randomBytes(16);
    var SecrectKey = buf.toString('hex');
    var Signture = crypto.createHmac('sha256', SecrectKey);
    Signture.update(password);
    var token = Signture.digest().toString('base64');
    return token;
}

function getPassword(password) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(password);
    var password = sha256.digest('hex');
    return password;
}


router.post('/', function (req, res, next) {
    var json = {"success": false};
    var params = req.body;
    if (params.userName && params.password) {
        var connection = database.getConnection();
        params.password = getPassword(params.password);
        var sql = "SELECT * FROM sys_user WHERE login_name='" + params.userName + "' AND password='" + params.password + "'";
        connection.query(sql, function (err, rows, fields) {
            if (err) {
                console.log(err);
                json.msg = "服务异常，请稍后再试！";
            } else {
                if (rows.length == 0) {
                    json.msg = '您的账户名或密码错误，请重新输入！';
                } else {
                    var token = getToken(params.userName, params.password);
                    var data=rows[0];
                    var insertSql = "UPDATE sys_user SET token='" + token + "' WHERE login_name='" + params.userName +"'";
                    connection.query(insertSql, function (err, rows, fields) {
                        if (err) {
                            json.msg = '服务异常，登陆失败！';
                        } else {
                            json.data=data;
                            json.data.token = token;
                            json.success = true;
                        }
                    })

                }
            }
            setTimeout(function () {
                res.json(json);
            }, 1000)
        })
    } else {
        json.msg = '未知错误，请稍后再试!';
        res.json(json);
    }
});
module.exports = router;