<template>
  <div>
    <v-search :data="searchData" @on-click="searchDataClick"></v-search>
    <table-list :data-header="sellHeader" :url="sellUrl" :params="page" :refs="sellRefs" @get-table-data="sellGetTableData">
      <template slot-scope="scope" slot="number">
        <el-button type="text" @click="toDet(scope.row)">{{scope.row.number}}</el-button>
      </template>
      <template slot-scope="scope" slot="replenishStockCode">
        <el-button type="text" @click="toReplenish(scope.row)">{{scope.row.replenishStockCode}}</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeName: 'tab_sell',
        sellHeader: [
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'number', label: '采购单号', slot: true},
          {prop: 'createTimeStr', label: '需求日期'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'countStr', label: '采购数量'},
//          {prop: 'replenishStockCode', label: '进货单号', slot: true, width: '150'},
          {prop: 'companyName', label: '供应商名称'}
        ],
        sellUrl: this.$Api.order.purchaseNoDeliveryGoodsList,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_board_more_2'
        },
        sellRefs: 'table_board_more_2',
        dataSearch: {},
        searchData: [
          {label: '供应商', value: '', key: 'companyName'},
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          },
          {label: '采购计划单号', value: '', key: 'number'},
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
          },
          {label: '商品名称', value: '', key: 'goodsName'}
//          {label: '进货单号', value: '', key: 'replenishStockCode'}
        ]
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
        this.ajaxPost(this.$Api.orderManger.getProjectList, (res) => {
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
      toDet (row) {
        this.$router.push({name: 'detailsProcurement', params: {id: row.purchasePlanId}})
      },
      toReplenish (row) {
        this.$router.push({name: 'stockDetails', params: {id: row.replenishId}})
      },
      sellGetTableData (data) {
        this.page.totalNum = data.data.total
        data.data.rows.map(item => {
          item.countStr = item.noDeliveryGoodsCount + ' / ' + item.goodsCount
        })
      },
      searchDataClick (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearch, this.page], this.sellRefs, this)
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      }
    }
  }
</script>

<style scoped>
</style>
