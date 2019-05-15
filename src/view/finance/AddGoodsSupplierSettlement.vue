<template>
  <div class="p_d_detail_lv">
    <v-search :data="searchData" @on-click="searchDataClick"></v-search>
    <div class="box_all">
      <div class="pull-left">商品明细</div>
      <el-button class="pull-left" v-if="btnShow"
                 style="margin-left: 20px;margin-top: 12px;padding: 6px 14px !important;font-size: 12px;" type="primary"
                 @click="allAddSettlement">全部
      </el-button>
      <div class="pull-right">已选中<span class="color_red">{{countTotal}}</span>类物资，合计金额<span class="color_red">{{priceTotal}}</span>元
      </div>
    </div>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance" @selection-change="tbSelectionChange">
      <template slot-scope="scope" slot="indexCode">
        {{scope.index + 1}}
      </template>
      <template slot-scope="scope" slot="purchasePlanNumber">
        <el-button type="text" @click="toDetails(scope.row)">{{scope.row.purchasePlanNumber}}</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <br>
    <div class="text_center">
      <el-button type="primary" plain @click="toSave">保存</el-button>
      <!--<el-button type="primary" plain @click="toSubmit">提交</el-button>-->
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        projectId: 0,
        settlementId: 0,
        settlementType: 0,
        searchData: [
          {
            key: 'purchasePlanNumber',
            label: '采购单号',
            value: '',
            type: 'text'
          }, {
            key: 'startTime',
            label: '创建时间',
            value: '',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }
        ],
        dataSearch: {},
        countTotal: 0,
        priceTotal: 0,
        dataHeader: [
          {type: 'selection'},
          {prop: 'indexCode', label: '序号', width: '60', slot: true},
          {prop: 'purchasePlanNumber', label: '采购单号', slot: true},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '采购数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'winSupplierName', label: '供应商名称'}
        ],
        selection: [],
        selectionGoodsIds: [],
        enterpriseId: '',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'finance_statements_add_table'
        },
        tablePerformance: 'finance_statements_add_table',
        dialogCycle: {show: true, title: '选择供应商', width: '1000px'},
        searchDataPur: [
          {
            key: 'settlementType',
            prop: 'settlementType',
            label: '结算类型',
            value: '',
            custom: true
          },
          {
            key: 'enterpriseName',
            label: '企业名称',
            value: ''
          }
        ],
        dataSearchPur: {},
        radioType: 2,
        pDataHeader: [
          {prop: 'enterpriseName', label: '企业名称'},
          {prop: 'supplierTypeDisplay', label: '企业类型'},
          {prop: 'enterpriseArea', label: '企业地址'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        pTabUrl: this.$Api.order.loadEnterpriseData,
        pagePur: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'goods_add_statements_table'
        },
        refsPur: 'goods_add_statements_table',
        btnShow: false
      }
    },
    computed: {
      tabUrl () {
        let url = ''
        if (this.settlementType === '1') {
          url = this.$Api.finance.findAccountPaymentGoods
        } else {
          url = this.$Api.finance.findPresentPaymentGoods
        }
        return url
      }
    },
    created () {
      this.projectId = this.$route.params.projectId
      this.settlementType = this.$route.params.settlementType
      this.settlementId = this.$route.params.settlementId
      this.enterpriseId = this.$route.params.winSupplierId
      this.page.projectId = this.projectId
      this.page.winSupplierId = this.enterpriseId
      if (this.settlementType === '1') {
        this.searchData[1].label = '物资验收时间'
      } else {
        this.searchData[1].label = '创建时间'
      }
    },
    watch: {},
    methods: {
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      searchDataClick (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      tbSelectionChange (res) {
        this.selection = res
        this.selectionGoodsIds = this.selection.map(item => item.id)
        let price = 0
        if (this.selection && this.selection.length > 0) {
          this.countTotal = this.selection.length
          this.selection.map(res => {
            price = price + res.totalGoodsPrice
          })
          this.priceTotal = price.toFixed(4)
        } else {
          this.countTotal = 0
          this.priceTotal = 0
        }
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      toDetails (res) {
        let routeData = this.$router.resolve({
          name: 'salesDetail',
          params: {id: res.purchasePlanId, approve: 0}
        })
        window.open(routeData.href, '_blank')
      },
      toSave () {
        this.addSettlement(3)
      },
      toSubmit () {
        this.addSettlement(1)
      },
      addSettlement (state) {
        if (this.selectionGoodsIds && this.selectionGoodsIds.length > 0) {
          let paramsList = {}
          paramsList.settlementType = this.settlementType
          paramsList.projectId = this.projectId
          paramsList.settlementStateCode = state
          paramsList.signReceiptGoodsIds = this.selectionGoodsIds
          paramsList.supplierId = this.enterpriseId
          paramsList.id = this.settlementId
          this.$Ajax.post({
            url: this.$Api.finance.saveSettlementSupplier,
            data: {
              json: JSON.stringify(paramsList)
            },
            cb: res => {
              if (res.data.result) {
                this.$message('保存成功')
                this.$router.push({name: 'gooodsStatementsEdit', params: {id: this.settlementId}})
              } else {
                this.$message(res.data.message)
              }
            }
          })
        } else {
          this.$message('请选择物资')
        }
      },
      searchPur (res) {
        this.dataSearchPur = res
        if (JSON.stringify(this.dataSearchPur) === '{}') {
          this.pagePur.offset = 0
          this.pagePur.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.dataSearchPur, this.pagePur], this.refsPur, this)
      },
      getTableDataPur (data) {
        this.pagePur.totalNum = data.data.total
      },
      cancelCycleDialog () {
        this.dialogCycle.show = false
        this.$bus.emit('form-clear')
      }
    }
  }
