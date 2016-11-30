/**
 * Created by Riven on 2016/11/30.
 */
var express = require('express');
var router = express.Router();
var mysql = require('../../dao/database')


router.post('/update/:type', function (req, res, next) {
    console.log(req.params)
    var json = {"success": false};
    var params = req.body;
    if (req.params.type == "title") {
        if (params.id && params.title) {
            var sql = "UPDATE banner SET title='" + params.title + "' WHERE id='" + params.id + "'";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    json.msg = "修改成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    } else if (req.params.type == "image") {
        if (params.id && params.picurl) {
            var sql = "UPDATE banner SET picurl='" + params.picurl + "' WHERE id='" + params.id + "'";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    json.msg = "修改成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    } else if (req.params.type == "add") {
        if (params.title && params.picurl) {
            var sql = "INSERT INTO banner (title,picurl) VALUES ('" + params.title + "','" + params.picurl + "')";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    json.msg = "修改成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    }else if(req.params.type == "delete"){
        if (params.id) {
            var sql = "DELETE FROM banner WHERE id='"+params.id+"'";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    json.msg = "删除成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    }else if(req.params.type == "enable"){
        if (params.id) {
            var sql = "UPDATE banner SET disabled=0 WHERE id='"+params.id+"'";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    json.msg = "删除成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    }else if(req.params.type == "disable"){
        if (params.id) {
            var sql = "UPDATE banner SET disabled=1 WHERE id='"+params.id+"'";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    json.msg = "删除成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    } else {
        res.json(json);
    }


});
module.exports = router;