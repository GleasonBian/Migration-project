<template>
  <div>
    <el-tabs>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane label="退货管理" name="first">
        </el-tab-pane>
        <el-tab-pane label="换货管理" name="second">
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <v-search :data="searchData" @on-click="searchDataClick"></v-search>
    <table-list :data-header="TableDataHeader" :url="tabUrl"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template v-slot:operation="scope">
        <el-button type="text" @click="toView(scope.row)">查看详情</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        routeName: 'returnGoodDetails',
        activeName: 'first',
        searchData: [
          {
            label: '申请时间：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            label: '商品名称：',
            value: '',
            key: 'goodsName'
          }, {
            label: '供应商：',
            value: '',
            key: 'supplierName'
          }, {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          }, {
            label: '申请人：',
            value: '',
            key: 'userName'
          }, {
            label: '采购单号：',
            value: '',
            key: 'code'
          }
        ],
        dataSearch: {},
        TableDataHeader: [
          {prop: 'code', label: '退货单编号', renderHeader: this.renderHeaderCode},
          {prop: 'replenishStockCode', label: '进货单编号'},
          {prop: 'number', label: '采购单号'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'createTimeStr', label: '申请时间'},
          {prop: 'userName', label: '申请人'},
          {prop: 'userPhone', label: '手机号码'},
          {label: '操作', slot: true, prop: 'operation', width: '150px'}
        ],
        tabUrl: this.$Api.procurement.findPageReturnChangeList,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_goodsTable_list',
          returnType: 1
        },
        tablePerformance: 'tab_goodsTable_list',
        urlBeamField: this.$Api.orderManger.getProjectList,
        okReturn: true
      }
    },
    created () {
      this.getBeamField()
    },
    methods: {
      renderHeaderCode () {
        if (this.okReturn) {
          return (
            <div>
            <span> 退货单编号 </span>
            </div>
          )
        } else {
          return (
            <div>
            <span> 换货单编号 </span>
            </div>
          )
        }
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
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      tabClick (res) {
        this.page.offset = 0
        this.page.currentPage = 1
        if (res.index === '0') {
          this.page.returnType = 1
          this.okReturn = true
          this.routeName = 'returnGoodDetails'
          this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
        } else {
          this.okReturn = false
          this.page.returnType = 2
          this.routeName = 'exchangeGoodDetails'
          this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
        }
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
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      toView (row) {
        let routeData = this.$router.resolve({
          name: this.routeName,
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
      }
    },
    components: {}
  }
</script>

<style scoped>

</style>
