<template>
  <div>
    <div class="title">外审单详情</div>
    <div class="box">
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <br/>
    <div class="title">商品明细</div>
    <table-list :data-header="dataHeader" :url="tabUrlGoods" :params="pageGoods"
                :refs="tablePerformance" @get-table-data="getTableDataGoods">
      <template v-slot:dismissal="scope">
        <a class="handle" style="margin-left: 10px;" @click="toDismissal(scope.row)">审批记录</a>
      </template>
      <template v-slot:historyPrice="scope">
        <span class="handle" @click="toDetail(scope.row.goodsName)">历史价</span>
      </template>
    </table-list>
    <v-page :data="pageGoods" :dataArr="[]"></v-page>
    <div class="text_total_right">
      共{{dataList.goodsCount}}类物资，合计金额：￥{{dataList.goodsPriceTotle}}
    </div>
    <div class="title">外部审批记录</div>
    <table-list :data-header="approvalHeaderExternal" :refs="tableExternal"
                :dataStatic="dataApproval" :static="true">
    </table-list>
    <!--审批记录-->
    <examine-dialog :dialogDataView="dialogDataView" :pageView="pageView" :goodsName="goodsName"
                    :tablePerformanceView="tablePerformanceView"></examine-dialog>
    <!--<v-dialog :dialog="dialogDataView" @on-cancel="viewCancel">-->
      <!--<table-list :data-header="dataHeaderView" :url="tabUrlView" :params="pageView" @get-table-data="getTableDataView"-->
                  <!--:refs="tablePerformanceView"></table-list>-->
      <!--<v-page :data="pageView" :dataArr="[]"></v-page>-->
    <!--</v-dialog>-->
    <!--历史价-->
    <history-dialog :historyDialog="historyDialog" :historyDialogPage="historyDialogPage"
                    :historyDialogDataRefs="historyDialogDataRefs" :isShowHistory="isShowHistory"
                    :historyDialogSearchData="historyDialogSearchData" :historyDialogUrl="historyDialogUrl"></history-dialog>
    <!--<v-dialog :dialog="historyDialog">-->
      <!--<v-search :data="historyDialogSearchData" @on-click="historyDialogSearchDataClick"></v-search>-->
      <!--<table-list :data-header="historyDialogHeader" :url="historyDialogUrl" :params="historyDialogPage"-->
                  <!--:refs="historyDialogDataRefs" @get-table-data="historyDialogGetTableData"-->
                  <!--v-show="isShowHistory"></table-list>-->
      <!--<v-page :data="historyDialogPage" :dataArr="[historyDialogDataSearch]"></v-page>-->
    <!--</v-dialog>-->
  </div>
</template>


