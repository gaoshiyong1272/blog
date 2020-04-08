var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');
//var session = require('express-session');
//var redisStore = require('connect-redis')(session);
var Module = require('./models');

/**工具函数**/
var helpers = require('./helper');

/**加载memcached服务**/
var cache = require('./cache/memcache');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));
/**启动session服务**/
// app.use(session({
//   secret: 'express-test',
//   name: 'app.sid',
//   cookie: {
//     httpOnly: true,
//     path: '/',
//     maxAge: 24*60*60*1000
//   },
//   //store: redisStore
// }));


/**
 * 中间件
 */
app.use(function (req, res, next) {
  req['$helpers'] = helpers;
  req['$cache'] = cache;
  res['$module'] = Module;
  next()
});

/**
 * 允许跨域
 */
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", ' 3.2.1');
//   if (req.method === "OPTIONS") res.send(200);
//   else next();
// });

/**
 * 加载页面路由
 * @type {{init}|*}
 */
var router = require('./routes/loadRouter');
router.init(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
