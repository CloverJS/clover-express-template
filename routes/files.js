var express = require("express");
var router = express.Router();
const { upload } = require("../utils/index");
const FileController = require("../controller/FileController")

// 单文件上传 -- 前端上传时需要指定 name = "file"
router.post("/uploadFile", upload.single("file"), FileController.uploadFile);
// 多文件上传(最大9个文件) -- 前端上传时需要指定 name = "image"
router.post("/uploadFiles", upload.array("files", 9), FileController.uploadFiles);
// 单图片上传 -- 前端上传时需要指定 name = "image"
router.post("/uploadImage", upload.single("image"), FileController.uploadFile);
// 多图片上传(最大9个文件) -- 前端上传时需要指定 name = "images"
router.post("/uploadImages", upload.array("images", 9), FileController.uploadFiles);

module.exports = router;