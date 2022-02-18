// mssql模块拥有内置的sql注入保护

// sqlServer配置
const mssql = require("mssql");
const {sqlServerOption} = require("../config/dbConfig");

// 创建sqlServer连接池
const sqlServerPool = new mssql.ConnectionPool(sqlServerOption);

/**
 * 封装sqlServer操作
 * @param {String} sql 要执行的sql语句
 *  - eg: 'select * from user_table where id = ?'
 * @param {Array<Array<String,String|Array<String,Any>,Any>>} params 要替换sql语句中的?占位符, 数组形式,内部依次是变量名,变量类型,变量值
 *  eg: params: [
 *          ['user_id', 'Int', value],
 *          ['address', ['Char', 50], value],
 *      ]
 * @returns 
 */
function querySqlServer(sql, params) {
  return new Promise((resolve, reject) => {

    sqlServerPool.connect(err => {
        if(err) {
            console.log(err);
            reject(err);
            return;
        }
        // 构建请求
        let req = sqlServerPool.request(); // 或者使用下一条语句
        // let req = new mssql.Request(sqlServerPool);
        // 插入input值
        if(params) {
            params.forEach((element) => {
                    // 传入参数是指定了数据类型
                if(element.length > 2) {
                    req.input(element[0], sqlType(element[1]), element[2]);
                } else {
                    // 传入参数时缺省了数据类型, 此时mssql会依据js数据类型自动选择合适的sql数据类型,这其中有一个映射表(支持自定义更改,见后面)
                    req.input(element[0], element[1]);
                }
            });
        }
        // 处理sql语句---将'?'替换为'@参数名'
        let querySql = sql;
        if(params && params.length !== querySql.split('?').length - 1) {
            // 如果sql中的'?'占位符与参数个数不一致则抛出错误
            let err = new Error('参数不匹配')
            reject(err);
            return;
        }
        if(params) {
            params.forEach(item => {
                querySql = querySql.replace('?',`@${item[0]}`);
            })
        }
        // 执行sql语句
        req.query(querySql, (err, result) => {
            if(err) {
              reject(err);
              return;
            }
            resolve(result);
        });
    })
  });
}

//TODO sqlServer事务处理





const /** 无可选参数的sqlType匹配项 */ sqlTypeMap = new Map([
  ["Bit", mssql.Bit],
  ["BigInt", mssql.BigInt],
  ["Decimal", mssql.Decimal],
  ["Float", mssql.Float],
  ["Int", mssql.Int],
  ["Money", mssql.Money],
  ["Numeric", mssql.Numeric],
  ["SmallInt", mssql.SmallInt],
  ["SmallMoney", mssql.SmallMoney],
  ["Real", mssql.Real],
  ["TinyInt", mssql.TinyInt],
  ["Char", mssql.Char],
  ["NChar", mssql.NChar],
  ["Text", mssql.Text],
  ["NText", mssql.NText],
  ["VarChar", mssql.VarChar],
  ["NVarChar", mssql.NVarChar],
  ["Xml", mssql.Xml],
  ["Time", mssql.Time],
  ["Date", mssql.Date],
  ["DateTime", mssql.DateTime],
  ["DateTime2", mssql.DateTime2],
  ["DateTimeOffset", mssql.DateTimeOffset],
  ["SmallDateTime", mssql.SmallDateTime],
  ["UniqueIdentifier", mssql.UniqueIdentifier],
  ["Variant", mssql.Variant],
  ["Binary", mssql.Binary],
  ["VarBinary", mssql.VarBinary],
  ["Image", mssql.Image],
  ["UDT", mssql.UDT],
  ["Geography", mssql.Geography],
  ["Geometry", mssql.Geometry]
]);

/**
 * 处理有可选参数的sqlType 
 * @param {Array<String,Any} arr
 *  - [type<string>, ...params]  
 * @returns mssql数据类型
 */
function paramsType(arr) {
  let result = null;
  switch (arr[0]) {
    case "Decimal":
      arr.shift();
      result = mssql.Decimal(...arr);
      break;
    case "Numeric":
      arr.shift();
      result = mssql.Numeric(...arr);
      break;
    case "Char":
      arr.shift();
      result = mssql.Char(...arr);
      break;
    case "NChar":
      arr.shift();
      result = mssql.NChar(...arr);
      break;
    case "VarChar":
      arr.shift();
      result = mssql.VarChar(...arr);
      break;
    case "NVarChar":
      arr.shift();
      result = mssql.NVarChar(...arr);
      break;
    case "Time":
      arr.shift();
      result = mssql.Time(...arr);
      break;
    case "DateTime2":
      arr.shift();
      result = mssql.DateTime2(...arr);
      break;
    case "DateTimeOffset":
      arr.shift();
      result = mssql.DateTimeOffset(...arr);
      break;
    case "VarBinary":
      arr.shift();
      result = mssql.VarBinary(...arr);
      break;
  }
  return result;
}

/**
 * 处理sqlType
 * @param {String|Array<String,Any} params 
 *  - eg: ['Char', 50]
 * @returns mssql类型
 */
function sqlType(params) {
  let type = null;
  let isArray = false;
  // 依据params类型的不同执行操作
  if (Array.isArray(params)) {
    type = params[0];
    isArray = true;
  } else if (typeof params === "string") {
    type = params;
  }
  // 检查传来的类型是否在类型表里
  let findType = sqlTypeMap.has(type);
  if (!findType) {
    // 如果该类型不在sql类型表里, 则抛出错误
    console.log("sqlType is not defined");
    return new Error("sqlType is not defined");
  } else if (isArray) {
    // 如果params是数组类型,表明是带可选参数的sql类型,调用带参函数返回mssql类型
    return paramsType(params);
  } else {
    // 如果params是string, 则从无参类型表里返回mssql类型
    return sqlTypeMap.get(type);
  }
}

/**
 * JS数据类型到SQL数据类型映射表以及自定义映射关系
 *  - `String` -> `sql.NVarChar`
 *  - `Number` -> `sql.Int`
 *  - `Boolean` -> `sql.Bit`
 *  - `Date` -> `sql.DateTime`
 *  - `Buffer` -> `sql.VarBinary`
 *  - `sql.Table` -> `sql.TVP`
 * 未知对象的缺省数据类型为 `sql.NVarChar`
 */
// mssql.map.register(MyClass, sql.Text); // 新增自定义的数据关系映射
// mssql.map.register(Number, sql.BigInt); // 覆盖原有的数据关系映射

/**
 * sql操作结果值处理
 *     可以对sql操作的返回结果值进行统一处理
 *  - 示例: 对所有返回的Int值加1
 */
// mssql.valueHandler.set(mssql.TYPES.Int, (value) => value + 1);

/**
 * sqlServer错误处理
 */
mssql.on('error', err => {
    // error handler
})


module.exports = {
    /** 暴露pool连接池对象,以便在需要的地方自定义事务逻辑 */
    sqlServerPool,
    querySqlServer,
};