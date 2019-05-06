<template>
  <div>
    <div class="color_red">提示：梁场名称必选</div>
    <br/>
    <v-search :data="searchData" @on-click="search">
    </v-search>
    <div class="box_all">
      <div class="pull-left">商品明细</div>
      <div class="pull-right">已选中<span class="color_red">{{countTotal}}</span>类物资，合计金额<span class="color_red">{{priceTotal}}</span>元
      </div>
    </div>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance" @selection-change="tbSelectionChange">
      <template slot-scope="scope" slot="indexCode">
        {{scope.index + 1}}
      </template>
      <template slot-scope="scope" slot="number">
        <el-button type="text" @click="toDetails(scope.row)">{{scope.row.number}}</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <div class="but">
      <el-button type="primary" @click="cancel">返回</el-button>
      <el-button type="primary" @click="btnToNext">下一步</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        countTotal: 0,
        priceTotal: 0,
        searchData: [
          {
            key: 'code',
            label: '采购单号',
            value: '',
            type: 'text'
          }, {
            label: '梁场名称：',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
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
          }
        ],
        dataHeader: [
          {type: 'selection'},
          {prop: 'indexCode', label: '序号', width: '60', slot: true},
          {prop: 'number', label: '采购单号', slot: true},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'signCount', label: '实收数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'totalPrice', label: '金额'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'remark', label: '其他要求'}
        ],
        selection: [],
        selectionGoodsIds: [],
        tabUrl: this.$Api.finance.findGoodsPager,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [10, 50, 100, 500, 1000, 2000],
          refs: 'finance_beam_add_table'
        },
        tablePerformance: 'finance_beam_add_table',
        dataSearch: {}
      }
    },
    computed: {},
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
        this.ajaxPost(this.$Api.orderManger.getProjectList, {}, (res) => {
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
        this.pageUpdateTable()
      },
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      tbSelectionChange (res) {
        this.selection = res
        this.selectionGoodsIds = this.selection.map(item => item.id)
        let price = 0
        if (this.selection && this.selection.length > 0) {
          this.countTotal = this.selection.length
          this.selection.map(res => {
            price = price + res.totalPrice
          })
          this.priceTotal = price.toFixed(4)
        } else {
          this.countTotal = 0
          this.priceTotal = 0
        }
      },
      btnToNext () {
        let json = {}
        json.startTime = this.dataSearch.startTime
        json.endTime = this.dataSearch.endTime
        json.projectId = this.dataSearch.projectId
        if (this.selectionGoodsIds && this.selectionGoodsIds.length > 0) {
          json.signReceiptGoodsIds = this.selectionGoodsIds
          this.$router.push({name: 'addBeanmfIeldStateSec', params: {data: JSON.stringify(json)}})
        } else {
          this.$message('请选择物资')
        }
      },
      cancel () {
        this.$router.push({name: 'beamFieldStatements'})
      },
      toDetails (res) {
        let routeData = this.$router.resolve({
          name: 'salesDetail',
          params: {id: res.listPurchaseId, approve: 0}
        })
        window.open(routeData.href, '_blank')
      }
    }
  }
</script>

<style scoped>
  .txt_state {
    color: #fff;
    font-size: 13px;
    background: #D8190F;
    padding: 2px 16px;
  }

  .row_title {
    display: flex;
    justify-content: space-between;
  }

  .row_title div {
    width: 30%;
    padding-left: 1%;
  }

  .tab_text_select {
    display: flex;
    margin-bottom: 20px;
    height: 40px;
  }

  .tab_text_select_lef {
    width: 2%;
    border-left: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    border-top: solid 1px gainsboro;
    align-self: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tab_text_select_rig {
    flex: 1;
    font-size: 14px;
    display: flex;
    border: solid 1px gainsboro;
  }

  .tab_shop_con {
    display: flex;
  }

  .tab_shop_lef {
    flex: 1;
  }

  .tab_shop_lef_con {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 20px;
    border-left: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    border-right: solid 1px gainsboro;
  }

  .tab_shop_rig {
    width: 8%;
    text-align: center;
    border-right: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    padding-top: 20px;
  }

  .tab_shop_rig_1 {
    border-top: solid 1px gainsboro;
  }

  .tab_title_cel_price {
    color: red;
  }

  .tab_shop_con_img {
    width: 80px;
    height: 90px;
  }

  .tab_con {
    display: flex;
    font-size: 14px;
  }

  .tab_con_lef {
    width: 2%;
    align-self: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: solid 1px gainsboro;
    border-left: solid 1px gainsboro;
  }

  .tab_con_cen {
    flex: 1;
  }

  .tab_shop_rig {
    width: 8%;
    text-align: center;
    border-right: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    padding-top: 20px;
  }

  .tab_title_con_1 {
    border: solid 1px gainsboro;
  }

  .tab_title_con {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 20px;
    border-left: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    border-right: solid 1px gainsboro;
  }

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

  .box_all {
    height: 50px;
    background: #eee;
    font-size: 14px;
    line-height: 50px;
    padding: 0 20px;
    margin-bottom: 20px;
  }
</style>
