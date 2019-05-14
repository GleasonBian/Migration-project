<template>
  <div>
    <v-search :data="searchData" @on-click="searchDataClick">
    </v-search>
    <tab-but :data="btnData" @on-add="addUser"></tab-but>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @selection-change="selectionChange"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="operation">
        <div>
          <span class="handle" @click="toSet(scope.row)">设置职位</span>
          <span class="handle" @click="onDetails(scope.row)">查看</span>
          <span class="handle" @click="editUser(scope.row)">编辑</span>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>

    <v-dialog :dialog="dialogView" :dialogFooter="dialogViewFooter" @on-ok="dialogViewSave">
      <v-search :data="dialogViewSearchdata" @on-click="dialogViewSearchDataClick"></v-search>
      <table-list
        :data-header="dialogHeader"
        :url="dialogDataUrl"
        @selection-change="dialogselectionChange"
        @get-table-data="dialogGetTableData"
        :params="dialogPage"
        :refs="dialogTableRef">
      </table-list>
      <v-page :data="dialogPage" :dataArr="[dialogDataSearch]"></v-page>
    </v-dialog>

    <v-dialog :dialog="dialogSet">
      <form-group :data="setDialogData" :dataBut="setDialogBut" :custom=true @on-ok="saveDialog" @on-cancel="cancelDialog">
      </form-group>
    </v-dialog>

    <!--新增用户模态框-->
    <v-dialog :dialog="dialogDataAddUser">
      <form-group :data="dataFormAddUser" style="width: 100%" :custom=true @on-cancel="cancelDialogUser" @on-ok="okUser"
                  :data-but="dataButAddUser">
      </form-group>
    </v-dialog>
    <!--编辑用户模态框-->
    <v-dialog :dialog="dialogDataEditUser">
      <form-group :data="dataFormEditUser" style="width: 100%" :custom=true @on-cancel="cancelDialogUserEdit" @on-ok="okEditUser"
                  :data-but="dataButAddUser">
      </form-group>
    </v-dialog>
    <!--用户查看模态框-->
    <v-dialog :dialog="dialogDataDetailsUser">
      <form-group :data="dataFormDetailsUser" style="width: 100%" :custom=true @on-cancel="cancelDialogUserDetails">
        <template slot-scope="scope" slot="userId">
            <span>{{userDataDetails.userId}}</span>
          </template>
          <template slot-scope="scope" slot="userName">
            <span>{{userDataDetails.userName}}</span>
          </template>
          <template slot-scope="scope" slot="projectName">
            <span>{{userDataDetails.projectName}}</span>
          </template>
          <template slot-scope="scope" slot="positionName">
            <span>{{userDataDetails.positionName}}</span>
          </template>
          <template slot-scope="scope" slot="organizationName">
            <span>{{userDataDetails.organizationName}}</span>
          </template>
          <template slot-scope="scope" slot="sysRoleName">
            <span>{{userDataDetails.sysRoleName}}</span>
          </template>
          <template slot-scope="scope" slot="userTypeDisplay">
            <span>{{userDataDetails.userTypeDisplay}}</span>
          </template>
          <template slot-scope="scope" slot="lubanNumber">
            <span>{{userDataDetails.lubanNumber}}</span>
          </template>
          <template slot-scope="scope" slot="lubanName">
                <span>{{userDataDetails.lubanName}}</span>
          </template>
          <template slot-scope="scope" slot="createTimeStr">
            <span>{{userDataDetails.createTimeStr}}</span>
          </template>
          <template slot-scope="scope" slot="createPerson">
            <span>{{userDataDetails.createPerson}}</span>
          </template>
          <template slot-scope="scope" slot="remark">
            <span>{{userDataDetails.remark}}</span>
          </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        btnData: [{
          text: '新增用户',
          key: 'add'
        }],
        dialogSet: {show: false, title: '设置职位', width: '30%'},
        setDialogData: {
          from: [{
            prop: 'positionCode',
            label: '职位：',
            value: '',
            labelWidth: '120px',
            placeholder: '请选择',
            required: true,
            rules: [{required: true, message: '请选择职位', trigger: 'blur,change'}]
          }, {
            prop: 'userId',
            label: 'userId：',
            value: '',
            labelWidth: '120px',
            display: 'none'
          }]
        },
        setDialogBut: [{text: '取消', key: 'cancel'}, {text: '确定', type: 'primary', key: 'ok'}],
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
          }, {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          }
        ],
        TableDataHeader: [
          {label: '登录账号', prop: 'userId'},
          {label: '姓名', prop: 'userName'},
          {label: '用户类型', prop: 'userTypeDisplay'},
          {label: '职位', prop: 'positionName'},
          {label: '梁场名称', prop: 'projectName'},
          {label: '所属组织', prop: 'organizationName'},
          {label: '鲁班账号', prop: 'lubanNumber'},
          {label: '鲁班姓名', prop: 'lubanName'},
          {label: '系统角色', prop: 'sysRoleName'},
          {label: '注册时间', prop: 'createTimeToString'},
          {label: '说明', prop: 'remark'},
          {label: '操作', prop: 'operation', slot: true}
        ],
        DataUrl: this.$Api.user.loadUserInfoQueryData,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_user_list',
          userType: 1
        },
        dataSearch: {},
        tablePerformance: 'tab_user_list',
        selection: [],
        dialogView: {show: false, title: '选择企业'},
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
        dialogViewSearchdata: [{label: '企业名称', value: '', placeholder: '输入企业名称等信息', key: 'companyName'}],
        dialogHeader: [
          {type: 'selection'},
          {label: '企业名称', prop: 'companyName'},
          {label: '注册资本', prop: 'registerCapital'},
          {label: '所属县区', prop: 'companyAddress'},
          {label: '电话', prop: 'companyPhone'}
        ],
        dialogDataUrl: this.$Api.user.loadAllCompany,
        dialogPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_user_dialog'
        },
        dialogTableRef: 'tab_user_dialog',
        dialogDataSearch: {},
        dialogselection: [],
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlFrontRoleEnum: this.$Api.user.getFrontRoleEnum,
        urlPositionStateEnum: this.$Api.user.getPositionStateEnum,
        urlUserTypeEnum: this.$Api.user.getUserTypeEnum,
        arrBeamData: [],
        arrRoleData: [],
        arrJobData: [],
        saveOrUpdate: this.$Api.user.saveOrUpdate,
        dialogDataAddUser: {show: false, title: '新增梁场'},
        dataFormAddUser: {
          from: [{
            prop: 'userId',
            label: '登录账号：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{trigger: 'blur,change'}],
            placeholder: '请输入'
          }, {
            prop: 'userName',
            label: '用户名称：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{required: true, message: '请输入用户名称', trigger: 'blur,change'}],
            placeholder: '请输入'
          }, {
            prop: 'userTypeCode',
            label: '用户类型：',
            value: '',
            select: [],
            labelWidth: '150px',
            rules: [{required: true, trigger: 'blur,change', message: '请选择用户类型'}]
          }, {
            prop: 'positionCode',
            label: '职位：',
            value: '',
            select: [],
            labelWidth: '150px',
            rules: [{required: true, trigger: 'blur,change', message: '请选择用户类型'}]
          }, {
            prop: 'projectId',
            label: '梁场名称：',
            value: '',
            select: [],
            labelWidth: '150px',
            rules: [{required: true, trigger: 'blur,change', message: '请选择梁场名称'}]
          }, {
            prop: 'organizationName',
            label: '所属组织：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{required: true, message: '请输入组织名称', trigger: 'blur,change'}]
          }, {
            prop: 'roleIds',
            label: '系统角色：',
            value: [],
            checkbox: [],
            labelWidth: '150px',
            rules: [{required: true, trigger: 'blur,change', message: '请选择系统角色'}]
          },
          {
            prop: 'remark',
            label: '说明：',
            labelWidth: '150px',
            value: '',
            type: 'textarea',
            rows: 3
          }],
          class: 'form_purchase'
        },
        dataButAddUser: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          key: 'ok',
          type: 'primary'
        }],
        dialogDataEditUser: {show: false, title: '编辑梁场'},
        dataFormEditUser: {
          from: [{
            prop: 'userId',
            label: '登录账号：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{trigger: 'blur,change'}],
            placeholder: '请输入'
          }, {
            prop: 'userName',
            label: '用户名称：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{required: true, message: '请输入用户名称', trigger: 'blur,change'}],
            placeholder: '请输入'
          }, {
            prop: 'userTypeCode',
            label: '用户类型：',
            value: '',
            select: [],
            labelWidth: '150px',
            rules: [{required: true, trigger: 'blur,change', message: '请选择用户类型'}]
          }, {
            prop: 'positionCode',
            label: '职位：',
            value: '',
            select: [],
            labelWidth: '150px',
            rules: [{required: true, trigger: 'blur,change', message: '请选择职位'}]
          }, {
            prop: 'projectId',
            label: '梁场名称：',
            value: '',
            select: [],
            labelWidth: '150px',
            rules: [{required: true, trigger: 'blur,change', message: '请选择梁场名称'}]
          }, {
            prop: 'organizationName',
            label: '所属组织：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{required: true, trigger: 'blur,change', message: '请输入所属组织'}]
          }, {
            prop: 'roleIds',
            label: '系统角色：',
            value: [],
            checkbox: [],
            labelWidth: '150px',
            rules: [{required: true, trigger: 'blur,change', message: '请选择系统角色'}]
          }, {
            prop: 'remark',
            label: '说明(可选)：',
            labelWidth: '150px',
            value: '',
            type: 'textarea',
            rows: 3,
            placeholder: '请输入备注'
          }],
          class: 'form_purchase'
        },
        dataButEditUser: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          key: 'ok',
          type: 'primary'
        }],
        userId: '',
        dialogDataDetailsUser: {show: false, title: '查看梁场'},
        dataFormDetailsUser: {
          from: [{
            prop: 'userId',
            label: '登录账号：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'userName',
            label: '用户名称：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'userTypeDisplay',
            label: '用户类型：',
            value: '',
            labelWidth: '150px',
            custom: true
          }, {
            prop: 'positionName',
            label: '职位：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'organizationName',
            label: '所属组织：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'projectName',
            label: '梁场名称：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'sysRoleName',
            label: '系统角色：',
            value: '',
            labelWidth: '150px',
            custom: true
          }, {
            prop: 'lubanNumber',
            label: '鲁班账号：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'lubanName',
            label: '鲁班姓名：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'createTimeStr',
            label: '创建时间：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'createPerson',
            label: '创建人：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'remark',
            label: '说明：',
            labelWidth: '150px',
            value: '',
            custom: true
          }],
          class: 'form_purchase'
        },
        userDataDetails: {}
      }
    },
    computed: {
      getCheckUser () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('手机号不能为空'))
          } else {
            if (this.$Validate.mobilephone(value)) {
              this.$Ajax.post({
                url: this.$Api.user.checkPhone,
                data: {
                  userId: value
                },
                cb: (res) => {
                  if (!res.data.result) {
                    callback(new Error('该用户已存在，请重新填写!'))
                  } else {
                    callback()
                  }
                }
              })
            } else {
              callback(new Error('请填写正确的手机号'))
            }
          }
        }
      },
      getCheckEditUser () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('手机号不能为空'))
          } else {
            if (this.$Validate.mobilephone(value)) {
              this.$Ajax.post({
                url: this.$Api.user.getUserByUserVO,
                data: {
                  id: this.userId,
                  userId: value
                },
                cb: (res) => {
                  if (!res.data.result) {
                    callback(new Error('该用户已存在，请重新填写!'))
                  } else {
                    callback()
                  }
                }
              })
            } else {
              callback(new Error('请填写正确的手机号'))
            }
          }
        }
      }
    },
    created () {
      this.getBeamField()
      this.getUserPosition()
      this.getFrontRoleEnum()
      this.getPositionStateEnum()
      this.getUserTypeEnum()
      this.getCheck()
    },
    methods: {
      checkFn (formName, i, n, checkRule) {
        formName.from[i].rules[n].validator = checkRule
      },
      getCheck () {
        this.checkFn(this.dataFormAddUser, 0, 0, this.getCheckUser)
        this.checkFn(this.dataFormEditUser, 0, 0, this.getCheckEditUser)
      },
      saveDialog (data) {
        this.$Ajax.post({
          url: this.$Api.orderManger.setUserPosition,
          data: data,
          cb: res => {
            this.$message(res.data.message)
            this.cancelDialog()
            this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
          }
        })
      },
      cancelDialog () {
        this.dialogSet.show = false
        this.setDialogData.from[0].value = ''
      },
      toSet (row) {
        this.dialogSet.show = true
        this.setDialogData.from[1].value = row.id
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      getUserPosition () {
        this.ajaxPost(this.$Api.orderManger.loadUserPosition, (res) => {
          if (res.data.result) {
            this.setDialogData.from[0].select = res.data.data
          }
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
            this.dataFormAddUser.from.map(item => {
              if (item.prop === 'projectId') {
                item.select = this.fliterSelectBeam(this.arrBeamData)
              }
            })
            this.dataFormEditUser.from.map(item => {
              if (item.prop === 'projectId') {
                item.select = this.fliterSelectBeam(this.arrBeamData)
              }
            })
          }
        })
      },
      getUserTypeEnum () {
        this.ajaxPost(this.urlUserTypeEnum, (res) => {
          if (res.data.result) {
            this.dataFormAddUser.from.map(item => {
              if (item.prop === 'userTypeCode') {
                item.select = res.data.data
              }
            })
            this.dataFormEditUser.from.map(item => {
              if (item.prop === 'userTypeCode') {
                item.select = res.data.data
              }
            })
          }
        })
      },
      getFrontRoleEnum () {
        this.ajaxPost(this.urlPositionStateEnum, (res) => {
          if (res.data.result) {
            this.dataFormAddUser.from.map(item => {
              if (item.prop === 'positionCode') {
                item.select = res.data.data
              }
            })
            this.dataFormEditUser.from.map(item => {
              if (item.prop === 'positionCode') {
                item.select = res.data.data
              }
            })
          }
        })
      },
      getPositionStateEnum () {
        this.ajaxPost(this.urlFrontRoleEnum, (res) => {
          if (res.data.result) {
            this.arrJobData = res.data.data
            this.dataFormAddUser.from.map(item => {
              if (item.prop === 'roleIds') {
                item.checkbox = this.arrJobData
              }
            })
            this.dataFormEditUser.from.map(item => {
              if (item.prop === 'roleIds') {
                item.checkbox = this.arrJobData
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
      searchDataClick (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
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
      openDialog () {
        this.dialogView.show = true
      },
      dialogViewSave (item) {
        this.dialogView.show = false
      },
      dialogViewSearchDataClick (res) {
        this.dialogDataSearch = res
        if (JSON.stringify(this.dialogDataSearch) === '{}') {
          this.dialogPage.offset = 0
          this.dialogPage.currentPage = 1
        }
        this.pageUpdateTable([this.dialogDataSearch, this.dialogPage], this.dialogTableRef, this)
      },
      dialogselectionChange (selection) {
        this.dialogselection = selection
      },
      dialogGetTableData (data) {
        this.dialogPage.totalNum = data.data.total
      },
      addUser () {
        this.dialogDataAddUser.show = true
      },
      cancelDialogUser () {
        this.dialogDataAddUser.show = false
        this.$bus.emit('form-clear')
      },
      saveOrUpdateHttp (res) {
        this.$Ajax.post({
          url: this.saveOrUpdate,
          data: res,
          cb: (res) => {
            if (res.data.result) {
              this.cancelDialogUser()
              this.cancelDialogUserEdit()
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
              this.$message(res.data.data)
            }
          }
        })
      },
      editUser (res) {
        this.userId = res.id
        this.dataFormEditUser.from.map(item => {
          item.value = res[item.prop]
          if (item.prop === 'roleIds') {
            let arrOld = res.sysRoleName ? res.sysRoleName.split('、') : []
            item.value = arrOld
          }
        })
        this.dialogDataEditUser.show = true
      },
      cancelDialogUserEdit () {
        this.dialogDataEditUser.show = false
        this.$bus.emit('form-clear')
      },
      okUser (data) {
        let dialogArr = []
        this.dataFormAddUser.from[6].checkbox.map(item => {
          data.roleIds.map(ritem => {
            if (ritem === item.label) {
              dialogArr.push(item.value)
            }
          })
        })
        data.roleIds = dialogArr
        this.saveOrUpdateHttp(data)
      },
      okEditUser (data) {
        let dialogArr = []
        this.dataFormEditUser.from[6].checkbox.map(item => {
          data.roleIds.map(ritem => {
            if (ritem === item.label) {
              dialogArr.push(item.value)
            }
          })
        })
        data.roleIds = dialogArr
        data.id = this.userId
        this.saveOrUpdateHttp(data)
      },
      onDetails (data) {
        this.$Ajax.post({
          url: this.$Api.user.findUserById,
          data: {
            id: data.id
          },
          cb: res => {
            this.userDataDetails = res.data
          }
        })
        this.dialogDataDetailsUser.show = true
      },
      cancelDialogUserDetails () {
        this.dialogDataDetailsUser.show = false
        this.$bus.emit('form-clear')
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
    margin: 0px 3px;
  }
</style>
