var express = require("express");
var router = express.Router();
// 引入中间件
var { checkParams } = require("../utils/middleware");
const { checkSchema } = require('express-validator');
//引入处理逻辑的JavaScript文件
const UserController = require("../controller/UserController");

//注册
router.post("/register",[
    checkSchema({
        username: {
            in: ['body'],
            errorMessage: 'username is wrong',
            isString: true,
        },
        phone_number: {
            in: ['body'],
            errorMessage: 'phone_number should be a phoneNumber',
            isMobilePhone: {options: 'zh-CN'},
        },
        password: {
            in: ['body'],
            isLength: {
                // if: value => value, // 条件判断此校验是否生效
                errorMessage: 'Password should be at least 7 chars long',
                options: { min: 7},
            },
            // custom: { //TODO 自定义验证器
            //     if: (value) => value,
            //     options: (value) => util.checkDate(value) // 自定义的日期校验参数
            // }
        }
    }),
    checkParams
], UserController.register);
//登录
router.post("/login",[
    checkSchema({
        phone_number: {
            in: ['body'],
            errorMessage: 'phone_number should be a phoneNumber',
            isMobilePhone: {options: 'zh-CN'},
        },
        password: {
            in: ['body'],
            isLength: {
                errorMessage: 'password should be at least 7 chars long',
                options: { min: 7},
            }
        },
    }),
    checkParams
], UserController.login);
// 获取用户信息
router.get("/userInfo", UserController.getUserInfo);


// 从sqlServer中查询用户列表
router.get("/users", UserController.getUserForSqlServer);


module.exports = router;
