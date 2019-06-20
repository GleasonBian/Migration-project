<template>
  <div>
    <v-search :data="Searchdata" @on-click="searchDataClick"></v-search>
    <TabBut :data="TabButData" @on-add="onAdd"></TabBut>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @selection-change="selectionChange"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template v-slot:download="scope">
        <el-button type="text" @click="toDownload(scope.row)" size="mini">资源包下载</el-button>
      </template>
      <template v-slot:operation="scope">
        <TabBut :data="tbBut" @on-edit="onEdit(scope.row)" @on-del="onDel(scope.row)"></TabBut>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>

    <v-dialog :dialog="resourceDialog">
      <form-group :data="resourceForm" @on-cancel="resourceCancel" @on-ok="resourceOk" :custom=true :clear=true :data-but="resourceBut">
        <template v-slot:fileUrl="scope">
          <v-upload :data="uploadData" :customBeforeUpload="customBeforeUpload" @on-success="uploadSuccess">
            <div><el-button size="small" type="primary">上传资源附件</el-button></div>
          </v-upload>
        </template>
      </form-group>
    </v-dialog>

    <v-dialog :dialog="resourceDialogEdit">
      <form-group :data="resourceFormEdit" @on-cancel="resourceCancelEdit" @on-ok="resourceOkEdit" :custom=true :data-but="resourceButEdit">
        <template v-slot:fileUrl="scope">
          <v-upload :data="uploadDataEdit" :customBeforeUpload="customBeforeUpload" @on-success="uploadSuccess">
            <div><el-button size="small" type="primary">上传资源附件</el-button></div>
          </v-upload>
        </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        Searchdata: [
          {label: '当前资源', value: '', key: 'currentResourceCode'},
          {label: '更新资源', value: '', key: 'updateResourceCode'}
        ],
        TabButData: [{text: '创建资源', key: 'add'}],
        TableDataHeader: [
          {type: 'selection', width: '10px'},
          {label: '当前资源', prop: 'currentResourceCode'},
          {label: '更新资源', prop: 'updateResourceCode'},
          {label: '资源包地址', prop: 'fileUrl'},
          {label: '资源包下载', prop: 'download', slot: true},
          {label: '操作', prop: 'operation', slot: true}
        ],
        tbBut: [
          {text: '编辑', key: 'edit', type: 'text'},
          {text: '删除', key: 'del', type: 'text'}
        ],
        DataUrl: this.$Api.operate.clientResourceinfoData,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_operate_vInfo'
        },
        tablePerformance: 'tab_operate_vInfo',
        dataSearch: {},
        resourceDialog: {show: false, title: '创建资源', width: '30%'},
        resourceForm: {
          from: [{
            prop: 'currentResourceCode',
            label: '当前资源：',
            value: null,
            required: true,
            labelWidth: '110px',
            type: 'number',
            min: 0,
            rules: [{ required: true, message: '请输入当前资源', trigger: 'blur,change' }]
          }, {
            prop: 'updateResourceCode',
            label: '更新资源：',
            value: null,
            required: true,
            labelWidth: '110px',
            type: 'number',
            min: 0,
            rules: [{ required: true, message: '请输入更新资源', trigger: 'blur,change' }]
          }, {
            prop: 'fileUrl',
            label: '附件上传：',
            value: '',
            labelWidth: '110px',
            custom: true
          }]
        },
        resourceBut: [
          {
            text: '取消',
            key: 'cancel'
          }, {
            text: '保存',
            type: 'primary',
            key: 'ok'
          }
        ],
        uploadData: {
          url: this.$Api.operate.uploadImage,
          listType: 'text',
          custom: true,
          showFileList: false
        },
        customBeforeUpload: true,
        fileMd5: '',
        resourceDialogEdit: {show: false, title: '编辑资源', width: '30%'},
        resourceFormEdit: {
          from: [{
            prop: 'currentResourceCode',
            label: '当前资源：',
            value: null,
            required: true,
            labelWidth: '110px',
            type: 'number',
            min: 0,
            rules: [{ required: true, message: '请输入当前资源', trigger: 'blur,change' }]
          }, {
            prop: 'updateResourceCode',
            label: '更新资源：',
            value: null,
            required: true,
            labelWidth: '110px',
            type: 'number',
            min: 0,
            rules: [{ required: true, message: '请输入更新资源', trigger: 'blur,change' }]
          }, {
            prop: 'fileUrl',
            label: '附件上传：',
            value: '',
            labelWidth: '110px',
            custom: true
          }]
        },
        resourceButEdit: [
          {
            text: '取消',
            key: 'cancel'
          }, {
            text: '保存',
            type: 'primary',
            key: 'ok'
          }
        ],
        uploadDataEdit: {
          url: this.$Api.operate.uploadImage,
          listType: 'text',
          custom: true,
          showFileList: false
        },
        isEdit: false,
        isWgtuFlag: true
      }
    },
    created () {
      this.page.id = this.$route.params.id
    },
    methods: {
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
        data.data.rows.map(item => {
          item.saveUrl = item.fileUrl
          item.fileUrl = this.$ImgPath.imgApi.imgApi + item.fileUrl
        })
      },
      onEdit (row) {
        this.resourceDialogEdit.show = true
        this.isEdit = true
        this.resourceFormEdit.from[0].value = row.currentResourceCode
        this.resourceFormEdit.from[1].value = row.updateResourceCode
        this.resourceFormEdit.from[2].value = row.saveUrl
        this.resourceFormEdit.from[2].id = row.id
        this.fileMd5 = row.fileMd5
      },
      onDel (row) {
        let ids = [row.id]
        this.$Ajax.post({
          url: this.$Api.operate.deleteResource,
          data: {ids: ids},
          cb: res => {
            if (res.data.result) {
              this.$message('删除成功！')
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      onAdd () {
        this.resourceDialog.show = true
        this.isEdit = false
        this.fileMd5 = ''
        this.resourceForm.from[0].value = ''
        this.resourceForm.from[1].value = ''
        this.resourceForm.from[2].value = ''
        this.$bus.emit('form-clear')
      },
      toDownload (row) {
        location.href = row.fileUrl
      },
      resourceCancel () {
        this.resourceDialog.show = false
        this.$bus.emit('form-clear')
      },
      resourceOk (res) {
        if (this.codeValidation(res)) {
          return
        }
        res.fileMd5 = this.fileMd5
        res.versionId = this.page.id
        this.$Ajax.post({
          url: this.$Api.operate.saveResource,
          data: res,
          cb: res => {
            if (res.data.result) {
              this.$message('创建成功！')
              this.$bus.emit('form-clear')
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
              this.resourceDialog.show = false
            }
          }
        })
      },
      uploadSuccess (res) {
//        if (!this.isWgtuFlag) {
//          return
//        }
        if (res.result) {
          if (this.isEdit) {
            this.resourceFormEdit.from[2].value = res.data.imgUrl
          } else {
            this.resourceForm.from[2].value = res.data.imgUrl
          }
          this.fileMd5 = res.data.fileMd5
          this.$message('上传资源成功')
          this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
        } else {
          this.$message.error(res.message)
        }
      },
      beforeUpload (file) {
        let isWgtu = file.name.substr(file.name.indexOf('.') + 1, file.name.length)
        if (isWgtu !== 'wgtu') {
          this.$message.error('只能上传后缀名为 .wgtu 格式的文件!')
          this.isWgtuFlag = false
        } else {
          this.isWgtuFlag = true
        }
        return this.isWgtuFlag
      },
      resourceCancelEdit () {
        this.resourceDialogEdit.show = false
      },
      codeValidation (res) {
        let result = false
//        if (!this.isWgtuFlag) {
//          result = true
//        }
        if (parseInt(res.currentResourceCode) <= 0 || parseInt(res.updateResourceCode) <= 0) {
          this.$message.error('不能小于等于0!')
          result = true
        }
        if (parseInt(res.currentResourceCode) >= parseInt(res.updateResourceCode)) {
          this.$message.error('当前版本号必须小于更新版本号!')
          result = true
        }
        if (this.fileMd5 === '') {
          this.$message.error('请上传资源!')
          result = true
        }
        return result
      },
      resourceOkEdit (res) {
        if (this.codeValidation(res)) {
          return
        }
        res.fileMd5 = this.fileMd5
        res.versionId = this.page.id
        res.id = this.resourceFormEdit.from[2].id
        this.$Ajax.post({
          url: this.$Api.operate.updateResource,
          data: res,
          cb: res => {
            if (res.data.result) {
              this.$message('编辑成功！')
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
              this.resourceDialogEdit.show = false
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
