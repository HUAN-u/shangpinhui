const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap:false,
  transpileDependencies: true,
  lintOnSave:false,
  //代理跨域
  devServer: {
    proxy: {
      '/api': {   //当前端发起请求的时候，路径中带有/api这样的请求，代理api会找到对应的服务器地址获取数据,
        target: 'http://gmall-h5-api.atguigu.cn',
        // pathRewrite: { '^/api': '' },  //路径重写
      },
    },
  },
})
  