// todo 中间件

const { querySql } = require("../db/mysqlDB");
//用户状态判定

// 引入应用配置信息,用于鉴定应用来源(忽略)
const { ALLOW_APP } = require("../config/app");
const defaultSettings = require("../settings");
const util = require("./common");
const { validationResult } = require('express-validator');
/**
 * 中间件定义---检查请求来源
 */
exports.checkAPP = (req, res, next) => {
  // console.log(req.headers)
  // if(!ALLOW_APP.includes(req.headers.fapp)){
  //     res.json(util.getReturnData(500,"来源不正确"))
  // }else{
  //     next()
  // }
  // req.body = {haha:'999'}
  next();
};

/**
 * 中间件定义--参数校验
 */
exports.checkParams = (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json(util.buildError('参数校验不通过',errors.array()));
    } else {
      next();
    }
}

/**
 * 中间件定义---参数空值处理
 */
 exports.nullHandler = (req, res, next) => {
  util.nullHandler(req.body);
  next();
};

/**
 * 中间件定义--检查用户状态
 */
exports.checkUser = async (req, res, next) => {
    // 如果用户退出登录,则应清空数据库token,若发来的token与数据库中不一致则不应通过token验证(保证同一用户同一时间只有一个token生效)
  if (defaultSettings.WHITE.includes(req.originalUrl)) { //如果当前路由在白名单中则跳过token验证
    next();
  } else {
    let { user_id } = req.user;
    let { authorization } = req.headers;
    try {
      // 如果用户被封禁, 则直接返回封禁提示
      let status = await querySql("select user_id, status from user where user_id = ?", [
        user_id
      ])
      if(status.length !== 0 && status[0].status === -1) {
        return res.json(util.buildError(-1003,'抱歉! 您已被封禁!',[]));
      }
      // 查询数据库中存储得用户token
      let result = await querySql(
        "select token from user where user_id = ?",
        [user_id]
      );
      if (!result || result.length !== 0) {
        if (result[0].token === authorization.split("Bearer ")[1]) {
          next();
        } else {
          res.status(401).send(util.buildError("token验证失败"));
        }
      } else {
        res.status(401).send(util.buildError("token验证失败"));
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
};

/**
 * 中间件定义--检查用户权限
 */
 exports.checkAdmin = (req, res, next) => {
  if (defaultSettings.WHITE.includes(req.originalUrl)) {
    //如果当前路由在白名单中则跳过权限验证
    next();
  } else {
    console.log("检查用户权限");
    let { role } = req.user; // 获取用户权限--在登录生成token令牌时,将权限也放入
    const /** !Map<number, Array<string>> 权限表 */ Roles = new Map([
      [
        1,
        [
          "user",
          "person",
          "admin",
        ],
      ],
      [
        2,
        [
          "user",
        ],
      ],
      [
        3,
        [
          "person",
        ],
      ],
    ]);
    // 获取当前用户的权限表
    let userRole = Roles.get(role);
    // 检查baseUrl中的标记字段是否在当前用户的权限表里,如果在则放行,不在则返回权限不足
    if (
      userRole.includes(
        /(?<=v1\/)[a-z0-9\-_%&@#$!`|*(){}\[\]'";:?,.<>+=]+(?=\/?)/.exec(
          req.baseUrl
        )[0]
      )
    ) {
      next();
    } else {
      res.status(403).send(util.buildError(-1002, "权限不足", []));
    }
  }
};
