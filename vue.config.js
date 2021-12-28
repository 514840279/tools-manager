module.exports = {
    devServer: {
        proxy: {
            '^/serve': {
                target: 'http://chuxuezhe.wang:8001/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                pathRewrite: {                  //路径重置
                    '^/serve': '/serve'
                }
            }
        }
    }
};