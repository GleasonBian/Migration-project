/**
 * Created by tim on 2017/10/23.
 * author: wangjialiang
 */
'use strict'

// 本地
let local = {
  type: 1,
  assetsPublicPath: '/',
  loginPath: 'login',
  defaultRouterPath: 'home',
  proxyTableNameVersionBaseApi: '/api/bmalladmin',
  proxyTableNameVersionAdmin: '/adminApi/admin',
  proxyTableNameImgVersion: 'http://192.168.1.210',
  isLocalMeun: true
}

// 开发
let development = {
  type: 1,
  assetsPublicPath: '/bmalladminpresent/',
  loginPath: 'login',
  defaultRouterPath: 'home',
  proxyTableNameVersionBaseApi: '/bmalladmin',
  proxyTableNameVersionAdmin: '/admin',
  proxyTableNameImgVersion: 'http://192.168.1.210'
}

// demo
let demo = {
  type: 1,
  assetsPublicPath: '/bmalladminpresent/',
  loginPath: 'login',
  defaultRouterPath: 'home',
  proxyTableNameVersionBaseApi: '/bmalladmin',
  proxyTableNameVersionAdmin: '/admin',
  proxyTableNameImgVersion: 'http://192.168.1.210'
}

// 生产
let production = {
  type: 1,
  assetsPublicPath: '/bmalladminpresent/',
  loginPath: 'login',
  defaultRouterPath: 'home',
  proxyTableNameVersionBaseApi: '/bmalladmin',
  proxyTableNameVersionAdmin: '/admin',
  proxyTableNameImgVersion: 'http://192.168.1.210'
}

let defaultConfig = null;
switch (process.env.NODE_ENV) {
  case 'development': defaultConfig = development;
    break;
  case 'demo': defaultConfig = demo;
    break;
  case 'production': defaultConfig = production;
    break;
  default:  defaultConfig = local;
    break;
}
module.exports = defaultConfig;