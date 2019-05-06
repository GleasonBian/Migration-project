<template>
  <div>
    <el-tabs>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane :label="'待报价(' + (countData.preApproveCount ? countData.preApproveCount : 0) + ')'" name="first">
        </el-tab-pane>
        <el-tab-pane :label="'已驳回(' + (countData.reject ? countData.reject : 0) + ')'"
                     name="second">
        </el-tab-pane>
        <el-tab-pane :label="'审批中(' + (countData.approving ? countData.approving : 0) + ')'"
                     name="three">
        </el-tab-pane>
        <el-tab-pane label="已通过" name="four"></el-tab-pane>
        <el-tab-pane
          :label="'驳回记录(' + (countData.rejectRecordDeliveryCount ? countData.rejectRecordDeliveryCount : 0) + ')'"
          name="five">
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <v-search :data="searchData" @on-click="search"></v-search>
    <!-- <tab-but :data="btnData" @to-pass="toPass"></tab-but> -->
    <!--<tab-but :data="btnDataExport" @to-pass="toExport"></tab-but>-->
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance" @selection-change="selectionChange">
      <template slot-scope="scope" slot="returnTypeDisplay">
        <span :title="scope.row.returnChangeReason">{{scope.row.returnTypeDisplay}}</span>
      </template>
      <template slot-scope="scope" slot="code">
        <a class="handle" @click="toSalesDetails(scope.row)">{{scope.row.purchasePlanNumber}}</a>
      </template>
      <template slot-scope="scope" slot="codeElse">
        <a class="handle" @click="toSalesDetailsElse(scope.row)">{{scope.row.code}}</a>
      </template>
      <template slot-scope="scope" slot="examine">
        <a class="handle" :class="[!scope.row.rejectFlag ? '' : 'text_red']" @click="toDismissal(scope.row)">审批记录</a>
      </template>
      <template slot-scope="scope" slot="handle">
        <a class="handle" style="margin-left: 10px;" @click="toDetail(scope.row.goodsName)">历史价</a>
        <a v-if="indexCode === '0' || indexCode === '1'" class="handle" style="margin-left: 10px;"
           @click="writePriceMark(scope.row.purchasePlanId)">报价</a>
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
        activeName: 'first',
        urlBeamField: this.$Api.orderManger.getProjectList,
        arrBeamData: [],
        searchData: [
          {
            label: '商品名称：',
            value: '',
            placeholder: '请输入',
            key: 'goodsName'
          }, {
            label: '规格型号：',
            value: '',
            placeholder: '请输入',
            key: 'typeModel'
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
        dataHeader: [],
        dataHeaderSave: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'remarkForPrice', label: '其他要求'},
          {prop: 'purchaseRemark', label: '采购备注'},
          {prop: 'code', label: '采购单号', slot: true},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'examine', label: '审批记录', slot: true},
          {prop: 'currentDiachronic', label: '当前历时'},
          {prop: 'modifyTimeStr', label: '处理时间'},
          {prop: 'handle', label: '操作', slot: true, width: '130'}
        ],
        dataHeaderSaveElse: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'remarkForPrice', label: '其他要求'},
          {prop: 'purchaseRemark', label: '采购备注'},
          {prop: 'codeElse', label: '采购单号', slot: true},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'examine', label: '审批记录', slot: true},
          {prop: 'modifyTimeStr', label: '处理时间'},
          {prop: 'handle', label: '操作', slot: true, width: '130'}
        ],
        tabUrl1: this.$Api.examine.todoList,
        tabUrl2: this.$Api.examine.findAuditRecordGoodsPager,
        urlCount: this.$Api.examine.tabCount,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          stateCode: 10,
          business: 'cgb',
          pageSizes: [10, 50, 100, 500, 1000, 2000],
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
        historyDialogUrl: this.$Api.procurement.priceRecord,
        historyDialogPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          goodsName: '',
          refs: 'table_historyPrice_list'
        },
        historyDialogDataRefs: 'table_historyPrice_list',
        historyDialogSearchData: [{label: '商品名称', value: '', key: 'goodsName', placeholder: '请输入商品名称'}, {label: '梁场名称：', value: '', placeholder: '请选择', key: 'projectId', select: []}],
        isShowHistory: false,
        btnData: [{
          text: '批量通过',
          key: 'to-pass'
        }],
        btnDataExport: [{
          text: '导出',
          key: 'to-export'
        }],
        selection: [],
        isFirst: true,
        indexCode: '0'
      }
    },
    computed: {
      tabUrl () {
        return this.indexCode !== '4' ? this.tabUrl1 : this.tabUrl2
      }
    },
    created () {
      this.getBeamField()
      this.getCount()
      this.dataHeader = this.dataHeaderSave
    },
    methods: {
      getDataHeader (type) {
        let newHeader = []
        this.dataHeaderSave.forEach(item => {
          if (type === '1') {
            if (item.prop !== 'modifyTimeStr') {
              newHeader.push(item)
            }
          } else {
            if (item.prop !== 'currentDiachronic') {
              newHeader.push(item)
            }
          }
        })
        this.dataHeader = newHeader
      },
      toExport () {
      },
      selectionChange (selection) {
        this.selection = selection
      },
      toDismissal (res) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
        this.dialogDataView.show = true
        if (this.indexCode === '0' || this.indexCode === '1' || this.indexCode === '2' || this.indexCode === '3') {
          this.pageView.goodsId = res.id
          this.pageView.typeCode = 1
        } else {
          this.pageView.goodsId = res.businessGoodsId
          this.pageView.typeCode = 1
        }
        this.$Utils.pageUpdateTable([[], this.pageView], this.tablePerformanceView, this)
      },
      viewCancel () {
        this.dialogDataView.show = false
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
          this.countData = res.data.data
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
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
        if (this.isFirst) {
          this.isFirst = false
          this.getDataHeader('1')
        }
      },
      toSalesDetails (res) {
        let routeData = this.$router.resolve({
          name: 'procurementSearch',
          params: {id: res.purchasePlanId}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'procurementSearch', params: {id: res.purchasePlanId}})
      },
      toSalesDetailsElse (res) {
        let routeData = this.$router.resolve({
          name: 'salesDetail',
          params: {id: res.businessId}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'salesDetail', params: {id: res.businessId}})
      },
      tabClick (res) {
        this.searchData.map(item => {
          item.value = ''
        })
        this.dataSearch = {}
        this.indexCode = res.index
        switch (res.index) {
          case '0':
            delete this.page.businessType
            delete this.page.materialState
            this.page.business = 'cgb'
            this.page.stateCode = 10
            this.getDataHeader('1')
            break
          case '1':
            delete this.page.businessType
            delete this.page.materialState
            this.page.business = 'cgb'
            this.page.stateCode = 60
            this.getDataHeader('1')
            break
          case '2':
            delete this.page.businessType
            delete this.page.materialState
            this.page.business = 'cgb'
            this.page.stateCode = 50
            this.getDataHeader('1')
            break
          case '3':
            delete this.page.businessType
            delete this.page.materialState
            this.page.business = 'cgb'
            this.page.stateCode = 70
            this.getDataHeader('2')
            break
          case '4':
            delete this.page.business
            delete this.page.stateCode
            this.page.materialState = 20
            this.page.businessType = 1
            this.dataHeader = this.dataHeaderSaveElse
            break
        }
        let _this = this
        Vue.nextTick().then(function () {
          _this.pageUpdateTable()
        })
      },
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
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
      writePriceMark (id) {
        let routeData = this.$router.resolve({
          name: 'procurementSearch',
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
