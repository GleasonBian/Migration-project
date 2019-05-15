<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="tabBut" @add-receipt="addReceipt"  v-if="$Utils.getPageElement($Consts.PERMISSION.batchAcceptance.code)"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="purchasePlanNumber">
        <span class="handle font_14" v-if="scope.row.purchasePlanNumbers && scope.row.purchasePlanNumbers.indexOf(',') != -1" @click="codeDetails(scope.row.purchasePlanNumbers)">详情</span>
        <span v-else>{{scope.row.purchasePlanNumber}}</span>
      </template>
      <template slot-scope="scope" slot="handle">
        <a class="handle" style="margin-left: 10px;" @click="toDetails(scope.row)">查看</a>
        <a class="handle" style="margin-left: 10px;" @click="toExport(scope.row.id)">导出</a>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--采购单号弹出框-->
    <v-dialog :dialog="dataDialog">
      <div style="word-break:break-all">{{codeStr}}</div>
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
        tabBut: [
          {text: '批量验收', key: 'add-receipt'}
        ],
        arrBeamData: [],
        stateArr: [],
        urlState: this.$Api.sale.getInternalAuditState,
        tabUrl: this.$Api.sign.findPager,
        exportUrl: this.$Api.sign.exportDetail,
        urlBeamField: this.$Api.orderManger.getProjectList,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'sign_table'
        },
        dataSearch: {},
        dataHeader: [
          {prop: 'number', label: '验收单号'},
          {prop: 'purchasePlanNumber', label: '采购单号', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'goodsCount', label: '物资数量'},
          {prop: 'stateStr', label: '验收单状态'},
          {prop: 'signTimeStr', label: '验收日期'},
          {prop: 'creator', label: '创建人'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        tablePerformance: 'sign_table',
        searchData: [{
          key: 'number',
          label: '验收单号',
          value: '',
          type: 'text'
        }, {
          key: 'purchasePlanNumber',
          label: '采购单号:',
          value: '',
          placeholder: '请输入采购单号'
        }, {
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
        }, {
          key: 'startSignDate',
          label: '验收日期',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }, {
          key: 'goodsName',
          label: '物资名称',
          value: '',
          type: 'text'
        }, {
          key: 'signStateCode',
          label: '验收单状态',
          value: '',
          select: []
        }]
      }
    },
    created () {
      this.getBeamField()
      this.getStateCode()
    },
    methods: {
      getStateCode () {
        this.ajaxPost(this.$Api.sign.getSignReceiptStateEnum, (res) => {
          if (res.data.result) {
            let arrData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'signStateCode') {
                item.select = arrData
              }
            })
          }
        })
      },
      codeDetails (str) {
        this.codeStr = str
        this.dataDialog.show = true
      },
      addReceipt () {
        this.$router.push({name: 'batchReceiptAdd'})
      },
      toExport (id) {
        location.href = this.exportUrl + '/' + id
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      fliterSelectState (res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({label: item.display, value: item.code})
          })
        }
        return arrBeam
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
      fliterSelectBeam (res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({label: item.projectName, value: item.id})
          })
        }
        return arrBeam
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      search (res) {
        if (res.endTime) {
          res.endSignDate = res.endTime
          delete res.endTime
        }
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      toDetails (item) {
        this.$router.push({name: 'batchReceiptDetails', params: {id: item.id}})
      }
    }
  }
</script>

<style scoped>
  .handle {
    font-size: 12px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }

  .txtRed {
    color: red;
  }
</style>
