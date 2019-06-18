/**
 * Created by tim on 2019/5/8.
 * author: Gleason
 */
'use strict'

/**
 * 开发
 */
let development = {
  type: 1,
  assetsPublicPath: '/bmalladminpresent/',
  loginPath: 'login',
  defaultRouterPath: 'home',
  proxyTableNameVersionBaseApi: process.env.VUE_APP_BASE_API,
  proxyTableNameVersionAdmin: process.env.VUE_APP_ADMIN,
  proxyTableNameImgVersion: process.env.VUE_APP_URL
}

/**
 * demo
 */
let demo = {
  type: 1,
  assetsPublicPath: '/bmalladminpresent/',
  loginPath: 'login',
  defaultRouterPath: 'home',
  proxyTableNameVersionBaseApi:  process.env.VUE_APP_BASE_API,
  proxyTableNameVersionAdmin: process.env.VUE_APP_ADMIN,
  proxyTableNameImgVersion: process.env.VUE_APP_URL
}

/**
 * 生产
 */
let production = {
  type: 1,
  assetsPublicPath: '/bmalladminpresent/',
  loginPath: 'login',
  defaultRouterPath: 'home',
  proxyTableNameVersionBaseApi:  process.env.VUE_APP_BASE_API,
  proxyTableNameVersionAdmin: process.env.VUE_APP_ADMIN,
  proxyTableNameImgVersion: process.env.VUE_APP_URL
}

let defaultConfig = null;
switch (process.env.NODE_ENV) {
  case 'development': defaultConfig = development;
    break;
  case 'demo': defaultConfig = demo;
    break;
  case 'production': defaultConfig = production;
    break;
}


module.exports = defaultConfig;