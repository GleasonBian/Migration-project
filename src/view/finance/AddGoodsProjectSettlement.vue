<template>
  <div class="p_d_detail_lv">
    <v-search :data="searchData" @on-click="searchDataClick"></v-search>
    <div class="box_all">
      <div class="pull-left">商品明细</div>
      <div class="pull-right">已选中<span class="color_red">{{countTotal}}</span>类物资，合计金额<span class="color_red">{{priceTotal}}</span>元
      </div>
    </div>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance" @selection-change="tbSelectionChange">
      <template slot-scope="scope" slot="indexCode">
        {{scope.index + 1}}
      </template>
      <template slot-scope="scope" slot="number">
        <el-button type="text" @click="toDetails(scope.row)">{{scope.row.number}}</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <br>
    <div class="text_center">
      <!--<el-button type="primary" plain @click="toSave">保存</el-button>-->
      <el-button type="primary" plain @click="toSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        projectId: 0,
        settlementId: 0,
        invoiceId: 0,
        searchData: [
          {
            key: 'code',
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
          {prop: 'number', label: '采购单号', slot: true},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'signCount', label: '实收数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'totalPrice', label: '金额'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'remark', label: '其他要求'}
        ],
        selection: [],
        selectionGoodsIds: [],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'finance_statements_project_add_table'
        },
        tablePerformance: 'finance_statements_project_add_table',
        tabUrl: this.$Api.finance.findGoodsPager
      }
    },
    created () {
      this.projectId = this.$route.params.projectId
      this.settlementId = this.$route.params.settlementId
      this.invoiceId = this.$route.params.invoiceId
      this.page.projectId = this.projectId
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
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      tbSelectionChange (res) {
        this.selection = res
        this.selectionGoodsIds = this.selection.map(item => item.id)
        let price = 0
        if (this.selection && this.selection.length > 0) {
          this.countTotal = this.selection.length
          this.selection.map(res => {
            price = price + res.totalPrice
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
          paramsList.projectId = this.projectId
          paramsList.settlementStateCode = state
          paramsList.signReceiptGoodsIds = this.selectionGoodsIds
          paramsList.invoiceId = this.invoiceId
          paramsList.id = this.settlementId
          this.$Ajax.post({
            url: this.$Api.finance.saveSettlement,
            data: {
              json: JSON.stringify(paramsList)
            },
            cb: res => {
              if (res.data.result) {
                this.$message('保存成功')
                this.$router.push({name: 'editBeamSettlement', params: {id: this.settlementId}})
              } else {
                this.$message(res.data.message)
              }
            }
          })
        } else {
          this.$message('请选择物资')
        }
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

