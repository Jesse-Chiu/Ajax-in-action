var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();


// 首先解析 json 类型 body
app.use(bodyParser.json());
// query string 类型 body
app.use(bodyParser.urlencoded({
	extended: false
}));

// 静态文件目录
app.use(express.static(path.join(__dirname,'public')));

app.use(function(req, res, next) {
	// 统一设置 CORS 头
	// res.header("Access-Control-Allow-Origin", "http://a.test.com");
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Headers", "test");
	// res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
	next();
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// --------------- BEGIN ROUTES ------------------
app.use('/', require('./routes/index.js'));
// --------------- END ROUTES --------------------

// 启动端口
var DEFAULT_PORT = 80;
app.listen(DEFAULT_PORT);
console.log('jesse server is started at port: %d', DEFAULT_PORT);