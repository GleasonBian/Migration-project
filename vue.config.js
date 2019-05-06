const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  configureWebpack: {
    entry: './src/view/index/main.js',
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        'components': resolve('src/components'),
        'bizcomponents': resolve('src/bizcomponents'),
        'customtemp': resolve('src/components/customtemp'),
        'common': resolve('src/common'),
        'static': resolve('src/static'),
        'view': resolve('src/view'),
        'store': resolve('src/store'),
        'base': resolve('base'),
        'api': resolve('src/api')
      }
    },
  }
}
