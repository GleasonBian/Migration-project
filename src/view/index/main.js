// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/**
 *  Date: 1562573921043
 *  author: \u535e \u5218 \u8457
 *  不要 他娘的 随便 动老子的代码
 *  代码 跑的 通 是 author 写的, 跑不通 就不知道了
 *  小不点 你来 抓我啊~~~
 *  qi - si - ni
 */
import echarts from 'echarts'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from 'common/router'
import store from 'store'
import 'common/tplmain'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
