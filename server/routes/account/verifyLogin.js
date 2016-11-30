/**
 * Created by Riven on 2016/11/25.
 */

var express = require('express');
var router = express.Router();
var mysql = require('../../dao/database')
var crypto = require('crypto');

router.post('/', function (req, res, next) {
    var json = {"success": false};
    var params = req.body;
    if (params.loginName && params.token) {
        var sql = "SELECT * FROM sys_user WHERE login_name='" + params.loginName + "' AND token='" + params.token + "'";
        mysql.query(sql, function (err, rows, fields) {
            if (err) {
                console.log(err);
                json.msg = "服务异常，请稍后再试！";
            } else {
                json.success=true;
                if (rows.length == 0) {
                    json.msg = '您的登陆已过期，请重新登录！';
                    json.expired=true;
                } else {
                    json.expired=false;
                }
            }
            res.json(json);
        })
    } else {
        json.msg = '未知错误，请稍后再试!';
        res.json(json);
    }
});
module.exports = router;