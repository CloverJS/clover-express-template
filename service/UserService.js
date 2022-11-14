// let redis=require("../db/redisDB")
const { querySql } = require("../db/mysqlDB");
// sqlServer操作方法
const { querySqlServer } = require("../db/sqlServerDB");

const util = require("../utils/common");
const { PWD_SALT, PRIVATE_KEY, EXPIRESD } = require("../utils/constant");
const { md5 } = require("../utils/index");
const jwt = require('jsonwebtoken')

const UserService = {
  register: async (username, password) => {
    let user = await querySql("select * from user where username = ?", [username]);
    if (!user || user.length === 0) {
      // 对密码加密后存入数据库
      password = md5(`${password}${PWD_SALT}`);
      await querySql("insert into user(username,password) value(?,?)", [
        username,
        password,
      ]);
      return util.buildSuccess("注册成功");
    } else {
      return util.buildError("账号已注册");
    }
  },
  login: async (username, password) => {
    let user = await querySql("select * from user where username = ?", [username]);
    if (!user || user.length === 0) {
      return util.buildError("账号不存在");
    } else {
      password = md5(`${password}${PWD_SALT}`);
      let result = await querySql("select * from user where username = ? and password = ?", [username, password]);
      if (!result || result.length === 0) {
        return util.buildError("账号或密码不正确");
      } else {
        let user_id = result[0].user_id;
        let token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: EXPIRESD }); // 这里推荐把userId也写入签名,方便之后查询用户
        // 将token存入数据库---配合中间件可实现同一用户同一时间只对应一个token
        await querySql(
          "update user set token = ? where user_id = ?",
          [token, user_id]
        );
        return util.buildSuccess('登录成功', { token: token });
        // token可以到jwt的官网解析一下,看一下解析内容是不是我们添加的内容
      }
    }
  },
  getUserInfo: async (username) => {
    let userinfo = await querySql('select username from user where username ?', [username])
    return util.buildSuccess('成功',userinfo[0])
  },
  getUserForSqlServer: async () => {
    // 注意: 因为user恰好是sql保留字, 所以直接使用user会出错,这时要么改表名,要么就加一个[]成为[user]
    // 查询
    // let userInfo = await querySqlServer('SELECT * FROM [user]'); // 无额外参数
    // let userInfo = await querySqlServer('select * from [user] where user_id = ? and user_name = ?',[
    //   ['user_id', 'Int', 1],
    //   ['user_name', ['VarChar', 32], '王志超']
    // ]); // 带额外参数
    // 新增
    // let result = await querySqlServer('insert into [user](user_name,password) values(?,?)', [
    //   ['user_name', 'VarChar', '巴黎斯'],
    //   ['password', ['VarChar', 32], '12345']
    // ])
    // 更新
    let result = await querySqlServer('update [user] set user_name = ? where user_id = ?', [
      ['user_name', 'VarChar', '格拉斯'],
      ['user_id', 'Int', 1]
    ])
    // 删除
    // let result = await querySqlServer('delete [user] where user_id = ?', [
    //   ['user_id', 6]
    // ])

    // 查询
    // console.log(userInfo);
    // return util.buildSuccess('查询成功',userInfo.recordset);
    // 新增
    // if(result.rowsAffected[0] !== 0) {
    //   return util.buildSuccess('新增成功');
    // } else {
    //   return util.buildSuccess('新增失败');
    // }
    // 更新
    if(result.rowsAffected[0] !== 0) {
      return util.buildSuccess('更新成功');
    } else {
      return util.buildSuccess('更新失败');
    }
    // 删除 -- 同样需要像新增和更新那样, 判断受影响的行(result.rowsAffected[0])是否不为0
    // return util.buildSuccess('删除成功');
  }
}


module.exports = UserService