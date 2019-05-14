<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @on-add="addData" @cancel-data="cancelData"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" :refs="tableDemandSceneList"
                @get-table-data="getTableData" @selection-change="selectionChange">
      <template slot-scope="scope" slot="stateStr">
        <span :class="[scope.row.stateStr === '已驳回' ? 'txtRed' : '']">{{scope.row.stateStr}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-select v-model="scope.row.value" placeholder="请选择" @change="changeSelectOperation(scope.row)">
          <el-option key="btn1" label="查看" value="btn1" v-show="scope.row.stateCode !== -1"></el-option>
          <el-option key="btn2" label="询价" value="btn2" v-show="scope.row.stateCode === 1 || scope.row.stateCode === 2 || scope.row.stateCode === 3"></el-option>
          <el-option key="btn3" label="进货" value="btn3" v-show="scope.row.stateCode !== -1"></el-option>
          <el-option key="btn4" label="编辑" value="btn4" v-show="scope.row.stateCode === -1"></el-option>
          <el-option key="btn5" label="删除" value="btn5" v-show="$Utils.getPageElement($Consts.PERMISSION.detPurchasePlan.code)"></el-option>
          <el-option key="btn6" label="关闭（鲁班驳回）" value="btn6"></el-option>
        </el-select>
        <!--<router-link class="handle" :to="{name: 'detailsProcurement', params:{id: scope.row.id}}" tag="a" target="_blank" v-show="scope.row.stateCode !== -1">查看</router-link>&nbsp;&nbsp;&nbsp;-->
        <!--<router-link class="handle" :to="{name: 'procurementSearch', params:{id: scope.row.id, approve: 0}}" tag="a" target="_blank" v-show="scope.row.stateCode === 1 || scope.row.stateCode === 2 || scope.row.stateCode === 3">询价</router-link>&nbsp;&nbsp;&nbsp;-->
        <!--<router-link class="handle" :to="{name: 'procurementOrder', params: {id: scope.row.id, type: '1'}}" tag="a" target="_blank" v-show="scope.row.stateCode !== -1">进货</router-link>&nbsp;&nbsp;&nbsp;-->
        <!--&lt;!&ndash;<el-button type="text" size="mini" @click="stock(scope.row)" v-show="scope.row.stateCode !== -1">进货</el-button>&ndash;&gt;-->
        <!--<el-button type="text" size="mini" v-show="scope.row.stateCode === -1 || scope.row.stateCode === 1" @click="toEdit(scope.row)">编辑</el-button>-->
        <!--<span class="handle" style="margin-left: 10px;" @click="toDelete(scope.row.id)" v-show="$Utils.getPageElement($Consts.PERMISSION.detPurchasePlan.code)">删除</span>-->
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--删除原因-->
    <v-dialog :dialog="dialogDataDel" @on-cancel="viewCancelDel">
      <form-group :data="dataFormDel" @on-cancel="cancelDialog" :custom="true" @on-ok="okReject" :data-but="dataBut">
      </form-group>
    </v-dialog>
    <!--关闭计划-->
    <v-dialog :dialog="dialogDataClose">
      <form-group :data="dataFormClose" @on-cancel="cancelDialogClose" :custom="true" @on-ok="okClose" :data-but="dataButClose">
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [{
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
        }, {
          label: '计划来源：',
          value: '',
          key: 'planSourceCode',
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
          key: 'number',
          label: '采购单号:',
          value: '',
          placeholder: '请输入采购单号'
        }, {
          key: 'stateCode',
          label: '需求状态：',
          value: '',
          select: []
        }, {
          key: 'materialName',
          label: '物资名称:',
          value: '',
          placeholder: '请输入物资名称'
        }, {
          key: 'id',
          label: '计划单号:',
          value: '',
          placeholder: '请输入计划单号'
        }, {
          key: 'lubanPlanCode',
          label: '鲁班计划:',
          value: '',
          placeholder: '请输入鲁班计划'
        }],
        dataSearch: {},
        btnData: [{
          text: '新增',
          key: 'add',
          icon: 'el-icon-plus'
        }, {
          text: '取消',
          key: 'cancel-data'
        }],
//        btnData: [{
//          text: '取消',
//          key: 'cancel-data'
//        }],
        dataHeader: [{
          type: 'selection'
        }, {
          prop: 'id',
          label: '计划单号'
        }, {
          prop: 'orderNumber',
          label: '关联采购单号'
        }, {
          prop: 'lubanPlanCode',
          label: '鲁班计划'
        }, {
          prop: 'planSourceDisplay',
          label: '计划来源'
        }, {
          prop: 'number',
          label: '采购单号'
        }, {
          prop: 'typeStr',
          label: '采购类型'
        }, {
          prop: 'projectName',
          label: '梁场名称'
        }, {
          prop: 'goodsCountPassedAndAll',
          label: '物资数量',
          width: '120px',
          renderHeader: this.renderHeaderGoods
        }, {
          prop: 'goodsPriceTotle',
          label: '总金额'
        }, {
          prop: 'quotationSupplierInfo',
          label: '报价供应商'
        }, {
          prop: 'expectedDeliveryTime',
          label: '期望到货时间'
        }, {
          prop: 'stateStr',
          label: '计划状态',
          slot: true
        }, {
          prop: 'creater',
          label: '创建人'
        }, {
          prop: 'createTimeStr',
          label: '创建时间'
        }, {
          prop: 'operation',
          label: '操作',
          width: '250px',
          slot: true
        }],
        tabUrl: this.$Api.procurement.getPagePurchasePlanList,
        tableDemandSceneList: 'table_demand_scene_list_12',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_demand_scene_list_12'
        },
        operationBtn: [{
          text: '查看',
          key: 'on-detail',
          type: 'text'
        }, {
          text: '导出',
          key: 'to-export',
          type: 'text'
        }, {
          text: '编辑',
          key: 'edit-data',
          type: 'text'
        }],
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlState: this.$Api.procurement.getPurchasePlanState,
        urlCancelData: this.$Api.demand.cancelledPurchaseRequestByIds,
        arrBeamData: [],
        arrStateData: [],
        selection: [],
        idsArr: [],
        dialogDataDel: {show: false, title: '删除原因', width: '500px'},
        dataFormDel: {
          from: [{
            prop: 'deletedReason',
            label: '删除原因',
            value: '',
            labelWidth: '100px',
            required: true,
            placeholder: '请输入删除原因',
            rules: [{required: true, message: '请输入删除原因', trigger: 'blur,change'}]
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
        idDel: 0,
        dialogDataClose: {show: false, title: '关闭计划', width: '600px'},
        dataFormClose: {
          from: [{
            prop: 'closeReason',
            label: '关闭原因',
            value: '',
            labelWidth: '100px',
            required: true,
            placeholder: '请输入关闭原因',
            rules: [{required: true, message: '请输入关闭原因', trigger: 'blur,change'}]
          }, {
            prop: 'orderNumber',
            label: '关联单号',
            value: '',
            labelWidth: '100px',
            required: true,
            placeholder: '请输入删除原因',
            rules: [{required: true, message: '请输入关联单号', trigger: 'blur,change'}]
          }]
        },
        dataButClose: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
        idClose: ''
      }
    },
    created () {
      this.getBeamField()
      this.getState()
      this.getSourceState()
    },
    methods: {
      getSourceState () {
        this.ajaxPost(this.$Api.sale.getPlanSourceState, (res) => {
          if (res.data.result) {
            this.searchData.map(item => {
              if (item.key === 'planSourceCode') {
                item.select = res.data.data
              }
            })
          }
        })
      },
      changeSelectOperation (row) {
        let routeData = {}
        switch (row.value) {
          case 'btn1':
            routeData = this.$router.resolve({
              name: 'detailsProcurement',
              params: {id: row.id}
            })
            window.open(routeData.href, '_blank')
            break
          case 'btn2':
            routeData = this.$router.resolve({
              name: 'procurementSearch',
              params: {id: row.id, approve: 0}
            })
            window.open(routeData.href, '_blank')
            break
          case 'btn3':
            routeData = this.$router.resolve({
              name: 'procurementOrder',
              params: {id: row.id, type: '1'}
            })
            window.open(routeData.href, '_blank')
            break
          case 'btn4':
            this.toEdit(row)
            break
          case 'btn5':
            this.toDelete(row.id)
            break
          case 'btn6':
            this.toClose(row)
            break
        }
        this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
      },
      renderHeaderGoods (h) {
        return (
          <div>
          <span> 物资数量 </span>
          <span title='内审通过数量/总数量' style='cursor:pointer'>...</span>
          </div>
        )
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
      fliterSelectState (res) {
        let arrState = []
        if (res.length) {
          res.map(item => {
            arrState.push({label: item.display, value: item.code})
          })
        }
        return arrState
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
          }
        })
      },
      getState () {
        this.ajaxPost(this.urlState, (res) => {
          if (res.data.result) {
            this.arrStateData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'stateCode') {
                item.select = this.fliterSelectState(this.arrStateData)
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
      getTableData (data) {
        this.page.totalNum = data.data.total
        data.data.rows.map(item => {
          item.quotationSupplierInfo = item.quotationSupplierCount + '/' + item.quotationAllSupplierCount
        })
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
      },
      addData () {
        this.jumpPage('addProcurement')
      },
      selectionChange (selection) {
        this.selection = selection
      },
      cancelData () {
        this.idsArr = []
        if (this.selection.length) {
          this.selection.map(item => {
            this.idsArr.push(item.id)
          })
          this.$Ajax.post({
            url: this.urlCancelData,
            data: {
              ids: this.idsArr.join(',')
            },
            cb: res => {
              if (res.data.result) {
                this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
              }
            }
          })
        } else {
          this.$message('请选择数据')
        }
      },
      toDetails (res) {
        this.jumpPageParams('sceneDetails', {id: res.id})
      },
      toEdit (res) {
        let routeData = this.$router.resolve({
          name: 'editProcurement',
          params: {id: res.id}
        })
        window.open(routeData.href, '_blank')
      },
      toExport (res) {
        location.href = this.$Api.demand.exportPurchaseRequesBuyId + '?id=' + res.id
      },
      stock (row) {
        this.$router.push({name: 'procurementOrder', params: {id: row.id}})
      },
      toDelete (id) {
        this.idDel = id
        this.dialogDataDel.show = true
      },
      viewCancelDel () {
        this.dialogDataDel.show = false
      },
      cancelDialog () {
        this.dialogDataDel.show = false
        this.$bus.emit('form-clear')
      },
      okReject (res) {
        let json = res
        json.ids = [this.idDel]
        this.$Ajax.post({
          url: this.$Api.order.deletePurchasePlan,
          data: {
            json: JSON.stringify(json)
          },
          cb: res => {
            if (res.data.result) {
              this.cancelDialog()
              this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
            }
          }
        })
      },
      toClose (row) {
        this.idClose = row.id
        this.dialogDataClose.show = true
      },
      cancelDialogClose () {
        this.dialogDataClose.show = false
        this.$bus.emit('form-clear')
      },
      okClose (row) {
        row.id = this.idClose
        this.$Ajax.post({
          url: this.$Api.order.closePurchaseLan,
          data: row,
          cb: res => {
            if (res.data.result) {
              this.$message(res.data.message)
              this.cancelDialogClose()
              this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .handle{
    font-size: 12px;
    color: #008aff;
    cursor:pointer;
    text-decoration: none;
    margin-left: 5px;
  }
  .handle:hover{
    text-decoration: none;
  }
  .txtRed{ color: red;}
</style>
<style>
  .tabBut.base_btn_group{
    display: initial;
  }
</style>
