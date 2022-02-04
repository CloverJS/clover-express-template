// mysql配置
const mysql = require("mysql");
const {mysqlDbOption} = require("../config/dbConfig");

//创建连接池
const mysqlPool = mysql.createPool(mysqlDbOption);

/**
 * mysql数据操作
 * @param {String} sql 需要执行的sql语句
 * @param {Array<number|string>} params 对应上面sql语句中的参数
 * @returns {Promise} 返回一个Promise
 */
function querySql(sql, params) {
  return new Promise((resolve, reject) => {
    //获取连接
    mysqlPool.getConnection((err, conn) => {
      if (err) {
        reject(err);
        return;
      }
      //执行sql语句
      conn.query(sql, params, (err, result) => {
        conn.release();
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  });
}

/**
 * mysql事务处理
 * @param {Array<String>} sqls 需要执行的sql语句
 * @param {Array<Array<number|string>>} params 对应上面sql语句的参数
 * @returns {Promise} 返回一个Promise
 */
function transaction(sqls, params) {
  return new Promise((resolve, reject) => {
    //获取连接 失败则promise直接返回失败
    mysqlPool.getConnection((err, conn) => {
      if (err) {
        reject(err);
        return;
      }
      // 如果 语句和参数数量不匹配 promise直接返回失败
      if (sqls.length !== params.length) {
        conn.release(); // 释放掉
        return reject(new Error("语句与传值不匹配"));
      }
      // 开始执行事务
      conn.beginTransaction((beginErr) => {
        // 创建事务失败
        if (beginErr) {
          conn.release();
          return reject(beginErr);
        }
        console.log("开始执行事务，共执行" + sqls.length + "条语句");
        // 返回一个promise 数组
        let funcAry = sqls.map((sql, index) => {
          return new Promise((sqlResolve, sqlReject) => {
            const data = params[index];
            conn.query(sql, data, (sqlErr, result) => {
              if (sqlErr) {
                return sqlReject(result); 
              }
              sqlResolve(sqlErr);
            });
          });
        });
        // 使用all 方法 对里面的每个promise执行的状态 检查
        Promise.all(funcAry)
          .then((arrResult) => {
            // 若每个sql语句都执行成功了 才会走到这里 在这里需要提交事务，前面的sql执行才会生效
            // 提交事务
            conn.commit(function (commitErr, info) {
              if (commitErr) {
                // 提交事务失败了
                console.log("提交事务失败:" + commitErr);
                // 事务回滚，之前运行的sql语句不生效
                conn.rollback(function (err) {
                  if (err) console.log("回滚失败:" + err);
                  conn.release();
                });
                // 返回promise失败状态
                return reject(commitErr);
              }

              conn.release();
              // 事务成功 返回 每个sql运行的结果 是个数组结构
              resolve(arrResult);
            });
          })
          .catch((error) => {
            // 多条sql语句执行中 其中有一条报错 直接回滚
            conn.rollback(function () {
              console.log("sql运行失败:" + error);
              conn.release();
              reject(error);
            });
          });
      });
    });
  });
}

module.exports = {
  /** 暴露pool连接池对象,以便在需要的地方重新自定义事务逻辑 */
  mysqlPool,
  querySql,
  transaction,
};
