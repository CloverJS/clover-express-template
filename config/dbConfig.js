// redis配置
// let redisOption={
//     host:'127.0.0.1',
//     port:'6379',
//     ttl:5*60*1000
// }

// sqlServer配置
let sqlServerOption = {
  user: 'sa', // 用户名
  password: 'xxxxxxx', // 密码
  server: '255.255.255.00', // 服务器ip
  port: 1433, // 连接端口, 缺省值为1433
  database: 'test', // 数据库名
  options: { // 参数配置
    encrypt: false, // 在azure上使用sqlServer时设为true
    trustServerCertificate: false // change to true for local dev / self-signed certs
  },
  pool: { // 连接池配置
    max: 10, // 最大连接数
    min: 0,
    idleTimeoutMillis: 30000
  }
}

// mysql配置
let mysqlDbOption

mysqlDbOption = {
  connectionLimit: 10, // 一次创建的最大连接数, 默认为 10
  host: '255.255.255.00', // 数据库地址
  user: 'root', // 连接数据库的用户名 root 是最高权限
  password: 'xxxxxxx', // 连接数据库的密码
  port: '3306', // 连接mysql的端口号, 默认 3306
  database: 'xxxxx' // 操作的数据库名
}

module.exports = {
  mysqlDbOption,
  sqlServerOption,
  // redisOption,
}
