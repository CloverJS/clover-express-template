const defaultSettings = require('./settings')
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const expressJWT = require("express-jwt");
const { PRIVATE_KEY } = require("./utils/constant");
process.env.PORT = defaultSettings.PORT;
process.env.HOST = defaultSettings.HOST;
process.env.URL = defaultSettings.URL;
const swaggerOptions = require("./config/swagger"); // swagger
/**
 * 这是log4js日志方案, 在使用前请先 npm install log4js@6.4.1
 * 然后取消下述log4js注释, 即可使用
 * 使用示例:
 *  - loggerProxy.info('hello!');
 *  - loggerProxy.error('Oh No! Error!');
 *  - 在utils/common.js中有一个通用的日志方法(处于注释状态),依据响应状态码是否为200判断是否应输出error日志,
 * 待日后能力提升后,再将此方法改为日志中间件写法.
 */
// const loggerProxy = require("./config/logConfig"); // log4js


// 引入中间件
var { checkAPP, checkAdmin, checkUser, nullHandler } = require("./utils/middleware");

// 引入错误处理
var {error404Handler, errorHandler} = require("./handler/errorHandler");

//引入路由
var usersRouter = require("./routes/users");
var filesRouter = require("./routes/files")

//创建实例
var app = express();

// swagger
const expressSwagger = require("express-swagger-generator")(app);
expressSwagger(swaggerOptions);

console.log(1);
// view engine setup ---模板页面,使用jade模板引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());  // 全局跨域--默认允许所有请求支持跨域
app.use(logger("dev")); // 记录网络请求日志
// post请求解析json, 将请求内容赋值给req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser()); // 解析cookie
app.use(express.static(path.join(__dirname, "public"))); // 静态资源

// url验证---登录拦截(需要放在所有路由的前面),token解密
app.use(
  expressJWT({
    secret: PRIVATE_KEY,
  }).unless({
    path: defaultSettings.WHITE, //白名单,除了这里写的地址，其他的URL都需要验证
  })
  // 前端需要为请求头添加token,格式遵守: headers['Authorization'] = `Bearer ${token}`  设置好后,发送请求在浏览器network请求头中可以看到 Authorization: Bearer token值
);

//如果AJAX方式请求服务器,在根域名或端口不同时会产生跨域问题,可以参照如下方式解决:
//设置允许跨域访问该服务
//设置跨域访问---指定一个全局路由中间件,将所有路由都设置为允许跨域
// app.all("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   next();
// });

//路由配置并使用中间件,在本项目中所有定义的路由都应当使用checkAPP中间件检查请求来源
app.use("/api/v1/user", [ checkUser, checkAdmin, nullHandler], usersRouter);
app.use("/api/v1/file", [ checkUser, checkAdmin, nullHandler], filesRouter);

// catch 404 and forward to error handler
app.use(error404Handler);

// error handler
app.use(errorHandler);

module.exports = app;
