<template>
  <div>
    <div class="contract_title">进货单详情</div>
    <v-list :data="purchaseData" :data-list="purchaseList" :list-style="listStyle"></v-list>
    <div class="contract_title mr_b10">商品明细</div>
    <table-list :data-header="dataHeader" :static="true" :dataStatic="dataTable" :refs="tableSalesPurchaseDetails"></table-list>
    <div style="margin-top: 20px;text-align: center">
      <el-button type="primary" v-if="purchaseList.state === 0"   @click="delivery">发货</el-button>
      <el-button type="primary" @click="toPurchaseAndDeliveryDetails">查看收货明细</el-button>
      <el-button type="primary" @click="exportDeliver" v-show="$Utils.getPageElement($Consts.PERMISSION.exportPurchase.code)">导出Excel</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        listStyle: {
          listwidth: '100px',
          class: 'purchase_list'
        },
        purchaseData: [
          {prop: 'replenishStockCode', label: '进货单编码'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'creater', label: '创建人'},
          {prop: 'stateStr', label: '状态'},
          {prop: 'companyName', label: '供应商名称'},
          {prop: 'orderCode', label: '销售单编码'},
          {prop: 'purchaseTypeStr', label: '进货类型'},
          {prop: 'receiver', label: '收货人'},
          {prop: 'receiverPhone', label: '联系方式'},
          {prop: 'warehouseName', label: '仓库名称'},
          {prop: 'warehouseNameAddress', label: '仓库地址'},
          {prop: 'expectTimeStr', label: '期望到货时间'},
          {prop: 'remark', label: '备注信息'},
          {prop: 'sumGoodsPrice', label: '进货单总金额'}
        ],
        purchaseList: {},
        tableSalesPurchaseDetails: 'table_sales_purchase_details',
        dataHeader: [{
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'typeModel',
          label: '规格型号'
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'replenishStockNum',
          label: '进货数量'
        }, {
          prop: 'unitGoodsPrice',
          label: '进货单价'
        }, {
          prop: 'deliveryNum',
          label: '已发货数量'
        }],
        dataTable: [],
        id: ''
      }
    },
    created () {
      let id = this.$route.params.id
      this.id = id
      this.getPurchaseData(id)
    },
    methods: {
      toPurchaseAndDeliveryDetails (row) {
        this.jumpPageParams('stockAndDeliveryDetails', {id: this.id})
      },
      exportDeliver (row) {
        location.href = this.$Api.sale.exportReplenishStock + '?id=' + this.id
      },
      delivery () {
        this.jumpPageParams('stockInfo', {id: this.id})
      },
      jumpPageParams (nameR, params) {
        this.$router.push({
          name: nameR,
          params: params
        })
      },
      getPurchaseData (id) {
        this.$Ajax.post({
          url: this.$Api.sale.gotoReplenishStockDetail,
          data: {
            id: id
          },
          cb: res => {
            if (res.data.result) {
              this.purchaseList = res.data.data
              this.purchaseList.purchaseTypeStr = '自建订单'
              this.dataTable = res.data.data.replenishStockGoodsVOList
              this.dataTable.map(item => {
                item.goodsName = item.quotationGoodsVO.goodsName
                item.typeModel = item.quotationGoodsVO.typeModel
                item.brandName = item.quotationGoodsVO.brandName
                item.unit = item.quotationGoodsVO.unit
              })
              if (!this.$Utils.getPageElement(this.$Consts.PERMISSION.replenishStockMoney.code)) {
                let _purchaseData = []
                this.purchaseData.forEach((item, index) => {
                  if (item.prop !== 'sumGoodsPrice') {
                    _purchaseData.push(item)
                  }
                })
                this.purchaseData = _purchaseData

                let _dataHeader = []
                this.dataHeader.forEach((item, index) => {
                  if (item.prop !== 'unitGoodsPrice') {
                    _dataHeader.push(item)
                  }
                })
                this.dataHeader = _dataHeader
              }
            }
          }
        })
      }
    }
  }
</script>

<style>
  .contract_title {display: inline-block;padding:10px 2px;border-bottom: 2px solid #1577fe; color: #1577fe;}
  .purchase_list > .v_list_li{width: 33% !important;float: left}
  .mr_b10 {margin-bottom:10px;}

  table{ width: 100%;}
</style>
