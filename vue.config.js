const path = require('path')
// 路径
const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}
let srcAds = {
  'components': resolve('src/components'),
  'bizcomponents': resolve('src/bizcomponents'),
  'customtemp': resolve('src/components/customtemp'),
  'common': resolve('src/common'),
  'static': resolve('src/static'),
  'vue$': 'vue/dist/vue.esm.js',
  'view': resolve('src/view'),
  'store': resolve('src/store'),
  'base': resolve('base'),
  'api': resolve('src/api'),
  '@': resolve('src')
}
module.exports = {
  configureWebpack: {
    entry: './src/view/index/main.js',
    resolve: {
      alias:srcAds
    }
  }
}
