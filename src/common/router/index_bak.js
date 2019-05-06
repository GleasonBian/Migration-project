import Vue from 'vue'
import Router from 'vue-router'
import base from 'base'

/* main config */
const App = resolve => require(['components/basetemp/App'], resolve)
const Main = resolve => require(['components/basetemp/Main'], resolve)
const Login = resolve => require(['components/view/Login'], resolve)
const Home = resolve => require(['components/view/Home'], resolve)

/* module vue page */
// 商品管理
const GoodsList = resolve => require(['view/goods/List'], resolve)
const AddMeal = resolve => require(['view/goods/AddMeal'], resolve)
const SetMealManager = resolve => require(['view/goods/SetMealManager'], resolve)
const NewPhase = resolve => require(['view/goods/NewPhase'], resolve)
const SetMealDetail = resolve => require(['view/goods/SetMealDetail'], resolve)
const SetMealgoodsDetails = resolve => require(['view/goods/goodsDetails'], resolve)
// 用户管理
const UserList = resolve => require(['view/user/List'], resolve)
const BmallManager = resolve => require(['view/user/BmallManager'], resolve)
const InnerUser = resolve => require(['view/user/innerUser'], resolve)
// 采购单
const OrderSales = resolve => require(['view/order/Sales'], resolve)
const SalesRemark = resolve => require(['view/order/SalesRemark'], resolve)
const SalesDetail = resolve => require(['view/order/SalesDetail'], resolve)
const OrderPurchase = resolve => require(['view/order/Purchase'], resolve)
const PurchaseDetail = resolve => require(['view/order/PurchaseDetail'], resolve)
const PurchaseRemark = resolve => require(['view/order/PurchaseRemark'], resolve)
const PurchaseSearch = resolve => require(['view/order/PurchaseSearch'], resolve)
const PurGoodsChoice = resolve => require(['view/order/PurGoodsChoice'], resolve)
const PurPackChoice = resolve => require(['view/order/PurPackChoice'], resolve)
const PurPackChoiceMore = resolve => require(['view/order/PurPackChoiceMore'], resolve)
const PurchaseMore = resolve => require(['view/order/PurchaseMore'], resolve)
const OrderPricing = resolve => require(['view/order/Pricing'], resolve)
const PricingDetail = resolve => require(['view/order/PriceDetail'], resolve)
const PriceRemark = resolve => require(['view/order/PriceRemark'], resolve)

// 财务管理
const BeamFieldStatements = resolve => require(['view/finance/BeamFieldStatements'], resolve)
const GooodsStatements = resolve => require(['view/finance/GooodsStatements'], resolve)
const GooodsStatementsAdd = resolve => require(['view/finance/GooodsStatementsAdd'], resolve)
const GooodsStatementsView = resolve => require(['view/finance/GooodsStatementsView'], resolve)
const GooodsStatementsViewDdetails = resolve => require(['view/finance/GooodsStatementsViewDdetails'], resolve)
const GooodsStatementsEdit = resolve => require(['view/finance/GooodsStatementsEdit'], resolve)
const AddBeanmfIeldState = resolve => require(['view/finance/AddBeanmfIeldState'], resolve)
const AddBeanmfIeldStateSec = resolve => require(['view/finance/AddBeanmfIeldStateSec'], resolve)
const DetailSettlement = resolve => require(['view/finance/DetailSettlement'], resolve)
const DetailSettlementDetails = resolve => require(['view/finance/DetailSettlementDetails'], resolve)

