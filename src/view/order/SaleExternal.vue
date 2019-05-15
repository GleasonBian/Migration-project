<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="tabBut" @add-external="addExternal"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="handle">
        <a class="handle" style="margin-left: 10px;" @click="toDetails(scope.row.id)">查看</a>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tabBut: [
          {text: '创建外审单', key: 'add-external'}
        ],
        arrBeamData: [],
        stateArr: [],
        urlState: this.$Api.sale.getExternalAuditState,
        tabUrl: this.$Api.sale.findExternalAuditList,
        urlBeamField: this.$Api.orderManger.getProjectList,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'external_table'
        },
        dataSearch: {},
        dataHeader: [
          {prop: 'code', label: '外审单号'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'typeStr', label: '采购类型'},
          {prop: 'goodsCount', label: '商品种类'},
          {prop: 'goodsPriceTotle', label: '金额'},
          {prop: 'stateDisplay', label: '状态'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        tablePerformance: 'external_table',
        searchData: [{
          key: 'code',
          label: '外审单号',
          value: '',
          type: 'text'
        }, {
          key: 'state',
          label: '审批状态',
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
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
        }, {
          key: 'listPurchaseTypeCode',
          label: '采购单类型',
          value: '',
          select: [
            {label: '物资', value: '0'},
            {label: '设备', value: '1'}
          ]
        }]
      }
    },
    created () {
      this.getBeamField()
      this.getStateCode()
    },
    methods: {
      addExternal () {
        this.$router.push({name: 'addExternal'})
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      getStateCode () {
        this.$Ajax.get({
          url: this.urlState,
          data: {},
          cb: res => {
            if (res.data.result) {
              this.stateArr = res.data.data
              this.searchData.map(item => {
                if (item.key === 'state') {
                  item.select = this.fliterSelectState(this.stateArr)
                }
              })
            }
          }
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
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      toDetails (id) {
        this.$router.push({name: 'externalDetails', params: {id: id}})
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