<script>
  import examineDialog from '../examine/examineDialog.vue'
  import historyDialog from '../examine/historyDialog.vue'
  export default {
    components: {examineDialog, historyDialog},
    data () {
      return {
        pageGoods: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_external_goods'
        },
        tabUrlGoods: this.$Api.sale.findExternalAuditGoods,
        data: [
          {prop: 'code', label: '外审单号'},
          {prop: 'typeStr', label: '采购类型'},
          {prop: 'stateDisplay', label: '外审单状态'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'userName', label: '创建人'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'modifyTimeStr', label: '期望到货时间'}
        ],
        dataList: {},
        listStyle: {
          class: ['pannel']
        },
        dataHeader: [
          {prop: 'code', label: '采购单编码'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'purpose', label: '用途'},
          {prop: 'pricingAnalysis', label: '定价说明'},
          {prop: 'recommendGoodsPrice', label: '销售价'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'historyPrice', label: '历史价', slot: true},
          {prop: 'dismissal', label: '审批记录', slot: true}
        ],
        dataHeaderView: [
          {prop: 'createrName', label: '驳回人'},
          {prop: 'createTimeStr', label: '驳回时间'},
          {prop: 'remark', label: '驳回原因'}
        ],
        tableStatic: true,
        dataStatic: [],
        tablePerformance: 'table_external_goods',
        dialogDataView: {show: false, title: '审批记录', width: '700px'},
        tablePerformanceView: 'reject_external_table_goods',
        pageView: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'reject_external_table_goods'
        },
        tabUrlView: this.$Api.sale.queryGoodsRejectRecordPage,
        historyDialog: {
          width: '800px',
          show: false,
          title: '交易明细'
        },
        historyDialogHeader: [
          {prop: 'recordTimeStr', label: '采购日期'},
          {prop: 'goodsName', label: '物资名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'unit', label: '计量单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'goodsPrice', label: '单价'},
          {prop: 'totalPrice', label: '金额'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'projectName', label: '梁场名称'}
        ],
        historyDialogUrl: this.$Api.order.priceRecord,
        historyDialogPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          goodsName: '',
          refs: 'table_historyPrice_list'
        },
        historyDialogDataRefs: 'table_historyPrice_list',
        historyDialogDataSearch: {},
        historyDialogSearchData: [{label: '商品名称', value: '', key: 'goodsName', placeholder: '请输入商品名称'}, {label: '梁场名称：', value: '', placeholder: '请选择', key: 'projectId', select: []}],
        isShowHistory: false,
        approvalHeaderExternal: [
          {prop: 'dueTime', label: '更新时间'},
          {prop: 'dueName', label: '审批节点'},
          {prop: 'duePerson', label: '负责人'},
          {prop: 'state', label: '审批状态'},
          {prop: 'comment', label: '审批意见'}
        ],
        approvalUrlExternal: this.$Api.sale.listHistoryCommentInner,
        approvalPageExternal: {businessKey: ''},
        tableExternal: 'table_external',
        businessKey: '',
        dataApproval: [],
        goodsName: ''
      }
    },
    created () {
      this.id = this.$route.params.id
      this.getTableData()
      this.pageGoods.externalAuditId = this.id
      this.getBeamField()
    },
    methods: {
      getBeamField () {
        this.ajaxPost(this.$Api.orderManger.getProjectList, (res) => {
          if (res.data.result) {
            this.historyDialogSearchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(res.data.data)
              }
            })
          }
        })
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
      getTableData () {
        this.$Ajax.get({
          url: this.$Api.sale.externalAuditDetails,
          data: {
            params: {
              listPurchaseExternalAuditId: this.id
            }
          },
          cb: res => {
            if (res.data.result) {
              this.dataList = res.data.data
              this.businessKey = res.data.data.businessKey
              this.approvalPageExternal.businessKey = this.businessKey + this.id
              this.getDataApproval()
            }
          }
        })
      },
      getDataApproval () {
        this.$Ajax.post({
          url: this.approvalUrlExternal,
          data: this.approvalPageExternal,
          cb: res => {
            this.dataApproval = res.data.rows
          }
        })
      },
      toDismissal (res) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
        this.dialogDataView.show = true
        this.pageView.goodsId = res.id
        this.pageView.typeCode = 2
        this.$Utils.pageUpdateTable([[], this.pageView], this.tablePerformanceView, this)
      },
      viewCancel () {
        this.dialogDataView.show = false
      },
      getTableDataGoods (data) {
        this.pageGoods.totalNum = data.data.total
      },
      getTableDataView (data) {
        this.pageView.totalNum = data.data.total
      },
      toDetail (goodsName) {
        this.historyDialogSearchData.map(item => {
          if (item.key !== 'goodsName') {
            item.value = ''
          }
        })
        this.historyDialogPage.goodsName = goodsName
        this.historyDialogPage.projectId = ''
        this.historyDialogSearchData[0].value = goodsName
        this.$Utils.pageUpdateTable([this.historyDialogPage], this.historyDialogDataRefs, this)
        this.isShowHistory = true
        this.historyDialog.show = true
      },
      historyDialogGetTableData (data) {
        this.historyDialogPage.totalNum = data.data.total
      },
      historyDialogSearchDataClick (res) {
        if (res.goodsName === undefined) {
          res.goodsName = ''
        }
        this.historyDialogDataSearch = res
        this.historyDialogPage.goodsName = res.goodsName
        if (JSON.stringify(this.historyDialogDataSearch) === '{}') {
          this.historyDialogPage.offset = 0
          this.historyDialogPage.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.historyDialogPage], this.historyDialogDataRefs, this)
      }
    }
  }
</script>
<style scoped>
  .title {
    margin-bottom: 10px;
    font-size: 18px;
    border-left: solid #008aff 4px;
    padding-left: 5px;
  }

  .box {
    padding: 0px 5px;
    border: solid #e5e5e5 1px;
  }

  .item_img {
    font-size: 12px;
    color: #008aff;
  }

  .item_img:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .handle {
    font-size: 14px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin-right: 15px;
  }

  .handle:hover {
    text-decoration: underline;
  }
</style>
<style>
  .text_total_right {
    text-align: right;
    line-height: 40px;
    font-size: 14px;
  }

  .pannel .v_list_li {
    float: left;
    width: 33% !important;
  }
</style>
