'use strict'
/* author: wangjialiang
 * api 接口配置类
 * 使用方法:
 * import api from 'api'
 * api.Api.delMiddleTable
 * 命名参数说明：
 * 列表  listMiddleTable
 * 查询  searchMiddleTable
 * 增加  addMiddleTable
 * 删除  delMiddleTable
 * 编辑  editMiddleTable
 * 设置  setMiddleTable
 * 获取  getMiddleTable
 * ImagePre 接口配置类
 * */
import { adminApi, baseApi } from './domain'
export default {
  common: {
    uploadImage: baseApi + '/customPackage/uploadLogo' // 上传图片
  },
  baseClass: {
    baseClassJSONData: baseApi + '/baseClass/childBaseClassJSONData' // 分类
  },
  order: {
    // 定价分析
    priceList: baseApi + '/listPurchase/getListPurchaseList', // 定价分析列表
    exportQuotation: baseApi + '/listPurchase/exportQuotation?listPurchaseId=', // 导出报价单
    priceDetail: baseApi + '/listPurchase/newDistributionDetails', // price详情
    approvalListPurchase: baseApi + '/listPurchase/approvalListPurchase', // 待办-详情
    getVoucherList: baseApi + '/listPurchase/getVoucherList', // 采购单图片列表
    uploadImage: baseApi + '/listPurchase/uploadImageFile', // 采购单图片上传
    uploadImage2: baseApi + '/listPurchase/uploadImageFile2', // 采购单图片上传
    deleteVoucher: baseApi + '/listPurchase/deleteVoucher', // 采购单删除接口
    deleteVoucher2: baseApi + '/listPurchase/deleteVoucher2', // 列表删除图片接口
    saveThisPricingAnalysis: baseApi + '/listPurchase/saveThisPricingAnalysis', // 修改定价分析
    saveThisRemarkForPrice: baseApi + '/listPurchase/saveThisRemarkForPrice', // 添加备注
    updateQuotationEnum: baseApi + '/listPurchase/updateQuotationEnum', // 修改报价类型
    getQuotationEnumValues: baseApi + '/listPurchase/getQuotationEnumValues', // 报价类型枚举
    downloadrelatedFile: baseApi + '/relatedFile/downloadrelatedFile', // 下载文件
    deleteListPurchaseGoodsById: baseApi + '/listPurchase/deleteListPurchaseGoodsById', // 删除一条商品
    oneKeyAllocation: baseApi + '/listPurchase/oneKeyAllocation', // 一键配货
    deleteListPurchase: baseApi + '/listPurchase/delete', // 一键配货
    deleteListPurchaseList: baseApi + '/listPurchase/deleteListPurchase', // 删除采购清单
    deletePurchasePlan: baseApi + '/purchasePlan/deletePurchasePlan', // 删除采购计划
    closePurchaseLan: baseApi + '/purchasePlan/closePurchaseLan', // 关闭采购计划
    deleteGoods: baseApi + '/purchasePlan/deleteGoods', // 删除采购计划商品
    updatePricePlan: baseApi + '/purchasePlan/updatePrice', // 修改采购计划物资价格
    updateTaxPoint: baseApi + '/purchasePlan/updateTaxPoint', // 修改采购计划税点
    updatePrice: baseApi + '/listPurchase/updatePrice', // 修改采购单物资价格
    repairOrderAllocated: baseApi + '/listPurchase/repairOrderAllocated', // 补单配货

    // 进货价格
    newStartQuotation: baseApi + '/quotation/newStartQuotation', // 进货价格发起询价详情
    loadEnterpriseData: baseApi + '/enterprise/loadEnterpriseData', // 供应商列表
    appointCompanyQuotation: baseApi + '/quotation/appointCompanyQuotation', // 添加供应商
    newQuotationDetail: baseApi + '/quotation/newQuotationDetail', // 查看更多
    downloadTemplate: baseApi + '/quotation/downloadTemplate', // 文件下载
    importExcelOnePurchase: baseApi + '/quotation/importExcelOnePurchase', // 文件上传
    updateQuotation: baseApi + '/quotation/updateQuotation', // 保存更新采购单
    newBidQuotationByGoodsList: baseApi + '/quotation/newBidQuotationByGoodsList', // 分物资选择供应商
    saveBidQuotationByGoods: baseApi + '/quotation/saveBidQuotationByGoods', // 分物资选择供应商
    newBidQuotationByCompanyList: baseApi + '/quotation/newBidQuotationByCompanyList', // 整包报价列表
    saveBidQuotationByCompany: baseApi + '/quotation/saveBidQuotationByCompany', // 整包报价保存
    newBidQuotationByCompanyDetail: baseApi + '/quotation/newBidQuotationByCompanyDetail', // 整包选择报价详情
    updateQuotationGoodsTxaPoint: baseApi + '/quotation/updateQuotationGoodsTxaPoint', // 税点
    updateQuotationReason: baseApi + '/quotation/updateQuotationReason', // 中标理由
    updateQuotationGoodsPrice: baseApi + '/quotation/updateQuotationGoodsPrice', // 更新报价
    downloadQuotationTemplate: baseApi + '/quotation/downloadQuotationTemplate', // 下载供应商报价单模板
    imporQuotationTemplate: baseApi + '/quotation/imporQuotationTemplate', // 供应商报价导入
    // 销售价格
    priceRecord: baseApi + '/listPurchase/priceRecord', // 销售明细
    purchaseNoDeliveryGoodsList: baseApi + '/purchasePlan/purchaseNoDeliveryGoodsList', // 采购部-未送货物资-更多
    purchaseNoDeliveryGoodsThird: baseApi + '/purchasePlan/purchaseNoDeliveryGoodsThird', // 采购部-未送货物资
    sceneNoDeliveryGoodsList: baseApi + '/listPurchase/sceneNoDeliveryGoodsList', // 现场-未收货物资-更多
    sceneNoDeliveryGoodsThird: baseApi + '/listPurchase/sceneNoDeliveryGoodsThird', // 现场-未收货物资
    confirmApplicaForm: baseApi + '/applicaForm/confirmApplicaForm', // 确认验收
    updateApplicaFormGoodsCollectionQuantit: baseApi + '/applicaForm/updateApplicaFormGoodsCollectionQuantity', // 实收数量
    approval: baseApi + '/workflowTask/approval', // 审批意见
    getForAuditPurchasePlanList: baseApi + '/purchasePlan/getForAuditPurchasePlanList', // 采购定价
    getForAuditListPurchaseList: baseApi + '/listPurchase/getForAuditListPurchaseList', // 销售定价
    submitInnerAudit: baseApi + '/listPurchase/submitInnerAudit', // 发起内部审批
    listHistoryCommentInner: baseApi + '/listPurchase/listHistoryCommentInner', // 内部审批记录
    addListPurchaseGoods: baseApi + '/listPurchase/addListPurchaseGoods', // 新增物资
    updatePurchaseGoodsById: baseApi + '/listPurchase/updatePurchaseGoodsById', // 编辑物资
    saveSaleGuidancePrice: baseApi + '/listPurchase/saveSaleGuidancePrice', // 销售指导价
    savePriceCompost: baseApi + '/listPurchase/savePriceCompost', // 修改价格组成
    saveSellingPriceFun: baseApi + '/listPurchase/saveSellingPriceFun', // 修改价格
    associatedGoodsInfo: baseApi + '/listPurchase/associatedGoodsInfo', // 关联商品方法
    saveThisStockPrice: baseApi + '/listPurchase/saveThisStockPrice', // 修改进货价格
    createOrder: baseApi + '/listPurchase/createOrder', // 生成订单
    createFormalOrder: baseApi + '/listPurchase/createFormalOrder', // 生成订单(待确认)
    goodsList: baseApi + '/listPurchase/findGoodsGroupByNameAndBrand', // 商品列表
    addGoodItem: baseApi + '/listPurchase/findGoodsGroupByNameAndBrand', // 添加一条商品记录
    listPurchase: baseApi + '/listPurchase/listPurchase', // 采购清单
    listPurchaseByPager: baseApi + '/listPurchase/listPurchaseByPager', // 分页查询采购清单商品
    pushSuppliers: baseApi + '/quotation/pushSuppliers', // 选择推送供应商
    closeQuotation: baseApi + '/quotation/closeQuotation', // 关闭询价
    winTheBidGoods: baseApi + '/quotation/winTheBidGoods', // 分物资选择供应商
    cancel: baseApi + '/quotation/cancel', // 分物资选择供应商-取消
    savePush: baseApi + '/listPurchase/subAllListPurchaseGoodsRecommend ', // 保存并推送
    listHistoryComment: baseApi + '/listPurchase/listHistoryComment ' // 保存并推送
  },
  login: {
    checkOriginalPassword: adminApi + '/user/checkOriginalPassword', // 校验原密码是否正确
    modifyUserPassword: adminApi + '/user/modifyUserPassword', // 修改用户密码
    ajaxLoginCheck: adminApi + '/ajaxLoginCheck', // 登录
    getCurrentUser: adminApi + '/user/getCurrentUser', // 获取用户信息
    getUserPermission: adminApi + '/user/getUserPermission', // 用户权限
    getPageElement: adminApi + '/user/getPageElement', // 用户权限
    getSystem: adminApi + '/user/getSystem', // 顶部公用菜单
    logout: adminApi + '/logout' // 退出登录
  },
  user: {
    listInvoice: baseApi + '/invoice/findInvoiceByPage', // 发票列表
    addOrUpdateInvoice: baseApi + '/invoice/addOrUpdateInvoice', // 添加Or编辑普通发票
    addOrUpdateZInvoice: baseApi + '/invoice/addOrUpdateZInvoice', // 添加Or编辑增值税发票
    delete: baseApi + '/invoice/delete', // 删除发票信息
    saveProjectUserRelationList: baseApi + '/projectManagement/saveProjectUserRelationList', // 保存梁场用户关系
    deleteProjectUserRelationByIdList: baseApi + '/projectManagement/deleteProjectUserRelationByIdList', // 删除梁场用户关系
    loadProjectUserRelationList: baseApi + '/projectManagement/loadProjectUserRelationList', // 分页加载梁场用户关系
    userListPage: adminApi + '/user/userListPage', // 分页加载用户列表
    loadUserInfoQueryData: baseApi + '/userInfoQuery/loadUserInfoQueryData', // 分页查询用户
    loadAllCompany: baseApi + '/userInfoQuery/loadAllCompany', // 选择企业
    saveOrUpdate: baseApi + '/userInfoQuery/saveOrUpdateSupplier', // 添加用户 // 编辑
    getFrontRoleEnum: baseApi + '/userInfoQuery/getFrontRoleEnum', // 查询角色状态集合
    checkPhone: baseApi + '/userInfoQuery/checkPhone', // 校验用户是否已存在
    getUserByUserVO: baseApi + '/userInfoQuery/getUserByUserVO', // 编辑校验用户是否已存在
    findUserById: baseApi + '/userInfoQuery/findUserById', // 查看
    getPositionStateEnum: baseApi + '/userInfoQuery/getPositionStateEnum', // 查询职位状态
    getUserTypeEnum: baseApi + '/userInfoQuery/getUserTypeEnum', // 查询用户类型
    revertPwd: baseApi + '/userInfoQuery/revertPwd', // 重置密码
    updateAccountStatus: baseApi + '/userInfoQuery/updateAccountStatus', // 更改用户状态
    getSupplierManager: baseApi + '/userInfoQuery/getSupplierManager', // 查询企业
    setCompany: baseApi + '/userInfoQuery/setCompany', // 设置企业
    projectList: baseApi + '/projectManagement/projectList', // 梁场管理
    areaList: baseApi + '/area/children.json', // 梁场管理=>区域下拉框
    getProjectStatus: baseApi + '/projectManagement/getProjectStatus', // 梁场管理-梁场状态
    createProject: baseApi + '/projectManagement/createProject', // 梁场管理-新增梁场
    updateProject: baseApi + '/projectManagement/updateProject', // 梁场管理-编辑梁场
    findProjectById: baseApi + '/projectManagement/findProjectById', // 梁场管理-查看梁场
    updateProjectStatus: baseApi + '/projectManagement/updateProjectStatus', // 梁场管理-完成梁场
    getProjectdByUserPhone: baseApi + '/projectManagement/getProjectdByUserPhone', // 梁场管理-校验用户是否已关联梁场
    getProjectdByUser: baseApi + '/projectManagement/getProjectdByUser', // 梁场管理-编辑校验用户是否已关联梁场
    getProjectIdByProjectName: baseApi + '/projectManagement/getProjectIdByProjectName', // 梁场管理-校验梁场名称
    getProjectByProjectVO: baseApi + '/projectManagement/getProjectByProjectVO' // 梁场管理-编辑校验梁场名称
  },
  operate: {
    clientVersioninfoData: baseApi + '/clientVersioninfo/clientVersioninfoData', // 版本信息
    uploadImage: baseApi + '/clientResourceinfo/uploadImage', // 上传资源文件
    saveResource: baseApi + '/clientResourceinfo/save', // 保存资源信息
    deleteResource: baseApi + '/clientResourceinfo/delete', // 删除资源
    updateResource: baseApi + '/clientResourceinfo/update', // 更新资源信息
    save: baseApi + '/clientVersioninfo/ajaxSave', // 创建版本信息
    update: baseApi + '/clientVersioninfo/ajaxUpdate', // 更新版本信息
    delete: baseApi + '/clientVersioninfo/delete', // 行删除
    clientResourceinfoData: baseApi + '/clientResourceinfo/clientResourceinfoData' // 资源信息
  },
  frontMenu: {
    menuList: baseApi + '/frontMenu/loadFrontMenuTree', // 菜单列表
    addMenu: baseApi + '/frontMenu/saveFrontMenu', // 添加菜单
    deleteMenu: baseApi + '/frontMenu/deleteFrontMenuChildById', // 删除菜单
    ruleList: baseApi + '/roleMenu/roleMenuListJSONDATA', // 角色列表
    ruleMenuList: baseApi + '/roleMenu/roleMenuIndexJSONDATA', // 角色对应的菜单
    saveRoleMenu: baseApi + '/roleMenu/saveRoleMenuBatch' // 批量选中角色权限
  },
  sale: {
    exportApplicaFormDetailList: baseApi + '/applicaForm/exportApplicaFormDetailList', // 导出
    confirmStockDeliver: baseApi + '/stockdeliver/confirmStockDeliver', // 确认验收
    updateStockDeliverGoodsCollectionQuantity: baseApi + '/stockdeliver/updateStockDeliverGoodsCollectionQuantity', // 实收数量
    getReplenishStockList: baseApi + '/replenishStock/getReplenishStockList', // 销售订单-进货单列表
    gotoReplenishStockDetail: baseApi + '/replenishStock/gotoReplenishStockDetail', // 销售订单-进货单详情
    toStockDeliverDetails: baseApi + '/stockdeliver/toStockDeliverDetails', // 销售订单-进货单管理-进货发货单详情s
    toApplyStockDeliver: baseApi + '/stockdeliver/toApplyStockDeliver', // 销售订单-进货单管理-申请进货发货单
    uploadImageFile: baseApi + '/stockdeliver/uploadImageFile', // 销售订单-进货单管理-进货发货单详情--上传凭证
    getVoucherList: baseApi + '/stockdeliver/getVoucherList', // 销售订单-进货单管理-进货发货单详情--凭证查看
    deleteVoucher: baseApi + '/orderManger/deleteVoucher', // 销售订单-进货单管理-进货发货单详情--删除凭证
    exportReplenishStock: baseApi + '/replenishStock/exportReplenishStock', // 销售订单-进货单管理-导出进货单信息
    exportStockDeliver: baseApi + '/stockdeliver/exportStockDeliver', // 销售订单-进货单管理-导出进货发货单信息
    createStockDeliver: baseApi + '/stockdeliver/createStockDeliver', // 销售订单-进货单管理-生成进货发货单
    loadStockDeliverPager: baseApi + '/stockdeliver/loadStockDeliverPager', // 销售订单-进货发货单管理-分页加载进货发货清单
    toStockDeliverList: baseApi + '/stockdeliver/toStockDeliverList', // 销售订单-进货发货单管理-订单状态枚举
    toStockDeliverDetail: baseApi + '/stockdeliver/toStockDeliverDetail', // 销售订单-进货发货单管理-进货发货单详情
    loadEnterpriseData: baseApi + '/enterprise/loadEnterpriseData', // 销售订单-进货发货单管理-供应商列表
    loadGoodsListData: baseApi + '/replenishStock/loadGoodsListData', // 销售订单-进货发货单管理-选择商品
    submitReplenishStock: baseApi + '/replenishStock/submitReplenishStock', // 销售订单-进货发货单管理-保存一个进货单的功能
    findWarehouseListByVO: baseApi + '/replenishStock/findWarehouseListByVO', // 销售订单-进货发货单管理-选择仓库
    queryGoodsRejectRecordPage: baseApi + '/goodsApprovalRecord/queryGoodsApprovalRecordPage', // 驳回记录列表-分页
    findMaterialList: baseApi + '/externalAudit/findMaterialList', // 创建内审单、外审单中的物资
    getExternalAuditState: baseApi + '/externalAudit/getExternalAuditState', // 审批状态
    findExternalAuditList: baseApi + '/externalAudit/findExternalAuditList', // 外审单列表
    externalAuditDetails: baseApi + '/externalAudit/details', // 外审单详情页
    saveExternalAudit: baseApi + '/externalAudit/saveExternalAudit', // 提交外审单
    listHistoryComment: baseApi + '/workflowTask/listHistoryComment', // 外审单详情页-
    findExternalAuditGoods: baseApi + '/externalAudit/findExternalAuditGoods', // 外审单详情页-商品信息
    listHistoryCommentInner: baseApi + '/workflowTask/listHistoryComment', // 外审单详情页--审批记录
    getPlanSourceState: baseApi + '/listPurchase/getPlanSourceState', // 计划转订单=>查询订单来源集合
    getOrderState: baseApi + '/orderManger/getOrderState', // 计划转订单=>查询销售订单状态集合
    saleOrderListData: baseApi + '/orderManger/saleOrderListData', // 计划转订单=>销售订单列表
    findListPurchasePagerByPush: baseApi + '/listPurchase/findListPurchasePagerByPush', // 计划转订单=>待推送计划列表
    pushAllGoods: baseApi + '/orderManger/pushAllGoods', // 计划转订单=>推送商品
    pushSelectGoods: baseApi + '/orderManger/pushSelectGoods', // 计划转订单=>选择商品推送
    againPush: baseApi + '/orderManger/againPush', // 计划转订单=>再次推送订单
    pushOrder: baseApi + '/orderManger/pushOrder', // 计划转订单=>推送单个订单
    push: baseApi + '/orderManger/push' // 计划转订单=>推送订单
  },
  returnForm: {
    returnFormList: baseApi + '/returnForm/returnFormList', // 退换货列表
    auditReturnForm: baseApi + '/returnForm/auditReturnForm', // 审核退换货申请
    toReturnFormDetail: baseApi + '/returnForm/toReturnFormDetail', // 通过退换货清单Id获取退换货详情
    pushOrder: baseApi + '/returnForm/pushOrder', // 梁场换货 - 推送订单
    getStockDeliverByOrderId: baseApi + '/stockdeliver/getStockDeliverByOrderId', // 向供应商退换货
    saveSupplierReturnForm: baseApi + '/returnForm/createSupplierReturnForm', // 向供应商退换货保存
    addWayBill: baseApi + '/returnForm/addWayBill' // 填写单号
  },
  orderManger: {
    setUserPosition: baseApi + '/userInfoQuery/setUserPosition', // 职位保存
    loadUserPosition: baseApi + '/userInfoQuery/loadUserPosition', // 职位列表
    uploadImageFile: baseApi + '/orderManger/uploadImageFile', // 销售订单-订单管理列表--上传凭证
    getVoucherList: baseApi + '/orderManger/getVoucherList', // 销售订单-订单管理列表--凭证查看
    loadListData: baseApi + '/orderManger/loadListData', // 销售订单-订单管理列表
    selectLubanPushOrderList: baseApi + '/orderManger/selectLubanPushOrderList', // 销售订单-新订单列表
    getProjectList: baseApi + '/orderManger/getProjectList', // 销售订单-梁场名称
    exportOrderDetail: baseApi + '/orderManger/exportOrderDetail', // 销售订单-导出订单
    exportDeliveryOrder: baseApi + '/orderManger/exportDeliveryOrder', // 销售订单-导出发货单
    orderAllInfo: baseApi + '/orderManger/orderAllInfo', // 销售订单-查看订单详情
    gotoReplenishStock: baseApi + '/replenishStock/gotoReplenishStock', // 销售订单-进货
    saveReplenishStock: baseApi + '/replenishStock/saveReplenishStock', // 销售订单-保存进货拆单
    findGoodsClassList: baseApi + '/reconiliationGoods/findGoodsClassList' // 采购对账物资-库别的接口
  },
  customPackage: {
    getSetMealList: baseApi + '/customPackage/getSetMealList',
    getAllPhaselist: baseApi + '/customPackage/getAllPhaselist',
    disableSetMealById: baseApi + '/customPackage/disableSetMealById', // 下架套餐
    deletedSetMealById: baseApi + '/customPackage/deletedSetMealById', // 删除套餐
    enableSetMealById: baseApi + '/customPackage/enableSetMealById', // 上架套餐
    createSetMeal: baseApi + '/customPackage/createSetMeal', // 新建套餐,物理创建，逻辑删除
    deleteMealGoodsClassifyById: baseApi + '/customPackage/deleteMealGoodsClassifyById', // 删除套餐分类信息
    addNewClass: baseApi + '/customPackage/addNewClass', // 删除套餐分类信息
    editClass: baseApi + '/customPackage/editClass', // 修改套餐分类信息
    findGoodsGroupByNameAndBrand: baseApi + '/customPackage/findGoodsGroupByNameAndBrand', // 查询商品系类及其商
    saveClassGoods: baseApi + '/customPackage/saveClassGoods', // 保存分类和商品关系
    removeMealGoods: baseApi + '/customPackage/removeMealGoods', // 删除分类下的商品
    saveSetMeal: baseApi + '/customPackage/saveSetMeal', // 保存套餐基本信息
    getPhaseList: baseApi + '/customPackage/getPhaseList', // 查询阶段集合列表
    enabledPhase: baseApi + '/customPackage/enabledPhase', // 启用阶段
    disabledPhase: baseApi + '/customPackage/disabledPhase', // 禁用阶段
    deletedPhase: baseApi + '/customPackage/deletedPhase', // 删除阶段
    savePhase: baseApi + '/customPackage/savePhase', // 保存阶段
    uploadLogo2: baseApi + '/customPackage/uploadLogo2', // 图片上传
    getPhaseById: baseApi + '/customPackage/getPhaseById', // 根据id获取阶段
    saveEditPhase: baseApi + '/customPackage/saveEditPhase', // 保存编辑后的阶段
    getSetMealById: baseApi + '/customPackage/getSetMealById', // 保存编辑后的阶段
    changeRecommendGoodsCount: baseApi + '/customPackage/changeRecommendGoodsCount' // 保存推荐数量
  },
  smslog: {
    smslogJSONData: baseApi + '/smslog/smslogJSONData' // 加载短信日志
  },
  carousel: {
    indexPage: baseApi + '/indexPageManage/indexPageManageListJsonData', // 首页管理
    uploadImage: baseApi + '/indexPageManage/uploadImage', // 上传图片文件
    save: baseApi + '/indexPageManage/save', // 保存[首页管理]
    update: baseApi + '/indexPageManage/update', // 发布
    delete: baseApi + '/indexPageManage/delete', // 删除
    getDataById: baseApi + '/indexPageManage/getIndexPageManageById', // 根据id获取详情
    getArea: baseApi + '/indexPageManage/getIndexPageAreaTypeEnum' // 获取所在区域枚举
  },
  finance: {
    toNewSettlementDetail: baseApi + '/settlementSupplier/toNewSettlementDetail', // 通过结算单清单Id获取结算单详情
    toExamine: baseApi + '/settlementSupplier/toExamine', // 结算单审核
    exportSettlement: baseApi + '/settlementSupplier/exportSettlement', // 导出供应商结算单
    newExportSettlement: baseApi + '/settlement/exportProjectSettlement', // 导出梁场结算单
    selectExportSettlementSupplier: baseApi + '/settlementSupplier/selectExportSettlement', // 批量导出供应商结算单
    selectExportSettlement: baseApi + '/settlement/selectExportSettlement', // 批量导出梁场结算单
    loadApplyOrder: baseApi + '/settlementSupplier/loadApplyOrder', // 新增结算单list
    toApplySettlement: baseApi + '/settlementSupplier/toApplySettlement', // 新增/编辑结算单
    toNewSettlementList: baseApi + '/settlementSupplier/toNewSettlementList', // 供应商结算单，下拉菜单
    loadSettlement: baseApi + '/settlementSupplier/loadSettlement', // 分页查询结算单列
    loadListData: baseApi + '/settlement/loadListData', // 梁场结算单列表
    addOrEditList: baseApi + '/settlement/toNewApplySettlement', // 添加或者编辑取结算单信息
    addApplyOrder: baseApi + '/settlement/loadApplyOrder', // 获取结算单列表
    addSettlement: baseApi + '/settlement/addSettlement', // 生成结算单
    findInvoiceByPage: baseApi + '/invoice/findInvoiceByPage', // 发票列表
    loadApplyDetailOrder: baseApi + '/settlementSupplier/loadApplyDetailOrder', // 编辑-订单明细
    toAddSettlement: baseApi + '/settlementSupplier/addSettlement', // 保存提交编辑
    toNewApplySettlement: baseApi + '/settlementSupplier/toNewApplySettlement', // 编辑获取搜索信息[id]
    loadSettlementDetail: baseApi + '/settlement/toNewSettlementDetail', // 获取结算单详情
    loadDetailOrder: baseApi + '/settlement/loadApplyDetailOrder', // 获取订单详情
    loadSettlementGoods: baseApi + '/settlement/loadSettlementGoods', // 获取订单详情=>分页获取结算单物资
    newtoExamine: baseApi + '/settlement/toExamine', // 确认结算单
    findSettlementInvoiceRecordBySettlementId: baseApi + '/settlement/findSettlementInvoiceRecordBySettlementId', // 通过结算单Id获取发票登记记录
    findPayMoneyRecordBySettlementId: baseApi + '/settlement/findPayMoneyRecordBySettlementId', // 通过结算单Id获取付货款记录
    updateSettlementStateToFinish: baseApi + '/settlement/updateSettlementStateToFinish', // 修改结算状态为已完成
    saveSettlementInvoiceRecord: baseApi + '/settlement/saveSettlementInvoiceRecord', // 保存发票登记记录
    deletedInvoiceInformation: baseApi + '/settlement/deletedInvoiceInformation', // 发票信息删除
    updateInvoiceInformation: baseApi + '/settlement/updateInvoiceInformation', // 编辑发票信息
    savePayMoneyRecord: baseApi + '/settlement/savePayMoneyRecord', // 保存付货款记录
    updatePayMoneyRecord: baseApi + '/settlement/updatePayMoneyRecord', // 编辑付货款记录
    deletedPayMoneyRecord: baseApi + '/settlement/deletedPayMoneyRecord', // 删除付货款记录
    saveSettlement: baseApi + '/settlement/saveSettlement', // 梁场结算单=>创建结算单
    findGoodsPager: baseApi + '/signReceipt/findGoodsPager', // 梁场结算单=>待结算物资
    loadSettlementGoodsSupplier: baseApi + '/settlementSupplier/loadSettlementGoods', // 供应商结算单=>详情页
    findAccountPaymentGoods: baseApi + '/stockdeliver/findAccountPaymentGoods', // 供应商结算单=>账期付款--待结算物资
    findPresentPaymentGoods: baseApi + '/purchasePlan/findPresentPaymentGoods', // 供应商结算单=>现结付款--待结算物资
    deletedSettlementGoods: baseApi + '/settlement/deletedSettlementGoods', // 移除物资
    saveSettlementSupplier: baseApi + '/settlementSupplier/saveSettlement' // 供应商结算单=>保存/提交结算单
  },
  leaveStorage: {
    loadListData: baseApi + '/orderManger/loadListData', // 出库单列表
    createApplicaFormData: baseApi + '/orderManger/createApplicaFormData', // 出库单创建列表
    findWarehouseListByVO: baseApi + '/replenishStock/findWarehouseListByVO', // 出库单创建列表
    addApplicaForm: baseApi + '/applicaForm/addApplicaForm', // 创建一个出库单对象
    loadApplicaForm: baseApi + '/applicaForm/loadApplicaForm', // 申请配送发货单列表
    loadApplicaFormGoodsData: baseApi + '/applicaForm/loadApplicaFormGoodsData', // 加载每一个出库单的商品信息列表
    exportApplicaFormDetail: baseApi + '/applicaForm/exportApplicaFormDetail', // 导出出库申请单
    getVoucherList: baseApi + '/orderManger/getVoucherList', // 凭证查看
    uploadImageFile: baseApi + '/applicaForm/uploadImageFile', // 上传签字发货单
    deleteVoucher: baseApi + '/orderManger/deleteVoucher' // 删除
  },
  demand: {
    loadListData: baseApi + '/orderManger/loadListData', // 自建销售订单列表
    getProjectList: baseApi + '/orderManger/getProjectList', // 获取梁场列表
    createApplicaFormData: baseApi + '/orderManger/createApplicaFormData', // 申请配送发货单信息列表
    addApplicaForm: baseApi + '/applicaForm/addApplicaForm', // 创建一个出库单
    initPurchaseRequestId: baseApi + '/purchaseRequest/initPurchaseRequestId', // 初始化的采购需求id
    getPurchaseRequestState: baseApi + '/purchaseRequest/getPurchaseRequestState', // 查询采购状态集合
    getPagePurchaserList: baseApi + '/purchaseRequest/getPagePurchaserList', // 分页查询采购人员列表
    getPagePurchaseRequestList: baseApi + '/purchaseRequest/getPagePurchaseRequestList', // 查询采购需求列表
    savePurchaseRequest: baseApi + '/purchaseRequest/savePurchaseRequest', // 保存采购需求
    updatePurchaseRequest: baseApi + '/purchaseRequest/updatePurchaseRequest', // 更新采购需求
    uploadFilePurchaser: baseApi + '/purchaseRequest/uploadFile', // 上传采购需求文件
    deletedFile: baseApi + '/purchaseRequest/deletedFile', // 删除采购需求文件
    transferToListPurchaseById: baseApi + '/purchaseRequest/transferToListPurchaseById', // 将采购需求转化为采购清单
    loadApplicaFormListByPager: baseApi + '/applicaForm/loadApplicaFormListByPager', // 分页加载出库单列表
    loadWarehouseList: baseApi + '/applicaForm/loadWarehouseList', // 获取仓库列表
    loadApplicaStateList: baseApi + '/applicaForm/loadApplicaStateList', // 获取出库单状态列表
    findGoodsGroupByNameAndBrand: baseApi + '/purchaseRequest/findGoodsGroupByNameAndBrand', // 查询商品系类及其商品
    getPurchaseRequestById: baseApi + '/purchaseRequest/getPurchaseRequestById', // 根据id查询采购需求详情
    cancelledPurchaseRequestByIds: baseApi + '/purchaseRequest/cancelledPurchaseRequestByIds', // 查看出库单
    findApplicaForm: baseApi + '/applicaForm/findApplicaForm', // 查看出库单
    loadPurchaseUserInfoByPage: baseApi + '/userInfoQuery/loadPurchaseUserInfoByPage', // 分页查询采购员信息
    loadPurchaseUserInfoByProjecId: baseApi + '/userInfoQuery/loadPurchaseUserInfoByProjecId', // 通过梁场id获取当前梁场下采购员
    findApplicaFormListByProjectId: baseApi + '/applicaForm/findApplicaFormListByProjectId', // 通过梁场id批量获取出库单
    formatApplicaFormList: baseApi + '/applicaForm/formatApplicaFormList', // 选中出库单格式化
    createListPurchase: baseApi + '/applicaForm/createListPurchase', // 生成采购清单
    doLinkGoods: baseApi + '/purchaseRequest/doLinkGoods', // 为手动录入的商品关联商品库商品
    updatePurchaseRequestGoods: baseApi + '/purchaseRequest/updatePurchaseRequestGoods', // 更新采购商品信息（目前只更新价格)
    savePurchaseRequestAudit: baseApi + '/purchaseRequest/savePurchaseRequestAudit', // 保存驳回意见
    purchaseRequestToOrderForm: baseApi + '/purchaseRequest/purchaseRequestToOrderForm', // 需求清单转化为采购订单
    forcedClosure: baseApi + '/listPurchase/forcedClosure', // 强制关闭已推送计划
    downloadPurchaseRequestGoodsTemplate: baseApi + '/purchaseRequest/downloadPurchaseRequestGoodsTemplate', // 采购需求商品模模板下载
    importExcelPurchaseRequestGoods: baseApi + '/purchaseRequest/importExcelPurchaseRequestGoods', // 采购需求导入商品
    getAreaInfo: baseApi + '/purchaseRequest/getAreaInfo', // 商品区域列表
    exportPurchaseRequesBuyId: baseApi + '/purchaseRequest/exportPurchaseRequesBuyId' // 导出
  },
  board: {
    findProjectSettlement: baseApi + '/purchasePlan/findProjectSettlement', // 供应商结算
    pfindProjectSettlement: baseApi + '/listPurchase/findProjectSettlement', // 梁场结算
    buyerReport: baseApi + '/listPurchase/buyerReport', // 审批看板
    getProjectByNo: baseApi + '/board/getProjectByNo', // 梁场=>根据code值获取梁场
    listPurchase: baseApi + '/board/listPurchase', // 梁场=>采购单返回
    purchasePlan: baseApi + '/board/purchasePlan', // 梁场=>采购计划返回
    manageBoard: baseApi + '/board/manageBoard', // 梁场=>经营看板
    totalPerformancePager: baseApi + '/kanban/totalPerformancePager', // 梁场=>绩效
    totalPerformanceDetailPager: baseApi + '/kanban/totalPerformanceDetailPager', // 梁场=>绩效详情
    profitPager: baseApi + '/kanban/profitPager', // 中台经营看板经营概况
    exportGoodsDetail: baseApi + '/kanban/exportGoodsDetail', // 中台经营看板物资明细导出
    projectGoodsDetailPage: baseApi + '/kanban/projectGoodsDetailPage' // 中台经营看板经营概况=>物资明细
  },
  procurement: {
    supplierTypes: baseApi + '/enterprise/supplierTypes', // 企业类型
    winTheBidGoodsBatch: baseApi + '/quotation/winTheBidGoodsBatch', // 批量入围
    listForReplenishStock: baseApi + '/purchasePlan/listForReplenishStock', // 待收货列表
    updatePurchasePlanGoodsById: baseApi + '/purchasePlan/updatePurchasePlanGoodsById', // 编辑物资
    priceRecord: baseApi + '/purchasePlan/priceRecord', // 销售明细
    submitInnerAudit: baseApi + '/purchasePlan/submitForApprove', // 提交审批
    approval: baseApi + '/workflowTask/approval', // 审批
    listHistoryCommentInner: baseApi + '/purchasePlan/listHistoryCommentInner', // 审批记录
    getPurchasePlanState: baseApi + '/purchasePlan/getPurchasePlanState', // 查询采购状态集合
    updatePurchasePlan: baseApi + '/purchasePlan/updatePurchasePlan', // 修改接口
    uploadFilePurchaser: baseApi + '/purchasePlan/uploadFile', // 上传采购需求文件
    winTheBidGoods: baseApi + '/quotation/winTheBidGoods', // 入围
    purchasePlanNewBidQuotationByGoodsList: baseApi + '/quotation/purchasePlanNewBidQuotationByGoodsList', // 分物资报价
    purchasePlanNewBidQuotationByCompanyList: baseApi + '/quotation/purchasePlanNewBidQuotationByCompanyList', // 整包报价
    purchasePlanByPager: baseApi + '/purchasePlan/purchasePlanByPager', // 分页查询采购人员列表
    getPagePurchaserList: baseApi + '/purchasePlan/getPagePurchaserList', // 分页查询采购人员列表
    getPurchasePlanById: baseApi + '/purchasePlan/getPurchasePlanById', // 查询采购计划详情
    savePurchasePlan: baseApi + '/purchasePlan/savePurchasePlan', // 保存采购计划
    getPagePurchasePlanList: baseApi + '/purchasePlan/getPagePurchasePlanList', // 分页查询采购计划列表
    updateQuotationEndTime: baseApi + '/purchasePlan/updateQuotationEndTime', // 采购计划=>选择截止时间
    savePurchaseGuidancePrice: baseApi + '/purchasePlan/savePurchaseGuidancePrice', // 采购计划=>采购指导价
    getWarehouseInfo: baseApi + '/purchasePlan/getWarehouseInfo', // 获取仓库信息
    batchCreate: baseApi + '/replenishStock/batchCreate', // 批量进货
    savePurchaseGoodsRemark: baseApi + '/purchasePlan/savePurchaseGoodsRemark', // 采购计划=>备注
    savePurchaseRemark: baseApi + '/purchasePlan/savePurchaseRemark', // 采购计划=>采购备注
    returnChangeGoods: baseApi + '/purchasePlan/returnChangeGoods', // 采购计划=>退换货待选择物资
    returnOperation: baseApi + '/returnChange/returnOperation', // 采购计划=>退货操作
    changeOperation: baseApi + '/returnChange/changeOperation', // 采购计划=>换货操作
    findPageReturnChangeList: baseApi + '/returnChange/findPageReturnChangeList', // 供应商售后-退换货列表
    getById: baseApi + '/returnChange/getById', // 供应商售后-退换货详情页
    checkReturnChanageGoodsToSettlement: baseApi + '/returnChange/checkReturnChanageGoodsToSettlement', // 申请退换货校验
    waybill: baseApi + '/returnChange/waybill' // 供应商售后-运单号保存
  },
  sign: {
    findPager: baseApi + '/signReceipt/findPager', // 分页查询验收单
    getSignReceiptStateEnum: baseApi + '/signReceipt/getSignReceiptStateEnum', // 验收单状态
    detail: baseApi + '/signReceipt/detail', // 查询验收单详情--上面的头信息
    exportDetail: baseApi + '/signReceipt/exportDetail', // 验收单--导出
    findListGoods: baseApi + '/signReceipt/findListGoods', // 查询验收单物资列表
    getVoucherList: baseApi + '/signReceipt/getVoucherList', // 获取验收单文件
    uploadFile: baseApi + '/signReceipt/uploadFile', // 上传验收单文件
    deletedFile: baseApi + '/signReceipt/deletedFile', // 删除验收单文件
    updateSignReceiptGoodsSignCount: baseApi + '/signReceipt/updateSignReceiptGoodsSignCount', // 验收数量
    confirmSign: baseApi + '/signReceipt/confirmSign', // 确认签收
    findStockDeliverGoodsToSign: baseApi + '/stockdeliver/findStockDeliverGoodsToSign', // 验收单物资列表
    saveSign: baseApi + '/signReceipt/save', // 创建验收单
    stockDeliverGoodsForExport: baseApi + '/stockdeliver/stockDeliverGoodsForExport', // 财务按供应商导出已收货物资列表
    exportGoods: baseApi + '/stockdeliver/exportGoods' // 财务部按供应商导出
  },
  examine: {
    supplierReject: baseApi + '/purchasePlan/supplierReject', // 供应商驳回
    supplierApprove: baseApi + '/purchasePlan/supplierApprove', // 供应商批量审批
    tabCount: baseApi + '/purchasePlan/tabCount', // 供应商部待办数量
    todoList: baseApi + '/purchasePlan/todoList', // 供应商部待办list
    queryGoodsApprovalRecord: baseApi + '/goodsApprovalRecord/queryGoodsApprovalRecordPage', // 审批记录列表
    findListPurchaseMaterialPager: baseApi + '/listPurchase/findListPurchaseMaterialPager', // 分页查询供应链部审批事项
    findAuditRecordGoodsPager: baseApi + '/listPurchase/findAuditRecordGoodsPager', // 分页查询供应链部审批事项--驳回记录
    findListPurchaseMaterialCount: baseApi + '/listPurchase/findListPurchaseMaterialCount', // 供应链部审批事项消息条数
    findListPurchaseMaterialPagerByNode: baseApi + '/listPurchase/findListPurchaseMaterialPagerByNode', // 产品数据部--查询审批中的物资集合
    findAuditRecordGoodsPagerByNode: baseApi + '/listPurchase/findAuditRecordGoodsPagerByNode', // 产品数据部/总裁--查询已驳回/已通过的物资集合
    findListPurchaseMaterialCountByNode: baseApi + '/listPurchase/findListPurchaseMaterialCountByNode', // 产品数据部--查询审批中的物资集合统计数
    rejectListPurchaseGoods: baseApi + '/listPurchase/rejectListPurchaseGoods', // 产品数据部--驳回
    signContractGoods: baseApi + '/listPurchase/signContractGoods', // 标记合同物资
    operateListPurchaseGoodsVOS: baseApi + '/listPurchase/operateListPurchaseGoodsVOS', // 配货页面批量保存/提交
    batchInternalAudit: baseApi + '/listPurchase/batchInternalAudit', // 批量内审
    batchInternalAuditPass: baseApi + '/listPurchase/batchInternalAuditPass', // 批量通过
    findFinanceDeptMaterialPagerByNode: baseApi + '/listPurchase/findFinanceDeptMaterialPagerByNode', // 财务部--查询待审批的合同物资集合
    findRoutineMaterialPagerByNode: baseApi + '/listPurchase/findRoutineMaterialPagerByNode', // 财务部--查询待审批的常规物资集合
    findExternalMaterialPagerByNode: baseApi + '/listPurchase/findExternalMaterialPagerByNode', // 财务部--查询待审批的外审驳回物资集合
    findFinanceDeptMaterialCount: baseApi + '/listPurchase/findFinanceDeptMaterialCount', // 财务部--查询待审批的合同物资、常规物资、外审驳回物资统计数
    routineBatchInternalAuditPass: baseApi + '/listPurchase/routineBatchInternalAuditPass', // 财务部--审批的常规物资-批量通过
    findSalesAndRejectedCount: baseApi + '/listPurchase/findSalesAndRejectedCount', // 总裁--审批事项消息条数
    findPendingMaterialByNode: baseApi + '/listPurchase/findPendingMaterialByNode', // 总裁--查询待审批的合同物资
    getGrossMarginRatio: baseApi + '/listPurchase/getGrossMarginRatio' // 判断毛利率是否大于50%
  },
  statistics: {
    findMaterialsApprovalState: baseApi + '/statisticsReport/findMaterialsApprovalState', // 查询物资审批状态列表
    listSupplierPurchase: baseApi + '/purchasePlan/list', // 查询供应商采购记录列表
    gtPurchasePlanGoodsRemarkList: baseApi + '/purchasePlan/gtPurchasePlanGoodsRemarkList', // 导出供应商采购记录列表
    exportHistoryPrice: baseApi + '/listPurchase/exportHistoryPrice', // 导出销售历史价格
    salesAndPurchaseMangeList: baseApi + '/listPurchase/salesAndPurchaseMangeList', // 导出梁场审批事项
    findProjectPlanGoodsVOList: baseApi + '/purchasePlan/findProjectPlanGoodsVOList', // 导出梁场供应商采购金额
    findPurchaseAndSalesByRegion: baseApi + '/purchasePlan/findPurchaseAndSalesByRegion', // 导出各地区采购销售总金额
    exportPurchaseGoods: baseApi + '/listPurchase/exportPurchaseGoods', // 导出采购单物资明细
    ExportSceneNoDeliveryGoodsList: baseApi + '/listPurchase/ExportSceneNoDeliveryGoodsList', // 现场未收货物资导出
    findPagePurchasePlanGoodsUpdateRecordList: baseApi + '/goodsUpdateRecord/findPagePurchasePlanGoodsUpdateRecordList', // 分页查询采购计划物资修改记录列表
    findPageListPurchaseGoodsUpdateRecordList: baseApi + '/goodsUpdateRecord/findPageListPurchaseGoodsUpdateRecordList', // 分页查询采购清单物资修改记录列表
    findPageGoodsDeletedRecordList: baseApi + '/goodsUpdateRecord/findPageGoodsDeletedRecordList', // 分页查询物资删除记录列表
    getEnumValues: baseApi + '/listPurchase/getEnumValues', // 采购清单物资状态
    getEnumValuesPlan: baseApi + '/purchasePlan/getEnumValues', // 采购计划物资状态
    getGoodsDeletedRecordVOById: baseApi + '/goodsUpdateRecord/getGoodsDeletedRecordVOById', // 查询物资删除记录详情
    getPurchasePlanGoodsUpdateRecordVOById: baseApi + '/goodsUpdateRecord/getPurchasePlanGoodsUpdateRecordVOById', // 查询采购计划物资修改记录详情
    getListPurchaseGoodsUpdateRecordVOById: baseApi + '/goodsUpdateRecord/getListPurchaseGoodsUpdateRecordVOById', // 查询采购清单物资修改记录详情
    getPurchasePlanGoodsState: baseApi + '/purchasePlan/getPurchasePlanGoodsState', // 查询采购计划物资状态的集合
    getListPurchaseGoodsMaterialState: baseApi + '/listPurchase/getListPurchaseGoodsMaterialState' // 查询采购计划物资状态的集合
  },
  contractGoods: {
    list: baseApi + '/contractGoods/list', // 查询合同物资列表
    saveContractGoods: baseApi + '/contractGoods/saveContractGoods', // 保存合同物资
    importContractGoods: baseApi + '/contractGoods/importContractGoods', // 上传合同物资模板EXCEL
    deleteContractGoods: baseApi + '/contractGoods/deleteContractGoods', // 批量删除合同物资
    downloadTemplate: baseApi + '/contractGoods/downloadTemplate', // 下载合同物资模板
    purchaseReconiliationList: baseApi + '/reconiliationGoods/findPurchaseReconiliationList', // 查询采购/销售对账物资
    deletePurchaseReconiliationGoods: baseApi + '/reconiliationGoods/deletePurchaseReconiliationGoods', // 采购/销售对账物资=>批量删除
    importProcurementReconiliationGoods: baseApi + '/reconiliationGoods/importProcurementReconiliationGoods', // 采购对账物资=>批量导入
    downloadProcurementTemplate: baseApi + '/reconiliationGoods/downloadProcurementTemplate', // 采购对账物资=>下载模板
    importSaleReconiliationGoods: baseApi + '/reconiliationGoods/importSaleReconiliationGoods', // 销售对账物资=>批量导入
    downloadSalePurchaseTemplate: baseApi + '/reconiliationGoods/downloadSalePurchaseTemplate' // 销售对账物资=>下载模板
  },
  platformSettlement: {
    gysSettlementPager: baseApi + '/platformSettlement/gysSettlementPager', // 首页饼图：供应商
    gysSettlementHistogram: baseApi + '/platformSettlement/gysSettlementHistogram' // 柱状图：供应商
  },
  wisdomBeam: {
    ProjectList: baseApi + '/projectManagement/findProjectList', // 可视化看板=>获取梁场信息
    manageSummary: baseApi + '/visualization/manageSummary', // 可视化看板=>经营概括柱状图
    supplierSummary: baseApi + '/visualization/supplierSummary', // 可视化看板=>供应商概括柱状图
    salesOverview: baseApi + '/visualization/salesOverview', // 可视化看板=>销售概览柱状图
    purchaseOverview: baseApi + '/visualization/purchaseOverview', // 可视化看板=>采购概览柱状图
    projectOverview: baseApi + '/visualization/projectOverview', // 可视化看板=>梁场概览柱状图
    grossProfitRate: baseApi + '/visualization/grossProfitRate', // 可视化看板=>毛利率排名柱状图
    supplierTypeRate: baseApi + '/visualization/supplierTypeRate' // 可视化看板=>毛利率排名柱状图
  }
}
