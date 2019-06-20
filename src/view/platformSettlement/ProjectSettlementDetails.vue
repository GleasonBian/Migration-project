<template>
  <div>
    <h4>梁场结算——结算详情</h4>
    <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    <br>
    <br>
    <v-search :data="searchData" @on-click="searchDataClick" :width="widthLabel"></v-search>
    <div class="title">交易明细</div>
    <table-list :data-header="TableDataHeader" :url="urlProjectList"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template v-slot:number="scope">
        {{scope.index + 1}}
      </template>
      <template v-slot:moneyElse="scope">
        <span>{{((scope.row.applicationMoney !== null) && (scope.row.actualApplicationMoney !== null)) ? ((scope.row.applicationMoney * 1000) - (scope.row.actualApplicationMoney) * 1000) / 1000 : ''}}</span>
      </template>
      <template v-slot:operation="scope">
        <span class="handle" @click="jumpDetailSetlement(scope.row.id)">查看</span>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        projectId: '',
        data: [
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'totalCost', label: '物资金额'},
          {prop: 'noSettTotalCost', label: '剩余应结算金额'}
        ],
        dataList: {},
        listStyle: {
          class: ['pannel']
        },
        urlProject: this.$Api.platformSettlement.gysSettlementPager,
        widthLabel: '200px',
        searchData: [
          {
            label: '梁场结算单创建时间：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }
        ],
        dataSearch: {},
        urlProjectList: this.$Api.finance.loadListData,
        TableDataHeader: [
          {prop: 'number', label: '序号', width: '60', slot: true},
          {label: '梁场结算单', prop: 'settlementNumber'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '物资金额', prop: 'applicationMoney'},
          {label: '已结算金额', prop: 'actualApplicationMoney'},
          {label: '剩余应结算金额', prop: 'noApplicationMoney'},
          {label: '是否开票', prop: 'isInvoice'},
          {label: '已开票金额', prop: 'invoiceAmount'},
          {label: '操作', prop: 'operation', slot: true}
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_supplier_settlement_details'
        },
        tablePerformance: 'tab_supplier_settlement_details'
      }
    },
    created () {
      this.projectId = this.$route.params.projectId
      this.page.projectId = this.projectId
      this.getData()
    },
    mounted () {
    },
    methods: {
      getData () {
        this.$Ajax.post({
          url: this.urlProject,
          data: {
            dataSource: 1,
            projectId: this.projectId
          },
          cb: res => {
            this.dataList = res.data.rows[0]
          }
        })
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
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
        data.data.rows.map(item => {
          if (item.isInvoice === 0) {
            item.isInvoice = '-'
          } else {
            item.isInvoice = '已收'
          }
        })
      },
      jumpDetailSetlement (settlementId) {
        let routeData = this.$router.resolve({
          name: 'detailSettlementDetails',
          params: {settlementId: settlementId}
        })
        window.open(routeData.href, '_blank')
      }
    }
  }
</script>

<style>
  .pannel .v_list_li {
    float: left;
    width: 33% !important;
  }
  .title{
    margin-bottom: 10px;
    font-size: 18px;
    border-left: solid #008aff 4px;
    padding-left: 5px;
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
</style>
