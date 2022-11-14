const UserService = require("../service/UserService")

const UserController = {
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
  register: async (req, res, next) => {
    try {
      let { username, password } = req.body;
      let handleRes = await UserService.register(username, password);
      res.json(handleRes)
    } catch (e) {
      console.log(e)
      // 将错误交由错误中间件处理
      next(e)
    }
  },

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
  login: async (req, res, next) => {
    try {
      let { username, password } = req.body;
      let handleRes = await UserService.login(username, password);
      res.json(handleRes);
    } catch (e) {
      console.log(e)
      // 将错误交由错误中间件处理
      next(e)
    }
  },

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
  getUserInfo: async (req, res, next) => {
    try {
      // 前端发送携带token的请求, 我们就可以通过这样的方法来获取token中的内容(之前生成token的时候使用了username,现在来获取username)
      let { username } = req.user
      let handleRes = await UserService.getUserInfo(username);
      res.json(handleRes)
    } catch (e) {
      console.log(e)
      next(e)
    }
  },



  // sqlServer使用示例 ---经过封装已经与mysql使用很相似
  getUserForSqlServer: async (req, res, next) => {
    try {
      let handleRes = await UserService.getUserForSqlServer();
      res.json(handleRes)
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
}

module.exports = UserController;