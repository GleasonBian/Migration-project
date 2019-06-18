'use strict'
/*!
 * consts.js v1.0.0
 * 常量列表js，主要是用来存一些常量，避免大家都各自在各个地方定义常量，便于统一管理<br>
 * 缓存的前缀和key需要注意，不能重复，所以，缓存的前缀，大家尽量按照模块名称来取，保证前缀不重复，例如登录的相关信息，前缀都用login
 * key也都在这里统一定义，这样就可以很明确的知道那些名字已经被占用了，已经存在了。
 * Author:
 * Date:
 * 使用方法：
 *        import consts from 'common/consts.js'
 *        consts.INSTANCE_ID
 */
/** **************缓存相关start*************************/
// 缓存用户名
const USERNAME = 'username'
// access_token缓存
const ACCESSTOKEN = 'access_token'

// 验证码类型
const OPERATION_TYPE = {
}
// 事件类型中心
const EVENT_TYPE = {
}
const PERMISSIONRELATIONS = {
  PROJECTNAME: 'bmalladmin'
}

const PERMISSION = {
  newInnerUser: {
    code: '00001',
    desc: '新建内部用户'
  },
  detPurchasePlan: {
    code: '06100101',
    desc: '删除采购计划'
  },
  detPurchaseList: {
    code: '06020301',
    desc: '删除采购清单'
  },
  repairOrder: {
    code: '06020307',
    desc: '采购单补单配货'
  },
  editPurchasePlan: {
    code: '06100103',
    desc: '修改采购计划价格'
  },
  editPurchasePlanPoint: {
    code: '06100104',
    desc: '修改采购计划税点'
  },
  editPurchaseList: {
    code: '06020306',
    desc: '修改采购清单价格'
  },
  replenishStockMoney: {
    code: '06100201',
    desc: '进货单金额'
  },
  stockdeliverMoney: {
    code: '06100301',
    desc: '收货单金额'
  },
  purchasePlan: {
    code: '06100102',
    desc: '采购计划编辑物资'
  },
  purchasePlanEdit: {
    code: '06100105',
    desc: '采购计划(查看)编辑物资'
  },
  editPurchase: {
    code: '06020304',
    desc: '编辑采购清单物资'
  },
  editPurchaseCW: {
    code: '06020308',
    desc: '财务编辑采购清单物资'
  },
  exportReceipt: {
    code: '06100302',
    desc: '收货单导出'
  },
  buyGoods: {
    code: '06100202',
    desc: '待进货'
  },
  exportPurchase: {
    code: '06100203',
    desc: '导出进货单'
  },
  addStatements: {
    code: '06020401',
    desc: '新增结算单'
  },
  addSupplierStatements: {
    code: '06100601',
    desc: '新增结算单（供应商）'
  },
  batchAcceptance: {
    code: '06100401',
    desc: '批量验收'
  },
  editGoodsPlanned: {
    code: '06020501',
    desc: '计划转订单编辑物资'
  },
  supplierSettlementSubmit: {
    code: '06100602',
    desc: '供应商结算单提交按钮'
  },
  beamSettlementSubmit: {
    code: '06020402',
    desc: '梁场结算单提交按钮'
  },
  supplyChainKanBan: {
    code: '06110901',
    desc: '供应链看板'
  },
  BusinessOverview: {
    code: '06110902',
    desc: '经营概览'
  },
  BeamFieldStatement: {
    code: '06110903',
    desc: '梁场结算单'
  },
  SupplierStatement: {
    code: '06110904',
    desc: '供应商结算单'
  },
  ZhangjhStatement: {
    code: '06110905',
    desc: '张吉怀TV看板'
  }
}

/** **************缓存相关end*************************/

const ERROR_CODE = {
}

export default {
  USERNAME,
  ACCESSTOKEN,
  ERROR_CODE,
  PERMISSIONRELATIONS,
  OPERATION_TYPE,
  EVENT_TYPE,
  PERMISSION
}
