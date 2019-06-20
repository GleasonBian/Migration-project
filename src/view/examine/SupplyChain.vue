<template>
  <div>
    <el-tabs>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane :label="'待报价(' + (countData.noDeliveryCount ? countData.noDeliveryCount : 0) + ')'" name="first">
        </el-tab-pane>
        <el-tab-pane label="待审批" name="six">
        </el-tab-pane>
        <el-tab-pane :label="'已驳回(' + (countData.rejectDeliveryCount ? countData.rejectDeliveryCount : 0) + ')'"
                     name="second">
        </el-tab-pane>
        <el-tab-pane :label="'审批中(' + (countData.auditDeliveryCount ? countData.auditDeliveryCount : 0) + ')'"
                     name="three">
        </el-tab-pane>
        <el-tab-pane label="已通过" name="four">
        </el-tab-pane>
        <el-tab-pane label="驳回记录" name="five">
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeaderData" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance">
      <!--<table-list :data-header="dataHeader" :params="page"-->
      <!--:refs="tablePerformance" :static="true" :dataStatic="dataExternal">-->
      <template v-slot:returnTypeDisplay="scope">
        <span :title="scope.row.returnChangeReason">{{scope.row.returnTypeDisplay}}</span>
      </template>
      <template v-slot:code="scope">
        <a class="handle" @click="toSalesDetails(scope.row)">{{scope.row.code}}</a>
      </template>
      <template v-slot:examine="scope">
        <a class="handle" :class="[!scope.row.rejectFlag ? '' : 'text_red']" @click="toDismissal(scope.row)">审批记录</a>
      </template>
      <template v-slot:handle="scope">
        <a class="handle" @click="toDetail(scope.row.goodsName)">历史价</a>
        <a v-if="(page.materialState === 10 || page.materialState === 50 || page.materialState === 20) && (page.businessType !== 2)" class="handle" style="margin-left: 10px;"
           @click="writePriceMark(scope.row.listPurchaseId)">报价</a>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!-- 审批记录 -->
    <examine-dialog :dialogDataView="dialogDataView" :pageView="pageView" :goodsName="goodsName"
                    :tablePerformanceView="tablePerformanceView"></examine-dialog>
    <!--历史价-->
    <history-dialog :historyDialog="historyDialog" :historyDialogPage="historyDialogPage"
                    :historyDialogDataRefs="historyDialogDataRefs" :isShowHistory="isShowHistory"
                    :historyDialogSearchData="historyDialogSearchData" :historyDialogUrl="historyDialogUrl"></history-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import examineDialog from './examineDialog.vue'
  import historyDialog from './historyDialog.vue'
  export default {
    components: {examineDialog, historyDialog},
    data () {
      return {
        dataExternal: [],
        activeName: 'first',
        urlBeamField: this.$Api.orderManger.getProjectList,
        arrBeamData: [],
        searchData: [
          {
            label: '商品名称：',
            value: '',
            placeholder: '请输入',
            key: 'materialName'
          }, {
            label: '梁场名称：',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
            select: []
          }, {
            label: '创建时间：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            label: '采购单号：',
            value: '',
            placeholder: '请输入',
            key: 'code'
          }
        ],
        dataSearch: {},
        dataHeaderData: [],
        dataHeader: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'recommendGoodsPrice', label: '价格'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'remarkForPrice', label: '其他要求'},
          {prop: 'purchaseRemark', label: '采购备注'},
          {prop: 'quotationEnumDisplay', label: '报价类型'},
          {prop: 'code', label: '采购单号', slot: true},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'examine', label: '审批记录', slot: true},
          {prop: 'currentDiachronic', label: '当前历时'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        dataHeaderElse: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'recommendGoodsPrice', label: '价格'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'remark', label: '备注'},
          {prop: 'code', label: '采购单号', slot: true},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'examine', label: '审批记录', slot: true},
          {prop: 'modifyTimeStr', label: '处理时间'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        tabUrl1: this.$Api.examine.findListPurchaseMaterialPager,
        tabUrl2: this.$Api.examine.findAuditRecordGoodsPager,
        urlCount: this.$Api.examine.findListPurchaseMaterialCount,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          materialState: 10,
          refs: 'supply_chain_examine_table'
        },
        tablePerformance: 'supply_chain_examine_table',
        countData: {},
        dialogDataView: {show: false, title: '物资审批记录', width: '700px'},
        pageView: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          refs: 'supply_chain_table_examine'
        },
        tablePerformanceView: 'supply_chain_table_examine',
        goodsName: '',
        historyDialog: {
          width: '1000px',
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
        historyDialogSearchData: [{label: '商品名称', value: '', key: 'goodsName', placeholder: '请输入商品名称'}, {label: '规格型号', value: '', key: 'model', placeholder: '请输入规格型号'}, {label: '梁场名称：', value: '', placeholder: '请选择', key: 'projectId', select: []}],
        historyDialogDataRefs: 'table_historyPrice_list',
        isShowHistory: false,
        indexCode: '0'
      }
    },
    computed: {
      tabUrl () {
        return (this.indexCode !== '4' && this.indexCode !== '5') ? this.tabUrl1 : this.tabUrl2
      }
    },
    created () {
      this.getBeamField()
      this.getCount()
      this.dataHeaderData = this.dataHeader
    },
    methods: {
      toDismissal (res) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
        this.dialogDataView.show = true
        if (this.indexCode === '4' || this.indexCode === '5') {
          this.pageView.goodsId = res.businessGoodsId
          this.pageView.typeCode = 2
        } else {
          this.pageView.goodsId = res.id
          this.pageView.typeCode = 2
        }
        this.$Utils.pageUpdateTable([[], this.pageView], this.tablePerformanceView, this)
      },
      viewCancel () {
        this.dialogDataView.show = false
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      getTableDataView (data) {
        this.pageView.totalNum = data.data.total
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      getCount () {
        this.ajaxPost(this.urlCount, (res) => {
          this.countData = res.data
        })
      },
      getBeamField () {
        this.ajaxPost(this.urlBeamField, (res) => {
          if (res.data.result) {
            this.arrBeamData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(this.arrBeamData)
              }
            })
            this.historyDialogSearchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(this.arrBeamData)
              }
            })
          }
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
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      toSalesDetails (res) {
        let id = ''
        if (this.indexCode !== '4') {
          id = res.listPurchaseId
        } else {
          id = res.businessId
        }
        this.$router.push({name: 'salesDetail', params: {id: id}})
      },
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      tabClick (res) {
        this.searchData.map(item => {
          item.value = ''
        })
        this.dataSearch = {}
        this.indexCode = res.index
        switch (res.index) {
          case '0':
            this.dataHeaderData = this.dataHeader
            this.page.materialState = 10
            delete this.page.businessType
            break
          case '1':
            this.dataHeaderData = this.dataHeader
            this.page.materialState = 20
            delete this.page.businessType
            break
          case '2':
            this.dataHeaderData = this.dataHeader
            this.page.materialState = 50
            delete this.page.businessType
            break
          case '3':
            this.dataHeaderData = this.dataHeaderElse
            this.page.materialState = 30
            delete this.page.businessType
            break
          case '4':
            this.dataHeaderData = this.dataHeaderElse
            this.page.materialState = 10
            this.page.businessType = 2
            break
          case '5':
            this.dataHeaderData = this.dataHeaderElse
            this.page.materialState = 20
            this.page.businessType = 2
            break
        }
        this.page.offset = 0
        this.page.currentPage = 1
        let _this = this
        Vue.nextTick().then(function () {
          _this.pageUpdateTable()
        })
      },
      getTablExternal (url) {
        this.$Ajax.post({
          url: url,
          data: this.page,
          cb: res => {
            this.dataExternal = res.data.rows
            this.page.totalNum = res.data.total
          }
        })
      },
      toDetail (goodsName) {
        this.historyDialogSearchData.map(item => {
          if (item.key !== 'goodsName') {
            item.value = ''
          }
        })
        this.historyDialogPage.goodsName = goodsName
        this.historyDialogPage.model = ''
        this.historyDialogPage.projectId = ''
        this.historyDialogSearchData[0].value = goodsName
        this.$Utils.pageUpdateTable([this.historyDialogPage], this.historyDialogDataRefs, this)
        this.isShowHistory = true
        this.historyDialog.show = true
      },
      historyDialogGetTableData (data) {
        this.historyDialogPage.totalNum = data.data.total
      },
      writePriceMark (id) {
        let routeData = this.$router.resolve({
          name: 'salesRemark',
          params: {id: id}
        })
        window.open(routeData.href, '_blank')
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

  .handle.text_red {
    color: #ff0000
  }
</style>
