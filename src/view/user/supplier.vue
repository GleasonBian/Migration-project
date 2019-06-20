<template>
  <div>
    <v-search :data="searchData" @on-click="searchDataClick">
    </v-search>
    <div class="base_btn_group">
      <el-button type="primary" size="mini" @click="onAdd">新建</el-button>
    </div>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @selection-change="selectionChange"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template v-slot:handle="scope">
        <span class="handle" @click="tableView(scope.row)">查看</span>
        <span class="handle" @click="setCompany(scope.row)">设置企业</span>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <v-dialog :dialog="dialogDataAdd" >
      <form-group :data="dataFormAdd" @on-cancel="cancelAdd" @on-ok="okAdd" :clear=true :custom=true :data-but="dataButAdd" class="box_form"></form-group>
    </v-dialog>
    <v-dialog :dialog="dialogDataView" >
      <form-group :data="dataFormView" @on-resetPassword="resetPassword" @on-edit="okEdit" @on-activate="onActivate" :clear=true :custom=true :data-but="dataButView" class="box_form"></form-group>
    </v-dialog>
    <v-dialog :dialog="dialogCompany" :dialogFooter="dialogViewFooter" @on-ok="dialogViewSave">
      <div>
        <div style="display: flex">
          <el-input v-model="dialogDataSearch.enterpriseName"></el-input>
          <el-button style="margin-left: 10px" @click="dialogViewSearchDataClick">搜索</el-button>
        </div>
        <table-list :dataHeader="DialogtableHeader" @get-table-data="dialogGetTableData" :url="DialogtableUrl" :refs="SupplierDialogTable"
                    :params="dialogPage" style="margin-top: 10px" >
          <template v-slot:radioSelect="scope">
            <el-radio v-model="radioChoose" :label="scope.row">&nbsp;</el-radio>
          </template>
        </table-list>
        <v-page :data="dialogPage" :dataArr="[dialogDataSearch]"></v-page>
      </div>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [
          {label: '用户手机', value: '', key: 'userId'},
          {label: '姓名', value: '', key: 'userName'},
          {
            label: '注册时间',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }
        ],
        TableDataHeader: [
          {type: 'selection'},
          {label: '电话', prop: 'userId'},
          {label: '姓名', prop: 'userName'},
          {label: '企业名称', prop: 'companyName'},
          {label: '职位', prop: 'positionName'},
          {label: 'Email', prop: 'email'},
          {label: '注册时间', prop: 'createTimeToString'},
          {label: '状态', prop: 'accountStatusStr'},
          {label: '操作', prop: 'handle', width: '150', slot: true}
        ],
        DataUrl: this.$Api.user.loadUserInfoQueryData,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_user_list',
          userType: 2
        },
        dataSearch: {},
        tablePerformance: 'tab_user_list',
        selection: [],
        urlBeamField: this.$Api.orderManger.getProjectList,
        arrBeamData: [],
        saveOrUpdate: this.$Api.user.saveOrUpdate,
        dialogDataAdd: {show: false, title: '新建用户', width: '30%'},
        dataButAdd: [{text: '取消', key: 'cancel'}, {text: '提交', type: 'primary', key: 'ok'}],
        dataFormAdd: {
          from: [
            {
              prop: 'userName',
              label: '姓名：',
              value: 'SHEN',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入姓名',
              rules: [{ required: true, message: '请输入姓名', trigger: 'blur,change' }]
            },
            {
              prop: 'userId',
              label: '账号：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入账号',
              rules: [{ required: true, message: '请输入账号', trigger: 'blur,change' }]
            },
            {
              prop: 'email',
              label: '邮箱：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入邮箱'
            },
            {
              prop: 'positionName',
              label: '职位：',
              value: '',
              select: [
                {label: '高层领导', value: '高层领导'},
                {label: '中层领导', value: '中层领导'},
                {label: '公司领导', value: '公司领导'}
              ],
              labelWidth: '120px',
              placeholder: '请选择职位'
            }
          ]
        },
        dialogDataView: {show: false, title: '查看用户', width: '30%'},
        dataButView: [{text: '重置密码', key: 'on-resetPassword'}, {text: '编辑', key: 'on-edit'}, {text: '激活/禁用', key: 'on-activate'}],
        dataFormView: {
          from: [
            {
              prop: 'companyName',
              label: '企业：',
              labelWidth: '120px',
              text: {value: ''}
            },
            {
              prop: 'userName',
              label: '姓名：',
              labelWidth: '120px',
              text: {value: ''}
            },
            {
              prop: 'userId',
              label: '账号：',
              labelWidth: '120px',
              text: {value: ''}
            },
            {
              prop: 'email  ',
              label: '邮箱：',
              labelWidth: '120px',
              text: {value: ''}
            },
            {
              prop: 'userType',
              label: '职位：',
              labelWidth: '120px',
              text: {value: ''}
            },
            {
              prop: 'createTimeToString',
              label: '创建时间：',
              labelWidth: '120px',
              text: {value: ''}
            },
            {
              prop: 'accountStatusStr',
              label: '用户状态：',
              labelWidth: '120px',
              text: {value: ''}
            }
          ]
        },
        selectUserData: {},
        dialogCompany: {show: false, title: '设置企业', width: '30%'},
        DialogtableHeader: [
          {label: '', slot: true, prop: 'radioSelect', width: 50},
          {label: '企业名称', prop: 'enterpriseName'}
        ],
        DialogtableUrl: this.$Api.user.getSupplierManager,
        SupplierDialogTable: 'tab_Dialog_list',
        dialogPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_Dialog_list'
        },
        dialogDataSearch: {},
        radioChoose: {},
        dialogViewFooter: [
          {
            text: '取消',
            key: 'cancel'
          }, {
            text: '确定',
            type: 'primary',
            key: 'ok'
          }
        ],
        editflag: false
      }
    },
    methods: {
      tableView (res) {
        this.dialogDataView.show = true
        this.selectUserData = res
        this.dataFormView.from.map((item) => {
          item.text.value = res[item.prop]
        })
      },
      onAdd () {
        // this.formClear()
        this.editflag = false
        this.dialogDataAdd.show = true
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      dialogViewSearchDataClick (res) {
        if (JSON.stringify(this.dialogDataSearch) === '{}') {
          this.dialogPage.offset = 0
          this.dialogPage.currentPage = 1
        }
        this.pageUpdateTable([this.dialogDataSearch, this.dialogPage], this.SupplierDialogTable, this)
      },
      searchDataClick (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      selectionChange (selection) {
        this.selection = selection
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      cancelAdd () {
        this.dialogDataAdd.show = false
        this.formClear()
      },
      formClear () {
        this.$bus.emit('form-clear')
      },
      okAdd (res) {
        if (this.editflag) {
          res.id = this.selectUserData.id
        }
        this.saveOrUpdateHttp(res)
      },
      saveOrUpdateHttp (res) {
        res.userTypeCode = 2
        this.$Ajax.post({
          url: this.saveOrUpdate,
          data: res,
          cb: (res) => {
            if (res.data.result) {
              this.cancelAdd()
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      resetPassword () {
        this.$Ajax.post({
          url: this.$Api.user.revertPwd,
          data: {userId: this.selectUserData.id},
          cb: (res) => {
            if (res.data.result) {
              this.dialogDataView.show = false
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      setCompany (res) {
        this.selectUserData = res
        this.dialogCompany.show = true
      },
      okEdit () {
        this.editflag = true
        this.dialogDataView.show = false
        this.dataFormAdd.from.map((item) => {
          item.value = this.selectUserData[item.prop]
        })
        this.dialogDataAdd.show = true
      },
      dialogGetTableData (data) {
        this.dialogPage.totalNum = data.data.total
      },
      onActivate () {
        let accountStatus = ''
        if (this.selectUserData.accountStatus === 1) {
          accountStatus = 2
        } else {
          accountStatus = 1
        }
        this.$Ajax.post({
          url: this.$Api.user.updateAccountStatus,
          data: {userId: this.selectUserData.id, accountStatus: accountStatus},
          cb: (res) => {
            if (res.data.result) {
              this.dialogDataView.show = false
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      dialogViewSave () {
        this.dialogCompany.show = false
        this.$Ajax.post({
          url: this.$Api.user.setCompany,
          data: {userId: this.selectUserData.id, companyId: this.radioChoose.id},
          cb: (res) => {
            if (res.data.result) {
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
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
  }
  .handle:hover{
    text-decoration: underline;
  }
</style>
