//   存放通用的方法或验证内容
const { isUseUrl } = require("../settings");
let util = {};
/**
 * 
 * @param {string} message 提示信息
 * @param {Array | any} data 返回数据
 * @returns {{code: (number), message: (string), date: (Array | any)}} 
 *  - code: 状态码
 *  - message: 提示信息
 *  - data: 返回数据
 */
util.buildSuccess = (message = "", data = []) => {
  //格式化返回数据格式---成功
  if (!data) {
    data = [];
  }
  return {
    code: 0,
    message: message,
    data: data,
  };
};
/**
 * 格式化返回数据格式---出错
 * @param  {...any} args 
 * @returns {{code: (number), message: (string), date: (Array | any)}} 
 *  - code: 状态码
 *  - message: 错误信息
 *  - data: 返回数据
 */
util.buildError = (...args) => {
  //格式化返回数据格式---出错
  if (!args[args.length - 1]) {
    data = [];
  }
  let resData = [
    {
      code: -1,
      message: args[0],
      data: [],
    },
    {
      code: -1,
      message: args[0],
      data: args[1],
    },
    {
      code: args[0],
      message: args[1],
      data: args[2],
    },
  ];
  switch (args.length) {
    case 1:
      return resData[0];
    case 2:
      return resData[1];
    case 3:
      return resData[2];
  }
};

/**
 * 转化为格式化时间
 * @param {String | timestamp} t 待转换的时间值
 * @param {string} type 默认为date,当值为date时代表t为string,当值为timestamp时,代表t为时间戳
 * @returns {string} 返回处理后的时间字符串  格式为: yyyy-MM-dd HH:mm:ss
 */
util.getLocalDate = (t, type = "date") => {
  let date;
  if (type === "date") {
    date = new Date(t);
  } else if (type === "timestamp") {
    date = new Date(parseInt(t));
  }
  if (!t || t.length === 0) {
    return "";
  }
  return (
    date.getFullYear() +
    "-" +
    (parseInt(date.getMonth()) + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
};

/**
 * 验证字符串是否是符合要求的日期格式
 * @param {string} date 日期格式的字符串,格式遵守: yyyy-MM-dd HH:mm:ss 
 * @returns {boolean} 通过检查则返回true
 */
util.checkDate = (date) => {
  let result =
    /(\d{2}|\d{4})(?:\-)+([0]{0,1}\d{1}|[1]{1}[0-2]{1})(?:\-)+([0-2]{0,1}\d{1}|[3]{1}[0-1]{1})(?:\s)+([0-1]{0,1}\d{1}|[2]{1}[0-3]{0,1})(?::)+([0-5]{0,1}\d{1})(?::)+([0-5]{0,1}\d{1})/.exec(
      date
    );
  if (result && result[0] === result.input) {
    return true;
  }
};

/**
 * ?构建分页参数
 * @param {Array<{totalRecords: (number)}>} pagination
 *  - sql查询记录数(count函数)执行结束的返回值
 *  - sql查询示例: select count(*) as totalRecords from user where 1=1
 * @param {number} currentPage
 *  - 查询第几页
 * @param {number} pageSize
 *  - 一页多少条数据
 * @returns {totalRecords: (number), totalPage: (number), pageSize: (number), currentPage: (number)}
 *  - totalRecords: 总计多少条数据
 *  - totalPage: 总计多少页
 *  - pageSize: 每页多少条数据
 *  - currentPage: 当前是第几页
 */
util.setPagination = (pagination, currentPage, pageSize) => {
  // 检查是否有记录数,如果没有,则不必分页了(因为记录为0)
  if (pagination[0].totalRecords === 0) {
    return 0;
  }
  // 如果所查询的范围超出已有范围--则查询最后一页
  if (pagination[0].totalRecords < currentPage * pageSize) {
    currentPage =
      pagination[0].totalRecords % pageSize === 0
        ? pagination[0].totalRecords / pageSize
        : parseInt(pagination[0].totalRecords / pageSize) + 1;
  } else {
  }
  // 构建分页参数 ---总计多少条数据, 总计多少页, 每页多少条数据, 当前是第几页
  let totalRecords = pagination[0].totalRecords;
  return {
    ...pagination[0],
    totalPage:
      totalRecords % pageSize === 0
        ? totalRecords / pageSize
        : parseInt(totalRecords / pageSize) + 1,
    pageSize: parseInt(pageSize),
    currentPage: parseInt(currentPage),
  };
};

//!警告: 在不启用域名的情况下, 转换启用域名时图片地址将导致转换失败
// 将静态资源url访问地址转为存储的相对路径
util.urlToPath = (url) => {
  return isUseUrl
    ? url.split(process.env.URL)[1]
    : url.split(process.env.PORT)[1];
};
// 将静态资源存储的相对路径转为url访问地址
util.pathToUrl = (path) => {
  // 需添加判断, 如果有域名则直接拼接域名即可, 不必管端口号
  return isUseUrl
    ? `${process.env.URL}${path}`
    : `${process.env.HOST}:${process.env.PORT}${path}`;
};

/**
 * 统一的空值处理方法
 * @param {string | Object | number | Array} data 需要处理空值的对象或者值
 * @param {string} defaultStr 将空值转为该值, 不传默认将所有空值转为null
 * @returns {string | null} 处理结果
 *  - 空值包括, '', undefined, null, NaN
 */
util.nullHandler = function (data, defaultStr = null) {
  // 普通数据类型
  if (
    typeof data != "object" ||
    data === null ||
    data === undefined ||
    data === NaN ||
    data === ""
  ) {
    if (
      data === null ||
      data === undefined ||
      data === NaN ||
      data === "" ||
      data == "null"
    ) {
      return defaultStr;
    } else {
      return data;
    }
  }
  // 引用数据类型
  for (const v in data) {
    if (
      data[v] === null ||
      data[v] === undefined ||
      data[v] === NaN ||
      data[v] === "" ||
      data[v] == "null"
    ) {
      data[v] = defaultStr;
    }
    if (typeof data[v] == "object") {
      util.nullHandler(data[v]);
    }
  }
};

module.exports = util;
