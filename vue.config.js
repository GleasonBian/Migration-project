const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir)
}
/**
 *  Date: 1562573921043
 *  author: \u535e \u5218 \u8457
 *  不要 他娘的 随便 动老子的代码
 *  代码 跑的 通 是 author 写的, 跑不通 就不知道了
 *  小不点 你来 抓我啊~~~
 *  qi - si - ni
 */
const baseConfig = require('./public/base.js')
const CompressionPlugin = require('compression-webpack-plugin'); //Gzip
module.exports = {
  // 基本路径
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack配置 see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('store', resolve('src/store'))
      .set('view', resolve('src/view'))
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('static', resolve('src/components/static'))
      .set('common', resolve('src/common'))
      .set('customtemp', resolve('src/components/customtemp'))
      .set('bizcomponents', resolve('src/bizcomponents'))
      .set('components', resolve('src/components'))
      .set('base', resolve('public/base.js'));
  },
  	//调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
  configureWebpack: config => {
    // 入口文件
    config.entry = './src/view/index/main.js';
		// 生产 & 测试环境
		let pluginsPro = [
			new CompressionPlugin({ //文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
				filename: '[path].gz[query]',
				algorithm: 'gzip',
				test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$', ),
				threshold: 8192,
				minRatio: 0.8,
			}),
    ];
    // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
    if (process.env.NODE_ENV !== 'development') {
      config.plugins = [...config.plugins, ...pluginsPro];
    }
	},
  // configureWebpack: {
  //   entry: './src/view/index/main.js',
  // },
  // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: false,
  // css相关配置
  css: {
   // 是否使用css分离插件 ExtractTextPlugin
   extract: true,
   // 开启 CSS source maps?
   sourceMap: false,
   // css预设器配置项
   loaderOptions: {},
   // 启用 CSS modules for all css / pre-processor files.
   modules: false
  },
  // 如果机器有超过1个内核，则在默认情况下为生产构建中的babel&ts使用线程加载器
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: true,
    host: '',
    port: 8080,
    https: false,
    hotOnly: false,
    // 设置代理
    proxy: {
      '/adminApi': {
        target: baseConfig.proxyTableNameImgVersion,
        changeOrigin: true,
        pathRewrite: {
          '^/adminApi': ''
        }
      },
      '/api': {
        target:baseConfig.proxyTableNameImgVersion,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }, 
   before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {

  }
 }
