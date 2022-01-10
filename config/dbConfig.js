// redis配置
// exports.redisConfig={
//     host:'127.0.0.1',
//     port:'6379',
//     ttl:5*60*1000
// }

// mysql配置
let dbOption

dbOption = {
  connectionLimit: 10, // 一次创建的最大连接数, 默认为 10
  host: '255.255.255.00', // 数据库地址
  user: 'root', // 连接数据库的用户名 root 是最高权限
  password: 'xxxxxxx', // 连接数据库的密码
  port: '3306', // 连接mysql的端口号, 默认 3306
  database: 'xxxxx' // 操作的数据库名
}

module.exports = dbOption
