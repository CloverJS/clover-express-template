// let redis=require("../db/redisDB")
const { querySql } = require("../db/mysqlDB");
const util = require("../utils/common");
const { PWD_SALT, PRIVATE_KEY, EXPIRESD } = require("../utils/constant");
const { md5 } = require("../utils/index");
const jwt = require('jsonwebtoken')

// 获取body参数通过req.body, 获取query传参通过req.query, 获取token参数通过req.user

// 如果是query传参, 直接: @param {string} username.query.required
/**
 * 用户信息注册
 * @route POST /api/v1/user/register
 * @group user - 用户相关接口
 * @summary 注册
 * @param {string} loginParam.body.required - 注册相关信息 - eg: {"username":"","password":""}
 * @returns {object} 200 - 与用户信息相关的数组
 * @returns {Error} default - Unexpected error
 * @security JWT
 */

//用户注册API
exports.userRegister = async (req, res, next) => {
  let { username, password } = req.body;
  try {
    let user = await querySql("select * from user where username = ?", [username]);
    if (!user || user.length === 0) {
      // 对密码加密后存入数据库
      password = md5(`${password}${PWD_SALT}`);
      await querySql("insert into user(username,password) value(?,?)", [
        username,
        password,
      ]);
      res.json(util.buildSuccess("注册成功"));
    } else {
      res.json(util.buildError("账号已注册"));
    }
  } catch (e) {
      console.log(e)
      // 将错误交由错误中间件处理
      next(e)
  }
};

/**
 * 用户登录
 * @route POST /api/v1/user/login
 * @group user - 用户相关接口
 * @summary 登录
 * @param {string} loginParam.body.required - 登录 - eg: {"username":"","password":""}
 * @returns {object} 200 - 包含token的数据对象
 * @returns {Error} default - Unexpected error
 * @security JWT
 */

//用户登录API
exports.userLogin = async (req, res, next) => {
    let { username, password } = req.body;
    try {
      let user = await querySql("select * from user where username = ?", [username]);
      if (!user || user.length === 0) {
        res.json(util.buildError("账号不存在"));
      } else {
        password = md5(`${password}${PWD_SALT}`);
        let result = await querySql("select * from user where username = ? and password = ?", [username,password]);
        if(!result || result.length === 0) {
            res.json(util.buildError("账号或密码不正确"));
        }else {
            let token = jwt.sign({username}, PRIVATE_KEY, {expiresIn: EXPIRESD}) // 这里推荐把userId也写入签名,方便之后查询用户
            res.json(util.buildSuccess('登录成功',{token:token}))
            // token可以到jwt的官网解析一下,看一下解析内容是不是我们添加的内容
        }
      }
    } catch (e) {
        console.log(e)
        // 将错误交由错误中间件处理
        next(e)
    }
  };
  
/**
 * 查询用户信息(需携带token):无法直接调试,请使用postman
 * @route GET /api/v1/user/userInfo
 * @group user - 用户相关接口
 * @summary 查询用户信息
 * @returns {object} 200 - 用户信息对象
 * @returns {Error} default - Unexpected error
 * @security JWT
 */

// 获取用户信息接口
exports.getUserInfo = async (req, res, next) => {
  // 前端发送携带token的请求, 我们就可以通过这样的方法来获取token中的内容(之前生成token的时候使用了username,现在来获取username)
  let {username} = req.user
  try {
    let userinfo = await querySql('select username from user where username ?', [username])
    res.json(util.buildSuccess('成功',userinfo[0]))
  }catch(e) {
    console.log(e)
    next(e)
  }
}

/**
 * 单文件上传:需设置name='file',无法直接调试,请使用postman尝试
 * @route POST /api/v1/user/uploadFile
 * @group user - 用户相关接口
 * @summary 上传文件
 * @returns {object} 200 - 文件访问地址
 * @returns {Error} default - Unexpected error
 * @security JWT
 */

// 单文件上传接口--前端上传时需要指定 name = "file"
exports.uploadFile = async (req, res, next) => {
  console.log(req.file)
  let filePath = req.file.path.split('public')[1]
  let fileUrl = 'http://127.0.0.1:' + process.env.PORT + filePath
  res.json(util.buildSuccess('上传成功',{fileUrl:fileUrl}))
}

/**
 * 多文件上传:需设置name='files',无法直接调试,请使用postman尝试
 * @route POST /api/v1/user/uploadFiles
 * @group user - 用户相关接口
 * @summary 上传文件
 * @returns {object} 200 - 文件访问地址数组
 * @returns {Error} default - Unexpected error
 * @security JWT
 */

// 多文件上传接口--前端上传时需要指定 name = "files"
exports.uploadFiles = async (req, res, next) => {
  console.log(req.files)
  let fileUrls = []
  req.files.forEach(item => {
    let filePath = item.path.split('public')[1]
    let fileUrl = 'http://127.0.0.1:' + process.env.PORT + filePath
    fileUrls.push({fileUrl})
  })
  res.json(util.buildSuccess('上传成功',fileUrls))
}
