配送出库单号<template>
  <div>
    <div>新建采购计划</div>
    <form-group :data="dataFormAdd" @on-cancel="cancelAdd" @on-ok="okAdd" :custom=true :data-but="dataButAdd" class="txt_fr">
      <template slot-scope="scope" slot="listPurchaserId">
        <el-input v-model="scope.rows.value" placeholder="请选择" readonly @focus="toDialog"></el-input>
      </template>
      <template slot-scope="scope" slot="projectName">
        <el-input v-model="scope.rows.value" placeholder="请选择" readonly @focus="toDialog"></el-input>
      </template>
      <template slot-scope="scope" slot="table">
        <div v-show="isTrue">
          <br><br>
          <h5>选择配送出库单</h5>
          <br>
          <v-search :data="searchDataSr" @on-click="searchClickSr"></v-search>
          <br>
          <table-list :data-header="dataHeaderDialogSr" :url="tabUrlDialogSr" :params="pageDialogSr" :refs="tableDialogSr" v-show="isTrue" @selection-change="selectionChange">
          </table-list>
        </div>
      </template>
    </form-group>

    <v-dialog :dialog="dialogDataSetAdmin">
      <v-search :data="searchData" @on-click="searchClick"></v-search>
      <table-list :data-header="dataHeaderDialog" :url="tabUrlDialog" :params="pageDialog" @get-table-data="getTableDataDialog" :refs="tableDialog">
        <template slot-scope="scope" slot="choose">
          <el-radio v-model="radioChoose" :label="scope.row.id" @change="radioChange(scope.row)">&nbsp;</el-radio>
        </template>
      </table-list>
      <v-page :data="pageDialog" :dataArr="[dataSearch]"></v-page>
    </v-dialog>

    <v-dialog :dialog="dialogDataSetAdminSr" :dialogFooter="dialogFooter" @on-ok="saveDialogSr">
      <table-list :data-header="attrHeader" :url="attrHeaderUrl" :params="attrHeaderPage" :refs="tableRefsAttr">
      </table-list>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataFormAdd: {
          from: [
            {
              prop: 'type',
              label: '采购类型：',
              value: '',
              labelWidth: '120px',
              radio: [
                {label: '0', text: '物资采购'}, {label: '1', text: '设备采购'}
              ],
              defaultVal: '0'
            }, {
              prop: 'listPurchaserId',
              label: '采购员：',
              value: '',
              labelWidth: '120px',
              custom: true
            }, {
              prop: 'projectName',
              label: '梁场名称：',
              value: '',
              labelWidth: '120px',
              custom: true
            }, {
              prop: 'remark',
              label: '备注：',
              value: '',
              labelWidth: '120px',
              type: 'textarea',
              rows: 4
            }, {
              prop: 'table',
              label: '',
              value: '',
              labelWidth: '0px',
              custom: true
            }
          ]
        },
        dataButAdd: [
          {
            text: '返回列表',
            key: 'cancel'
          }, {
            text: '查看商品',
            type: 'primary',
            key: 'ok'
          }
        ],
        attrHeader: [
          {prop: 'goodsId', label: '商品编号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'applicaNum', label: '数量'}
        ],
        tableRefsAttr: 'tab_demand_la',
        dialogDataSetAdmin: {show: false, title: '选择采购员'},
        searchData: [{label: '姓名', value: '', key: 'userName'}, {label: '梁场名称', value: '', key: 'projectId', select: []}],
        dataHeaderDialog: [{prop: 'choose', label: '', slot: true, width: '100px'}, {prop: 'userName', label: '名称'}, {prop: 'projectName', label: '梁场名称'}],
        tabUrlDialog: this.$Api.demand.loadPurchaseUserInfoByPage,
        pageDialog: {totalNum: 0, currentPage: 1, offset: 0, refs: 'tab_demand_laD'},
        tableDialog: 'tab_demand_laD',
        radioChoose: '',
        dataSearch: {},
        dialogDataSetAdminSr: {show: false, title: '选择配送出库单'},
        searchDataSr: [
          {
            label: '采购员',
            value: '',
            key: 'listPurchaserId',
            select: []
          }, {
            label: '创建时间',
            value: '',
            key: 'receiveStartTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }
        ],
        dataHeaderDialogSr: [
          {type: 'selection', width: '10px'},
          {prop: 'applicaFormCode', label: '送货验收单号'},
          {prop: 'warehouseName', label: '仓库名称'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'listPurchaserName', label: '采购员'},
          {prop: 'stateStr', label: '状态'},
          {prop: 'applicaUserName', label: '创建人'}
        ],
        tabUrlDialogSr: this.$Api.demand.findApplicaFormListByProjectId,
        pageDialogSr: {refs: 'tab_demand_laDSr'},
        tableDialogSr: 'tab_demand_laDSr',
        dataSearchSr: {},
        isTrue: false,
        dialogFooter: [
          {
            text: '立即推送',
            type: 'primary',
            key: 'ok'
          }, {
            text: '取消',
            key: 'cancel'
          }
        ],
        selection: [],
        attrHeaderUrl: this.$Api.demand.formatApplicaFormList,
        attrHeaderPage: {refs: 'tab_demand_la'}
      }
    },
    created () {
      this.getSelect()
    },
    methods: {
      selectionChange (selection) {
        this.selection = selection
      },
      getSelect () {
        this.$Ajax.post({
          url: this.$Api.orderManger.getProjectList,
          cb: (res) => {
            if (res.data.data) {
              res.data.data.map(item => {
                this.searchData[1].select.push({value: item.id, label: item.projectName})
              })
            }
          }
        })
      },
      cancelAdd () {
        this.$router.push({name: 'demandLibrary'})
      },
      okAdd (res) {
        if (this.isTrue) {
          if (this.selection.length !== 0) {
            let ids = []
            this.selection.map(item => {
              ids.push(item.id)
            })
            this.attrHeaderPage.applicaFormIds = ids.join(',')
            this.pageUpdateTable([this.attrHeaderPage], this.tableRefsAttr)
            this.dialogDataSetAdminSr.show = true
          } else {
            this.$message('请选择配送出库单！')
          }
        } else {
          this.$message.error('请选择采购员和梁场名称！')
        }
      },
      toDialog () {
        this.dialogDataSetAdmin.show = true
        this.pageUpdateTable([this.dataSearch, this.pageDialog], this.tableDialog)
      },
      saveDialogSr () {
        let ids = []
        this.selection.map(item => {
          ids.push(item.id)
        })
        let data = {
          applicaFormIds: ids.join(','),
          listPurchaserId: this.dataFormAdd.from[1].id,
          type: parseInt(this.dataFormAdd.from[0].defaultVal),
          remark: this.dataFormAdd.from[3].value
        }
        this.$Ajax.post({
          url: this.$Api.demand.createListPurchase,
          data: data,
          cb: (res) => {
            if (res.data.result) {
              this.$message('推送成功！')
              this.cancelAdd()
            }
          }
        })
      },
      searchClick (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.pageDialog.offset = 0
          this.pageDialog.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearch, this.pageDialog], this.tableDialog)
      },
      searchClickSr (res) {
        if (res.endTime) {
          res.receiveEndTime = res.endTime
        }
        this.pageUpdateTable([res, this.pageDialogSr], this.tableDialogSr)
      },
      pageUpdateTable (dataArr, refs) {
        this.$Utils.pageUpdateTable(dataArr, refs, this)
      },
      getTableDataDialog (data) {
        this.pageDialog.totalNum = data.data.total
      },
      radioChange (val) {
        this.dataFormAdd.from[1].id = val.id
        this.dataFormAdd.from[1].value = val.userName
        this.dataFormAdd.from[2].value = val.projectName
        if (val.projectId) {
          this.pageDialogSr.projectId = val.projectId
          this.getPurchaseUser(val.projectId)
          this.isTrue = true
          this.pageUpdateTable([this.pageDialogSr], this.tableDialogSr)
        } else {
          this.$message.error('没有梁场名称')
        }
        this.dialogDataSetAdmin.show = false
      },
      getPurchaseUser (projectId) {
        this.$Ajax.post({
          url: this.$Api.demand.loadPurchaseUserInfoByProjecId,
          data: {projectId: projectId},
          cb: (res) => {
            if (res.data.data) {
              this.searchDataSr[0].select = []
              res.data.data.map(item => {
                this.searchDataSr[0].select.push({value: item.id, label: item.userName})
              })
            }
          }
        })
      }
    }
  }
</script>

<style>
  .txt_fr { margin: 50px 0}
  .txt_fr .dataBut{text-align: center;  margin-top: 50px;}
</style>
