<template>
  <div class="box_purchase">
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @on-add="addData" v-show="$Utils.getPageElement($Consts.PERMISSION.buyGoods.code)"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData" :refs="tableSalesPurchase">
      <template v-slot:operation="scope" class='opation-flex'>
        <a class="handle" @click="toPurchaseDetails(scope.row)">查看</a>
        <a class="handle" @click="toPurchaseAndDeliveryDetails(scope.row)">收货明细</a>
        <a class="handle" @click="exportDeliver(scope.row)" v-show="$Utils.getPageElement($Consts.PERMISSION.exportPurchase.code)">导出</a>
        <a class="handle" @click="toDeliveryInfo(scope.row)" v-show="scope.row.state === 0">发货</a>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    components: {},
    data () {
      return {
        searchData: [{
          key: 'startTime',
          label: '下单时间：',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }, {
          label: '状态：',
          value: '',
          key: 'state',
          select: [{
            value: '', label: '全部'
          }, {
            value: '0', label: '待发货'
          }, {
            value: '2', label: '已发货'
          }, {
            value: '3', label: '已签收'
          }, {
            value: '4', label: '结算中'
          }, {
            value: '1', label: '已完成'
          }]
        }, {
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
        }, {
          key: 'companyName',
          label: '供应商名称:',
          value: '',
          placeholder: '请输入'
        }, {
          key: 'replenishStockCode',
          label: '进货单号:',
          value: '',
          placeholder: '请输入'
        }, {
          key: 'orderCode',
          label: '销售单号:',
          value: '',
          placeholder: '请输入'
        }, {
          key: 'materialName',
          label: '物资名称:',
          value: '',
          placeholder: '请输入物资名称'
        }, {
          // 根据采购计划单号查询
          key: 'orderCode',
          label: '采购计划单号:',
          value: '',
          placeholder: '请输入采购计划单号'
        }],
        dataSearch: {},
        btnData: [{
          text: '待进货',
          key: 'add'
        }],
        dataHeader: [{
          prop: 'replenishStockCode',
          label: '进货单编码'
        }, {
          prop: 'projectName',
          label: '梁场名称'
        }, {
          prop: 'companyName',
          label: '供应商名称'
        }, {
          prop: 'sumGoodsPrice',
          label: '进货单总金额'
        }, {
          prop: 'purchasePlanNumber',
          label: '采购计划单号',
          width: '200px'
        }, {
          prop: 'stateStr',
          label: '状态'
        }, {
          prop: 'countStr',
          label: '发货数量'
        }, {
          prop: 'createTimeStr',
          label: '创建时间',
          width: '160px'
        }, {
          prop: 'creater',
          label: '创建人'
        }, {
          label: '操作',
          prop: 'operation',
          width: '320px',
          slot: true
        }],
        tabUrl: this.$Api.sale.getReplenishStockList,
        tableSalesPurchase: 'table_sales_purchase_01',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          dataSources: 4,
          refs: 'table_sales_purchase_01'
        },
        operationBtn: [{
          text: '查看',
          key: 'on-detail',
          type: 'text'
        }, {
          text: '收货明细',
          key: 'on-deliver-detail',
          type: 'text'
        }, {
          text: '导出',
          key: 'on-export',
          type: 'text'
        }, {
          text: '发货',
          key: 'on-delivery',
          type: 'text'
        }],
        urlBeamField: this.$Api.orderManger.getProjectList
      }
    },
    created () {
      this.getBeamField()
    },
    methods: {
      addData () {
        let routeData = this.$router.resolve({
          name: 'procurementStayStockList'
        })
        window.open(routeData.href, '_blank')
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      fliterSelectBeam (res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({label: item.projectName, value: item.id})
          })
        }
        return arrBeam
      },
      getBeamField () {
        this.ajaxPost(this.urlBeamField, (res) => {
          if (res.data.result) {
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(res.data.data)
              }
            })
          }
        })
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      jumpPageParams (nameR, params) {
        this.$router.push({
          name: nameR,
          params: params
        })
      },
      search (res) {
        if (res.state) {
          res.state = parseInt(res.state)
        }
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.pageUpdateTable([this.dataSearch, this.page], this.tableSalesPurchase, this)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
        if (!this.$Utils.getPageElement(this.$Consts.PERMISSION.replenishStockMoney.code)) {
          let newHeader = []
          this.dataHeader.forEach((item, index) => {
            if (item.prop !== 'sumGoodsPrice') {
              newHeader.push(item)
            }
          })
          this.dataHeader = newHeader
        }
        data.data.rows.map(item => {
          item.countStr = item.deliverGoodsCount + ' / ' + item.replenishStockCount
        })
      },
      toPurchaseDetails (row) {
        let routeData = this.$router.resolve({
          name: 'stockDetails',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.jumpPageParams('stockDetails', {id: row.id})
      },
      toPurchaseAndDeliveryDetails (row) {
        let routeData = this.$router.resolve({
          name: 'stockAndDeliveryDetails',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.jumpPageParams('stockAndDeliveryDetails', {id: row.id})
      },
      toDeliveryInfo (row) {
        let routeData = this.$router.resolve({
          name: 'stockInfo',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.jumpPageParams('stockInfo', {id: row.id})
      },
      exportDeliver (row) {
        location.href = this.$Api.sale.exportReplenishStock + '?id=' + row.id
      }
    }
  }
</script>

<style>
  .box_purchase .el-table td.is-center:last-child{
    text-align: center;
  }
  .handle {
    font-size: 12px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
    margin:0px 2px;
  }

  .handle:hover {
    text-decoration: underline;
  }

  table{ width: 100%;}
  .opation-flex{
    text-align: center;
  }
</style>
