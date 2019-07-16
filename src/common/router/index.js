import Vue from 'vue'
import Router from 'vue-router'
import base from 'base'

/* main config */
const App = resolve => require(['components/basetemp/App'], resolve)
const Main = resolve => require(['components/basetemp/Main'], resolve)
const MainEmpty = resolve =>
  require(['components/basetemp/MainEmpty'], resolve)
const Login = resolve => require(['components/view/Login'], resolve)
const Home = resolve => require(['components/view/Home'], resolve)

/* module vue page */
// 商品管理
const GoodsList = resolve => require(['view/goods/List'], resolve)
const AddMeal = resolve => require(['view/goods/AddMeal'], resolve)
const SetMealManager = resolve =>
  require(['view/goods/SetMealManager'], resolve)
const NewPhase = resolve => require(['view/goods/NewPhase'], resolve)
const SetMealDetail = resolve => require(['view/goods/SetMealDetail'], resolve)
const SetMealgoodsDetails = resolve =>
  require(['view/goods/goodsDetails'], resolve)
const ContractMaterialList = resolve =>
  require(['view/goods/ContractMaterialList'], resolve)
const PurchaseReconciliationList = resolve =>
  require(['view/goods/PurchaseReconciliationList'], resolve)
const SaleReconciliationList = resolve =>
  require(['view/goods/SaleReconciliationList'], resolve)

// 用户管理
const UserList = resolve => require(['view/user/List'], resolve)
const BmallManager = resolve => require(['view/user/BmallManager'], resolve)
const InnerUser = resolve => require(['view/user/innerUser'], resolve)
const InvoiceList = resolve => require(['view/user/InvoiceList'], resolve)

// 采购单
const OrderSales = resolve => require(['view/order/Sales'], resolve)
const SalesRemark = resolve => require(['view/order/SalesRemark'], resolve)
const SalesDetail = resolve => require(['view/order/SalesDetail'], resolve)
const SaleExternal = resolve => require(['view/order/SaleExternal'], resolve)
const AddExternal = resolve => require(['view/order/AddExternal'], resolve)
const ExternalDetails = resolve =>
  require(['view/order/ExternalDetails'], resolve)

// 财务管理
const BeamFieldStatements = resolve =>
  require(['view/finance/BeamFieldStatements'], resolve)
const GooodsStatements = resolve =>
  require(['view/finance/GooodsStatements'], resolve)
const GooodsStatementsAdd = resolve =>
  require(['view/finance/GooodsStatementsAdd'], resolve)
const GooodsStatementsView = resolve =>
  require(['view/finance/GooodsStatementsView'], resolve)
const GooodsStatementsViewDdetails = resolve =>
  require(['view/finance/GooodsStatementsViewDdetails'], resolve)
const GooodsStatementsEdit = resolve =>
  require(['view/finance/GooodsStatementsEdit'], resolve)
const AddGoodsSupplierSettlement = resolve =>
  require(['view/finance/AddGoodsSupplierSettlement'], resolve)
const AddGoodsProjectSettlement = resolve =>
  require(['view/finance/AddGoodsProjectSettlement'], resolve)
const AddBeanmfIeldState = resolve =>
  require(['view/finance/AddBeanmfIeldState'], resolve)
const AddBeanmfIeldStateSec = resolve =>
  require(['view/finance/AddBeanmfIeldStateSec'], resolve)
const EditBeamSettlement = resolve =>
  require(['view/finance/EditBeamSettlement'], resolve)
const DetailSettlement = resolve =>
  require(['view/finance/DetailSettlement'], resolve)
const DetailSettlementDetails = resolve =>
  require(['view/finance/DetailSettlementDetails'], resolve)

// 系统管理
const SystemList = resolve => require(['view/system/SystemList'], resolve)
const SystemConf = resolve => require(['view/system/SystemConf'], resolve)
// 销售订单
const OrderList = resolve => require(['view/sales/Order'], resolve)
const SaleOrder = resolve => require(['view/sales/SaleOrder'], resolve)
const OrderNewDetail = resolve =>
  require(['view/sales/ordermanager/OrderNewDetail'], resolve)
const ReturnList = resolve => require(['view/sales/Return'], resolve)
const LibraryList = resolve => require(['view/sales/Library'], resolve)
const LibraryAdd = resolve => require(['view/sales/LibraryAdd'], resolve)
const LibraryView = resolve => require(['view/sales/LibraryView'], resolve)
const OrderManangerDetail = resolve =>
  require(['view/sales/ordermanager/OrderDetail'], resolve)
const NewStockOrder = resolve =>
  require(['view/sales/ordermanager/NewStockOrder'], resolve)
const ReturnDetails = resolve =>
  require(['view/sales/returnManager/Details'], resolve)
const ReturnGoods = resolve =>
  require(['view/sales/returnGood/Goods'], resolve)
const ReturnGoodDetails = resolve =>
  require(['view/sales/returnGood/ReturnGoodDetails'], resolve)
const ExchangeGoodDetails = resolve =>
  require(['view/sales/returnGood/ExchangeGoodDetails'], resolve)
const PlannedTransferOrder = resolve =>
  require(['view/sales/PlannedTransferOrder'], resolve)
const PlannedTransferOrderDetails = resolve =>
  require(['view/sales/PlannedTransferOrderDetails'], resolve)
const PushOrderList = resolve => require(['view/sales/PushOrderList'], resolve)

const ReturnGoodList = resolve =>
  require(['view/sales/returnGood/List'], resolve)
