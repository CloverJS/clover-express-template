## 项目备注

### config中存放配置文件
 - app :项目常量
 - dbConfig :数据库配置
 - swagger :swagger配置

### utils中存放所有工具的JavaScript方法,以及常量,中间件
 - common
   - 格式化成功返回的json
   - 格式化失败返回的json
   - 格式化时间
   - 校验字符串是否是日期时间格式
   - 构建分页参数
   - url转path
   - path转url
   - 空值处理方法
 - constant :常量
   - 用户密码加密密钥
   - token密钥
   - token过期时间
 - index
   - md5加密
   - 文件上传
   - json5解析
 - middleware
   - 检查请求来源中间件
   - 参数校验中间件
   - 参数空值处理中间件
   - 检查用户状态中间件(token)
   - 检查用户权限中间件
  

### db中存放数据库连接操作和操作封装
 - mysql: 
   - querySql :单条sql语句的封装
   - transaction :sql事务的封装
   - mysqlPool :连接池对象
 - sqlServer:
   - querySqlServer: 单条sql语句的封装
   - sqlServerPool: 连接池对象

### controller文件夹存放请求处理代码逻辑,所有的路由都定义在routes文件夹中

### public下存放静态资源
 - upload :上传的图片及其他文件存放的位置

### pm2运行生成的日志存放在logs目录下

### views中存放一些默认首页,错误页面

### settings文件中存放一些配置常量
 - 启动端口
 - 启动地址
 - 启动url
 - 是否使用url
 - 路由白名单
   - 警告: 这些路由将跳过token验证和权限验证

### ecosystem.config.js文件是pm2默认的配置文件
 - 已配置忽略监听 node_modules  logs  public

### handler中存放处理文件,如错误处理
 - errorHandler :错误处理

### url验证,错误处理在app.js文件中

### 项目已配置跨域、token验证、参数校验、加解密、文件上传、权限验证、swagger、pm2等常用后端配置
 - token验证: 前端需要为请求头添加token,格式遵守: headers['Authorization'] = `Bearer ${token}`  设置好后,发送请求在浏览器network请求头中可以看到 Authorization: Bearer token值

### 使用express-validator进行参数校验
 - 写在routes里, 使用其支持的结构型(对象型)写法
 - 部分validatorjs里的验证方法经试验并不生效,可能使用姿势有误,目前的解决方式是使用express-validator的自定义验证解决

### 说明: 
 - node运行:  npm run start
 - 生产环境使用pm2运行: npm run pm2
 - package.json插件:
   - "cookie-parser": 解析cookie
   - "cors": 跨域
   - "crypto": 加密算法库
   - "debug": debug
   - "express": express框架
   - "express-jwt": url验证
   - "express-swagger-generator": swagger
   - "express-validator": 参数校验
   - "http-errors": 错误处理
   - "iconv-lite": 字符编码转换
   - "jade": 模板引擎
   - "json5": json5解析
   - "jsonwebtoken": token
   - "morgan": 日志
   - "multer": 文件上传
   - "mysql": mysql操作
   - "redis": redis操作
 - 之后预计加入的插件:
   - lodash: js数据处理方法的增强版