<template>
  <div>
    <h4>{{projectName}}物资明细</h4>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="profitDetailsHeader" :refs="profitDetailsRefs" :url="urlProfitDetails"
                :params="page" @get-table-data="getTableData">
      <template slot-scope="scope" slot="number">
        {{scope.index + 1}}
      </template>
      <template slot-scope="scope" slot="code">
        <a class="handle" @click="toGoodsDetails(scope.row)">{{scope.row.code}}</a>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        projectName: '',
        profitDetailsHeader: [
          {prop: 'number', label: '序号', width: '60', slot: true},
          {prop: 'goodsName', label: '物资名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'salesPrice', label: '销售价'},
          {prop: 'purchasePrice', label: '采购价'},
          {prop: 'totalMoney', label: '采购金额'},
          {prop: 'grossProfit', label: '毛利润'},
          {prop: 'grossProfitRate', label: '毛利率（%）'},
          {prop: 'supplierName', label: '供应商'},
          {prop: 'code', label: '采购单号', slot: true}
        ],
        urlProfitDetails: this.$Api.board.projectGoodsDetailPage,
        profitDetailsRefs: 'profit_details_infoinfo_table',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'profit_details_infoinfo_table',
          projectId: '',
          reportDate: ''
        },
        dataSearch: {},
        searchData: [{
          key: 'goodsName',
          label: '物资名称',
          value: '',
          type: 'text'
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
        }]
      }
    },
    created () {
      this.page.projectId = this.$route.params.id
      this.page.reportDate = this.$route.params.date
      this.projectName = this.$route.params.name
    },
    mounted () {
    },
    methods: {
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
        this.pageUpdateTable()
      },
      ajaxPost (url, data, cb) {
        this.$Ajax.post({
          url: url,
          data: data,
          cb: cb
        })
      },
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.profitDetailsRefs, this)
      },
      toGoodsDetails (res) {
        this.$router.push({name: 'salesDetail', params: {id: res.purchaseId}})
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

  .contract_title {
    margin-bottom: 10px;
    font-size: 18px;
    border-left: solid #008aff 4px;
    padding-left: 5px;
    margin-right: 20px;
  }

  .btn_search_time {
    margin: 10px 0;
    font-size: 14px;
  }

  .box_icon_bodrd {
    padding: 20px;
  }

  .box_icon_bodrd_img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    background: url(../../static/img/icon_board.png);
    background-size: 100%;
    text-align: center;
    line-height: 100px;
    color: #5a9df8;
  }

  .box_icon_bodrd_text {
    font-size: 18px;
    margin-top: 20px;
    line-height: 30px;
    text-align: center;
  }
</style>
