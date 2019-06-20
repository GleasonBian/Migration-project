<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance">
      <template v-slot:typeStr="scope">
        <div v-if="scope.row.type == 0">物资采购</div>
        <div v-else>设备采购</div>
      </template>
      <template v-slot:handle="scope">
        <div v-if="scope.row.state == 6">
          <span class="handle" @click="viewDetail(scope.row.id)">查看</span>
        </div>
        <div v-else>
          <span class="handle" @click="viewDetail(scope.row.id)">查看</span>
          <span class="handle" style="margin-left: 10px;" @click="forceClose(scope.row.id)">强制关闭</span>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        arrBeamData: [],
        exportQuotation: this.$Api.order.exportQuotation,
        urlBeamField: this.$Api.orderManger.getProjectList,
        tabUrl: this.$Api.order.priceList,
        urlClose: this.$Api.demand.forcedClosure,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          listPurchaseTypeCode: 2,
          refs: 'push_plan_table'
        },
        dataSearch: {},
        dataHeader: [
          { prop: 'code', label: '采购单编码' },
          {prop: 'typeStr', label: '采购类型', slot: true},
          { prop: 'projectName', label: '梁场名称' },
          { prop: 'expectedTime', label: '期望到货时间' },
          { prop: 'stateStr', label: '状态' },
          { prop: 'createTimeStr', label: '创建时间' },
          { prop: 'userName', label: '创建人' },
          { prop: 'phoneNum', label: '手机号码' },
          { prop: 'handle', label: '操作', slot: true }
        ],
        tablePerformance: 'push_plan_table',
        searchData: [{
          key: 'userName',
          label: '采购员',
          value: '',
          type: 'text'
        }, {
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
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
          key: 'state',
          label: '计划状态',
          value: '',
          select: [
            { label: '全部', value: '' },
            { label: '待配货', value: '0' },
            { label: '待确认', value: '1' },
            { label: '已确认', value: '2' },
            { label: '强制关闭', value: '6' }
          ]
        }]
      }
    },
    created () {
      this.getBeamField()
    },
    methods: {
      ajaxPost (url, data, cb) {
        this.$Ajax.post({
          url: url,
          data: data,
          cb: cb
        })
      },
      getBeamField () {
        this.ajaxPost(this.urlBeamField, {}, (res) => {
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
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      showAlert (msg, myCallback) {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          myCallback()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      forceClose (id) {
        this.showAlert('要强制关闭吗', () => {
          this.ajaxPost(this.urlClose, {listPurchaseId: id}, (res) => {
            if (res.data.result) {
              this.$message('强制关闭成功')
              this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          })
        })
      },
      viewDetail (id) {
        this.$router.push({ name: 'pushPlanDetails', params: { id: id } })
      }
    }
  }
</script>

<style scoped>
  .handle{
    font-size: 12px;
    color:#3a8ee6;
    cursor:pointer;
    text-decoration: none;
  }
  .handle:hover{
    text-decoration: underline;
  }
</style>