// 系统管理
const SystemList = resolve => require(['view/system/SystemList'], resolve)
const SystemConf = resolve => require(['view/system/SystemConf'], resolve)
// 销售订单
const OrderList = resolve => require(['view/sales/Order'], resolve)
const ReturnList = resolve => require(['view/sales/Return'], resolve)
const LibraryList = resolve => require(['view/sales/Library'], resolve)
const LibraryAdd = resolve => require(['view/sales/LibraryAdd'], resolve)
const LibraryView = resolve => require(['view/sales/LibraryView'], resolve)
const PurchaseList = resolve => require(['view/sales/Purchase'], resolve)
const DeliveryAndDeliveryList = resolve => require(['view/sales/PurchaseAndDelivery'], resolve)
const AddPurchase = resolve => require(['view/sales/purchase/AddPurchase'], resolve)
const PurchaseDetails = resolve => require(['view/sales/purchase/PurchaseDetails'], resolve)
const PurchaseApply = resolve => require(['view/sales/purchase/apply'], resolve)
const PurchaseAndDeliveryDetails = resolve => require(['view/sales/purchase/PurchaseAndDeliveryDetails'], resolve)
const PurchaseAndDeliveryDetail = resolve => require(['view/sales/purchase/PurchaseAndDeliveryDetail'], resolve)
const DeliveryInfo = resolve => require(['view/sales/purchase/deliveryInfo'], resolve)
const OrderManangerDetail = resolve => require(['view/sales/ordermanager/OrderDetail'], resolve)
const NewStockOrder = resolve => require(['view/sales/ordermanager/NewStockOrder'], resolve)
const ReturnDetails = resolve => require(['view/sales/returnManager/Details'], resolve)
const ReturnGoods = resolve => require(['view/sales/returnGood/Goods'], resolve)
const ReturnGoodDetails = resolve => require(['view/sales/returnGood/Details'], resolve)
const ReturnGoodList = resolve => require(['view/sales/returnGood/List'], resolve)
const SaveSupplier = resolve => require(['view/sales/saveSupplier'], resolve)
// 运营中心
const ShowMessage = resolve => require(['view/operate/ShowMessage'], resolve)
const VersionInfor = resolve => require(['view/operate/VersionInfor'], resolve)
const CarouselFigure = resolve => require(['view/operate/CarouselFigure'], resolve)
const CarouselFigureAdd = resolve => require(['view/operate/CarouselFigureAdd'], resolve)
const CarouselFigureEdit = resolve => require(['view/operate/CarouselFigureEdit'], resolve)
const VersionInfor1 = resolve => require(['view/operate/VersionInfor1'], resolve)
const VersionInforAdd = resolve => require(['view/operate/VersionInforAdd'], resolve)
const VersionInforEdit = resolve => require(['view/operate/VersionInforEdit'], resolve)
// 采购需求管理
const DemandScene = resolve => require(['view/demand/SceneList'], resolve)
const DemandPurchase = resolve => require(['view/demand/PurchaseList'], resolve)
const DemandPurchaseDetails = resolve => require(['view/demand/PurchaseDetails'], resolve)
const AddDemand = resolve => require(['view/demand/AddDemand'], resolve)
const SceneDetails = resolve => require(['view/demand/SceneDetails'], resolve)
const DemandLibrary = resolve => require(['view/demand/Library'], resolve)
const DemandLibraryAdd = resolve => require(['view/demand/LibraryAdd'], resolve)
const DemandLibraryView = resolve => require(['view/demand/LibraryView'], resolve)
const PushPlanList = resolve => require(['view/demand/PushPlanList'], resolve)
const PushPlanDetails = resolve => require(['view/demand/PushPlanDetails'], resolve)
const SelfOrderList = resolve => require(['view/demand/SelfOrderList'], resolve)
const SelfOrderDetail = resolve => require(['view/demand/SelfOrderDetail'], resolve)
const SelfOrderNew = resolve => require(['view/demand/SelfOrderNew'], resolve)
const SelfOrderOutDetail = resolve => require(['view/demand/SelfOrderOutDetail'], resolve)
const EditDemand = resolve => require(['view/demand/EditDemand'], resolve)
// 审批看板
const BoardList = resolve => require(['view/board/List'], resolve)
// 采购计划管理
const ProcurementList = resolve => require(['view/procurement/List'], resolve)
const ProcurementSearch = resolve => require(['view/procurement/Search'], resolve)
const AddProcurement = resolve => require(['view/procurement/Add'], resolve)
const EditProcurement = resolve => require(['view/procurement/Edit'], resolve)
const DetailsProcurement = resolve => require(['view/procurement/Details'], resolve)
const PurPack = resolve => require(['view/procurement/PurPack'], resolve)
const PurGoods = resolve => require(['view/procurement/PurGoods'], resolve)
const ProcurementOrder = resolve => require(['view/procurement/Order'], resolve)
const ProcurementStockList = resolve => require(['view/procurement/StockList'], resolve)
const StockDetails = resolve => require(['view/procurement/StockDetails'], resolve)
const StockAndDeliveryDetails = resolve => require(['view/procurement/StockAndDeliveryDetails'], resolve)
const StockAndDeliveryDetail = resolve => require(['view/procurement/StockAndDeliveryDetail'], resolve)
const StockInfo = resolve => require(['view/procurement/StockInfo'], resolve)
const ReceiptList = resolve => require(['view/procurement/ReceiptList'], resolve)
const ReceiptDetail = resolve => require(['view/procurement/ReceiptDetail'], resolve)

