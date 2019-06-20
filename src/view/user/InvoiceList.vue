<template>
  <div>
    <el-tabs>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane label="增值税普通发票" name="one">
        </el-tab-pane>
        <el-tab-pane label="增值税专用发票" name="two">
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <tab-but v-if="indexCode === '0'" :data="btnData" @on-add="addInvoice" @del-invoice="delInvoice"></tab-but>
    <tab-but v-else :data="btnDataZ" @on-add="addInvoice" @del-invoice="delInvoice"></tab-but>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @selection-change="selectionChange"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template v-slot:handle="scope">
        <span class="handle" @click="editInvoice(scope.row)">编辑</span>&nbsp;
        <span class="handle" @click="delInvoice(scope.row, true)">删除</span>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[]"></v-page>
    <!-- 新增发票 -->
    <v-dialog :dialog="dialogDataAdd" >
      <form-group :data="dataFormAdd" @on-cancel="cancelAdd" @on-ok="okAdd" :clear=true :custom=true :data-but="dataButAdd" class="box_form"></form-group>
    </v-dialog>
    <!-- 编辑发票 -->
    <v-dialog :dialog="dialogDataEdit" >
      <form-group :data="dataFormEdit" @on-cancel="cancelEdit" @on-ok="okEdit" :custom=true :data-but="dataButEdit" class="box_form"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeName: 'one',
        indexCode: '0',
        btnData: [{
          text: '新增增值税普通发票',
          key: 'add'
        }, {
          text: '删除',
          key: 'del-invoice'
        }],
        btnDataZ: [{
          text: '新增增值税专用发票',
          key: 'add'
        }, {
          text: '删除',
          key: 'del-invoice'
        }],
        TableDataHeader: [
          {type: 'selection'},
          {label: '单位名称', prop: 'companyName'},
          {label: '注册地址', prop: 'registryAddress'},
          {label: '注册电话', prop: 'registryPhone'},
          {label: '开户银行', prop: 'openAccount'},
          {label: '开户银行账号', prop: 'accountNumber'},
          {label: '收票人姓名', prop: 'receiverName'},
          {label: '收票人手机', prop: 'receiverPhone'},
          {label: '收票地址', prop: 'receiverAddr'},
          {label: '操作', prop: 'handle', width: '150', slot: true}
        ],
        DataUrl: this.$Api.user.listInvoice,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_invoice_list',
          invoiceTypeCode: 1
        },
        dataSearch: {},
        tablePerformance: 'tab_invoice_list',
        selection: [],
        selectionIds: [],
        dialogDataAdd: {show: false, title: '新增增值税普通发票', width: '600px'},
        dataButAdd: [{text: '取消', key: 'cancel'}, {text: '提交', type: 'primary', key: 'ok'}],
        dataFormAdd: {
          from: [
            {
              prop: 'companyName',
              label: '单位名称：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入单位名称',
              rules: [{ required: true, message: '请输入单位名称', trigger: 'blur,change' }]
            },
            {
              prop: 'taxpayCode',
              label: '纳税人识别号：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入纳税人识别号',
              rules: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur,change' }]
            },
            {
              prop: 'openAccount',
              label: '开户银行：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入开户银行',
              rules: [{ required: true, message: '请输入开户银行', trigger: 'blur,change' }]
            },
            {
              prop: 'accountNumber',
              label: '开户银行账号：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入开户银行账号',
              rules: [{ required: true, message: '请输入开户银行账号', trigger: 'blur,change' }]
            },
            {
              prop: 'registryAddress',
              label: '注册地址：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入注册地址'
            },
            {
              prop: 'registryPhone',
              label: '注册电话：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入注册电话',
              required: true,
              rules: [{trigger: 'blur,change'}]
            },
            {
              prop: 'receiverName',
              label: '收票人姓名：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入收票人姓名'
            },
            {
              prop: 'receiverPhone',
              label: '收票人电话：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入收票人电话',
              required: true,
              rules: [{trigger: 'blur,change'}]
            },
            {
              prop: 'receiverAddr',
              label: '收票地址：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入收票地址'
            }
          ]
        },
        dialogDataEdit: {show: false, title: '编辑增值税普通发票', width: '600px'},
        dataButEdit: [{text: '取消', key: 'cancel'}, {text: '提交', type: 'primary', key: 'ok'}],
        dataFormEdit: {
          from: [
            {
              prop: 'companyName',
              label: '单位名称：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入单位名称',
              rules: [{required: true, message: '请输入单位名称', trigger: 'blur,change'}]
            },
            {
              prop: 'taxpayCode',
              label: '纳税人识别号：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入纳税人识别号',
              rules: [{required: true, message: '请输入纳税人识别号', trigger: 'blur,change'}]
            },
            {
              prop: 'openAccount',
              label: '开户银行：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入开户银行',
              rules: [{required: true, message: '请输入开户银行', trigger: 'blur,change'}]
            },
            {
              prop: 'accountNumber',
              label: '开户银行账号：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入开户银行账号',
              rules: [{required: true, message: '请输入开户银行账号', trigger: 'blur,change'}]
            },
            {
              prop: 'registryAddress',
              label: '注册地址：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入注册地址'
            },
            {
              prop: 'registryPhone',
              label: '注册电话：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入注册电话',
              required: true,
              rules: [{trigger: 'blur,change'}]
            },
            {
              prop: 'receiverName',
              label: '收票人姓名：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入收票人姓名'
            },
            {
              prop: 'receiverPhone',
              label: '收票人电话：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入收票人电话',
              required: true,
              rules: [{trigger: 'blur,change'}]
            },
            {
              prop: 'receiverAddr',
              label: '收票地址：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入收票地址'
            }
          ]
        },
        editInvoiceId: ''
      }
    },
    created () {
      this.getCheck()
    },
    computed: {
      getCheckPhone () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('手机号不能为空'))
          } else {
            if (!this.$Validate.mobilephone(value)) {
              callback(new Error('请输入正确的手机号'))
            } else {
              callback()
            }
          }
        }
      }
    },
    methods: {
      checkFn (formName, i, n, checkRule) {
        formName.from[i].rules[n].validator = checkRule
      },
      getCheck () {
        this.checkFn(this.dataFormAdd, 5, 0, this.getCheckPhone)
        this.checkFn(this.dataFormEdit, 5, 0, this.getCheckPhone)
        this.checkFn(this.dataFormAdd, 7, 0, this.getCheckPhone)
        this.checkFn(this.dataFormEdit, 7, 0, this.getCheckPhone)
      },
      selectionChange (selection) {
        this.selection = selection
        this.selectionIds = this.selection.map(item => {
          return item.id
        })
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([this.page], this.tablePerformance, this)
      },
      tabClick (res) {
        this.indexCode = res.index
        switch (res.index) {
          case '0':
            this.page.invoiceTypeCode = 1
            break
          case '1':
            this.page.invoiceTypeCode = 2
            break
        }
        this.pageUpdateTable()
      },
      addInvoice () {
        switch (this.indexCode) {
          case '0':
            this.dialogDataAdd.title = '新增增值税普通发票'
            break
          case '1':
            this.dialogDataAdd.title = '新增增值税专用发票'
            break
        }
        this.dialogDataAdd.show = true
      },
      cancelAdd () {
        this.dialogDataAdd.show = false
        this.formClear()
      },
      formClear () {
        this.$bus.emit('form-clear')
      },
      okAdd (res) {
        if (this.indexCode === '0') {
          this.saveInvoice(res)
        } else {
          this.saveZInvoice(res)
        }
      },
      saveInvoice (data, flag) {
        if (flag) {
          data.id = this.editInvoiceId
        }
        this.$Ajax.post({
          url: this.$Api.user.addOrUpdateInvoice,
          data: data,
          cb: (res) => {
            if (res.data.result) {
              this.$message(res.data.message)
              this.cancelAdd()
              this.cancelEdit()
              this.pageUpdateTable()
            }
          }
        })
      },
      saveZInvoice (data, flag) {
        if (flag) {
          data.id = this.editInvoiceId
        }
        this.$Ajax.post({
          url: this.$Api.user.addOrUpdateZInvoice,
          data: data,
          cb: (res) => {
            if (res.data.result) {
              this.$message(res.data.message)
              this.cancelAdd()
              this.cancelEdit()
              this.pageUpdateTable()
            }
          }
        })
      },
      editInvoice (res) {
        this.editInvoiceId = res.id
        switch (this.indexCode) {
          case '0':
            this.dialogDataEdit.title = '编辑增值税普通发票'
            break
          case '1':
            this.dialogDataEdit.title = '编辑增值税专用发票'
            break
        }
        this.dataFormEdit.from.map(item => {
          item.value = res[item.prop]
        })
        this.dialogDataEdit.show = true
      },
      okEdit (res) {
        if (this.indexCode === '0') {
          this.saveInvoice(res, true)
        } else {
          this.saveZInvoice(res, true)
        }
      },
      cancelEdit () {
        this.dialogDataEdit.show = false
        this.formClear()
      },
      delInvoice (data, flag) {
        let ids = []
        if (flag) {
          ids = [data.id]
        } else {
          if (this.selectionIds && this.selectionIds.length > 0) {
            ids = this.selectionIds
          } else {
            this.$message('请选择发票')
          }
        }
        if (ids && ids.length) {
          this.$confirm('确定要删除吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.$Api.user.delete,
              data: {
                ids: ids
              },
              cb: res => {
                if (res.data.result) {
                  this.$message('删除成功')
                  this.pageUpdateTable()
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
