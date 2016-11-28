var express = require('express');
var router = express.Router();
var mysql = require('../dao/database')


var sql = "select id,parent_id,name,href from sys_menu Where is_show=1";
var json={};

mysql.query(sql, function(err, rows, fields) {
	if (err) {
		json.success=false;
	}else{
		json.data=rows;
		json.success=true;
	}
})

router.get('/', function(req, res, next) {
	res.json(json);
});
module.exports = router;