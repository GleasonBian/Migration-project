<template>
  <div>
    <el-tabs>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane :label="'待审批(' + (countData.preApproveCount ? countData.preApproveCount : 0) + ')'" name="first">
        </el-tab-pane>
        <el-tab-pane :label="'已驳回记录(' + (countData.rejectPlanCount ? countData.rejectPlanCount : 0) + ')'"
                     name="second">
        </el-tab-pane>
        <el-tab-pane label="已通过记录"
                     name="three">
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but v-if="indexCode !== '2'" :data="btnData" @to-pass="toPass"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance" @selection-change="selectionChange">
      <template v-slot:returnTypeDisplay="scope">
        <span :title="scope.row.returnChangeReason">{{scope.row.returnTypeDisplay}}</span>
      </template>
      <template v-slot:purchasePlanNumber="scope">
        <a class="handle" @click="toSalesDetails(scope.row)">{{scope.row.purchasePlanNumber}}</a>
      </template>
      <template v-slot:codeElse="scope">
        <a class="handle" @click="toSalesDetailsElse(scope.row)">{{scope.row.code}}</a>
      </template>
      <template v-slot:examine="scope">
        <a class="handle" :class="[!scope.row.rejectFlag ? '' : 'text_red']" @click="toDismissal(scope.row)">审批记录</a>
      </template>
      <template v-slot:handle="scope">
        <a class="handle" style="margin-left: 10px;" @click="toDetail(scope.row.goodsName)">历史价</a>
        <a v-show="page.stateCode === 50" class="handle" style="margin-left: 10px;"
           @click="toReject(scope.row)">驳回</a>
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
            key: 'winSupplierName'
          }
        ],
        dataSearch: {},
        dataHeaderSave: [
          {type: 'selection'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'count', label: '数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'purchaseRemark', label: '采购备注'},
          {prop: 'purchasePlanNumber', label: '采购单号', slot: true},
          {prop: 'codeElse', label: '采购单号', slot: true},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'winSupplierName', label: '供应商名称'},
          {prop: 'examine', label: '审批记录', slot: true},
          {prop: 'currentDiachronic', label: '当前历时'},
          {prop: 'modifyTimeStr', label: '处理时间'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        dataHeader: [],
        tabUrl1: this.$Api.examine.todoList,
        tabUrl2: this.$Api.examine.findAuditRecordGoodsPagerByNode,
        urlCount: this.$Api.examine.findListPurchaseMaterialCountByNode,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          stateCode: 50,
          refs: 'supply_examine_table'
        },
        tablePerformance: 'supply_examine_table',
        countData: {},
        dialogDataView: {show: false, title: '物资审批记录', width: '700px'},
        pageView: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          refs: 'supply_table_examine'
        },
        tablePerformanceView: 'supply_table_examine',
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
          key: 'to-pass',
          disabled: false
        }],
        selection: [],
        isFirst: true,
        getGoodsListChange: [],
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
        tabUrlView: this.$Api.examine.queryGoodsApprovalRecord,
        indexCode: '0'
      }
    },
    computed: {
      tabUrl () {
        return this.indexCode === '0' ? this.tabUrl1 : this.tabUrl2
      }
    },
    created () {
      this.getBeamField()
      this.getCount()
    },
    methods: {
      getDataHeader (type) {
        let newHeader = []
        this.dataHeaderSave.forEach(item => {
          if (type === '1') {
            if (item.prop !== 'modifyTimeStr' && item.prop !== 'codeElse' && item.prop !== 'brand' && item.prop !== 'model' && item.prop !== 'count') {
              newHeader.push(item)
            }
          } else {
            if (item.prop !== 'currentDiachronic' && item.prop !== 'purchasePlanNumber' && item.prop !== 'brandName' && item.prop !== 'typeModel' && item.prop !== 'goodsCount') {
              newHeader.push(item)
            }
          }
        })
        this.dataHeader = newHeader
      },
      toPass () {
        this.btnData[0].disabled = true
        let arrData = this.getGoodsListChange
        if (arrData && arrData.length > 0) {
          this.$confirm('批量通过将推送已选择物资进入下一个环节，确定要推送吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.$Api.examine.supplierApprove,
              data: {
                goodsIds: arrData
              },
              cb: res => {
                if (res.data.result) {
                  this.$message('通过成功')
                  this.pageUpdateTable()
                  this.getCount()
                  this.btnData[0].disabled = false
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
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      selectionChange (selection) {
        this.selection = selection
        this.getGoodsListChange = selection.map(item => item.id)
      },
      toDismissal (res) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
        this.dialogDataView.show = true
        this.pageView.goodsId = res.businessGoodsId
        if (this.indexCode === '0') {
          this.pageView.goodsId = res.id
        } else {
          this.pageView.goodsId = res.businessGoodsId
        }
        this.pageView.typeCode = 1
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
      getTableData (data) {
        this.page.totalNum = data.data.total
        if (this.isFirst) {
          this.isFirst = false
          this.getDataHeader('1')
        }
      },
      toSalesDetails (res) {
        this.$router.push({name: 'procurementSearch', params: {id: res.purchasePlanId, approve: 0}})
      },
      toSalesDetailsElse (res) {
        this.$router.push({name: 'procurementSearch', params: {id: res.businessId, approve: 0}})
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
            this.page.stateCode = 50
            this.getDataHeader('1')
            break
          case '1':
            delete this.page.stateCode
            this.page.materialState = 20
            this.page.businessType = 1
            this.getDataHeader('2')
            break
          case '2':
            delete this.page.stateCode
            this.page.materialState = 10
            this.page.businessType = 1
            this.getDataHeader('2')
            break
        }
        let _this = this
        Vue.nextTick().then(function () {
          _this.pageUpdateTable()
        })
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
      toReject (item) {
        this.goodsNameReject = item.goodsName
        this.goodsIdReject = item.id
        this.dialogDataViewReject.show = true
        this.pageViewReject.goodsId = item.id
        this.pageViewReject.typeCode = 1
        this.$Utils.pageUpdateTable([[], this.pageViewReject], this.tablePerformanceViewReject, this)
        this.rejectInfo = ''
      },
      getTableDataViewReject (data) {
        this.pageViewReject.totalNum = data.data.total
      },
      viewCancelReject () {
        this.dialogDataViewReject.show = false
        this.rejectInfo = ''
      },
      cancelDialog () {
        this.dialogDataViewReject.show = false
        this.$bus.emit('form-clear')
      },
      okReject () {
        if (!this.rejectInfo.trim()) {
          this.$message('请输入驳回意见')
        } else {
          this.$confirm('确定要驳回吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.$Api.examine.supplierReject,
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
