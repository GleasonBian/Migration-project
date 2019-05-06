/**
 * Created by tim on 2017/9/6.
 * author: wangjialiang
 */
import router from 'common/router'

const getId = (id) => {
  return document.getElementById(id)
}
const getClass = (query) => {
  return document.querySelector(query)
}
const getSessionStorage = (name) => {
  return router.app.$Cache.sessionStorage(name).get(name)
}
const setSessionStorage = (name, val) => {
  let value = typeof val !== 'string' ? JSON.stringify(val) : val
  return router.app.$Cache.sessionStorage(name).set(name, value)
}
const getCookie = (name) => {
  return router.app.$Cache.cookie.get(name)
}
const setCookie = (name, val) => {
  let value = typeof val !== 'string' ? JSON.stringify(val) : val
  return router.app.$Cache.cookie.set(name, value)
}
/**
 * 分页中更新表格数据
 * @param arr 刷新表格所需要的条件
 * @param refs 当前表格
 * @param _this vue实例
 */
const pageUpdateTable = (arr, refs, _this) => {
  let obj = {}
  arr.map(item => {
    if (JSON.stringify(item) !== '{}') {
      for (let attr in item) {
        obj[attr] = item[attr]
      }
    }
  })
  _this.$bus.emit('get-table-data', obj, refs)
}

/**
 * 生成对应字段value的值
 * @param data
 * @param currentVal
 * @returns {Uint8Array | React.DetailedReactHTMLElement<React.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement> | any[] | Float64Array | Int8Array | Float32Array | any}
 */
const createVal = (data, currentVal) => {
  return data.map(item => {
    for (let s in currentVal) {
      if (s === item.prop) {
        item.value = currentVal[s]
      }
    }
    return item
  })
}

const _isObject = (obj) => {
  return obj !== null && typeof (obj) === 'object'
}
const _isPainObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
/**
 * isObect 判断当前数据是否是对像
 * _isObject 判断外层数据是否是对像
 * _isPainObject 判断数据字符串内是不是含有对像
 */
const isObect = (obj) => {
  return (_isObject(obj) === true || _isPainObject(obj) === true) ? obj : false
}

const isArray = (obj) => {
  return Array.isArray(obj)
}

/**
 * 两个正数相称,先把每个数保留两位小数再相乘，最后保留两位小数
 */
const multiplyTwo = (x, y, num = 2) => {
  if (!x || x < 0 || !y || y < 0) {
    return 0
  }
  return parseFloat(Number(x.toString().match(/^\d+(?:\.\d{0,2})?/)) * 100 * Number(y.toString().match(/^\d+(?:\.\d{0,2})?/)) * 100 / 10000).toFixed(num)
}

/**
 * 合并多个对像到目标对像
 * @param first 目标参数
 * @param second 要和并的数据对像或对像
 * @returns {object}
 */
const extend = (first, second) => {
  if (Array.isArray(second)) {
    if (second && second.length <= 0 && second !== '[]') return
    second.map(item => {
      for (let key in item) {
        first[key] = item[key]
      }
    })
  } else if (isObect(second)) {
    for (let key in second) {
      first[key] = second[key]
    }
  } else {
    return
  }
  return first
}
/**
 * 合并数组
 * @param first 目标数组
 * @param second 要合并的数组
 */
const concat = (first, second) => {
  return secondTree(first, second)
}
/**
 * 创建数组合并树
 * @param first
 * @param data
 * @returns {*}
 */
const secondTree = (first, data) => {
  if (isArray(data)) {
    data.map(item => {
      secondTree(first, item)
    })
  } else {
    first.push(data)
  }
  return first
}

const getPageElement = (str) => {
  let isShow = false
  let pageElement = getSessionStorage('pageElement').indexOf(str)
  if (pageElement !== -1) {
    isShow = true
  }
  return isShow
}

export default {
  getId,
  getClass,
  pageUpdateTable,
  getCookie,
  setCookie,
  getSessionStorage,
  setSessionStorage,
  createVal,
  isObect,
  isArray,
  multiplyTwo,
  extend,
  concat,
  getPageElement
}
export {
  getId,
  getClass,
  isArray,
  pageUpdateTable,
  getCookie,
  setCookie,
  getSessionStorage,
  setSessionStorage,
  createVal,
  isObect,
  multiplyTwo,
  extend,
  concat,
  getPageElement
}
