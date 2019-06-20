<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="box_boadr_home">
          <el-row class="boadr_home_title">
            <el-col class="title_left" :span="12">经营利润</el-col>
          </el-row>
          <div class="boadr_home_cont clearfix">
            <div class="pull-left" id="myChart" :style="{width: '150px', height: '150px'}"></div>
            <ul class="pull-right pie_text">
              <li class="clearfix">
                <span class="icon_point color_e3e5e9"></span>
                <span class="icon_text">采购总额</span>
                <span class="icon_price">¥ {{profitDetailsData.totalMoney}}</span>
              </li>
              <li class="clearfix">
                <span class="icon_point color_3aa1fe"></span>
                <span class="icon_text">采购成本</span>
                <span class="icon_price">¥ {{profitDetailsData.totalCost}}</span>
              </li>
              <li class="clearfix">
                <span class="icon_point"></span>
                <span class="icon_text">毛利润</span>
                <span class="icon_price">¥ {{profitDetailsData.grossProfit}}</span>
              </li>
              <li class="clearfix">
                <span class="icon_point"></span>
                <span class="icon_text">毛利率</span>
                <span class="icon_price">{{profitDetailsData.grossProfitRate}}%</span>
              </li>
            </ul>
          </div>
        </div>
        <!--经营利润明细-->
        <div class="box_boadr_home">
          <el-row class="boadr_home_title">
            <el-col class="title_left" :span="12">经营利润明细</el-col>
            <el-col class="title_right" :span="12">
              <el-button type="text" @click="toProfitDetails">更多</el-button>
            </el-col>
          </el-row>
          <div class="board_box">
            <table-list :data-header="profitDetailsHeader" :refs="profitDetailsRefs" :url="urlProfitDetails"
                        :params="pageProfitDetails" @get-table-data="getTableDataProfitDetails">
              <template v-slot:grossProfitRate="scope">
                {{scope.row.grossProfitRate}}%
              </template>
            </table-list>
            <v-page :data="pageProfitDetails" :dataArr="[dataSearch]"></v-page>
          </div>
        </div>
        <!--采购专员绩效-->
        <div class="box_boadr_home">
          <el-row class="boadr_home_title">
            <el-col class="title_left" :span="12">采购专员绩效</el-col>
            <el-col class="title_right" :span="12">
              <el-button type="text" @click="toPurchaseDetails">更多</el-button>
            </el-col>
          </el-row>
          <div class="board_box">
            <table-list :data-header="purchasingPerformanceHeader" :refs="purchasingPerformanceRefs"
                        :url="urlPurchasingPerformance" :params="pagePurchasingPerformance"
                        @get-table-data="getTableDataPurchasing">
            </table-list>
            <v-page :data="pagePurchasingPerformance" :dataArr="[dataSearch]"></v-page>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="board_center">
          <div class="board_center_top">
            <span>梁场名称：</span>
            <el-select class="board_center_select" v-model="valueProject" placeholder="请选择梁场名称"
                       @change="selectionChange" style="width: 37%">
              <el-option
                v-for="item in optionsProject"
                :key="item.id"
                :label="item.projectName"
                :value="item.id">
              </el-option>
            </el-select>
            <a class="handle" @click="toPageBoard">经营看板</a>
            <a class="handle" @click="">物资统计</a>
          </div>
          <div class="box_boadr_home box_map">
            <img src="../../static/img/map.png" alt="" width="100%">
          </div>
          <!--供应链专员绩效-->
          <div class="box_boadr_home">
            <el-row class="boadr_home_title">
              <el-col class="title_left" :span="12">供应链专员绩效</el-col>
              <el-col class="title_right" :span="12">
                <el-button type="text" @click="toChainDetails">更多</el-button>
              </el-col>
            </el-row>
            <div class="board_box">
              <table-list :data-header="supplyChainHeader" :refs="supplyChainRefs" :url="urlSupplyChain"
                          :params="pageSupplyChain" @get-table-data="getTableDataSupplyChain">
              </table-list>
              <v-page :data="pageSupplyChain" :dataArr="[dataSearch]"></v-page>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <!--梁场结算-->
        <div class="box_boadr_home">
          <el-row class="boadr_home_title">
            <el-col class="title_left" :span="12">梁场结算</el-col>
          </el-row>
          <div class="board_box_r">
            <table-list :data-header="settlementHeader" :refs="settlementRefs" :url="urlSettlement"
                        :params="pageProject"
                        @get-table-data="getTableDataProject">
            </table-list>
          </div>
          <!-- <v-page :data="pageProject" :dataArr="[dataSearch]"></v-page> -->
        </div>
        <!--供应商结算-->
        <div class="box_boadr_home">
          <el-row class="boadr_home_title">
            <el-col class="title_left" :span="12">供应商结算</el-col>
          </el-row>
          <div class="board_box_r">
            <table-list :data-header="supplierHeader" :refs="supplierRefs" :url="supplierUrl" :params="supplierPage"
                        @get-table-data="supplierGetTableData">
            </table-list>
          </div>
        </div>
        <!--供应商专员绩效-->
        <div class="box_boadr_home">
          <el-row class="boadr_home_title">
            <el-col class="title_left" :span="12">供应商专员绩效</el-col>
            <el-col class="title_right" :span="12">
              <el-button type="text" @click="toSupplierDetails">更多</el-button>
            </el-col>
          </el-row>
          <div class="board_box">
            <table-list :data-header="supplyPerformanceHeader" :refs="supplyPerformanceRefs" :url="urlSupplyPerformance"
                        :params="pageSupplyPerformance" @get-table-data="getTableDataSupplyPerformance">
            </table-list>
            <v-page :data="pageSupplyPerformance" :dataArr="[dataSearch]"></v-page>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    data () {
      return {
        projectId: '',
        // 经营利润明细
        profitDetailsHeader: [
          {prop: 'reportDate', label: '月份'},
          {prop: 'totalMoney', label: '采购金额'},
          {prop: 'totalCost', label: '采购成本'},
          {prop: 'grossProfit', label: '毛利润'},
          {prop: 'grossProfitRate', label: '毛利率（%）'}
        ],
        urlProfitDetails: this.$Api.board.profitPager,
        profitDetailsRefs: 'profit_details_table',
        pageProfitDetails: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          isTotal: 1,
          refs: 'profit_details_table'
        },
        // 梁场结算
        settlementHeader: [
          {prop: 'reportDate', label: '月份'},
          {prop: 'totalMoney', label: '采购金额'},
          {prop: 'totalNoInvoiceMoney', label: '未开票'},
          {prop: 'totalInvoiceMoney', label: '未回款'},
          {prop: 'totalSettlementMoney', label: '已结算'}
        ],
        urlSettlement: this.$Api.board.pfindProjectSettlement,
        settlementRefs: 'settlement_table',
        pageProject: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          refs: 'settlement_table'
        },
        // 供应商结算
        supplierHeader: [
          {prop: 'supplierName', label: '企业名称'},
          {prop: 'totalMoney', label: '采购金额'},
          {prop: 'totalNoInvoiceMoney', label: '未开票'},
          {prop: 'totalInvoiceMoney', label: '未付款'},
          {prop: 'totalSettlementMoney', label: '已结算'}
        ],
        supplierRefs: 'supplier_tb_refs',
        supplierUrl: this.$Api.board.findProjectSettlement,
        supplierPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          refs: 'supplier_tb_refs'
        },
        // 供应链专员绩效
        supplyChainHeader: [
          {prop: 'userName', label: '姓名'},
          {prop: 'currentProfit', label: '当月利润'},
          {prop: 'currentMoney', label: '采购金额'},
          {prop: 'totalProfit', label: '总利润'},
          {prop: 'totalMoney', label: '采购总金额'}
        ],
        pageSupplyChain: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          type: 2,
          refs: 'supply_chain_refs_table'
        },
        urlSupplyChain: this.$Api.board.totalPerformancePager,
        supplyChainRefs: 'supply_chain_refs_table',
        // 采购专员绩效
        purchasingPerformanceHeader: [
          {prop: 'userName', label: '姓名'},
          {prop: 'currentProfit', label: '当月利润'},
          {prop: 'currentMoney', label: '采购金额'},
          {prop: 'totalProfit', label: '总利润'},
          {prop: 'totalMoney', label: '采购总金额'}
        ],
        pagePurchasingPerformance: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          type: 1,
          refs: 'purchasing_performance_refs_table'
        },
        urlPurchasingPerformance: this.$Api.board.totalPerformancePager,
        purchasingPerformanceRefs: 'purchasing_performance_refs_table',
        // 供应商专员绩效
        supplyPerformanceHeader: [
          {prop: 'userName', label: '姓名'},
          {prop: 'currentProfit', label: '当月利润'},
          {prop: 'currentMoney', label: '采购金额'},
          {prop: 'totalProfit', label: '总利润'},
          {prop: 'totalMoney', label: '采购总金额'}
        ],
        pageSupplyPerformance: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          type: 3,
          refs: 'supply_performance_refs_table'
        },
        urlSupplyPerformance: this.$Api.board.totalPerformancePager,
        supplyPerformanceRefs: 'supply_performance_refs_table',
        urlBeamField: this.$Api.orderManger.getProjectList,
        valueProject: '',
        dataSearch: {projectId: ''},
        optionsProject: [],
        profitDetailsData: [],
        totalCost: 0,
        totalMoney: 0
      }
    },
    created () {
      this.getBeamField()
    },
    mounted () {
      this.drawLine()
    },
    methods: {
      toPageBoard () {
        let routeData = this.$router.resolve({
          name: 'boardHome'
        })
        window.open(routeData.href, '_blank')
      },
      pageUpdateTable (page, table) {
        let _this = this
        Vue.nextTick().then(function () {
          _this.$Utils.pageUpdateTable([_this.dataSearch, page], table, _this)
        })
      },
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
            this.optionsProject = res.data.data
            this.dataSearch.projectId = this.optionsProject[0].id
            this.valueProject = this.optionsProject[0].projectName
            if (this.dataSearch.projectId) {
              this.pageUpdateTable(this.pageProfitDetails, this.profitDetailsRefs)
              this.pageUpdateTable(this.pageProject, this.settlementRefs)
              this.pageUpdateTable(this.supplierPage, this.supplierRefs)
              this.pageUpdateTable(this.pageSupplyChain, this.supplyChainRefs)
              this.pageUpdateTable(this.pagePurchasingPerformance, this.purchasingPerformanceRefs)
              this.pageUpdateTable(this.pageSupplyPerformance, this.supplyPerformanceRefs)
              this.getPieData()
            }
          }
        })
      },
      getPieData () {
        let data = {}
        data = JSON.parse(JSON.stringify(this.pageProfitDetails))
        data.projectId = this.dataSearch.projectId
        data.isTotal = 0
        this.ajaxPost(this.urlProfitDetails, data, (res) => {
          this.profitDetailsData = res.data.rows[0]
          if (!this.profitDetailsData.grossProfitRate) {
            this.grossProfitRate = 0 + '%'
          } else {
            this.grossProfitRate = this.profitDetailsData.grossProfitRate + '%'
          }
          if (!this.profitDetailsData.totalCost) {
            this.totalCost = 0
          } else {
            this.totalCost = parseInt(this.profitDetailsData.totalCost)
          }
          if (!this.profitDetailsData.totalMoney || !this.profitDetailsData.totalCost) {
            this.totalMoney = 0
          } else {
            this.totalMoney = parseInt(this.profitDetailsData.totalMoney) - parseInt(this.profitDetailsData.totalCost)
          }
          this.drawLine()
        })
      },
      selectionChange (res) {
        this.dataSearch.projectId = res
        if (this.dataSearch.projectId) {
          this.pageUpdateTable(this.pageProfitDetails, this.profitDetailsRefs)
          this.pageUpdateTable(this.pageProject, this.settlementRefs)
          this.pageUpdateTable(this.supplierPage, this.supplierRefs)
          this.pageUpdateTable(this.pageSupplyChain, this.supplyChainRefs)
          this.pageUpdateTable(this.pagePurchasingPerformance, this.purchasingPerformanceRefs)
          this.pageUpdateTable(this.pageSupplyPerformance, this.supplyPerformanceRefs)
          this.getPieData()
        }
      },
      // 经营利润明细
      getTableDataProfitDetails (data) {
        this.pageProfitDetails.totalNum = data.data.total
      },
      // 供应商结算
      supplierGetTableData (data) {
        this.supplierPage.totalNum = data.data.total
      },
      // 梁场结算
      getTableDataProject (data) {
        this.pageProject.totalNum = data.data.total
      },
      // 供应链专员绩效
      getTableDataPurchasing (data) {
        this.pagePurchasingPerformance.totalNum = data.data.total
      },
      // 采购专员绩效
      getTableDataSupplyChain (data) {
        this.pageSupplyChain.totalNum = data.data.total
      },
      // 供应商专员绩效
      getTableDataSupplyPerformance (data) {
        this.pageSupplyPerformance.totalNum = data.data.total
      },
      drawLine () {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
//          title: {
//            text: _this.grossProfitRate,
//            x: 'center',
//            y: 'center',
//            textStyle: {
//              color: '#ff0000',
//              fontSize: 16
//            }
//          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {value: _this.totalCost, name: '', itemStyle: {color: '#3aa1fe'}},
                {value: _this.totalMoney, name: '', itemStyle: {color: '#e3e5e9'}}
              ]
            }
          ]
        })
      },
      jumpPage (name, params) {
        let routeData = this.$router.resolve({
          name: name,
          params: params
        })
        window.open(routeData.href, '_blank')
      },
      toProfitDetails () {
        let id = this.dataSearch.projectId
        this.jumpPage('profitDetails', {id: id})
      },
      toPurchaseDetails () {
        let id = this.dataSearch.projectId
        this.jumpPage('purchasePerformanceDetails', {id: id})
      },
      toChainDetails () {
        let id = this.dataSearch.projectId
        this.jumpPage('supplychainPerformanceDetails', {id: id})
      },
      toSupplierDetails () {
        let id = this.dataSearch.projectId
        this.jumpPage('supplierPerformanceDetails', {id: id})
      }
    }
  }
