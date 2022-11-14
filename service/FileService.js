const FileService = {
  uploadFile: async (file) => {
    let filePath = file.path.split('public')[1]
    let fileUrl = 'http://127.0.0.1:' + process.env.PORT + filePath
    return util.buildSuccess('上传成功', { fileUrl: fileUrl })
  },
  uploadFiles: async (files) => {
    let fileUrls = []
    files.forEach(item => {
      let filePath = item.path.split('public')[1]
      let fileUrl = 'http://127.0.0.1:' + process.env.PORT + filePath
      fileUrls.push({ fileUrl })
    })
    return util.buildSuccess('上传成功', fileUrls)
  }
}


module.exports = FileService