module.exports = {
    /** @const {number} - 启动端口 */
    PORT: 3030,
    /** @const {string(ip)} - 项目地址 */
    HOST: 'http://127.0.0.1',
    /** @const {string(url)} - 项目域名 */
    URL: 'https://wzctest.wzc520pyf.cn',
    /** @const {boolean} - 是否启用域名---如果设置了启用域名,那么返回的图片链接将以域名形式开头,否则以ip和端口号开头 */
    isUseUrl: false,
    /** @const {Array<string(urlPath)>} - 路由白名单:跳过token验证和权限验证 */
    WHITE: ["/api/v1/user/register", "/api/v1/user/login", "/api/v1/user/uploadFile", "/api/v1/user/uploadFiles", "/api/v1/user/uploadImage", "/api/v1/user/uploadImages", "/api/v1/user/users"] // "/api/v1/user/users"是sqlServer查询示例接口
}

