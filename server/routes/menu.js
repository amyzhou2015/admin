var express = require('express');
var router = express.Router();
var mysql = require('../dao/database')


router.get('/(:type)?', function (req, res, next) {
    var json = {};
    if (req.params && req.params.type == 'edit') {
        var sql = "select id,parent_id,name,href,is_show from sys_menu Where del_flag=0";
    } else {
        var sql = "select id,parent_id,name,href,is_show from sys_menu Where is_show=1";
    }
    mysql.query(sql, function (err, rows, fields) {
        if (err) {
            json.success = false;
            res.send(json);
        } else {
            json.data = rows;
            json.success = true;
            res.send(json);
        }
    })
});

router.post('/update/:type', function (req, res, next) {
    console.log(req.params)
    var json = {"success": false};
    var params = req.body;
    if (req.params.type == "name") {
        if (params.id && params.name) {
            var sql = "UPDATE sys_menu SET name='" + params.name + "' WHERE id='" + params.id + "'";
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
    } else if (req.params.type == "href") {
        if (params.id && params.href) {
            var sql = "UPDATE sys_menu SET href='" + params.href + "' WHERE id='" + params.id + "'";
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
    } else if (req.params.type == "delete") {
        if (params.id) {
            var sql = "DELETE FROM sys_menu WHERE id='" + params.id + "' OR parent_ids like '%" + params.id + ",%'";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    console.log(sql);
                    console.log(rows);
                    json.msg = "删除成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    } else if (req.params.type == "show") {
        if (params.id) {
            var sql = "UPDATE sys_menu SET is_show=1 WHERE id='" + params.id + "'";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    json.msg = "显示成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    } else if (req.params.type == "hide") {
        if (params.id) {
            var sql = "UPDATE sys_menu SET is_show=0 WHERE id='" + params.id + "'";
            mysql.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    json.msg = "服务异常，请稍后再试！";
                } else {
                    console.log(sql);
                    console.log(rows);
                    json.msg = "隐藏成功";
                    json.success = true;
                }
                res.json(json)
            })
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    }else if (req.params.type == "add") {
        if (params.name) {
            var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            if(params.parentId){
                console.log(params.parentId)
                var getParentIds = "SELECT parent_ids FROM sys_menu WHERE id='"+params.parentId+"'";
                mysql.query(getParentIds, function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                        json.msg = "服务异常，请稍后再试！";
                    } else {
                        console.log(rows[0].parent_ids)
                        var sql = "INSERT INTO sys_menu (name,href,parent_id,parent_ids,sort,is_show,create_by,create_date,update_by,update_date,del_flag) VALUES ('" + params.name + "','" + params.href + "','"+params.parentId+"','"+rows[0].parent_ids+","+params.parentId+",','0',1,'riven','"+date+"','riven','"+date+"','0')";
                        mysql.query(sql,function (err,rows,fields) {
                            if (err) {
                                console.log(err);
                                json.msg = "服务异常，请稍后再试！";
                            } else {
                                json.msg = "新增成功";
                                json.success = true;
                            }
                            res.json(json)
                        })
                    }
                })
            }else{
                var sql = "INSERT INTO sys_menu (name,href,parent_id,parent_ids,sort,is_show,create_by,create_date,update_by,update_date,del_flag) VALUES ('" + params.name + "','" + params.href + "','1','0,1','0',1,'riven','"+date+"','riven','"+date+"','0')";
                mysql.query(sql, function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                        json.msg = "服务异常，请稍后再试！";
                    } else {
                        json.msg = "新增成功";
                        json.success = true;
                    }
                    res.json(json)
                })
            }
        } else {
            json.msg = '未知错误，请稍后再试!';
            res.json(json);
        }
    } else {
        res.json(json);
    }


});
module.exports = router;