const SaveSupplier = resolve => require(['view/sales/saveSupplier'], resolve)
// 运营中心
const ShowMessage = resolve => require(['view/operate/ShowMessage'], resolve)
const VersionInfor = resolve => require(['view/operate/VersionInfor'], resolve)
const CarouselFigure = resolve =>
  require(['view/operate/CarouselFigure'], resolve)
const CarouselFigureAdd = resolve =>
  require(['view/operate/CarouselFigureAdd'], resolve)
const CarouselFigureEdit = resolve =>
  require(['view/operate/CarouselFigureEdit'], resolve)
const VersionInfor1 = resolve =>
  require(['view/operate/VersionInfor1'], resolve)
const VersionInforAdd = resolve =>
  require(['view/operate/VersionInforAdd'], resolve)
const VersionInforEdit = resolve =>
  require(['view/operate/VersionInforEdit'], resolve)
// 采购需求管理
const DemandScene = resolve => require(['view/demand/SceneList'], resolve)
const DemandPurchase = resolve =>
  require(['view/demand/PurchaseList'], resolve)
const DemandPurchaseDetails = resolve =>
  require(['view/demand/PurchaseDetails'], resolve)
const AddDemand = resolve => require(['view/demand/AddDemand'], resolve)
const SceneDetails = resolve => require(['view/demand/SceneDetails'], resolve)
const DemandLibrary = resolve => require(['view/demand/Library'], resolve)
const DemandLibraryAdd = resolve =>
  require(['view/demand/LibraryAdd'], resolve)
const DemandLibraryView = resolve =>
  require(['view/demand/LibraryView'], resolve)
const PushPlanList = resolve => require(['view/demand/PushPlanList'], resolve)
const PushPlanDetails = resolve =>
  require(['view/demand/PushPlanDetails'], resolve)
const SelfOrderList = resolve =>
  require(['view/demand/SelfOrderList'], resolve)
const SelfOrderDetail = resolve =>
  require(['view/demand/SelfOrderDetail'], resolve)
const SelfOrderNew = resolve => require(['view/demand/SelfOrderNew'], resolve)
const SelfOrderOutDetail = resolve =>
  require(['view/demand/SelfOrderOutDetail'], resolve)
const EditDemand = resolve => require(['view/demand/EditDemand'], resolve)
// 审批看板
const BoardList = resolve => require(['view/board/List'], resolve)
// 采购计划管理
const ProcurementList = resolve => require(['view/procurement/List'], resolve)
const ProcurementSearch = resolve =>
  require(['view/procurement/Search'], resolve)
const AddProcurement = resolve => require(['view/procurement/Add'], resolve)
const EditProcurement = resolve => require(['view/procurement/Edit'], resolve)
const DetailsProcurement = resolve =>
  require(['view/procurement/Details'], resolve)
const PurPack = resolve => require(['view/procurement/PurPack'], resolve)
const PurPackListElse = resolve =>
  require(['view/procurement/PurPackListElse'], resolve)
const PurGoods = resolve => require(['view/procurement/PurGoods'], resolve)
const ProcurementOrder = resolve =>
  require(['view/procurement/Order'], resolve)
const ProcurementStockList = resolve =>
  require(['view/procurement/StockList'], resolve)
const ProcurementStayStockList = resolve =>
  require(['view/procurement/StayStockList'], resolve)

const StockDetails = resolve =>
  require(['view/procurement/StockDetails'], resolve)
const StockAndDeliveryDetails = resolve =>
  require(['view/procurement/StockAndDeliveryDetails'], resolve)
const StockAndDeliveryDetail = resolve =>
  require(['view/procurement/StockAndDeliveryDetail'], resolve)
const StockInfo = resolve => require(['view/procurement/StockInfo'], resolve)
const ReceiptList = resolve =>
  require(['view/procurement/ReceiptList'], resolve)
const ReceiptDetail = resolve =>
  require(['view/procurement/ReceiptDetail'], resolve)

const MyBoard = resolve => require(['view/board/MyBoard'], resolve)
const BeamBoard = resolve => require(['view/board/BeamBoard'], resolve)
const MoreScene = resolve => require(['view/board/MoreScene'], resolve)
const MorePurchase = resolve => require(['view/board/MorePurchase'], resolve)
const SalesDetailBoard = resolve =>
  require(['view/board/SalesDetailBoard'], resolve)
const BoardHome = resolve => require(['view/board/BoardHome'], resolve) // 经营看板
const BoardOpation = resolve => require(['view/board/BoardOpation'], resolve) // 经营看板
const BoardHomeElse = resolve => require(['view/board/BoardHomeElse'], resolve) // 经营看板-梁场
const ProfitDetails = resolve => require(['view/board/ProfitDetails'], resolve) // 经营看板=>经营概况
const ProfitDetailsElse = resolve =>
  require(['view/board/ProfitDetailsElse'], resolve) // 经营看板=>月份排名
const PurchasePerformanceDetails = resolve =>
  require(['view/board/PurchaseDetails'], resolve) // 经营看板=>采购员绩效详情
const SupplychainPerformanceDetails = resolve =>
  require(['view/board/ChainDetails'], resolve) // 经营看板=>供应链绩效详情
const SupplierPerformanceDetails = resolve =>
  require(['view/board/SupplierDetails'], resolve) // 经营看板=>供应商绩效详情
const ProfitGoodsDetails = resolve =>
  require(['view/board/ProfitGoodsDetails'], resolve) // 经营看板=>经营概况=>物资明细
