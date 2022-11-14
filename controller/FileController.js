const FileService = require("../service/FileService")


const FileController = {
  /**
    * 单文件上传:需设置name='file',无法直接调试,请使用postman尝试
    * @route POST /api/v1/user/uploadFile
    * @group user - 用户相关接口
    * @summary 上传文件
    * @returns {object} 200 - 文件访问地址
    * @returns {Error} default - Unexpected error
    * @security JWT
    */

  // 单文件上传接口--前端上传时需要指定 name = "file"
  uploadFile: async (req, res, next) => {
    console.log(req.file);
    let handleRes = await FileService.uploadFile(req.file);
    res.json(handleRes);
  },

  /**
    * 多文件上传:需设置name='files',无法直接调试,请使用postman尝试
    * @route POST /api/v1/user/uploadFiles
    * @group user - 用户相关接口
    * @summary 上传文件
    * @returns {object} 200 - 文件访问地址数组
    * @returns {Error} default - Unexpected error
    * @security JWT
    */

  // 多文件上传接口--前端上传时需要指定 name = "files"
  uploadFiles: async (req, res, next) => {
    console.log(req.files)
    let handleRes = await FileService.uploadFiles(req.files);
    res.json(handleRes);
  }
}


module.exports = FileController