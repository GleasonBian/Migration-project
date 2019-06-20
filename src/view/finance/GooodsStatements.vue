<template>
  <div>
    <v-search :data="searchData" @on-click="searchDataClick"></v-search>
    <!--<TabBut :data="TabButData" @on-add="onAdd" v-if="$Utils.getPageElement($Consts.PERMISSION.addSupplierStatements.code)"></TabBut>-->
    <div style="margin-bottom: 20px;display: flex;">
      <el-button type="primary" v-if="$Utils.getPageElement($Consts.PERMISSION.addSupplierStatements.code)" @click="tabAdd">新增结算单</el-button>
      <el-button type="primary" @click="importfileAll">批量导出</el-button>
    </div>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template v-slot:number="scope">
        <span class="handle font_14" v-if="scope.row.numbers && scope.row.numbers.indexOf(',') != -1" @click="codeDetails(scope.row.numbers)">详情</span>
        <span v-else>{{scope.row.number}}</span>
      </template>
      <template v-slot:operation="scope">
        <span class="handle" @click="onView(scope.row)">查看</span>
        <span class="handle" @click="onDerive(scope.row)">导出</span>
        <span class="handle" v-if="scope.row.processingStateCode === 3" @click="onEdit(scope.row)">编辑</span>
        <!--<TabBut :data="tbButElse" @onView="onView(scope.row)"></TabBut>-->
        <!--<TabBut :data="tbBut" @onView="onView(scope.row)" @onDerive="onDerive(scope.row)" v-show="scope.row.processingStateCode !== 1 && scope.row.processingStateCode !== 3"></TabBut>-->
        <!--<TabBut :data="tbBut1" @onView="onView(scope.row)" @onAffirm="onAffirm(scope.row)" @onDerive="onDerive(scope.row)" v-show="scope.row.processingStateCode === 1"></TabBut>-->
        <!--<TabBut :data="tbBut3" @onView="onView(scope.row)" @on-edit="onEdit(scope.row)" @onDerive="onDerive(scope.row)" v-show="scope.row.processingStateCode === 3"></TabBut>-->
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--采购单号弹出框-->
    <v-dialog :dialog="dataDialog">
      <div style="word-break:break-all">{{codeStr}}</div>
    </v-dialog>
    <v-dialog :dialog="dialogData">
      <form-group :data="dialogForm" @on-cancel="dialogCancel" @on-ok="dialogOk" :custom=true :data-but="dialogBut"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataDialog: {
          show: false,
          title: '采购单号',
          width: '700px'
        },
        codeStr: '',
        searchData: [
          {label: '结算单编号', value: '', key: 'settlementNumber'},
          {label: '采购单号', value: '', key: 'number'},
          {
            label: '结算单状态',
            value: '',
            key: 'processingStateCode',
            select: [
              {value: 1, label: '待结算'},
              {value: 2, label: '已完成'},
              {value: 3, label: '编制中'}
            ]
          },
          {
            label: '结算类型',
            value: '',
            key: 'settlementType',
            select: [
              {value: 1, label: '账期付款'},
              {value: 2, label: '现结付款'}
            ]
          },
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          },
          {label: '供应商名称', value: '', key: 'supplierName'},
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
        TabButData: [{text: '新增结算单', key: 'add'}],
        TableDataHeader: [
          {label: '结算单编号', prop: 'settlementNumber'},
          {label: '采购单号', prop: 'number', slot: true},
          {label: '供应商名称', prop: 'supplierName'},
          {label: '结算金额', prop: 'applicationMoney'},
          {label: '实际结算金额', prop: 'actualApplicationMoney'},
          {label: '结算类型', prop: 'settlementTypeDisplay'},
          {label: '结算状态', prop: 'processingStateDisplay'},
          {label: '发票', prop: 'isInvoice'},
          {label: '已付货款比例', prop: 'payMoneyRecord'},
          {label: '下次付款时间', prop: 'nextTime'},
          {label: '创建人', prop: 'applicantName'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '操作', prop: 'operation', slot: true, width: '250px'}
        ],
        DataUrl: this.$Api.finance.loadSettlement,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_finance_list'
        },
        tablePerformance: 'tab_finance_list',
        dataSearch: {},
        tbBut: [
          {text: '查看', key: 'onView', type: 'text'},
          {text: '导出', key: 'onDerive', type: 'text'}
        ],
        tbButElse: [
          {text: '查看', key: 'onView', type: 'text'}
        ],
        tbBut1: [
          {text: '查看', key: 'onView', type: 'text'},
          {text: '记录发票货款', key: 'onAffirm', type: 'text'},
          {text: '导出', key: 'onDerive', type: 'text'}
        ],
        tbBut3: [
          {text: '查看', key: 'onView', type: 'text'},
          {text: '编辑', key: 'edit', type: 'text'},
          {text: '导出', key: 'onDerive', type: 'text'}
        ],
        dialogData: {show: false, title: '结算设置', width: '30%'},
        dialogForm: {
          from: [{
            prop: 'applicationMoney',
            label: '实际结算金额：',
            value: '',
            labelWidth: '130px',
            type: 'number',
            min: 0,
            required: true,
            placeholder: '请填写实际结算金额',
            rules: [{ required: true, message: '请填写实际结算金额', trigger: 'blur,change' }]
          }, {
            prop: 'auditRemarks',
            label: '审核备注：',
            value: '',
            type: 'textarea',
            rows: 4,
            labelWidth: '130px'
          }]
        },
        dialogBut: [{text: '取消', key: 'cancel'}, {text: '确定', type: 'primary', key: 'ok'}]
      }
    },
    created () {
//      this.getSelectData()
      this.getBeamField()
    },
    methods: {
      codeDetails (str) {
        this.codeStr = str
        this.dataDialog.show = true
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      getBeamField () {
        this.ajaxPost(this.$Api.orderManger.getProjectList, (res) => {
          if (res.data.result) {
            let arrBeamData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(arrBeamData)
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
      getSelectData () {
        this.$Ajax.post({
          url: this.$Api.finance.toNewSettlementList,
          cb: res => {
            if (res.data.result) {
              this.searchData[1].select = []
              for (let item in res.data.data) {
                let sel = res.data.data
                let name = ''
                if (sel[item] === 'TO_BE_SETTLED') {
                  name = '待结算'
                } else if (sel[item] === 'FINISH') {
                  name = '已完成'
                } else {
                  name = '编制中'
                }
                this.searchData[1].select.push({value: item, label: name})
              }
            }
          }
        })
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
            item.isInvoice = '已收'
          }
        })
      },
      onAdd () {
        this.$router.push({name: 'gooodsStatementsAdd'})
      },
      importfileAll () {
        let api = this.$Api.finance.selectExportSettlementSupplier
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
        if (this.dataSearch.processingStateCode) {
          str += '&processingStateCode=' + this.dataSearch.processingStateCode
        } else {
          str += '&processingStateCode='
        }
        if (this.dataSearch.settlementType) {
          str += '&settlementType=' + this.dataSearch.settlementType
        } else {
          str += '&settlementType='
        }
        if (this.dataSearch.projectId) {
          str += '&projectId=' + this.dataSearch.projectId
        } else {
          str += '&projectId='
        }
        if (this.dataSearch.supplierName) {
          str += '&supplierName=' + this.dataSearch.supplierName
        } else {
          str += '&supplierName='
        }
        if (this.dataSearch.startTime) {
          str += '&startTime=' + this.dataSearch.startTime + '&endTime=' + this.dataSearch.endTime
        } else {
          str += '&startTime=&endTime='
        }
        location.href = api + str
      },
      onView (row) {
        let routeData = this.$router.resolve({
          name: 'gooodsStatementsViewDdetails',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'gooodsStatementsView', params: {id: row.id}})
      },
      tabAdd () {
        let routeData = this.$router.resolve({
          name: 'gooodsStatementsAdd'
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'gooodsStatementsAdd', params: {id: -1}})
      },
      onEdit (row) {
        let routeData = this.$router.resolve({
          name: 'gooodsStatementsEdit',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'gooodsStatementsEdit', params: {id: row.id}})
      },
      onDerive (row) {
        location.href = this.$Api.finance.exportSettlement + '/' + row.id
      },
      onAffirm (row) {
        let routeData = this.$router.resolve({
          name: 'gooodsStatementsViewDdetails',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'gooodsStatementsViewDdetails', params: {id: row.id}})
      },
      dialogCancel () {
        this.dialogData.show = false
        this.$bus.emit('form-clear')
      },
      dialogOk (res) {
        res.applicationMoney = parseInt(res.applicationMoney)
        if (res.applicationMoney < 0) {
          this.$message.error('实际结算金额不能小于0！')
          return
        }
        if (res.auditRemarks === undefined) {
          res.auditRemarks = ''
        }
        let data = {
          id: this.dialogData.id,
          actualApplicationMoney: res.applicationMoney,
          auditRemarks: res.auditRemarks
        }
        this.$Ajax.post({
          url: this.$Api.finance.toExamine,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message('审核成功')
              this.dialogCancel()
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            } else {
              this.$message.error('确认失败')
            }
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
    margin: 0px 2px;
  }

  .handle:hover {
    text-decoration: underline;
  }
</style>
