/**
 * Created by tim on 2017/7/24.
 * Author: wangjialiang
 * http请求工具类
 * 使用方法：
 * import ajax from 'common/httpUtils'
 * get:
 * 有参数
 * ajax.get({
    url: api.Api.delMiddleTable,
    data: { // data参数为空时不用写
      id: 10,
      name: ''
    }
    cb: res => {
      console.log(res)
    }
  })
 无参数
 ajax.get({
    url: api.Api.delMiddleTable,
    cb: res => {
      console.log(res)
    }
  })
 post:
 有参数
 ajax.post({
    url: api.Api.delMiddleTable,
    data: { // data参数为空时不用写
      id: 10,
      name: ''
    }
    cb: res => {
      console.log(res)
    }
  })
 无参数
 ajax.post({
    url: api.Api.delMiddleTable,
    cb: res => {
      console.log(res)
    }
  })
 delete:
 有参数
 ajax.delete({
    url: api.Api.delMiddleTable,
    data: { // data参数为空时不用写
      id: 10,
      name: ''
    }
    cb: res => {
      console.log(res)
    }
  })
 无参数
 ajax.delete({
    url: api.Api.delMiddleTable,
    cb: res => {
      console.log(res)
    }
  })
 */

import axios from 'axios'
import axiosUtils from 'axios/lib/utils'
import base from 'base'
import router from 'common/router'

function setContentTypeIfUnset (headers, value) {
  if (!axiosUtils.isUndefined(headers) && axiosUtils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value
  }
}

axios.defaults.timeout = 100000
axios.defaults.hasGlobalSpin = true
axios.defaults.transformRequest = [function (data, headers) {
  if (axiosUtils.isObject(data)) {
    setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8')
    let keys2 = Object.keys(data)
    /* 这里就是把json变成url形式，并进行encode */
    return encodeURI(keys2.map(name => `${name}=${data[name]}`).join('&'))
  }
}]
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// http request 拦截器
axios.interceptors.request.use((config) => {
  return config
})

// http response 拦截器
axios.interceptors.response.use((res) => {
  return res
})

export default {
  // 默认参数为空配置
  _default (options) {
    options.data = options.data ? options.data : {}
    options.msg = options.msg ? options.msg : ''
  },
  // 错误日志
  _errorLog (error) {
    console.log(error)
  },
  _interceptLogin (res) {
    if (res.data.code === '40001') {
      if (base.loginPath === 'login') {
        router.app.$router.push({name: base.loginPath})
      } else {
        location.href = base.loginPath
      }
    }
  },
  get (options) {
    this._default(options)
    axios.get(options.url, options.data).then(res => {
      if (JSON.stringify(res.data) !== '{}') {
        this._interceptLogin(res)
        options.cb(res)
      }
    }).catch(error => {
      this._errorLog(error)
    })
  },
  post (options) {
    this._default(options)
    axios.post(options.url, options.data).then(res => {
      if (JSON.stringify(res.data) !== '{}') {
        this._interceptLogin(res)
        options.cb(res)
      }
    }).catch(error => {
      this._errorLog(error)
    })
  },
  delete (options) {
    this._default(options)
    axios.delete(options.url, options.data).then(res => {
      if (JSON.stringify(res.data) !== '{}') {
        this._interceptLogin(res)
        options.cb(res)
      }
    }).catch(error => {
      this._errorLog(error)
    })
  }
}
