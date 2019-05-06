<template>
  <div>
    <v-search :data="searchData" @on-click="search">
      <template slot="projectName" slot-scope="scope">
        <el-select v-model="scope.rows.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.projectName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </v-search>
    <div style="margin-bottom: 20px;display: flex;">
      <el-button type="primary" v-if="$Utils.getPageElement($Consts.PERMISSION.addStatements.code)" @click="tabAdd">新增结算单</el-button>
      <el-button type="primary" @click="importfileAll">批量导出</el-button>
    </div>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="number">
        <span class="handle font_14" v-if="scope.row.numbers && scope.row.numbers.indexOf(',') != -1" @click="codeDetails(scope.row.numbers)">详情</span>
        <span v-else>{{scope.row.number}}</span>
      </template>
      <template slot-scope="scope" slot="cz">
        <div>
          <span class="handle" @click="jumpDetailSetlement(scope.row.id)">查看</span>
          <span class="handle" v-if="scope.row.processingStateCode === 3" @click="editSettle(scope.row)">编辑</span>
          <span class="handle" @click="importfile(scope.row.id)">导出</span>
          <!--<span class="handle" @click="editSettle(scope.row)"-->
                <!--v-if="scope.row.processingStateCode === 3">编辑</span>-->
          <!--<span class="handle" @click="suremoney(scope.row.id, scope.row.orderIds)"-->
                <!--&gt;记录发票货款</span>-->
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--采购单号弹出框-->
    <v-dialog :dialog="dataDialog">
      <div style="word-break:break-all">{{codeStr}}</div>
    </v-dialog>
    <v-dialog :dialog="dialogDataAdd">
      <form-group :data="dataFormAdd" @on-cancel="cancelAdd" @on-ok="okAdd" :custom=true :data-but="databut"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    data () {
      return {
        dataDialog: {
          show: false,
          title: '采购单号',
          width: '700px'
        },
        codeStr: '',
        searchData: [{
          key: 'settlementNumber',
          label: '结算单编号',
          value: '',
          type: 'text'
        }, {
          label: '采购单号',
          value: '',
          key: 'number'
        }, {
          label: '梁场名称：',
          value: '',
          placeholder: '请输入',
          custom: true,
          key: 'projectId',
          prop: 'projectName'
        }, {
          key: 'startTime',
          label: '创建时间',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }, {
          key: 'processingStateCode',
          label: '结算单状态',
          value: '',
          select: [
            {value: 1, label: '待结算'},
            {value: 2, label: '已完成'},
            {value: 3, label: '编制中'}
          ]
        }],
        options: [],
        dataHeader: [{
          prop: 'settlementNumber',
          label: '结算单编号',
          width: 200
        }, {
          label: '采购单号',
          prop: 'number',
          slot: true
        }, {
          prop: 'projectName',
          label: '梁场名称'
        }, {
          prop: 'applicationMoney',
          label: '结算金额'
        }, {
          prop: 'actualApplicationMoney',
          label: '实际结算金额'
        }, {
          prop: 'processingStateDisplay',
          label: '结算单状态'
        }, {
          prop: 'applicantName',
          label: '创建人'
        }, {
          prop: 'createTimeStr',
          label: '创建时间'
        }, {
          label: '回款比例',
          prop: 'payMoneyRecord'
        }, {
          label: '发票',
          prop: 'isInvoice'
        }, {
          prop: 'cz',
          label: '操作',
          slot: true
        }],
        tabUrl: this.$Api.finance.loadListData,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'finance_beam_table'
        },
        tablePerformance: 'finance_beam_table',
        dataSearch: {},
        tabBut: [{text: '新增结算单', key: 'add', icon: 'el-icon-plus'}],
        dialogDataAdd: {show: false, title: '结算设置', width: '30%'},
        dataFormAdd: {
          from: [{
            prop: 'actualApplicationMoney',
            label: '实际结算金额：',
            value: '',
            labelWidth: '130px',
            required: true,
            type: 'number',
            min: 0,
            placeholder: '请输入结算金额',
            rules: [{required: true, message: '请输入结算金额', trigger: 'blur,change'}]
          }, {
            prop: 'description',
            label: '审核备注：',
            value: '',
            type: 'textarea',
            rows: 3,
            labelWidth: '130px',
            placeholder: '请填写描述'
          }]
        },
        databut: [{text: '取消', key: 'cancel'}, {text: '确认', type: 'primary', key: 'ok'}],
        settlementId: ''
      }
    },
    created () {
      this.getphases()
    },
    methods: {
      codeDetails (str) {
        this.codeStr = str
        this.dataDialog.show = true
      },
      importfile (id) {
        location.href = this.$Api.finance.newExportSettlement + '/' + id
      },
      importfileAll () {
        let api = this.$Api.finance.selectExportSettlement
        let str = ''
        if (this.dataSearch.settlementNumber) {
          str += '?settlementNumber=' + this.dataSearch.settlementNumber
        } else {
          str += '?settlementNumber='
        }
        if (this.dataSearch.number) {
          str += '&number=' + this.dataSearch.number
        } else {
          str += '&number='
        }
        if (this.dataSearch.projectId) {
          str += '&projectId=' + this.dataSearch.projectId
        } else {
          str += '&projectId='
        }
        if (this.dataSearch.startTime) {
          str += '&startTime=' + this.dataSearch.startTime + '&endTime=' + this.dataSearch.endTime
        } else {
          str += '&startTime=&endTime='
        }
        if (this.dataSearch.processingStateCode) {
          str += '&processingStateCode=' + this.dataSearch.processingStateCode
        } else {
          str += '&processingStateCode='
        }
        location.href = api + str
      },
      suremoney (settlementId) {
        let routeData = this.$router.resolve({
          name: 'detailSettlementDetails',
          params: {settlementId}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'detailSettlementDetails', params: {settlementId, orderIds}})
      },
      okAdd (res) {
        if (res.actualApplicationMoney < 0) {
          this.$message.error('实际结算金额不能小于0！')
          return
        }
        res.id = this.settlementId
        this.$Ajax.post({
          url: this.$Api.finance.newtoExamine,
          data: res,
          cb: res => {
            if (res.status === 200) {
              this.dialogDataAdd.show = false
              this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      cancelAdd () {
        this.dialogDataAdd.show = false
        this.$bus.emit('form-clear')
      },
      jumpDetailSetlement (settlementId) {
        let routeData = this.$router.resolve({
          name: 'detailSettlementDetails',
          params: {settlementId: settlementId}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'detailSettlement', params: {settlementId, orderIds}})
      },
      tabAdd () {
        let routeData = this.$router.resolve({
          name: 'addBeanmfIeldState'
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'addBeanmfIeldState', params: {id: -1}})
      },
      editSettle (row) {
        let routeData = this.$router.resolve({
          name: 'editBeamSettlement',
          params: {id: row.id, projectId: row.projectId}
        })
        window.open(routeData.href, '_blank')
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      getphases () {
        this.$Ajax.post({
          url: this.$Api.orderManger.getProjectList,
          data: {},
          cb: res => {
            if (res.status === 200) {
              this.options = res.data.data
              this.options.unshift({id: '', projectName: '全部'})
            }
          }
        })
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
        data.data.rows.map(item => {
          if (item.payMoneyRecord === 0) {
            item.payMoneyRecord = '-'
          } else {
            item.payMoneyRecord = item.payMoneyRecord + '%'
          }
          if (item.isInvoice === 0) {
            item.isInvoice = '-'
          } else {
            item.isInvoice = '已开'
          }
        })
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
</style>
