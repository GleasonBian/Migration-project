<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div>发票设置</div>
      </el-col>
    </el-row>
    <tab-but :data="tabBut" @on-add="tabAdd"></tab-but>
    <v-dialog :dialog="dialogDataAdd">
      <v-search :data="searchData" @on-click="search"></v-search>
      <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                  :refs="tablePerformance">
        <template v-slot:cz="scope">
          <span class="handle" @click="selInvoice(scope.row)">选择</span>
        </template>
      </table-list>
      <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    </v-dialog>
    <table-list :data-header="dataHeaderElse" :data-static="dataStatic" :static="tableStatic"></table-list>
    <div class="but">
      <el-button type="primary" @click="save" class="distribution" :disabled="disabledSave">保存</el-button>
      <!--<el-button type="primary" @click="commit" class="distribution" :disabled="disabledCommit">提交</el-button>-->
      <!--<tab-but :data="tabBut2" @cancel="cancel" @save="save" @on-add="commit"></tab-but>-->
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        disabledSave: false,
        disabledCommit: false,
        tableStatic: true,
        dataStatic: [],
        tabBut: [{
          text: '选择',
          key: 'add'
        }],
        tabBut2: [{
          text: '保存',
          key: 'save'
        }, {
          text: '提交',
          key: 'add'
        }],
        radio: false,
        dialogDataAdd: {show: false, title: '添加发票', width: '60%'},
        searchData: [{
          key: 'companyName',
          label: '单位名称',
          value: '',
          type: 'text'
        }],
        dataHeader: [{
          prop: 'invoiceTypeString',
          label: '发票类型'
        }, {
          prop: 'companyName',
          label: '单位名称'
        }, {
          prop: 'taxpayCode',
          label: '税号'
        }, {
          prop: 'registryAddress',
          label: '注册地址'
        }, {
          prop: 'registryPhone',
          label: '注册电话'
        }, {
          prop: 'openAccount',
          label: '开户银行'
        }, {
          prop: 'accountNumber',
          label: '开户银行账户'
        }, {
          prop: 'receiverName',
          label: '收票人姓名'
        }, {
          prop: 'receiverPhone',
          label: '收票人手机'
        }, {
          prop: 'receiverAddr',
          label: '收票地址'
        }, {
          prop: 'cz',
          label: '操作',
          slot: true
        }],
        dataHeaderElse: [{
          prop: 'invoiceTypeString',
          label: '发票类型'
        }, {
          prop: 'companyName',
          label: '单位名称'
        }, {
          prop: 'taxpayCode',
          label: '税号'
        }, {
          prop: 'registryAddress',
          label: '注册地址'
        }, {
          prop: 'registryPhone',
          label: '注册电话'
        }, {
          prop: 'openAccount',
          label: '开户银行'
        }, {
          prop: 'accountNumber',
          label: '开户银行账户'
        }, {
          prop: 'receiverName',
          label: '收票人姓名'
        }, {
          prop: 'receiverPhone',
          label: '收票人手机'
        }, {
          prop: 'receiverAddr',
          label: '收票地址'
        }],
        tabUrl: this.$Api.finance.findInvoiceByPage,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'finance_add_settle'
        },
        dataSearch: {},
        tablePerformance: 'finance_add_settle',
        dataOld: {}
      }
    },
    computed: {},
    created () {
      let data = JSON.parse(this.$route.params.data)
      this.dataOld = data
      if (data.invoice) {
        this.dataStatic.push(data.invoice)
      }
    },
    mounted () {
    },
    components: {},
    filters: {},
    watch: {},
    methods: {
      commit () {
        this.disabledCommit = true
        this.addSettlement(1)
      },
      save () {
        this.disabledSave = true
        this.addSettlement(3)
      },
      formatParams (settlementStateCode) {
        let params = this.dataOld
        if (params.invoice) {
          delete params.invoice
        }
        if (this.dataStatic.length !== 0 && this.dataStatic[0].id) {
          params.invoiceId = this.dataStatic[0].id
          params.settlementStateCode = settlementStateCode
          return [true, params]
        }
        return [false]
      },
      cancel () {
        this.$router.back()
      },
      selInvoice (data) {
        this.dataStatic = [data]
        this.dialogDataAdd.show = false
      },
      tabAdd () {
        this.dialogDataAdd.show = true
      },
      search (res) {
        res.settlementCycleEndTimeStr = res.endTime ? res.endTime : ''
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      addSettlement (state) {
        let paramsList = this.formatParams(state)
        if (!paramsList[0]) {
          this.$message('请先选择发票')
          return false
        }
        this.$Ajax.post({
          url: this.$Api.finance.saveSettlement,
          data: {
            json: JSON.stringify(paramsList[1])
          },
          cb: res => {
            if (res.data.result) {
              this.$message('保存成功')
              this.$router.push({name: 'beamFieldStatements'})
              this.disabledSave = false
              this.disabledCommit = false
            } else {
              this.$message(res.data.message)
            }
          }
        })
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      }
    }
  }
</script>

<style scoped>
  .handle {
    font-size: 14px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }

  .but {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
</style>
