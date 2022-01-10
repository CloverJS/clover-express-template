const crypto = require('crypto')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const JSON5 = require('json5')

/** @return {string} md5加密 */
function md5(s){
    //注意参数需要为string类型，否则会报错
    return crypto.createHash('md5').update(String(s)).digest('hex');
}

// 文件上传
let upload = multer({
    storage: multer.diskStorage({
      /**
       * 设置文件存储位置
       *  - 上传的文件统一放在 public/upload 目录下
       *  - 以 年月日 命名文件夹
       *  - 以 时间戳 命名文件
       */
      destination: function (req, file, cb) {
        let date = new Date()
        let year = date.getFullYear()
        let month = (date.getMonth() + 1).toString().padStart(2, '0')
        let day = date.getDate()
        let dir = path.join(__dirname,'../public/uploads/' + year + month + day)
  
            // 判断目录是否存在，没有则创建
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {recursive: true})
        }
  
        // dir就是上传文件存放的目录
        cb(null, dir)
      },
        // 设置文件名称
      filename: function (req, file, cb) {
        let fileName = Date.now() + path.extname(file.originalname)
        // fileName就是上传文件的文件名
        cb(null, fileName)
      }
    }),
    /**
     * 文件格式过滤器, 不被允许的文件将被禁止上传
     *  - file.fieldname就是设置的name,比如现在单文件上传就是file,多文件上传就是files
     */
    fileFilter: function(req, file, cb) {
      const /** !Map<RegExp, Array<string>> */ field = new Map([
        [/^(image){1}(s?)$/, ['.png','.jpg','.jpeg','.gif','.bmp']],
        [/^(file){1}(s?)$/, ['.xls','.xlsx','.xlsm','.doc','.docx','.pdf']],
        [/^(defaultFile)$/, ['.png','.jpg','.jpeg','.gif','.bmp','.xls','.xlsx','.xlsm','.doc','.docx','.pdf']]
      ])
      let allowFile = [...field].filter(([key,value]) => (key.test(file.fieldname)))[0][1]
      let extName = path.extname(file.originalname).toLowerCase ()
      if(allowFile.includes(extName)){
        cb(null, true)
      } else {
        cb(new Error('FileNotAllow'), false)
      }
    },
    // 对上传的数据大小进行限制
    limits: {
      // 文件最大5MB
      fileSize: 5242880
    }
  })

module.exports = {
    md5,
    upload,
    JSON5
}