<template>
  <div>
    <el-row>
      <el-col class="box_icon_bodrd" :span="6">
        <div class="box_icon_bodrd_img">{{formatData(profitDetailsData.totalMoney)}}</div>
        <div class="box_icon_bodrd_text">采购金额</div>
      </el-col>
      <el-col class="box_icon_bodrd" :span="6">
        <div class="box_icon_bodrd_img">{{formatData(profitDetailsData.totalCost)}}</div>
        <div class="box_icon_bodrd_text">采购成本</div>
      </el-col>
      <el-col class="box_icon_bodrd" :span="6">
        <div class="box_icon_bodrd_img">{{formatData(profitDetailsData.grossProfit)}}</div>
        <div class="box_icon_bodrd_text">毛利润</div>
      </el-col>
      <el-col class="box_icon_bodrd" :span="6">
        <div class="box_icon_bodrd_img">{{profitDetailsData.grossProfitRate}}</div>
        <div class="box_icon_bodrd_text">毛利率</div>
      </el-col>
    </el-row>
    <div class="contract_title">绩效明细</div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="profitDetailsHeader" :refs="profitDetailsRefs" :url="urlGoods"
                :params="pageProfitDetails" @get-table-data="getTableData">
      <template slot-scope="scope" slot="number">
        {{scope.index + 1}}
      </template>
      <template slot-scope="scope" slot="code">
        <a class="handle" @click="toGoodsDetails(scope.row)">{{scope.row.code}}</a>
      </template>
    </table-list>
    <v-page :data="pageProfitDetails" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        urlProfitDetails: this.$Api.board.profitPager,
        profitDetailsRefs: 'performance_details_table',
        pageProfitDetails: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          type: 1,
          refs: 'performance_details_table'
        },
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
        urlGoods: this.$Api.board.projectGoodsDetailPage,
        profitDetailsData: {},
        typeCode: '',
        userId: '',
        searchData: [],
        searchData1: [{
          key: 'supplierName',
          label: '供应商名称:',
          value: '',
          placeholder: '请输入'
        }, {
          key: 'goodsName',
          label: '物资名称:',
          value: '',
          placeholder: '请输入'
        }],
        searchData2: [{
          key: 'goodsName',
          label: '物资名称:',
          value: '',
          placeholder: '请输入'
        }, {
          label: '梁场名称',
          value: '',
          key: 'projectId',
          select: []
        }],
        dataSearch: {}
      }
    },
    created () {
      this.userId = this.$route.params.id
      this.typeCode = this.$route.params.type
      if (this.typeCode === '3') {
        this.searchData = this.searchData1
      } else {
        this.searchData = this.searchData2
      }
      this.pageProfitDetails.userId = this.userId
      this.pageProfitDetails.type = this.typeCode
      this.getDetailsData()
      this.getProjectList()
    },
    mounted () {
    },
    methods: {
      formatData (val1) {
        let val = Number(val1)
        let str = val.toFixed(4) + ''
        let intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',')
        let dot = str.substring(str.length, str.indexOf('.'))
        let ret = intSum + dot
        return ret
      },
      getProjectList () {
        this.$Ajax.post({
          url: this.$Api.demand.getProjectList,
          cb: res => {
            if (res.status === 200) {
              if (res.data.data) {
                let select = []
                res.data.data.map(x => {
                  select.push({
                    value: x.id,
                    label: x.projectName
                  })
                })
                this.searchData2[1].select = select
              }
            }
          }
        })
      },
      ajaxPost (url, data, cb) {
        this.$Ajax.post({
          url: url,
          data: data,
          cb: cb
        })
      },
      getDetailsData () {
        let data = {}
        data.isTotal = 0
        data.type = this.typeCode
        data.userId = this.userId
        this.ajaxPost(this.urlProfitDetails, data, (res) => {
          this.profitDetailsData = res.data.rows[0]
        })
      },
      getTableData (data) {
        this.pageProfitDetails.totalNum = data.data.total
      },
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([this.dataSearch, this.pageProfitDetails], this.profitDetailsRefs, this)
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.pageProfitDetails.offset = 0
          this.pageProfitDetails.currentPage = 1
        }
        this.pageUpdateTable()
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

  .box_search {
    margin: 20px 0;
    font-size: 14px;
  }
</style>
