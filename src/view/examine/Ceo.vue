<template>
  <div>
    <el-tabs>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane :label="'待审批物资(' + (countData ? countData : 0) + ')'"
                     name="first">
        </el-tab-pane>
        <el-tab-pane :label="'采购驳回记录(' + (countDataElse.rejectPlanCount ? countDataElse.rejectPlanCount : 0) + ')'"
                     name="two">
        </el-tab-pane>
        <el-tab-pane label="采购通过记录" name="three">
        </el-tab-pane>
        <el-tab-pane
          :label="'销售驳回记录(' + (countDataElse.rejectDeliveryCount ? countDataElse.rejectDeliveryCount : 0) + ')'"
          name="four">
        </el-tab-pane>
        <el-tab-pane label="销售通过记录" name="five">
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but v-if="indexCode === '0'" :data="btnData"
             @to-pass="toPass"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance" @selection-change="selectionChange">
      <template v-slot:returnTypeDisplay="scope">
        <span :title="scope.row.returnChangeReason">{{scope.row.returnTypeDisplay}}</span>
      </template>
      <template v-slot:code="scope">
        <a class="handle" @click="toSalesDetails(scope.row)">{{scope.row.code}}</a>
      </template>
      <template v-slot:examine="scope">
        <a v-if="indexCode !== '0'" class="handle" :class="[!scope.row.rejectFlag ? '' : 'text_red']"
           @click="toDismissal(scope.row)">审批记录</a>
        <div v-else>
          <a class="handle" :class="[!scope.row.rejectFlag ? '' : 'text_red']" @click="toDismissal(scope.row, '1')">采购审批记录</a>
          <a class="handle" :class="[!scope.row.rejectFlag ? '' : 'text_red']" @click="toDismissal(scope.row, '2')">销售审批记录</a>
        </div>
      </template>
      <template v-slot:handle="scope">
        <a v-if="indexCode === '0'" class="handle"
           @click="toDetail(scope.row.goodsName, '1')">销售价</a>
        <a v-if="indexCode === '0'" class="handle"
           @click="toDetail(scope.row.goodsName, '2')">采购价</a>
        <a v-if="indexCode === '1' || indexCode === '2'" class="handle"
           @click="toDetail(scope.row.goodsName, '2')">历史价</a>
        <a v-if="indexCode === '3' || indexCode === '4'" class="handle"
           @click="toDetail(scope.row.goodsName, '1')">历史价</a>
        <a v-if="indexCode === '0'" class="handle"
           @click="toReject(scope.row, '2')">驳回采购</a>
        <a v-if="indexCode === '0'" class="handle" @click="toReject(scope.row, '1')">驳回销售</a>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!-- 审批记录 -->
    <examine-dialog :dialogDataView="dialogDataView" :pageView="pageView" :goodsName="goodsName"
                    :tablePerformanceView="tablePerformanceView"></examine-dialog>
    <!--历史价-->
    <history-dialog :historyDialog="historyDialog" :historyDialogPage="historyDialogPage"
                    :historyDialogDataRefs="historyDialogDataRefs" :isShowHistory="isShowHistory"
                    :historyDialogSearchData="historyDialogSearchData" :historyDialogUrl="getHistoryDialogUrl"></history-dialog>
    <!-- 驳回 -->
    <v-dialog :dialog="dialogDataViewReject" @on-cancel="viewCancelReject">
      <div>物资名称：{{goodsNameReject}}</div>
      <br/>
      <table-list :data-header="dataHeaderViewReject" :url="tabUrlView" :params="pageViewReject"
                  @get-table-data="getTableDataViewReject"
                  :refs="tablePerformanceViewReject"></table-list>
      <v-page :data="pageViewReject" :dataArr="[]"></v-page>
      <div>审批意见（必填）</div>
      <br/>
      <form-group :data="dataForm" style="width: 100%" :custom=true @on-cancel="cancelDialog" @on-ok="okReject"
                  :data-but="dataBut">
        <template v-slot:reject="scope">
          <textarea name="" id="" rows="5" style="width: 100%" v-model="rejectInfo"></textarea>
        </template>
      </form-group>
    </v-dialog>
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
          }, {
            label: '供应商名称：',
            value: '',
            placeholder: '请输入',
            key: 'supplierName'
          }
        ],
        dataSearch: {},
        dataHeader: [
          {type: 'selection'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'purchaseRemark', label: '采购备注'},
          {prop: 'quotationEnumDisplay', label: '报价类型'},
          {prop: 'recommendGoodsPrice', label: '售价'},
          {prop: 'unitPrice', label: '进价'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'grossMarginRatio', label: '毛利率%'},
          {prop: 'winSupplierName', label: '供应商'},
          {prop: 'code', label: '采购单号', slot: true},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
          {prop: 'examine', label: '审批记录', slot: true},
          {prop: 'currentDiachronic', label: '当前历时'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        tabUrl1: this.$Api.examine.findPendingMaterialByNode,
        tabUrl2: this.$Api.examine.findAuditRecordGoodsPagerByNode,
        urlCount: this.$Api.examine.findListPurchaseMaterialCountByNode,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'product_data_examine_table'
        },
        tablePerformance: 'product_data_examine_table',
        countData: {},
        countDataElse: {},
        dialogDataView: {show: false, title: '物资审批记录', width: '700px'},
        dataHeaderView: [
          {prop: 'createTimeStr', label: '更新时间'},
          {prop: 'nodeName', label: '审批节点'},
          {prop: 'createrName', label: '姓名'},
          {prop: 'appstateDisplay', label: '审批状态'},
          {prop: 'remark', label: '审批意见'}
        ],
        tabUrlView: this.$Api.examine.queryGoodsApprovalRecord,
        pageView: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'product_data_table_examine'
        },
        tablePerformanceView: 'product_data_table_examine',
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
        getHistoryDialogUrl: '',
        historyDialogUrl: this.$Api.order.priceRecord,
        historyDialogUrlE: this.$Api.procurement.priceRecord,
        historyDialogPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          goodsName: '',
          refs: 'table_historyPrice_list_product'
        },
        historyDialogDataRefs: 'table_historyPrice_list_product',
        historyDialogSearchData: [{label: '商品名称', value: '', key: 'goodsName', placeholder: '请输入商品名称'}, {label: '梁场名称：', value: '', placeholder: '请选择', key: 'projectId', select: []}],
        isShowHistory: false,
        btnData: [{
          text: '批量通过',
          key: 'to-pass',
          disabled: false
        }],
        selection: [],
        dialogDataViewReject: {show: false, title: '物资审批记录', width: '700px'},
        dataHeaderViewReject: [
          {prop: 'createTimeStr', label: '更新时间'},
          {prop: 'nodeName', label: '审批节点'},
          {prop: 'createrName', label: '姓名'},
          {prop: 'appstateDisplay', label: '审批状态'},
          {prop: 'remark', label: '审批意见'}
        ],
        pageViewReject: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          refs: 'product_data_table_examine_reject'
        },
        tablePerformanceViewReject: 'product_data_table_examine_reject',
        goodsNameReject: '',
        goodsIdReject: '',
        dataForm: {
          from: [{
            prop: 'reject',
            label: '',
            value: '',
            labelWidth: '0',
            custom: true
          }]
        },
        dataBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
        rejectInfo: '',
        indexCode: '0',
        getGoodsListChange: [],
        typeReject: null
      }
    },
    computed: {
      tabUrl () {
        let url = ''
        if (this.indexCode === '0') {
          url = this.tabUrl1
        } else {
          url = this.tabUrl2
        }
        return url
      }
    },
    created () {
      this.getBeamField()
      this.getCount()
    },
    methods: {
      toPass () {
        this.btnData[0].disabled = true
        let arrData = this.getGoodsListChange
        let url = this.$Api.examine.routineBatchInternalAuditPass
        if (arrData && arrData.length > 0) {
          this.$confirm('批量通过将推送已选择物资进入下一个环节，确定要推送吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: url,
              data: {
                goodsIds: arrData
              },
              cb: res => {
                if (res.data.result) {
                  this.btnData[0].disabled = false
                  this.$message('通过成功')
                  this.pageUpdateTable()
                  this.getCount()
                }
              }
            })
          }).catch(() => {
            this.btnData[0].disabled = false
          })
        } else {
          this.btnData[0].disabled = false
          this.$message('请选择物资')
        }
      },
      selectionChange (selection) {
        this.selection = selection
        this.getGoodsListChange = selection.map(item => item.id)
      },
      toDismissal (res, type) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
        this.dialogDataView.show = true
        if (this.indexCode === '0') {
          this.pageView.goodsId = res.id
          this.pageView.typeCode = type
        } else {
          if (this.indexCode === '1' || this.indexCode === '2') {
            this.pageView.typeCode = 1
          } else {
            this.pageView.typeCode = 2
          }
          this.pageView.goodsId = res.businessGoodsId
        }
        this.$Utils.pageUpdateTable([[], this.pageView], this.tablePerformanceView, this)
      },
      viewCancel () {
        this.dialogDataView.show = false
      },
      getTableDataView (data) {
        this.pageView.totalNum = data.data.total
      },
      ajaxPost (url, data, cb) {
        this.$Ajax.post({
          url: url,
          data: data,
          cb: cb
        })
      },
      getCount () {
        this.ajaxPost(this.tabUrl1, {}, (res) => {
          this.countData = res.data.total
        })
        this.ajaxPost(this.urlCount, {}, (res) => {
          this.countDataElse = res.data
        })
      },
      getBeamField () {
        this.ajaxPost(this.urlBeamField, {}, (res) => {
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
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      toSalesDetails (res) {
        let id = ''
        let name = ''
        if (this.indexCode === '0' || this.indexCode === '1' || this.indexCode === '2') {
          id = res.purchasePlanId
          name = 'detailsProcurement'
        } else if (this.indexCode === '3' || this.indexCode === '4') {
          id = res.businessId
          name = 'detailsProcurement'
        } else {
          id = res.businessId
          name = 'salesDetail'
        }
        this.$router.push({name: name, params: {id: id}})
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
            delete this.page.materialState
            delete this.page.businessType
            break
          case '1':
            this.page.materialState = 20
            this.page.businessType = 1
            break
          case '2':
            this.page.materialState = 10
            this.page.businessType = 1
            break
          case '3':
            this.page.materialState = 20
            this.page.businessType = 2
            break
          case '4':
            this.page.materialState = 10
            this.page.businessType = 2
            break
        }
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
      toDetail (goodsName, type) {
        this.historyDialogSearchData.map(item => {
          if (item.key !== 'goodsName') {
            item.value = ''
          }
        })
        if (type === '1') {
          this.getHistoryDialogUrl = this.historyDialogUrl
        } else {
          this.getHistoryDialogUrl = this.historyDialogUrlE
        }
        this.historyDialogPage.goodsName = goodsName
        this.historyDialogPage.projectId = ''
        this.historyDialogSearchData[0].value = goodsName
        let _this = this
        Vue.nextTick().then(function () {
          _this.$Utils.pageUpdateTable([_this.historyDialogPage], _this.historyDialogDataRefs, _this)
        })
        this.isShowHistory = true
        this.historyDialog.show = true
      },
      historyDialogGetTableData (data) {
        this.historyDialogPage.totalNum = data.data.total
      },
      okReject () {
        let url = ''
        if (!this.rejectInfo.trim()) {
          this.$message('请输入驳回意见')
        } else {
          this.$confirm('确定要驳回吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            if (this.typeReject === 1) {
              url = this.$Api.examine.rejectListPurchaseGoods
            } else {
              url = this.$Api.examine.supplierReject
            }
            this.$Ajax.post({
              url: url,
              data: {
                goodsId: this.goodsIdReject,
                remark: this.rejectInfo
              },
              cb: res => {
                if (res.data.result) {
                  this.$message('已驳回')
                  this.dialogDataViewReject.show = false
                  this.pageUpdateTable()
                  this.getCount()
                }
              }
            })
          }).catch(() => {
          })
        }
      },
      toReject (item, type) {
        if (type === '1') {
          this.typeReject = 1
          this.pageViewReject.typeCode = 2
        } else {
          this.typeReject = 2
          this.pageViewReject.typeCode = 1
        }
        this.goodsNameReject = item.goodsName
        this.goodsIdReject = item.id
        this.dialogDataViewReject.show = true
        this.pageViewReject.goodsId = item.id
        this.$Utils.pageUpdateTable([[], this.pageViewReject], this.tablePerformanceViewReject, this)
        this.rejectInfo = ''
      },
      viewCancelReject () {
        this.dialogDataViewReject.show = false
        this.rejectInfo = ''
      },
      getTableDataViewReject (data) {
        this.pageViewReject.totalNum = data.data.total
      },
      cancelDialog () {
        this.dialogDataViewReject.show = false
        this.$bus.emit('form-clear')
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
