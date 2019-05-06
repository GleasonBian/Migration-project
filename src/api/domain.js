'use strict'
/**
 * Created by tim on 2017/7/25.
 * domain.js v1.0.0
 * 域名配置类,分成测试和上线两种情况
 * author: wangjialiang
 * 参数说明：
 * // 判断是测试还是开发环境
 * imgPre 图片接口
 */
import base from 'base'

const baseApi = (process.env.NODE_ENV === 'production') ? base.proxyTableNameVersionBaseApi ? base.proxyTableNameVersionBaseApi : '' : base.proxyTableNameVersionBaseApi ? base.proxyTableNameVersionBaseApi : ''
const adminApi = (process.env.NODE_ENV === 'production') ? base.proxyTableNameVersionAdmin ? base.proxyTableNameVersionAdmin : '' : base.proxyTableNameVersionAdmin ? base.proxyTableNameVersionAdmin : ''
const imgApi = (process.env.NODE_ENV === 'production') ? base.proxyTableNameImgVersion ? base.proxyTableNameImgVersion : '' : base.proxyTableNameImgVersion ? base.proxyTableNameImgVersion : base.proxyTableNameImgVersion
export default {
  baseApi,
  adminApi,
  imgApi
}
export {
  baseApi,
  adminApi,
  imgApi
}
