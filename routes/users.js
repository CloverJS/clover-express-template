//
var express = require("express");
var router = express.Router();
const { upload } = require("../utils/index");
// 引入中间件
var { checkParams } = require("../utils/middleware");
const { checkSchema } = require('express-validator');
//引入处理逻辑的JavaScript文件
var {
  userRegister,
  userLogin,
  getUserInfo,
  uploadFile,
  uploadFiles,
} = require("../controller/user");

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
], userRegister);
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
], userLogin);
// 获取用户信息
router.get("/userInfo", getUserInfo);
// 单文件上传 -- 前端上传时需要指定 name = "file"
router.post("/uploadFile", upload.single("file"), uploadFile);
// 多文件上传(最大9个文件) -- 前端上传时需要指定 name = "image"
router.post("/uploadFiles", upload.array("files", 9), uploadFiles);
// 单图片上传 -- 前端上传时需要指定 name = "image"
router.post("/uploadImage", upload.single("image"), uploadFile);
// 多图片上传(最大9个文件) -- 前端上传时需要指定 name = "images"
router.post("/uploadImages", upload.array("images", 9), uploadFiles);

module.exports = router;