</script>

<style scoped>
  .add_item {
    color: #008aff;
    cursor: pointer;
    font-size: 12px;
  }

  .add_item:hover {
    text-decoration: underline;
  }

  .box_all {
    height: 50px;
    background: #eee;
    font-size: 14px;
    line-height: 50px;
    padding: 0 20px;
    margin-bottom: 20px;
  }
</style>
<style>
  .p_d_detail_lv .contract_title {
    display: inline-block;
    padding: 10px 2px;
    border-bottom: 2px solid #1577fe;
    color: #1577fe;
  }

  .p_d_detail_lv .purchase_list > .v_list_li {
    width: 25% !important;
    float: left
  }

  .p_d_detail_lv .mr_b10 {
    margin-bottom: 10px;
  }

  .p_d_detail_lv .btn_box {
    text-align: center;
    margin-bottom: 60px;
  }

  .p_d_detail_lv .btn_box .base_btn_group .el-button {
    padding: 10px 15px !important
  }

  .p_d_detail_lv .avatar-uploader .el-upload {
    border: none;
  }

  .p_d_detail_lv .el-dialog__body {
    padding-top: 10px;
  }

  .p_d_detail_lv .el-dialog__body .el-form-item {
    margin-bottom: 0;
  }

  .p_d_detail_lv .el-table__row img {
    width: 93px;
    height: 93px;
  }

  .tb_border {
    border: 1px solid #e6ebf5;
    padding: 8px;
  }

  .tb_border .el-row .el-col {
    min-height: 96px;
  }

  .text_center {
    text-align: center;
  }

  .p_d_detail_lv .btn_view {
    text-align: right;
    margin-top: -33px;
    position: relative;
  }

  .box_collapse .el-collapse-item__header {
    border-bottom-color: gainsboro !important;
    border-right: solid 1px gainsboro !important;
    border-left: solid 1px gainsboro !important;
  }

  .box_collapse .el-collapse-item__content {
    padding-bottom: 0;
  }
</style>

