<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" :refs="tableDemandSceneList"
                @get-table-data="getTableData" @selection-change="selectionChange">
      <template slot-scope="scope" slot="operation">
        <tab-but :data="getOperationBtn(scope.row.state)"
                 @on-detail="toDetails(scope.row)"
                 @to-export="toExport(scope.row)"
        ></tab-but>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [{
          key: 'buyUserName',
          label: '采购员:',
          value: '',
          placeholder: '请输入采购员'
        }, {
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
        }, {
          key: 'startTime',
          label: '创建时间：',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }, {
          key: 'creater',
          label: '创建人:',
          value: '',
          placeholder: '请输入创建人'
        }, {
          key: 'stateCode',
          label: '需求状态：',
          value: '',
          select: []
        }],
        dataSearch: {},
        dataHeader: [{
          prop: 'id',
          label: '需求单号'
        }, {
          prop: 'typeStr',
          label: '采购类型'
        }, {
          prop: 'projectName',
          label: '梁场名称'
        }, {
          prop: 'buyUserName',
          label: '采购员'
        }, {
          prop: 'expectedDeliveryTime',
          label: '期望到货时间'
        }, {
          prop: 'stateStr',
          label: '需求状态'
        }, {
          prop: 'creater',
          label: '创建人'
        }, {
          prop: 'createTimeStr',
          label: '创建时间'
        }, {
          prop: 'operation',
          label: '操作',
          slot: true
        }],
        tabUrl: this.$Api.demand.getPagePurchaseRequestList,
        tableDemandSceneList: 'table_demand_scene_list',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_demand_scene_list'
        },
        operationBtn: [{
          text: '查看',
          key: 'on-detail',
          type: 'text'
        }, {
          text: '导出',
          key: 'to-export',
          type: 'text'
        }],
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlState: this.$Api.demand.getPurchaseRequestState,
        urlCancelData: this.$Api.demand.getPurchaseRequestState,
        arrBeamData: [],
        arrStateData: [],
        selection: []
      }
    },
    created () {
      this.getBeamField()
      this.getState()
    },
    methods: {
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
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
      fliterSelectState (res) {
        let arrState = []
        if (res.length) {
          res.map(item => {
            arrState.push({label: item.display, value: item.code})
          })
        }
        return arrState
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
      getState () {
        this.ajaxPost(this.urlState, (res) => {
          if (res.data.result) {
            this.arrStateData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'stateCode') {
                item.select = this.fliterSelectState(this.arrStateData)
              }
            })
          }
        })
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      jumpPageParams (nameR, params) {
        this.$router.push({
          name: nameR,
          params: params
        })
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
        this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
      },
      selectionChange (selection) {
        this.selection = selection
      },
      getOperationBtn (code) {
//        let arrOperationBtn = [].concat(this.operationBtn).splice(0, 1, 1)
//        return code === 3 ? this.operationBtn : arrOperationBtn
        return this.operationBtn
      },
      toDetails (res) {
        this.jumpPageParams('DemandPurchaseDetails', {id: res.id})
      },
      toExport (res) {
        location.href = this.$Api.demand.exportPurchaseRequesBuyId + '?id=' + res.id
      }
    }
  }
</script>

<style scoped>

</style>