const ProfitGoodsDetailsElse = resolve =>
  require(['view/board/ProfitGoodsDetailsElse'], resolve) // 经营看板=>物资明细
const PerformanceDetails = resolve =>
  require(['view/board/DetailsPerformance'], resolve) // 经营看板=>经营概况=>物资明细
const WisdomBeamBoardLeader = resolve =>
  require(['view/board/WisdomBeamBoardLeader'], resolve) // 智慧梁场管理看板（领导）
const HomeBtn = resolve => require(['view/board/HomeBtn'], resolve) // 智慧梁场管理看板（领导）
const WisdomBeamBoard = resolve =>
  require(['view/board/WisdomBeamBoard'], resolve) // 智慧梁场管理看板（员工）
const HomeButton = resolve => require(['view/board/HomeButton'], resolve) // 智慧梁场管理看板（员工）

// 批量签收单
const BatchReceiptList = resolve =>
  require(['view/batchReceipt/List'], resolve)
const BatchReceiptAdd = resolve => require(['view/batchReceipt/Add'], resolve)
const BatchReceiptDetails = resolve =>
  require(['view/batchReceipt/Details'], resolve)

// 审批事项
const SupplyChainExamine = resolve =>
  require(['view/examine/SupplyChain'], resolve) // 供应链部
const ProductDataExamine = resolve =>
  require(['view/examine/ProductData'], resolve) // 产品数据部
const FinanceExamine = resolve => require(['view/examine/Finance'], resolve) // 财务部
const CeoExamine = resolve => require(['view/examine/Ceo'], resolve) // 总裁
const FinanceExport = resolve =>
  require(['view/examine/FinanceExport'], resolve) // 财务部导出
const SupplierExamine = resolve => require(['view/examine/Supplier'], resolve) // 供应商部
const PurchaseExamine = resolve => require(['view/examine/Purchase'], resolve) // 采购部

// 统计报表
const Statistics = resolve => require(['view/statistics/Statistics'], resolve) // 统计报表
const MaterialModifyList = resolve =>
  require(['view/statistics/MaterialModifyList'], resolve) // 物资修改记录
const SupplierPurchaseList = resolve =>
  require(['view/statistics/SupplierPurchaseList'], resolve) // 供应商采购记录
const MaterialApprovalStatus = resolve =>
  require(['view/statistics/MaterialApprovalStatus'], resolve) // 物资审批状态

// 平台结算管理 platformSettlement
const PlatformSettlementList = resolve =>
  require(['view/platformSettlement/List'], resolve) // 平台结算管理
const SupplierSettlement = resolve =>
  require(['view/platformSettlement/SupplierSettlement'], resolve) // 供应商结算
const SupplierSettlementDetails = resolve =>
  require(['view/platformSettlement/SupplierSettlementDetails'], resolve) // 供应商结算详情
const ProjectSettlement = resolve =>
  require(['view/platformSettlement/ProjectSettlement'], resolve) // 梁场结算
const ProjectSettlementDetails = resolve =>
  require(['view/platformSettlement/ProjectSettlementDetails'], resolve) // 梁场结算详情

// 经营工作台->绩效考核
const principal = resolve =>
  require(['view/board/evaluation/principal'], resolve) // 采购部负责人
const attache = resolve =>
  require(['view/board/evaluation/attache'], resolve) // 采购专员
const fieldConduct = resolve =>
  require(['view/board/evaluation/fieldConduct'], resolve) // 现场实施

// 经营工作台->梁场指标
const SalesAmount = resolve =>
  require(['view/board/BeamYard/SalesAmount'], resolve) // 采购部负责人
