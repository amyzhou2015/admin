var express = require('express');
var router = express.Router();
var path = require('path');
var http = require('http'),
    util = require('util'),
    fs = require('fs'),
    formidable = require('formidable');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/', function (req, res, next) {
    var form = new formidable.IncomingForm(),
        fields = [];
    form.uploadDir = path.join(__dirname, "../public/upload");


    form.parse(req, function (err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        var extName = ''; //后缀名
        switch (files.file.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length === 0) {
            res.send({
                code: 202,
                msg: '只支持png和jpg格式图片'
            });
            return;
        } else {
            var avatarName = '/' + Date.now() + '.' + extName;
            var newPath = form.uploadDir + avatarName;
            displayUrl = "http://localhost:3000/static/upload" + avatarName;
            fs.renameSync(files.file.path, newPath); //重命名
            res.send({
                code: 200,
                url: displayUrl,
                success:true
            });
        }
    });
});

module.exports = router;
