<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @to-export="toExport"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance"></table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataSearch: {},
        searchData: [
          {
            label: '供应商名称：',
            value: '',
            placeholder: '请输入',
            key: 'supplierName'
          }, {
            label: '梁场名称：',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
            select: []
          }, {
            label: '创建时间：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            label: '采购单号：',
            value: '',
            placeholder: '请输入',
            key: 'purchasePlanNumber'
          }
        ],
        btnData: [{
          text: '导出',
          key: 'to-export'
        }],
        urlBeamField: this.$Api.orderManger.getProjectList,
        dataHeader: [
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'goodsName', label: '物资名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '计量单位'},
          {prop: 'stockCount', label: '采购数量'},
          {prop: 'unitPrice', label: '采购价格'},
          {prop: 'purchasePlanNumber', label: '采购单号'},
          {prop: 'collectionQuantity', label: '实收数量'}
        ],
        tabUrl: this.$Api.sign.stockDeliverGoodsForExport,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'finance_export_table'
        },
        tablePerformance: 'finance_export_table'
      }
    },
    created () {
      this.getBeamField()
    },
    methods: {
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
            this.historyDialogSearchData.map(item => {
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
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      toExport () {
        let str = ''
        if (this.dataSearch.projectId) {
          str += '?projectId=' + this.dataSearch.projectId
        } else {
          str += '?projectId='
        }
        if (this.dataSearch.supplierName) {
          str += '&supplierName=' + this.dataSearch.supplierName
        } else {
          str += '&supplierName='
        }
        if (this.dataSearch.startTime) {
          str += '&startTime=' + this.dataSearch.startTime
        } else {
          str += '&startTime='
        }
        if (this.dataSearch.endTime) {
          str += '&endTime=' + this.dataSearch.endTime
        } else {
          str += '&endTime='
        }
        if (this.dataSearch.purchasePlanNumber) {
          str += '&purchasePlanNumber=' + this.dataSearch.purchasePlanNumber
        } else {
          str += '&purchasePlanNumber='
        }
        location.href = this.$Api.sign.exportGoods + str
      }
    }
  }
</script>

<style scoped>
</style>
