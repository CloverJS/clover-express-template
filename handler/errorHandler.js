
var createError = require("http-errors");
const util = require("../utils/common");
// 404 error handler
exports.error404Handler = function (req, res, next) {
    next(createError(404));
}

// error handler
exports.errorHandler = function(err, req, res, next) {
    console.log(err);
    // 处理express.json处理非法数据格式时出现的错误
    if(err.name === "SyntaxError"){
      return res.status(400).send(util.buildError("非法的请求数据"));
    }
    // sql操作出错,多数情况是前端传来的数据非法(返回400提醒前端检查参数)
    if(err.code === "ER_BAD_FIELD_ERROR" || err.code === "ER_PARSE_ERROR") {
      // console.log('入参错误')
      return res.status(403).send(util.buildError("入参错误,是否未传必须参数或传入了空值或传入了非法数据?"))
    }
    // 传入了不符合数据库数据关系的数据,导致执行sql出错
    if(/ER_NO_REFERENCED_ROW_\d+/.exec(err.code)){
      return res.status(403).send(util.buildError('非法数据!'))
    }
    // 传入值的类型与数据库要求值的类型不匹配
    if(err.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD"){
      return res.status(403).send(util.buildError('数据类型错误!'))
    }
    // 传入值的长度超出了数据库允许的范围
    if(err.code === "ER_DATA_TOO_LONG"){
      return res.status(403).send(util.buildError('数据超出允许的最大长度!'))
    }
    // (自定义错误值)上传了不被允许的文件格式,此错误来源于multer
    if(err.message === "FileNotAllow") {
      return res.status(403).send(util.buildError('不被允许的文件格式!'))
    }
    // multer文件上传中间件报错
    if(err.name === "MulterError") {
      // 上传文件大小超出限制
      if(err.message === "File too large") {
        return res.status(403).send(util.buildError('文件太大!'))
      }
      // 没有按按照single要求指定name
      if(err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(403).send(util.buildError('错误的field字段值'))
      }
    }
    // token不正确或token过期都会进入这个错误
    if (err.name === "UnauthorizedError") {
      //  返回错误
      res.status(401).send(util.buildError(-1001,"token验证失败",[]));
    } else { // 通用的错误处理位置
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {}; // 开发环境会返回详细的错误信息, 而在正式环境不会返回任何内容

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    }
}