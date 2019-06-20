<template>
  <div class="box_purchase">
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @bulk-purchase="bulkPurchase"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tableSalesPurchase" @selection-change="selectionChange">
      <template v-slot:purchasePlanNumber="scope">
        <a class="handle" @click="toSalesDetails(scope.row)">{{scope.row.purchasePlanNumber}}</a>
      </template>
      <template v-slot:handle="scope">
        <a class="handle" @click="toPurchase(scope.row)">进货</a>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [
          {
            key: 'goodsName',
            label: '物资名称:',
            value: '',
            placeholder: '请输入物资名称'
          }, {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          }, {
            key: 'startTime',
            label: '创建时间：',
            value: '',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            key: 'purchasePlanNumber',
            label: '采购单号:',
            value: '',
            placeholder: '请输入'
          }, {
            key: 'winSupplierName',
            label: '供应商名称:',
            value: '',
            placeholder: '请输入'
          }
        ],
        dataSearch: {},
        btnData: [{
          text: '批量进货',
          key: 'bulk-purchase'
        }],
        dataHeader: [
          {type: 'selection'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '数量'},
//          {prop: 'unitPrice', label: '价格'},
//          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'purchasePlanNumber', label: '采购单号'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'winSupplierName', label: '供应商名称'},
          {prop: 'currentDiachronic', label: '当前历时'},
          {prop: 'handle', label: '操作', slot: true, width: '50px'}
        ],
        tabUrl: this.$Api.procurement.listForReplenishStock,
        tableSalesPurchase: 'table_sales_purchase_stay',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [10, 50, 100, 500, 1000, 2000],
          refs: 'table_sales_purchase_stay'
        },
        operationBtn: [{
          text: '进货',
          key: 'on-stock',
          type: 'text'
        }],
        urlBeamField: this.$Api.orderManger.getProjectList,
        selection: [],
        selectionGoodsIds: []
      }
    },
    created () {
      this.getBeamField()
    },
    methods: {
      selectionChange (selection) {
        this.selection = selection
        this.selectionGoodsIds = this.selection.map(item => item.id)
      },
      bulkPurchase () {
        if (this.selectionGoodsIds && this.selectionGoodsIds.length > 0) {
          this.$confirm('确定要提交吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.$Api.procurement.batchCreate,
              data: {
                goodsIds: this.selectionGoodsIds
              },
              cb: (res) => {
                if (res.data.result) {
                  this.$message('提交成功')
                  this.$router.push({name: 'procurementStockList'})
                } else {
                  let message = res.data.message ? res.data.message : '网络异常'
                  this.$message(message)
                }
              }
            })
          }).catch(() => {
          })
        } else {
          this.$message('请选择物资')
        }
      },
      toPurchase (res) {
        let routeData = this.$router.resolve({
          name: 'procurementOrder',
          params: {id: res.purchasePlanId, type: '2'}
        })
        window.open(routeData.href, '_blank')
      },
      toSalesDetails (res) {
        let routeData = this.$router.resolve({
          name: 'procurementSearch',
          params: {id: res.purchasePlanId}
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
        if (this.$Utils.getPageElement(this.$Consts.PERMISSION.replenishStockMoney.code)) {
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
      getOperationBtn (code) {
        let arrOperationBtn = [].concat(this.operationBtn).splice(0, 3, 1)
        return code === 0 ? this.operationBtn : arrOperationBtn
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
<style scoped>
  .handle {
    font-size: 12px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }
</style>
<style>
  .box_purchase .el-table td.is-center:last-child {
    text-align: left;
  }

  table {
    width: 100%;
  }
</style>
