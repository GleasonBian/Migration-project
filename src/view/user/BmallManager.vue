<template>
  <div>
    <v-search :data="searchData" @on-click="searchDataClick">
    </v-search>
    <tab-but :data="btnData" @on-add="addProject"></tab-but>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @selection-change="selectionChange"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template v-slot:operation="scope">
        <span class="handle" @click="tabAllocation(scope.row)">分配给用户</span>
        <span v-show="scope.row.stateCode == '1'" class="handle" @click="onDetails(scope.row)">查看</span>
        <span v-show="scope.row.stateCode == '1'" class="handle" @click="editProject(scope.row)">编辑</span>
        <span class="handle" @click="updateProjectStatus(scope.row)">完成</span>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--分配用户模态框-->
    <v-dialog :dialog="dialogDataAllocation" class="box_role">
      <el-row>
        <el-col :span="10">
          <v-search :data="searchDataDL" @on-click="searchClickDL" width="0px"></v-search>
          <table-list :data-header="dataHeaderDL" :url="tabUrlDL" :params="pageDL" @get-table-data="getTableDataDL" :refs="tablePerformanceDL"  @selection-change="selectionChangeDialog"></table-list>
          <v-page :data="pageDL" :dataArr="[dataSearchDL]" :layout="pageDLLayout"></v-page>
        </el-col>
        <el-col :span="4" class="box_role_btn">
          <el-button type="primary" :plain=plainL @click="saveRoleUserRelation"><i class="el-icon-arrow-right"></i></el-button>
          <el-button type="primary" :plain=plainR @click="deleteRoleUserRelation"><i class="el-icon-arrow-left"></i></el-button>
        </el-col>
        <el-col :span="10">
          <v-search :data="searchDataDR" @on-click="searchClickDR"></v-search>
          <table-list :data-header="dataHeaderDR" :url="tabUrlDR" :params="pageDR" @get-table-data="getTableDataDR" :refs="tablePerformanceDR"  @selection-change="selectionChangeDialog"></table-list>
          <v-page :data="pageDR" :dataArr="[dataSearchDR]" :layout="pageDRLayout"></v-page>
        </el-col>
      </el-row>
    </v-dialog>
    <!--新增梁场模态框-->
    <v-dialog :dialog="dialogDataAddProject">
      <form-group :data="dataFormAddProject" style="width: 100%" :custom=true @on-cancel="cancelDialogProject" @on-ok="okProject"
                  :data-but="dataButAddProject">
        <template v-slot:areaId="scope">
          <v-cites @on-change="citesChange" :value="citesValues(scope.rows)"></v-cites>
        </template>
      </form-group>
    </v-dialog>
    <!--编辑梁场模态框-->
    <v-dialog :dialog="dialogDataEditProject">
      <form-group :data="dataFormEditProject" style="width: 100%" :custom=true @on-cancel="cancelDialogProjectEdit" @on-ok="okEditProject"
                  :data-but="dataButAddProject">
      </form-group>
    </v-dialog>
    <!--梁场查看模态框-->
    <v-dialog :dialog="dialogDataDetailsProject">
      <form-group :data="dataFormDetailsProject" style="width: 100%" :custom=true @on-cancel="cancelDialogProjectDetails">
        <template v-slot:projectName="scope">
          <span>{{projectDataDetails.projectName}}</span>
        </template>
        <template v-slot:organizationName="scope">
          <span>{{projectDataDetails.organizationName}}</span>
        </template>
        <template v-slot:companyName="scope">
          <span>{{projectDataDetails.companyName}}</span>
        </template>
        <template v-slot:userName="scope">
          <span>{{projectDataDetails.userName}}</span>
        </template>
        <template v-slot:userPhone="scope">
          <span>{{projectDataDetails.userPhone}}</span>
        </template>
        <template v-slot:wholeAddress="scope">
          <span>{{projectDataDetails.wholeAddress}}</span>
        </template>
        <template v-slot:remark="scope">
          <span>{{projectDataDetails.remark}}</span>
        </template>
        <template v-slot:stateDisplay="scope">
          <span>{{projectDataDetails.stateDisplay}}</span>
        </template>
        <template v-slot:createTimeStr="scope">
          <span>{{projectDataDetails.createTimeStr}}</span>
        </template>
        <template v-slot:createPerson="scope">
          <span>{{projectDataDetails.createPerson}}</span>
        </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [
          {
            key: 'id',
            label: '梁场名称：',
            value: '',
            select: []
          },
          {label: '梁场状态', value: '', key: 'stateCode', select: []},
          {
            label: '创建时间',
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
          {label: '梁场名称', prop: 'projectName'},
          {label: '组织名称', prop: 'organizationName'},
          {label: '所属企业', prop: 'companyName'},
          {label: '负责人', prop: 'userName'},
          {label: '电话', prop: 'userPhone'},
          {label: '状态', prop: 'stateDisplay'},
          {label: '地址', prop: 'wholeAddress'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '说明', prop: 'remark'},
          {prop: 'operation', label: '操作', slot: true}
        ],
        DataUrl: this.$Api.user.projectList,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_user_list'
        },
        dataSearch: {},
        tablePerformance: 'tab_user_list',
        selection: [],
        urlBeamField: this.$Api.orderManger.getProjectList,
        arrBeamData: [],
        plainL: true,
        plainR: true,
        selectionL: [],
        selectionR: [],
        dialogDataAllocation: {show: false, title: '分配角色给用户'},
        dataHeaderDL: [{type: 'selection'}, {prop: 'name', label: '用户姓名'}, {prop: 'userName', label: '手机号'}],
        tabUrlDL: this.$Api.user.userListPage,
        pageDL: {totalNum: 0, currentPage: 1, offset: 0, refs: 'tab_permission_list_DL'},
        pageDLLayout: 'total, prev, pager, next',
        tablePerformanceDL: 'tab_permission_list_DL',
        searchDataDL: [{label: '', value: '', placeholder: '请输入姓名或者手机号', key: 'userName'}],
        dataSearchDL: {},
        dataHeaderDR: [{type: 'selection'}, {prop: 'userName', label: '用户姓名'}, {prop: 'userPhone', label: '手机号'}],
        tabUrlDR: this.$Api.user.loadProjectUserRelationList,
        pageDR: {totalNum: 0, currentPage: 1, offset: 0, refs: 'tab_permission_list_DR', projectManagementId: 0},
        pageDRLayout: 'total, prev, pager, next',
        tablePerformanceDR: 'tab_permission_list_DR',
        searchDataDR: [{label: '', value: '', placeholder: '请输入姓名或者手机号', key: 'userName'}],
        dataSearchDR: {},
        systemId: 0,
        btnData: [{
          text: '新增梁场',
          key: 'add'
        }],
        dialogDataAddProject: {show: false, title: '新增梁场'},
        dataFormAddProject: {
          from: [{
            prop: 'projectName',
            label: '梁场名称：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'shortName',
            label: '梁场简称：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'userName',
            label: '负责人：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{required: true, message: '请输入负责人', trigger: 'blur,change'}]
          }, {
            prop: 'userPhone',
            label: '电话：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'areaId',
            label: '区域：',
            labelWidth: '150px',
            value: [],
            custom: true,
            rules: [{required: true, message: '所在区域不能为空', trigger: 'blur,change'}]
          }, {
            prop: 'wholeAddress',
            label: '地址：',
            labelWidth: '150px',
            value: ''
          }, {
            prop: 'organizationName',
            label: '组织名称：',
            labelWidth: '150px',
            value: ''
          }, {
            prop: 'companyName',
            label: '所属企业：',
            labelWidth: '150px',
            value: ''
          }, {
            prop: 'remark',
            label: '说明：',
            labelWidth: '150px',
            value: '',
            type: 'textarea',
            rows: 3
          }],
          class: 'form_purchase'
        },
        dataButAddProject: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          key: 'ok',
          type: 'primary'
        }],
        dialogDataEditProject: {show: false, title: '编辑梁场'},
        dataFormEditProject: {
          from: [{
            prop: 'projectName',
            label: '梁场名称：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'shortName',
            label: '梁场简称：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'userName',
            label: '负责人：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{required: true, message: '请输入负责人', trigger: 'blur,change'}]
          }, {
            prop: 'userPhone',
            label: '电话：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'wholeAddress',
            label: '地址：',
            labelWidth: '150px',
            value: ''
          }, {
            prop: 'organizationName',
            label: '组织名称：',
            labelWidth: '150px',
            value: ''
          }, {
            prop: 'companyName',
            label: '所属企业：',
            labelWidth: '150px',
            value: ''
          }, {
            prop: 'remark',
            label: '说明：',
            labelWidth: '150px',
            value: '',
            type: 'textarea',
            rows: 3
          }],
          class: 'form_purchase'
        },
        dataButEditProject: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          key: 'ok',
          type: 'primary'
        }],
        projectId: '',
        dialogDataDetailsProject: {show: false, title: '查看梁场'},
        dataFormDetailsProject: {
          from: [{
            prop: 'projectName',
            label: '梁场名称：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'organizationName',
            label: '组织名称：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'companyName',
            label: '所属企业：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'userName',
            label: '负责人：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'userPhone',
            label: '电话：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'wholeAddress',
            label: '地址：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'remark',
            label: '说明：',
            labelWidth: '150px',
            value: '',
            custom: true
          }, {
            prop: 'stateDisplay',
            label: '梁场状态：',
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
          }],
          class: 'form_purchase'
        },
        projectDataDetails: {},
        arrBeamName: ''
      }
    },
    created () {
      this.getBeamField()
      this.getProjectStatus()
      this.getCheck()
    },
    computed: {
      getCheckProject () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('梁场名称不能为空'))
          } else {
            this.$Ajax.post({
              url: this.$Api.user.getProjectIdByProjectName,
              data: {
                projectName: value
              },
              cb: (res) => {
                if (!res.data.result) {
                  callback(new Error('该梁场已存在，请重新填写!'))
                } else {
                  callback()
                }
              }
            })
          }
        }
      },
      getCheckEditProject () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('梁场名称不能为空'))
          } else {
            this.$Ajax.post({
              url: this.$Api.user.getProjectByProjectVO,
              data: {
                id: this.projectId,
                projectName: value
              },
              cb: (res) => {
                if (!res.data.result) {
                  callback(new Error('该梁场已存在，请重新填写!'))
                } else {
                  callback()
                }
              }
            })
          }
        }
      },
      getCheckUser () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('手机号不能为空'))
          } else {
            if (this.$Validate.mobilephone(value)) {
              this.$Ajax.post({
                url: this.$Api.user.getProjectdByUserPhone,
                data: {
                  userPhone: value
                },
                cb: (res) => {
                  if (!res.data.result) {
                    callback(new Error('该用户已关联梁场，请重新填写!'))
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
                url: this.$Api.user.getProjectdByUser,
                data: {
                  id: this.projectId,
                  userPhone: value
                },
                cb: (res) => {
                  if (!res.data.result) {
                    callback(new Error('该用户已关联梁场，请重新填写!'))
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
    methods: {
      citesChange (val) {
        this.cites(this.dataFormAddProject, val)
      },
      cites (obj, val) {
        obj.from[4].value = val.label
        this.arrBeamName = val.value
      },
      citesValues (data) {
        return Array.isArray(data.value) ? data.value : data.value.split(',')
      },
      checkFn (formName, i, n, checkRule) {
        formName.from[i].rules[n].validator = checkRule
      },
      getCheck () {
        this.checkFn(this.dataFormAddProject, 0, 0, this.getCheckProject)
        this.checkFn(this.dataFormEditProject, 0, 0, this.getCheckEditProject)
        this.checkFn(this.dataFormAddProject, 3, 0, this.getCheckUser)
        this.checkFn(this.dataFormEditProject, 3, 0, this.getCheckEditUser)
      },
      deleteRoleUserRelation () {
        if (this.selectionR.length === 0 && this.selectionR) {
          this.$message({message: '请先选择用户'})
        } else {
          let ids = []
          this.selectionR.map(item => {
            ids.push(item.id)
          })
          this.$Ajax.post({
            url: this.$Api.user.deleteProjectUserRelationByIdList,
            data: {
              ids: ids,
              projectManagementId: this.pageDR.projectManagementId
            },
            cb: res => {
              if (res.data.result) {
                this.UserRelationMsg('移除')
              }
            }
          })
        }
      },
      UserRelationMsg (msg) {
        this.$message(msg + '成功！')
        this.pageUpdateTable([this.dataSearchDL, this.pageDL], this.tablePerformanceDL, this)
        this.pageUpdateTable([this.dataSearchDR, this.pageDR], this.tablePerformanceDR, this)
        this.selectionL = []
        this.selectionR = []
      },
      saveRoleUserRelation () {
        if (this.selectionL.length === 0 && this.selectionL) {
          this.$message({message: '请先选择用户'})
        } else {
          let ids = []
          this.selectionL.map(item => {
            ids.push(item.id)
          })
          this.$Ajax.post({
            url: this.$Api.user.saveProjectUserRelationList,
            data: {
              userIds: ids,
              projectManagementId: this.pageDR.projectManagementId
            },
            cb: res => {
              if (res.data.result) {
                this.UserRelationMsg('添加')
              }
            }
          })
        }
      },
      selectionChangeDialog (selection) {
        if (selection.length > 0) {
          selection.map(item => {
            if (item.userPhone) {
              this.plainR = false
              this.selectionR = selection
            } else {
              this.plainL = false
              this.selectionL = selection
            }
          })
        } else {
          this.plainL = true
          this.plainR = true
          this.selectionL = selection
          this.selectionR = selection
        }
      },
      getTableDataDL (data) {
        this.pageDL.totalNum = data.data.total
      },
      getTableDataDR (data) {
        this.pageDR.totalNum = data.data.total
      },
      searchClickDL (res) {
        this.dataSearchDL = res
        this.search(this.dataSearchDL, [this.dataSearchDL, this.pageDL], this.tablePerformanceDL, this.pageDL)
      },
      searchClickDR (res) {
        this.dataSearchDR = res
        this.search(this.dataSearchDR, [this.dataSearchDR, this.pageDR], this.tablePerformanceDR, this.pageDR)
      },
      search (obj, arr, refs, page) {
        if (JSON.stringify(obj) === '{}') {
          page.offset = 0
          page.currentPage = 1
        }
        this.pageUpdateTable(arr, refs, this)
      },
      tabAllocation (row) {
        this.pageDR.projectManagementId = row.id
        this.pageDL.currentPage = 1
        this.dataSearchDL = {}
        this.pageDR.currentPage = 1
        this.dataSearchDR = {}
        this.pageUpdateTable([this.dataSearchDR, this.pageDR], this.tablePerformanceDR, this)
        this.dialogDataAllocation.show = true
      },
      getProjectStatus () {
        this.ajaxPost(this.$Api.user.getProjectStatus, (res) => {
          let temp = []
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.display
            obj.value = item.code
            temp.push(obj)
          })
          this.searchData[1].select = temp
        })
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      getBeamField () {
        this.ajaxPost(this.urlBeamField, (res) => {
          if (res.data.result) {
            this.arrBeamData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'id') {
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
      addProject () {
        this.dialogDataAddProject.show = true
      },
      cancelDialogProject () {
        this.dialogDataAddProject.show = false
        this.$bus.emit('form-clear')
      },
      okProject (data) {
        this.$Ajax.post({
          url: this.$Api.user.createProject,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message(res.data.message)
              this.cancelDialogProject()
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      editProject (res) {
        this.projectId = res.id
        this.dataFormEditProject.from.map(item => {
          item.value = res[item.prop]
        })
        this.dialogDataEditProject.show = true
      },
      cancelDialogProjectEdit () {
        this.dialogDataEditProject.show = false
        this.$bus.emit('form-clear')
      },
      okEditProject (data) {
        data.id = this.projectId
        this.$Ajax.post({
          url: this.$Api.user.updateProject,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message(res.data.message)
              this.cancelDialogProjectEdit()
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      updateProjectStatus (data) {
        this.$Ajax.post({
          url: this.$Api.user.updateProjectStatus,
          data: {
            id: data.id
          },
          cb: res => {
            if (res.data.result) {
              this.$message(res.data.message)
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      onDetails (data) {
        this.$Ajax.post({
          url: this.$Api.user.findProjectById,
          data: {
            id: data.id
          },
          cb: res => {
            this.projectDataDetails = res.data
          }
        })
        this.dialogDataDetailsProject.show = true
      },
      cancelDialogProjectDetails () {
        this.dialogDataDetailsProject.show = false
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
    margin: 0px 1px;
  }
  .handle:hover{
    text-decoration: underline;
  }
</style>
<style>
  .box_role .base_search_box .el-col-8{width: 62.5%;}
  .box_role .base_search_box .base_search_button{width: 37.5%;}
  .box_role .base_search_box .el-form-item__content{ width: 100%; margin: 0 !important;}
  .box_role_btn{ padding-top: 100px;}
  .box_role_btn .el-button{ width: 100%; margin:20px 0 0;}
  .box_role_btn .is-plain:focus,
  .box_role_btn .is-plain:hover{ background: #ecf5ff !important;  border-color: #b3d8ff !important;  color: #409EFF !important;}
</style>