Vue.use(Router)

let router = new Router({
  routes: [{
    path: '/',
    component: App,
    meta: {
      menu: true
    },
    children: [{
      path: '',
      code: '0500',
      component: Main,
      meta: {
        requirePath: true,
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: '',
          name: 'home',
          code: '050010',
          component: Home,
          meta: {
            requirePath: true,
            menu: true,
            title: '欢迎访问中台'
          }
        }]
      }]
    }, {
      path: 'user',
      code: '0607',
      component: Main,
      meta: {
        requirePath: true,
        title: '用户管理',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'userList',
          name: 'userList',
          code: '060701',
          component: UserList,
          meta: {
            requirePath: true,
            menu: true,
            title: '梁场用户'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'bmallManager',
          name: 'BmallManager',
          code: '060703',
          component: BmallManager,
          meta: {
            requirePath: true,
            menu: true,
            title: '梁场管理'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'innerUser',
          name: 'InnerUser',
          code: '060702',
          component: InnerUser,
          meta: {
            requirePath: true,
            menu: true,
            title: '内部用户'
          }
        }]
      }]
    }, {
      path: 'sales',
      code: '0605',
      component: Main,
      meta: {
        requirePath: true,
        title: '销售管理',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'orderList',
          name: 'orderList',
          code: '060501',
          component: OrderList,
          meta: {
            requirePath: true,
            menu: true,
            title: '订单管理'
          }
        }, {
          path: 'orderManangerDetail/:id',
          name: 'orderManangerDetail',
          component: OrderManangerDetail,
          meta: {
            requirePath: true,
            title: '订单详情'
          }
        }, {
          path: 'newStockOrder/:id',
          name: 'newStockOrder',
          component: NewStockOrder,
          meta: {
            requirePath: true,
            title: '申请进货订单'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'returnList',
          name: 'returnList',
          code: '060502',
          component: ReturnList,
          meta: {
            requirePath: true,
            menu: true,
            title: '梁场退换货'
          }
        }, {
          path: 'returnDetails/:state/:id/:type',
          name: 'returnDetails',
          component: ReturnDetails,
          meta: {
            requirePath: true,
            title: '梁场退换货详情'
          }
        }, {
          path: 'returnGoods/:orderId/:returnTypeCode',
          name: 'returnGoods',
          component: ReturnGoods,
          meta: {
            requirePath: true,
            title: '向供应商退货'
          }
        }, {
          path: 'saveSupplier',
          name: 'saveSupplier',
          component: SaveSupplier,
          meta: {
            requirePath: true,
            title: '提交完成'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'returnGoodList',
          name: 'returnGoodList',
          code: '060502',
          component: ReturnGoodList,
          meta: {
            requirePath: true,
            menu: true,
            title: '供应商退换货'
          }
        }, {
          path: 'returnGoodDetails/:state/:id/:type',
          name: 'returnGoodDetails',
          component: ReturnGoodDetails,
          meta: {
            requirePath: true,
            title: '供应商退换货详情'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'libraryList',
          name: 'libraryList',
          code: '060503',
          component: LibraryList,
          meta: {
            requirePath: true,
            menu: true,
            title: '供应验收单'
          }
        }, {
          path: 'libraryAdd/:id/:orderCode',
          name: 'libraryAdd',
          component: LibraryAdd,
          meta: {
            requirePath: true,
            title: '创建出库单'
          }
        }, {
          path: 'libraryView/:id',
          name: 'libraryView',
          component: LibraryView,
          meta: {
            requirePath: true,
            title: '查看出库单'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'purchaseList',
          name: 'purchaseList',
          code: '060504',
          component: PurchaseList,
          meta: {
            requirePath: true,
            menu: true,
            title: '进货单管理'
          }
        }, {
          path: 'addPurchase',
          name: 'addPurchase',
          component: AddPurchase,
          meta: {
            requirePath: true,
            title: '新增进货单'
          }
        }, {
          path: 'purchaseDetails/:id',
          name: 'purchaseDetails',
          component: PurchaseDetails,
          meta: {
            requirePath: true,
            title: '进货单详情'
          }
        }, {
          path: 'purchaseAndDeliveryDetails/:id',
          name: 'purchaseAndDeliveryDetails',
          component: PurchaseAndDeliveryDetails,
          meta: {
            requirePath: true,
            title: '进货发货单详情'
          }
        }, {
          path: 'deliveryInfo/:id',
          name: 'deliveryInfo',
          component: DeliveryInfo,
          meta: {
            requirePath: true,
            title: '发货'
          }
        }, {
          path: 'purchaseApply/:id/:code',
          name: 'purchaseApply',
          component: PurchaseApply,
          meta: {
            requirePath: true,
            title: '申请'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'deliveryAndDeliveryList',
          name: 'deliveryAndDeliveryList',
          code: '060505',
          component: DeliveryAndDeliveryList,
          meta: {
            requirePath: true,
            menu: true,
            title: '收货单'
          }
        }, {
          path: 'purchaseAndDeliveryDetail/:id',
          name: 'purchaseAndDeliveryDetail',
          component: PurchaseAndDeliveryDetail,
          meta: {
            requirePath: true,
            title: '进货发货单详情'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'orderSales',
          name: 'orderSales',
          code: '060203',
          component: OrderSales,
          meta: {
            requirePath: true,
            menu: true,
            title: '销售价格'
          }
        }, {
          path: 'salesRemark/:id',
          name: 'salesRemark',
          component: SalesRemark,
          meta: {
            requirePath: true,
            title: '开始配货'
          }
        }, {
          path: 'salesDetail/:id',
          name: 'salesDetail',
          component: SalesDetail,
          meta: {
            requirePath: true,
            title: '详情'
          }
        }]
      }]
    }, {
      path: 'goods',
      code: '0601',
      component: Main,
      meta: {
        requirePath: true,
        title: '商品管理',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: '',
          name: 'goodsList',
          code: '060102',
          component: GoodsList,
          meta: {
            requirePath: true,
            menu: true,
            title: '套餐管理'
          }
        }, {
          path: '/addmeal/:state/:id',
          name: 'addmeal',
          component: AddMeal,
          meta: {
            requirePath: true,
            title: '新增套餐'
          }
        }, {
          path: '/setmealmanager',
          name: 'setmealmanager',
          component: SetMealManager,
          meta: {
            requirePath: true,
            title: '套餐阶段管理'
          }
        }, {
          path: '/newphase/:state/:id',
          name: 'newphase',
          component: NewPhase,
          meta: {
            requirePath: true,
            title: '新建阶段'
          }
        }, {
          path: '/setmealdetail/:id',
          name: 'setmealdetail',
          component: SetMealDetail,
          meta: {
            requirePath: true,
            title: '阶段详情'
          }
        }, {
          path: '/goodsDetails/:id',
          name: 'goodsDetails',
          component: SetMealgoodsDetails,
          meta: {
            requirePath: true,
            title: '套餐详情'
          }
        }]
      }]
    }, {
      path: 'order',
      code: '0602',
      component: Main,
      meta: {
        requirePath: true,
        title: '采购单',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'orderPricing',
          name: 'orderPricing',
          code: '060201',
          component: OrderPricing,
          meta: {
            requirePath: true,
            menu: true,
            title: '定价分析'
          }
        }, {
          path: 'pricingDetail/:id',
          name: 'pricingDetail',
          component: PricingDetail,
          meta: {
            requirePath: true,
            title: '定价详情'
          }
        }, {
          path: 'pricingRemark/:id',
          name: 'pricingRemark',
          component: PriceRemark,
          meta: {
            requirePath: true,
            title: '定价说明'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'orderPurchase',
          name: 'orderPurchase',
          code: '060202',
          component: OrderPurchase,
          meta: {
            requirePath: true,
            menu: true,
            title: '进货价格'
          }
        }, {
          path: 'purchaseDetail/:id',
          name: 'purchaseDetail',
          component: PurchaseDetail,
          meta: {
            requirePath: true,
            title: '进货详情'
          }
        }, {
          path: 'purchaseRemark/:id',
          name: 'purchaseRemark',
          component: PurchaseRemark,
          meta: {
            requirePath: true,
            title: '填写进货价'
          }
        }, {
          path: 'purchaseSearch/:id',
          name: 'purchaseSearch',
          component: PurchaseSearch,
          meta: {
            requirePath: true,
            title: '发起询价'
          }
        }, {
          path: 'purchaseMore/:id',
          name: 'purchaseMore',
          component: PurchaseMore,
          meta: {
            requirePath: true,
            title: '查看更多'
          }
        }, {
          path: 'purGoodsChoice/:id',
          name: 'purGoodsChoice',
          component: PurGoodsChoice,
          meta: {
            requirePath: true,
            title: '分物资选择'
          }
        }, {
          path: 'purPackChoice/:id',
          name: 'purPackChoice',
          component: PurPackChoice,
          meta: {
            requirePath: true,
            title: '分物资选择'
          }
        }, {
          path: 'purPackChoiceMore/:id',
          name: 'purPackChoiceMore',
          component: PurPackChoiceMore,
          meta: {
            requirePath: true,
            title: '分物资选择'
          }
        }]
      }]
    }, {
      path: 'financial',
      code: '0603',
      component: Main,
      meta: {
        requirePath: true,
        title: '财务管理',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'beamFieldStatements',
          name: 'beamFieldStatements',
          code: '060301',
          component: BeamFieldStatements,
          meta: {
            requirePath: true,
            menu: true,
            title: '梁场结算单'
          }
        }, {
          path: 'addBeanmfIeldState/:id',
          name: 'addBeanmfIeldState',
          component: AddBeanmfIeldState,
          meta: {
            requirePath: false,
            title: '新增梁场结算单'
          }
        }, {
          path: 'addBeanmfIeldStateSec/:data',
          name: 'addBeanmfIeldStateSec',
          component: AddBeanmfIeldStateSec,
          meta: {
            requirePath: false,
            title: '新增梁场结算单'
          }
        }, {
          path: 'detailSettlement/:settlementId/:orderIds',
          name: 'detailSettlement',
          component: DetailSettlement,
          meta: {
            requirePath: false,
            title: '梁场结算单详情'
          }
        }, {
          path: 'detailSettlementDetails/:settlementId/:orderIds',
          name: 'detailSettlementDetails',
          component: DetailSettlementDetails,
          meta: {
            requirePath: false,
            title: '梁场结算单详情'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'gooodsStatements',
          name: 'gooodsStatements',
          code: '060302',
          component: GooodsStatements,
          meta: {
            requirePath: true,
            menu: true,
            title: '供应商结算单'
          }
        }, {
          path: 'gooodsStatementsAdd',
          name: 'gooodsStatementsAdd',
          component: GooodsStatementsAdd,
          meta: {
            requirePath: true,
            title: '新增结算单'
          }
        }, {
          path: 'gooodsStatementsView/:id',
          name: 'gooodsStatementsView',
          component: GooodsStatementsView,
          meta: {
            requirePath: true,
            title: '查看结算单'
          }
        }, {
          path: 'gooodsStatementsEdit/:id',
          name: 'gooodsStatementsEdit',
          component: GooodsStatementsEdit,
          meta: {
            requirePath: true,
            title: '编辑结算单'
          }
        }, {
          path: 'gooodsStatementsViewDdetails/:id',
          name: 'gooodsStatementsViewDdetails',
          component: GooodsStatementsViewDdetails,
          meta: {
            requirePath: true,
            title: '商家结算单详情'
          }
        }]
      }]
    }, {
      path: 'system',
      code: '0604',
      component: Main,
      meta: {
        requirePath: true,
        title: '系统管理',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'systemList',
          name: 'systemList',
          code: '060401',
          component: SystemList,
          meta: {
            requirePath: true,
            menu: true,
            title: '菜单管理'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'systemConf',
          name: 'systemConf',
          code: '060402',
          component: SystemConf,
          meta: {
            requirePath: true,
            menu: true,
            title: '菜单配置'
          }
        }]
      }]
    }, {
      path: 'operate',
      code: '0606',
      component: Main,
      meta: {
        requirePath: true,
        title: '运营中心',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'versionInfor',
          name: 'versionInfor',
          code: '060601',
          component: VersionInfor,
          meta: {
            requirePath: true,
            menu: true,
            title: '版本信息管理'
          }
        }, {
          path: 'versionInfor1/:id',
          name: 'versionInfor1',
          component: VersionInfor1,
          meta: {
            requirePath: true,
            title: '资源信息'
          }
        }, {
          path: 'versionInforAdd',
          name: 'versionInforAdd',
          component: VersionInforAdd,
          meta: {
            requirePath: true,
            title: '创建版本信息'
          }
        }, {
          path: 'versionInforEdit',
          name: 'versionInforEdit',
          component: VersionInforEdit,
          meta: {
            requirePath: true,
            title: '编辑版本信息'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'carouselFigure',
          name: 'carouselFigure',
          code: '060602',
          component: CarouselFigure,
          meta: {
            requirePath: true,
            menu: true,
            title: '轮播图设置'
          }
        }, {
          path: 'carouselFigureAdd',
          name: 'carouselFigureAdd',
          component: CarouselFigureAdd,
          meta: {
            requirePath: true,
            title: '首页管理新增'
          }
        }, {
          path: 'carouselFigureEdit/:id',
          name: 'carouselFigureEdit',
          component: CarouselFigureEdit,
          meta: {
            requirePath: true,
            title: '首页管理编辑'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'showMessage',
          name: 'showMessage',
          code: '060603',
          component: ShowMessage,
          meta: {
            requirePath: true,
            menu: true,
            title: '短信查看'
          }
        }]
      }]
    }, {
      path: 'demand',
      code: '0608',
      component: Main,
      meta: {
        requirePath: true,
        title: '采购需求管理',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'demandScene',
          name: 'demandScene',
          code: '060801',
          component: DemandScene,
          meta: {
            requirePath: true,
            menu: true,
            title: '采购需求-现场'
          }
        }, {
          path: 'addDemand',
          name: 'addDemand',
          component: AddDemand,
          meta: {
            requirePath: true,
            title: '新增需求'
          }
        }, {
          path: 'sceneDetails/:id',
          name: 'sceneDetails',
          component: SceneDetails,
          meta: {
            requirePath: true,
            title: '需求详情-现场'
          }
        }, {
          path: 'editDemand/:id',
          name: 'editDemand',
          component: EditDemand,
          meta: {
            requirePath: true,
            title: '需求详情-现场'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'demandPurchase',
          name: 'demandPurchase',
          code: '060802',
          component: DemandPurchase,
          meta: {
            requirePath: true,
            menu: true,
            title: '采购需求-采购部'
          }
        }, {
          path: 'DemandPurchaseDetails/:id',
          name: 'DemandPurchaseDetails',
          component: DemandPurchaseDetails,
          meta: {
            requirePath: true,
            title: '需求详情-采购'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'pushPlanList',
          name: 'pushPlanList',
          code: '060805',
          component: PushPlanList,
          meta: {
            requirePath: true,
            menu: true,
            title: '已推送计划'
          }
        }, {
          path: 'pushPlanDetails/:id',
          name: 'pushPlanDetails',
          component: PushPlanDetails,
          meta: {
            requirePath: true,
            title: '已推送计划详情'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'demandLibrary',
          name: 'demandLibrary',
          code: '060803',
          component: DemandLibrary,
          meta: {
            requirePath: true,
            menu: true,
            title: '供应验收单'
          }
        }, {
          path: 'demandLibraryAdd',
          name: 'demandLibraryAdd',
          component: DemandLibraryAdd,
          meta: {
            requirePath: true,
            title: '创建采购计划'
          }
        }, {
          path: 'demandLibraryView/:id',
          name: 'demandLibraryView',
          component: DemandLibraryView,
          meta: {
            requirePath: true,
            title: '配送出库单详情'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'selfOrderList',
          name: 'selfOrderList',
          code: '060804',
          component: SelfOrderList,
          meta: {
            requirePath: true,
            menu: true,
            title: '自建销售订单'
          }
        }, {
          path: 'selfOrderDetail/:id',
          name: 'selfOrderDetail',
          component: SelfOrderDetail,
          meta: {
            requirePath: true,
            title: '自建销售订单详情'
          }
        }, {
          path: 'selfOrderNew/:id',
          name: 'selfOrderNew',
          component: SelfOrderNew,
          meta: {
            requirePath: true,
            title: '新建配送出货单'
          }
        }, {
          path: 'selfOrderOutDetail/:id',
          name: 'selfOrderOutDetail',
          component: SelfOrderOutDetail,
          meta: {
            requirePath: true,
            title: '新建配送出货单'
          }
        }]
      }]
    }, {
      path: 'board',
      code: '0609',
      component: Main,
      meta: {
        requirePath: true,
        title: '审批看板',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'boardList',
          name: 'boardList',
          code: '060901',
          component: BoardList,
          meta: {
            requirePath: true,
            menu: true,
            title: '审批看板'
          }
        }]
      }]
    }, {
      path: 'procurement',
      code: '0610',
      component: Main,
      meta: {
        requirePath: true,
        title: '采购计划管理',
        icon: 'el-icon-location'
      },
      children: [{
        path: '',
        component: App,
        children: [{
          path: 'procurementList',
          name: 'procurementList',
          code: '061001',
          component: ProcurementList,
          meta: {
            requirePath: true,
            menu: true,
            title: '采购计划'
          }
        }, {
          path: 'procurementSearch/:id',
          name: 'procurementSearch',
          component: ProcurementSearch,
          meta: {
            requirePath: true,
            title: '询价'
          }
        }, {
          path: 'addProcurement',
          name: 'addProcurement',
          component: AddProcurement,
          meta: {
            requirePath: true,
            title: '新增'
          }
        }, {
          path: 'editProcurement/:id',
          name: 'editProcurement',
          component: EditProcurement,
          meta: {
            requirePath: true,
            title: '编辑'
          }
        }, {
          path: 'detailsProcurement/:id',
          name: 'detailsProcurement',
          component: DetailsProcurement,
          meta: {
            requirePath: true,
            title: '查看'
          }
        }, {
          path: 'purPackList/:id',
          name: 'purPackList',
          component: PurPack,
          meta: {
            requirePath: true,
            title: '整包报价'
          }
        }, {
          path: 'purGoodsList/:id',
          name: 'purGoodsList',
          component: PurGoods,
          meta: {
            requirePath: true,
            title: '整包报价'
          }
        }, {
          path: 'procurementOrder/:id',
          name: 'procurementOrder',
          component: ProcurementOrder,
          meta: {
            requirePath: true,
            title: '进货'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'procurementStockList',
          name: 'procurementStockList',
          component: ProcurementStockList,
          code: '061002',
          meta: {
            requirePath: true,
            menu: true,
            title: '进货单'
          }
        }, {
          path: 'stockDetails/:id',
          name: 'stockDetails',
          component: StockDetails,
          meta: {
            requirePath: true,
            title: '查看'
          }
        }, {
          path: 'stockAndDeliveryDetails/:id',
          name: 'stockAndDeliveryDetails',
          component: StockAndDeliveryDetails,
          meta: {
            requirePath: true,
            title: '收货明细'
          }
        }, {
          path: 'stockInfo/:id',
          name: 'stockInfo',
          component: StockInfo,
          meta: {
            requirePath: true,
            title: '发货'
          }
        }]
      }, {
        path: '',
        component: App,
        children: [{
          path: 'receiptList',
          name: 'receiptList',
          code: '061003',
          component: ReceiptList,
          meta: {
            requirePath: true,
            menu: true,
            title: '收货单'
          }
        }, {
          path: 'receiptDetail/:id',
          name: 'receiptDetail',
          component: ReceiptDetail,
          meta: {
            requirePath: true,
            title: '进货发货单详情'
          }
        }, {
          path: 'stockAndDeliveryDetail/:id',
          name: 'stockAndDeliveryDetail',
          component: StockAndDeliveryDetail,
          meta: {
            requirePath: true,
            title: '收货单-查看'
          }
        }]
      }]
    }]
  }, {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requirePath: false,
      title: '登录'
    }
  }, {
    path: '*',
    redirect: {name: 'home'}
  }]
})

if (base.loginPath === 'login') {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(item => item.meta.requirePath)) {
      if (router.app.$Utils.getCookie('requirePath') === '201') {
        next()
      } else {
        next({
          name: 'login'
        })
      }
    } else {
      next()
    }
  })
}

export default router
