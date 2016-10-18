var express = require('express'),
    router = express.Router(),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    multer = require('multer'),

    // 这里是设置上传文件存储的磁盘位置
    storage = multer.diskStorage({
        destination: function(req, file, cb) {
            // 这里的 'uploads/' 目录是相对于运行的 app.js 目录
            cb(null, 'uploads/')
        },
        // 这里可以重新命名上传的文件名
        filename: function(req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    upload = multer({
        storage: storage,
        limits: {
            fileSize: 10 * 1024 * 1024 * 1024
        } // 设置上传文件大小为 10M
    }),
    fs = require('fs');


// 主页
router.all('/', function(req, res) {
    res.sendFile('../public/index.html');
});



// ajax 基础部分
// search book
var TEST_DATA = ['C# 从入门到精通', 'C++ primer', 'Object C 语言基础', 'HTML5 and CSS3',
    'canvas api', 'Android 体系结构', 'Bootstrap 精讲', 'Javascript 高级编程', 'Java Web 开发',
    'Express 框架指南', 'NodeJs', 'Linux', 'Javascript 核心', 'Apple'
];

router.all('/book', function(req, resp) {
    var keyword = req.query.keyword;
    if (!keyword) {
        keyword = req.body.keyword;
    }
    var retlist = select(keyword);
    // console.log('keyword: ' + req.query.keyword + ' queryBody: ' + JSON.stringify(req.body));

    // 可以设置服务器响应时间
    setTimeout(function() {
        resp.json(retlist);
    }, 2000);
});

function select(keyword) {
    var ret = [],
        dataLength = TEST_DATA.length;

    if (keyword) {
        keyword = keyword.toLowerCase();
        for (var i = 0, len = dataLength; i < len; ++i) {
            if (TEST_DATA[i].toLowerCase().indexOf(keyword) === 0) {
                ret.push(TEST_DATA[i])
            }
        }
    }
    return ret;
}

router.post('/register', function(req, resp) {
    console.log(req.body);
    // resp.send('ok');
    // 使用重定向
    setTimeout(function() {
        // resp.redirect(303, 'html/ajax-basic/register.html');
        resp.send('该手机已经被注册了!!!');
    }, 3000)
});


// jquery ajax
var users = [{
    type: 1,
    name: 'zhangsan'
}, {
    type: 2,
    name: 'lisi'
}, {
    type: 1,
    name: 'wangwu'
}];

router.all('/jquery-ajax', function(req, res) {
    res.send('Hello Jquery Ajax');
});

/**
 * 全部用户
 */
router.all('/allusers', function(req, res) {
    setTimeout(function() {
        res.json(users);
    }, 200);
    //console.log(req.body);
    //console.log(req.body['c[x]']);
    //res.status(400); // 模拟错误
    // res.send(toHtml(users));
});

function toHtml(users) {
    var ret = [];
    for (var i = 0; i < users.length; ++i) {
        ret.push("<li>" + users[i].name + "</li>");
    }
    return "<ul>" + ret.join("") + "</ul>";
}

router.all('/time', function(req, res) {
    //res.setHeader('ETag', '12345');
    res.send('Hello World');
    //res.send(new Date().getTime() + '');
});



// 跨域部分
router.all('/iframe', function(req, res) {
    res.send('iframe cross ok');

});router.all('/cors', function(req, res) {
    res.send('cors cross ok');
});

router.all('/testjsonp', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript'); //callback({a:1,b:2});
    res.send('callback(' + JSON.stringify({
        a: 1,
        b: 2
    }) + ')');
});


router.all('/testjsonp2', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript'); //cb123({a:1,b:2})
    res.send(req.query.callback + '(' + JSON.stringify({
        a: 3,
        b: 4
    }) + ')');
});

router.all('/testjsonp3', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    console.log('req.query.cbname: ' + req.query.cbname);
    res.send(req.query.cbname + '(' + JSON.stringify({
        a: 5,
        b: 6
    }) + ')');
});


// ajax 文件上传
// 使用 multer 中间件
// 这里设置了指接收 单个文件
router.post('/upload', upload.single('uploadFlile'), function(req, res) {
    console.log('ip: ' + req.ip)
    console.log('file info: ',req.file);
    console.log('------------------------------------------------\n\n');
    //console.log(req.body);
    res.json({
        fileName: req.file.originalname
    });
});

module.exports = router;