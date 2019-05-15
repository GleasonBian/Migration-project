<template>
  <div class="box_purchase">
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @on-add="addPurchase"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData" :refs="tableSalesPurchase">
      <template slot-scope="scope" slot="operation">
        <tab-but :data="getOperationBtn(scope.row.state)"
                 @on-detail="toPurchaseDetails(scope.row)"
                 @on-deliver-detail="toPurchaseAndDeliveryDetails(scope.row)"
                 @on-delivery="toDeliveryInfo(scope.row)"
                 @on-export="exportDeliver(scope.row)"
        ></tab-but>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
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
            value: '1', label: '已完成'
          }]
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
        }],
        dataSearch: {},
        btnData: [{
          text: '新增进货单',
          key: 'add'
        }],
        dataHeader: [{
          prop: 'replenishStockCode',
          label: '进货单编码'
        }, {
          prop: 'companyName',
          label: '供应商名称'
        }, {
          prop: 'sumGoodsPrice',
          label: '进货单总金额'
        }, {
          prop: 'orderCode',
          label: '关联订单',
          width: '200px'
        }, {
          prop: 'stateStr',
          label: '状态'
        }, {
          prop: 'createTimeStr',
          label: '创建时间'
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
        tableSalesPurchase: 'table_sales_purchase',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_sales_purchase'
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
        }]
      }
    },
    methods: {
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
      },
      getOperationBtn (code) {
        let arrOperationBtn = [].concat(this.operationBtn).splice(0, 3, 1)
        return code === 0 ? this.operationBtn : arrOperationBtn
      },
      addPurchase () {
        this.jumpPage('addPurchase')
      },
      toPurchaseDetails (row) {
        this.jumpPageParams('purchaseDetails', {id: row.id})
      },
      toPurchaseAndDeliveryDetails (row) {
        this.jumpPageParams('purchaseAndDeliveryDetails', {id: row.id})
      },
      toDeliveryInfo (row) {
        this.jumpPageParams('deliveryInfo', {id: row.id})
      },
      exportDeliver (row) {
        location.href = this.$Api.sale.exportReplenishStock + '?id=' + row.id
      }
    }
  }
</script>

<style>
  .box_purchase .el-table td.is-center:last-child{
    text-align: left;
  }
</style>