const PurchaseAmount = resolve =>
  require(['view/board/BeamYard/PurchaseAmount'], resolve) // 采购部负责人

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      component: App,
      meta: {
        menu: true
      },
      children: [
        {
          path: 'mainEmpty',
          code: '9999',
          component: MainEmpty,
          meta: {
            requirePath: true
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'beamBoard/:type',
                  name: 'beamBoard',
                  component: BeamBoard,
                  meta: {
                    requirePath: true,
                    menu: false,
                    title: 'beam看板'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'wisdomBeamBoardLeader',
                  name: 'wisdomBeamBoardLeader',
                  component: WisdomBeamBoardLeader,
                  meta: {
                    requirePath: true,
                    menu: false,
                    title: '智慧梁场管理看板(领导)'
                  }
                },
                {
                  path: 'HomeBtn',
                  name: 'HomeBtn',
                  component: HomeBtn,
                  meta: {
                    requirePath: true,
                    menu: false,
                    title: '智慧梁场管理看板(领导)'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'wisdomBeamBoard',
                  name: 'wisdomBeamBoard',
                  component: WisdomBeamBoard,
                  meta: {
                    requirePath: true,
                    menu: false,
                    title: '智慧梁场管理看板(员工)'
                  }
                },
                {
                  path: 'HomeButton',
                  name: 'HomeButton',
                  component: HomeButton,
                  meta: {
                    requirePath: true,
                    menu: false,
                    title: '智慧梁场管理看板(员工)'
                  }
                }
              ]
            }
          ]
        },
        {
          path: '',
          code: '0500',
          component: Main,
          meta: {
            requirePath: true,
            icon: 'icon_menu_home icon_menu_btn'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: '',
                  name: 'home',
                  code: '050010',
                  component: Home,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '欢迎访问中台'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'visualizationBoard',
          code: '0611',
          component: Main,
          meta: {
            requirePath: true,
            title: '可视化看板',
            icon: 'icon_menu_visualization_board'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'boardOpation',
                  name: 'boardOpation',
                  code: '061109',
                  component: BoardOpation,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '经营工作台'
                  }
                },
                {
                  path: 'boardHome',
                  name: 'boardHome',
                  code: '06110902',
                  component: BoardHome,
                  meta: {
                    requirePath: true,
                    title: '123123'
                  }
                },
                {
                  path: 'principal',
                  name: 'principal',
                  code: '06110902',
                  component: principal,
                  meta: {
                    requirePath: true,
                    title: '绩效考核->采购负责人'
                  }
                },
                {
                  path: 'attache',
                  name: 'attache',
                  code: '06110902',
                  component: attache,
                  meta: {
                    requirePath: true,
                    title: '绩效考核->采购专员'
                  }
                },
                {
                  path: 'fieldConduct',
                  name: 'fieldConduct',
                  code: '06110902',
                  component: fieldConduct,
                  meta: {
                    requirePath: true,
                    title: '绩效考核->现场实施'
                  }
                },
                {
                  path: 'SalesAmount',
                  name: 'SalesAmount',
                  code: '06110902',
                  component: SalesAmount,
                  meta: {
                    requirePath: true,
                    title: '梁场指标->销售金额'
                  }
                },
                {
                  path: 'PurchaseAmount',
                  name: 'PurchaseAmount',
                  code: '06110902',
                  component: PurchaseAmount,
                  meta: {
                    requirePath: true,
                    title: '梁场指标->采购金额'
                  }
                },
                {
                  path: 'boardHomeElse',
                  name: 'boardHomeElse',
                  component: BoardHomeElse,
                  meta: {
                    requirePath: true,
                    title: '经营看板——梁场'
                  }
                },
                {
                  path: 'profitDetails/:id',
                  name: 'profitDetails',
                  component: ProfitDetails,
                  meta: {
                    requirePath: true,
                    title: '经营看板经营概况'
                  }
                },
                {
                  path: 'profitDetailsElse/:id/:name',
                  name: 'profitDetailsElse',
                  component: ProfitDetailsElse,
                  meta: {
                    requirePath: true,
                    title: '经营看板经营概况'
                  }
                },
                {
                  path: 'profitGoodsDetails/:id/:date/:name',
                  name: 'profitGoodsDetails',
                  component: ProfitGoodsDetails,
                  meta: {
                    requirePath: true,
                    title: '经营看板经营概况'
                  }
                },
                {
                  path: 'profitGoodsDetailsElse/:id/:name',
                  name: 'profitGoodsDetailsElse',
                  component: ProfitGoodsDetailsElse,
                  meta: {
                    requirePath: true,
                    title: '经营看板经营概况'
                  }
                },
                {
                  path: 'purchasePerformanceDetails',
                  name: 'purchasePerformanceDetails',
                  component: PurchasePerformanceDetails,
                  meta: {
                    requirePath: true,
                    title: '经营看板--采购专员绩效--更多'
                  }
                },
                {
                  path: 'supplychainPerformanceDetails',
                  name: 'supplychainPerformanceDetails',
                  component: SupplychainPerformanceDetails,
                  meta: {
                    requirePath: true,
                    title: '经营看板--供应链专员绩效--更多'
                  }
                },
                {
                  path: 'supplierPerformanceDetails',
                  name: 'supplierPerformanceDetails',
                  component: SupplierPerformanceDetails,
                  meta: {
                    requirePath: true,
                    title: '经营看板--供应商专员绩效--更多'
                  }
                },
                {
                  path: 'performanceDetails/:id/:type',
                  name: 'performanceDetails',
                  component: PerformanceDetails,
                  meta: {
                    requirePath: true,
                    title: '经营看板--绩效明细详情页'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'myBoard',
          code: '0611',
          component: Main,
          meta: {
            requirePath: true,
            title: '我的看板',
            icon: 'icon_menu_board'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'myBoard',
                  name: 'myBoard',
                  code: '061101',
                  component: MyBoard,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '我的看板'
                  }
                },
                {
                  path: 'moreScene',
                  name: 'moreScene',
                  component: MoreScene,
                  meta: {
                    requirePath: true,
                    title: '现场-未收货物资'
                  }
                },
                {
                  path: 'morePurchase',
                  name: 'morePurchase',
                  component: MorePurchase,
                  meta: {
                    requirePath: true,
                    title: '采购部-未送货物资'
                  }
                },
                {
                  path: 'salesDetailBoard/:id/:approve',
                  name: 'salesDetailBoard',
                  component: SalesDetailBoard,
                  meta: {
                    requirePath: true,
                    title: '详情'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'supplyChainExamine',
                  name: 'supplyChainExamine',
                  code: '061102',
                  component: SupplyChainExamine,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '供应链部审批事项'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'productDataExamine',
                  name: 'productDataExamine',
                  code: '061103',
                  component: ProductDataExamine,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '产品数据部审批事项'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'financeExamine',
                  name: 'financeExamine',
                  code: '061106',
                  component: FinanceExamine,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '财务部审批事项'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'ceoExamine',
                  name: 'ceoExamine',
                  code: '061108',
                  component: CeoExamine,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '总裁审批事项'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'financeExport',
                  name: 'financeExport',
                  code: '061106',
                  component: FinanceExport,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '财务部按供应商导出'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'supplierExamine',
                  name: 'supplierExamine',
                  code: '061105',
                  component: SupplierExamine,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '供应商部审批事项'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'purchaseExamine',
                  name: 'purchaseExamine',
                  code: '061104',
                  component: PurchaseExamine,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '采购部审批事项'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'user',
          code: '0607',
          component: Main,
          meta: {
            requirePath: true,
            title: '用户管理',
            icon: 'icon_menu_user'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'userList',
                  name: 'userList',
                  code: '060701',
                  component: UserList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '梁场用户'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'bmallManager',
                  name: 'BmallManager',
                  code: '060703',
                  component: BmallManager,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '梁场管理'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'innerUser',
                  name: 'InnerUser',
                  code: '060702',
                  component: InnerUser,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '内部用户'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'invoiceList',
                  name: 'InvoiceList',
                  code: '060704',
                  component: InvoiceList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '发票管理'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'sales',
          code: '0605',
          component: Main,
          meta: {
            requirePath: true,
            title: '销售管理',
            icon: 'icon_menu_sales'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'boardList',
                  name: 'boardList',
                  code: '060901',
                  component: BoardList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '审批看板'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'orderSales',
                  name: 'orderSales',
                  code: '060203',
                  component: OrderSales,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '梁场采购单'
                  }
                },
                {
                  path: 'salesRemark/:id',
                  name: 'salesRemark',
                  component: SalesRemark,
                  meta: {
                    requirePath: true,
                    title: '开始配货'
                  }
                },
                {
                  path: 'salesDetail/:id',
                  name: 'salesDetail',
                  component: SalesDetail,
                  meta: {
                    requirePath: true,
                    title: '详情'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'saleExternal',
                  name: 'saleExternal',
                  code: '060506',
                  component: SaleExternal,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '梁场审批单'
                  }
                },
                {
                  path: 'addExternal',
                  name: 'addExternal',
                  component: AddExternal,
                  meta: {
                    requirePath: true,
                    title: '创建外审单'
                  }
                },
                {
                  path: 'externalDetails/:id',
                  name: 'externalDetails',
                  component: ExternalDetails,
                  meta: {
                    requirePath: true,
                    title: '外审单详情页'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'orderList',
                  name: 'orderList',
                  code: '060501',
                  component: OrderList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '订单管理'
                  }
                },
                {
                  path: 'orderManangerDetail/:id',
                  name: 'orderManangerDetail',
                  component: OrderManangerDetail,
                  meta: {
                    requirePath: true,
                    title: '订单详情'
                  }
                },
                {
                  path: 'newStockOrder/:id',
                  name: 'newStockOrder',
                  component: NewStockOrder,
                  meta: {
                    requirePath: true,
                    title: '申请进货订单'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'saleOrder',
                  name: 'saleOrder',
                  code: '060207',
                  component: SaleOrder,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '销售订单'
                  }
                },
                {
                  path: 'orderNewDetail/:id',
                  name: 'orderNewDetail',
                  component: OrderNewDetail,
                  meta: {
                    requirePath: true,
                    title: '新订单详情'
                  }
                },
                {
                  path: 'newStockOrders/:id',
                  name: 'newStockOrders',
                  component: NewStockOrder,
                  meta: {
                    requirePath: true,
                    title: '申请进货订单'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'libraryList',
                  name: 'libraryList',
                  code: '060503',
                  component: LibraryList,
                  meta: {
                    requirePath: true,
                    menu: false,
                    title: '供应验收单'
                  }
                },
                {
                  path: 'libraryAdd/:id/:orderCode/:sign',
                  name: 'libraryAdd',
                  component: LibraryAdd,
                  meta: {
                    requirePath: true,
                    title: '创建出库单'
                  }
                },
                {
                  path: 'libraryView/:id',
                  name: 'libraryView',
                  component: LibraryView,
                  meta: {
                    requirePath: true,
                    title: '查看出库单'
                  }
                },
                {
                  path: 'demandLibraryView/:id',
                  name: 'demandLibraryView1',
                  component: DemandLibraryView,
                  meta: {
                    requirePath: true,
                    title: '配送出库单详情'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'returnList',
                  name: 'returnList',
                  code: '060502',
                  component: ReturnList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '梁场售后'
                  }
                },
                {
                  path: 'returnDetails/:state/:id/:type',
                  name: 'returnDetails',
                  component: ReturnDetails,
                  meta: {
                    requirePath: true,
                    title: '梁场售后详情'
                  }
                },
                {
                  path: 'returnGoods/:orderId/:returnTypeCode',
                  name: 'returnGoods',
                  component: ReturnGoods,
                  meta: {
                    requirePath: true,
                    title: '向供应商退货'
                  }
                },
                {
                  path: 'saveSupplier',
                  name: 'saveSupplier',
                  component: SaveSupplier,
                  meta: {
                    requirePath: true,
                    title: '提交完成'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'beamFieldStatements',
                  name: 'beamFieldStatements',
                  code: '060204',
                  component: BeamFieldStatements,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '梁场结算单'
                  }
                },
                {
                  path: 'addBeanmfIeldState',
                  name: 'addBeanmfIeldState',
                  component: AddBeanmfIeldState,
                  meta: {
                    requirePath: false,
                    title: '新增梁场结算单'
                  }
                },
                {
                  path: 'addBeanmfIeldStateSec/:data',
                  name: 'addBeanmfIeldStateSec',
                  component: AddBeanmfIeldStateSec,
                  meta: {
                    requirePath: false,
                    title: '新增梁场结算单'
                  }
                },
                {
                  path: 'editBeamSettlement/:id/:projectId',
                  name: 'editBeamSettlement',
                  component: EditBeamSettlement,
                  meta: {
                    requirePath: false,
                    title: '编辑梁场结算单'
                  }
                },
                {
                  path: 'detailSettlement/:settlementId',
                  name: 'detailSettlement',
                  component: DetailSettlement,
                  meta: {
                    requirePath: false,
                    title: '梁场结算单详情'
                  }
                },
                {
                  path: 'detailSettlementDetails/:settlementId',
                  name: 'detailSettlementDetails',
                  component: DetailSettlementDetails,
                  meta: {
                    requirePath: false,
                    title: '梁场结算单详情'
                  }
                },
                {
                  path:
                    'addGoodsProjectSettlement/:projectId/:settlementId/:invoiceId',
                  name: 'addGoodsProjectSettlement',
                  component: AddGoodsProjectSettlement,
                  meta: {
                    requirePath: true,
                    title: '编辑结算单=>新增物资'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'plannedTransferOrder',
                  name: 'plannedTransferOrder',
                  code: '060205',
                  component: PlannedTransferOrder,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '计划转订单'
                  }
                },
                {
                  path: 'plannedTransferOrderDetails/:id',
                  name: 'plannedTransferOrderDetails',
                  component: PlannedTransferOrderDetails,
                  meta: {
                    requirePath: false,
                    title: '计划转订单-详情'
                  }
                },
                {
                  path: 'pushOrderList',
                  name: 'pushOrderList',
                  component: PushOrderList,
                  meta: {
                    requirePath: false,
                    title: '计划转订单-详情-推送'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'demandLibrary',
                  name: 'demandLibrary',
                  code: '060206',
                  component: DemandLibrary,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '供应验收单'
                  }
                },
                {
                  path: 'demandLibraryAdd',
                  name: 'demandLibraryAdd',
                  component: DemandLibraryAdd,
                  meta: {
                    requirePath: true,
                    title: '创建采购计划'
                  }
                },
                {
                  path: 'demandLibraryView/:id',
                  name: 'demandLibraryView',
                  component: DemandLibraryView,
                  meta: {
                    requirePath: true,
                    title: '配送出库单详情'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'procurement',
          code: '0610',
          component: Main,
          meta: {
            requirePath: true,
            title: '进货管理',
            icon: 'icon_menu_procurement'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'procurementList',
                  name: 'procurementList',
                  code: '061001',
                  component: ProcurementList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '采购计划'
                  }
                },
                {
                  path: 'procurementSearch/:id',
                  name: 'procurementSearch',
                  component: ProcurementSearch,
                  meta: {
                    requirePath: true,
                    title: '询价'
                  }
                },
                {
                  path: 'addProcurement',
                  name: 'addProcurement',
                  component: AddProcurement,
                  meta: {
                    requirePath: true,
                    title: '新增'
                  }
                },
                {
                  path: 'editProcurement/:id',
                  name: 'editProcurement',
                  component: EditProcurement,
                  meta: {
                    requirePath: true,
                    title: '编辑'
                  }
                },
                {
                  path: 'detailsProcurement/:id',
                  name: 'detailsProcurement',
                  component: DetailsProcurement,
                  meta: {
                    requirePath: true,
                    title: '查看'
                  }
                },
                {
                  path: 'purPackList/:id',
                  name: 'purPackList',
                  component: PurPack,
                  meta: {
                    requirePath: true,
                    title: '整包报价'
                  }
                },
                {
                  path: 'purPackListElse/:id',
                  name: 'purPackListElse',
                  component: PurPackListElse,
                  meta: {
                    requirePath: true,
                    title: '按供应商查看'
                  }
                },
                {
                  path: 'purGoodsList/:id',
                  name: 'purGoodsList',
                  component: PurGoods,
                  meta: {
                    requirePath: true,
                    title: '整包报价'
                  }
                },
                {
                  path: 'procurementOrder/:id/:type',
                  name: 'procurementOrder',
                  component: ProcurementOrder,
                  meta: {
                    requirePath: true,
                    title: '进货'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'procurementStockList',
                  name: 'procurementStockList',
                  component: ProcurementStockList,
                  code: '061002',
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '进货单'
                  }
                },
                {
                  path: 'stockDetails/:id',
                  name: 'stockDetails',
                  component: StockDetails,
                  meta: {
                    requirePath: true,
                    title: '查看'
                  }
                },
                {
                  path: 'procurementStayStockList',
                  name: 'procurementStayStockList',
                  component: ProcurementStayStockList,
                  meta: {
                    requirePath: true,
                    title: '待进货'
                  }
                },
                {
                  path: 'stockAndDeliveryDetails/:id',
                  name: 'stockAndDeliveryDetails',
                  component: StockAndDeliveryDetails,
                  meta: {
                    requirePath: true,
                    title: '收货明细'
                  }
                },
                {
                  path: 'stockInfo/:id',
                  name: 'stockInfo',
                  component: StockInfo,
                  meta: {
                    requirePath: true,
                    title: '发货'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'receiptList',
                  name: 'receiptList',
                  code: '061003',
                  component: ReceiptList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '收货单'
                  }
                },
                {
                  path: 'receiptDetail/:id',
                  name: 'receiptDetail',
                  component: ReceiptDetail,
                  meta: {
                    requirePath: true,
                    title: '进货发货单详情'
                  }
                },
                {
                  path: 'stockAndDeliveryDetail/:id',
                  name: 'stockAndDeliveryDetail',
                  component: StockAndDeliveryDetail,
                  meta: {
                    requirePath: true,
                    title: '收货单-查看'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'batchReceiptList',
                  name: 'batchReceiptList',
                  code: '061004',
                  component: BatchReceiptList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '验收单'
                  }
                },
                {
                  path: 'batchReceiptDetails/:id',
                  name: 'batchReceiptDetails',
                  component: BatchReceiptDetails,
                  meta: {
                    requirePath: true,
                    title: '验收单详情页'
                  }
                },
                {
                  path: 'batchReceiptAdd',
                  name: 'batchReceiptAdd',
                  component: BatchReceiptAdd,
                  meta: {
                    requirePath: true,
                    title: '创建验收单'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'returnGoodList',
                  name: 'returnGoodList',
                  code: '061005',
                  component: ReturnGoodList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '供应商售后'
                  }
                },
                {
                  path: 'returnGoodDetails/:id',
                  name: 'returnGoodDetails',
                  component: ReturnGoodDetails,
                  meta: {
                    requirePath: true,
                    title: '供应商售后-退货详情'
                  }
                },
                {
                  path: 'exchangeGoodDetails/:id',
                  name: 'exchangeGoodDetails',
                  component: ExchangeGoodDetails,
                  meta: {
                    requirePath: true,
                    title: '供应商售后-换货详情'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'gooodsStatements',
                  name: 'gooodsStatements',
                  code: '061006',
                  component: GooodsStatements,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '供应商结算'
                  }
                },
                {
                  path: 'gooodsStatementsAdd',
                  name: 'gooodsStatementsAdd',
                  component: GooodsStatementsAdd,
                  meta: {
                    requirePath: true,
                    title: '新增结算单'
                  }
                },
                {
                  path: 'gooodsStatementsView/:id',
                  name: 'gooodsStatementsView',
                  component: GooodsStatementsView,
                  meta: {
                    requirePath: true,
                    title: '查看结算单'
                  }
                },
                {
                  path: 'gooodsStatementsEdit/:id',
                  name: 'gooodsStatementsEdit',
                  component: GooodsStatementsEdit,
                  meta: {
                    requirePath: true,
                    title: '编辑结算单'
                  }
                },
                {
                  path:
                    'addGoodsSupplierSettlement/:projectId/:settlementId/:winSupplierId/:settlementType',
                  name: 'addGoodsSupplierSettlement',
                  component: AddGoodsSupplierSettlement,
                  meta: {
                    requirePath: true,
                    title: '编辑结算单=>新增物资'
                  }
                },
                {
                  path: 'gooodsStatementsViewDdetails/:id',
                  name: 'gooodsStatementsViewDdetails',
                  component: GooodsStatementsViewDdetails,
                  meta: {
                    requirePath: true,
                    title: '商家结算单详情'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'goods',
          code: '0601',
          component: Main,
          meta: {
            requirePath: true,
            title: '商品管理',
            icon: 'icon_menu_goods'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: '',
                  name: 'goodsList',
                  code: '060102',
                  component: GoodsList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '套餐管理'
                  }
                },
                {
                  path: '/addmeal/:state/:id',
                  name: 'addmeal',
                  component: AddMeal,
                  meta: {
                    requirePath: true,
                    title: '新增套餐'
                  }
                },
                {
                  path: '/setmealmanager',
                  name: 'setmealmanager',
                  component: SetMealManager,
                  meta: {
                    requirePath: true,
                    title: '套餐阶段管理'
                  }
                },
                {
                  path: '/newphase/:state/:id',
                  name: 'newphase',
                  component: NewPhase,
                  meta: {
                    requirePath: true,
                    title: '新建阶段'
                  }
                },
                {
                  path: '/setmealdetail/:id',
                  name: 'setmealdetail',
                  component: SetMealDetail,
                  meta: {
                    requirePath: true,
                    title: '阶段详情'
                  }
                },
                {
                  path: '/goodsDetails/:id',
                  name: 'goodsDetails',
                  component: SetMealgoodsDetails,
                  meta: {
                    requirePath: true,
                    title: '套餐详情'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'contractMaterialList',
                  name: 'contractMaterialList',
                  code: '060103',
                  component: ContractMaterialList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '合同物资管理'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'purchaseReconciliationList',
                  name: 'purchaseReconciliationList',
                  code: '060104',
                  component: PurchaseReconciliationList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '采购对账物资'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'saleReconciliationList',
                  name: 'saleReconciliationList',
                  code: '060105',
                  component: SaleReconciliationList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '销售对账物资'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'financial',
          code: '0603',
          component: Main,
          meta: {
            requirePath: true,
            title: '财务管理',
            icon: 'icon_menu_financial'
          },
          children: []
        },
        {
          path: 'system',
          code: '0604',
          component: Main,
          meta: {
            requirePath: true,
            title: '系统管理',
            icon: 'icon_menu_system'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'systemList',
                  name: 'systemList',
                  code: '060401',
                  component: SystemList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '菜单管理'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'systemConf',
                  name: 'systemConf',
                  code: '060402',
                  component: SystemConf,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '菜单配置'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'operate',
          code: '0606',
          component: Main,
          meta: {
            requirePath: true,
            title: '运营管理',
            icon: 'icon_menu_operate'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'versionInfor',
                  name: 'versionInfor',
                  code: '060601',
                  component: VersionInfor,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '版本信息管理'
                  }
                },
                {
                  path: 'versionInfor1/:id',
                  name: 'versionInfor1',
                  component: VersionInfor1,
                  meta: {
                    requirePath: true,
                    title: '资源信息'
                  }
                },
                {
                  path: 'versionInforAdd',
                  name: 'versionInforAdd',
                  component: VersionInforAdd,
                  meta: {
                    requirePath: true,
                    title: '创建版本信息'
                  }
                },
                {
                  path: 'versionInforEdit',
                  name: 'versionInforEdit',
                  component: VersionInforEdit,
                  meta: {
                    requirePath: true,
                    title: '编辑版本信息'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'carouselFigure',
                  name: 'carouselFigure',
                  code: '060602',
                  component: CarouselFigure,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '轮播图设置'
                  }
                },
                {
                  path: 'carouselFigureAdd',
                  name: 'carouselFigureAdd',
                  component: CarouselFigureAdd,
                  meta: {
                    requirePath: true,
                    title: '首页管理新增'
                  }
                },
                {
                  path: 'carouselFigureEdit/:id',
                  name: 'carouselFigureEdit',
                  component: CarouselFigureEdit,
                  meta: {
                    requirePath: true,
                    title: '首页管理编辑'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'showMessage',
                  name: 'showMessage',
                  code: '060603',
                  component: ShowMessage,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '短信查看'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'demand',
          code: '0608',
          component: Main,
          meta: {
            requirePath: true,
            title: '采购需求管理',
            icon: 'icon_menu_demand'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'demandScene',
                  name: 'demandScene',
                  code: '060801',
                  component: DemandScene,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '采购需求-现场'
                  }
                },
                {
                  path: 'addDemand',
                  name: 'addDemand',
                  component: AddDemand,
                  meta: {
                    requirePath: true,
                    title: '新增需求'
                  }
                },
                {
                  path: 'sceneDetails/:id',
                  name: 'sceneDetails',
                  component: SceneDetails,
                  meta: {
                    requirePath: true,
                    title: '需求详情-现场'
                  }
                },
                {
                  path: 'editDemand/:id',
                  name: 'editDemand',
                  component: EditDemand,
                  meta: {
                    requirePath: true,
                    title: '需求详情-现场'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'demandPurchase',
                  name: 'demandPurchase',
                  code: '060802',
                  component: DemandPurchase,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '采购需求-采购部'
                  }
                },
                {
                  path: 'DemandPurchaseDetails/:id',
                  name: 'DemandPurchaseDetails',
                  component: DemandPurchaseDetails,
                  meta: {
                    requirePath: true,
                    title: '需求详情-采购'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'pushPlanList',
                  name: 'pushPlanList',
                  code: '060805',
                  component: PushPlanList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '已推送计划'
                  }
                },
                {
                  path: 'pushPlanDetails/:id',
                  name: 'pushPlanDetails',
                  component: PushPlanDetails,
                  meta: {
                    requirePath: true,
                    title: '已推送计划详情'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'selfOrderList',
                  name: 'selfOrderList',
                  code: '060804',
                  component: SelfOrderList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '自建销售订单'
                  }
                },
                {
                  path: 'selfOrderDetail/:id',
                  name: 'selfOrderDetail',
                  component: SelfOrderDetail,
                  meta: {
                    requirePath: true,
                    title: '自建销售订单详情'
                  }
                },
                {
                  path: 'selfOrderNew/:id',
                  name: 'selfOrderNew',
                  component: SelfOrderNew,
                  meta: {
                    requirePath: true,
                    title: '新建配送出货单'
                  }
                },
                {
                  path: 'selfOrderOutDetail/:id',
                  name: 'selfOrderOutDetail',
                  component: SelfOrderOutDetail,
                  meta: {
                    requirePath: true,
                    title: '新建配送出货单'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'statistics',
          code: '0612',
          component: Main,
          meta: {
            requirePath: true,
            title: '统计报表',
            icon: 'icon_menu_statistics'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'statistics',
                  name: 'statistics',
                  code: '061201',
                  component: Statistics,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '统计报表'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'materialModifyList',
                  name: 'materialModifyList',
                  code: '061202',
                  component: MaterialModifyList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '物资修改记录'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'supplierPurchaseList',
                  name: 'supplierPurchaseList',
                  code: '061203',
                  component: SupplierPurchaseList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '供应商采购记录'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'materialApprovalStatus',
                  name: 'materialApprovalStatus',
                  code: '061204',
                  component: MaterialApprovalStatus,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '物资审批状态'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'platformSettlement',
          code: '0613',
          component: Main,
          meta: {
            requirePath: true,
            title: '平台结算管理',
            icon: 'icon_menu_settlement'
          },
          children: [
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'platformSettlementList',
                  name: 'platformSettlementList',
                  code: '061301',
                  component: PlatformSettlementList,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '平台结算管理'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'supplierSettlement',
                  name: 'supplierSettlement',
                  code: '061301',
                  component: SupplierSettlement,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '供应商结算'
                  }
                },
                {
                  path: 'supplierSettlementDetails/:supplierId',
                  name: 'supplierSettlementDetails',
                  component: SupplierSettlementDetails,
                  meta: {
                    requirePath: true,
                    title: '供应商结算详情'
                  }
                }
              ]
            },
            {
              path: '',
              component: App,
              children: [
                {
                  path: 'projectSettlement',
                  name: 'projectSettlement',
                  code: '061301',
                  component: ProjectSettlement,
                  meta: {
                    requirePath: true,
                    menu: true,
                    title: '梁场结算'
                  }
                },
                {
                  path: 'projectSettlementDetails/:projectId',
                  name: 'projectSettlementDetails',
                  component: ProjectSettlementDetails,
                  meta: {
                    requirePath: true,
                    title: '梁场结算详情'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requirePath: false,
        title: '登录'
      }
    },
    {
      path: '*',
      redirect: {
        name: 'home'
      }
    }
  ]
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