</script>

<style scoped>
  .board_box {
    height: 240px;
    overflow-y: auto;
  }

  .board_box_r{
    height: 196px;
    overflow-y: auto;
  }
  .box_map {
    height: 430px;
  }

  .box_boadr_home {
    margin-bottom: 20px;
  }

  .boadr_home_title {
    padding-left: 10px;
    border: 1px solid #eee;
    border-bottom: none
  }

  .boadr_home_title .title_left {
    font-size: 14px;
    line-height: 34px;
  }

  .boadr_home_title .title_right .el-button {
    font-size: 12px;
    float: right;
  }

  .boadr_home_cont {
    border: 1px solid #eee;
  }

  .board_center {
    padding: 0px 20px;
    font-size: 14px;
  }

  .board_center_top {
    height: 34px;
    line-height: 34px;
    margin-bottom: 20px;
  }

  .handle {
    font-size: 12px;
    color: #008aff;
    cursor: pointer;
    margin: 0 2px;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }

  .board_center_select {
    margin-right: 10px;
  }

  .pie_text {
    padding-right: 20px;
    padding-top: 20px;
    font-size: 14px;
    color: #333;
    height: 16px;
    line-height: 16px;
  }

  .pie_text li {
    margin: 6px 0;
  }
</style>
<style>
  .board_center_select .el-input__inner {
    height: 32px;
  }

  .icon_point {
    display: inline-block;
    margin-right: 6px;
    width: 7px;
    height: 7px;
    background-color: #ff0000;
    border-radius: 50%;
    float: left;
    margin-top: 4px;
  }

  .icon_point.color_e3e5e9 {
    background-color: #e3e5e9
  }

  .icon_point.color_3aa1fe {
    background-color: #3aa1fe
  }

  .icon_text {
    width: 64px;
    padding-right: 5px;
    border-right: 1px solid #999;
    float: left;
  }

  .icon_price {
    padding-left: 7px;
    float: left;
  }
</style>
