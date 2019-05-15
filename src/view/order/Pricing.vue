<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="handle">
        <div v-if="scope.row.state == 0">
          <!--<span class="handle" @click="writePriceMark(scope.row.id)">填写定价说明</span>-->
          <router-link class="handle" :to="{name: 'pricingRemark', params:{id: scope.row.id}}" tag="a" target="_blank">填写定价说明</router-link>
        </div>
        <div v-else>
          <!--<span class="handle" @click="viewDetail(scope.row.id)">查看</span>-->
          <router-link class="handle" :to="{name: 'pricingDetail', params:{id: scope.row.id}}" tag="a" target="_blank">查看</router-link>
          <a class="handle" style="margin-left: 10px;" :href="exportQuotation + scope.row.id">导出报价单</a>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        arrBeamData: [],
        exportQuotation: this.$Api.order.exportQuotation,
        tabUrl: this.$Api.order.priceList,
        urlBeamField: this.$Api.orderManger.getProjectList,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'price_table'
        },
        dataSearch: {},
        dataHeader: [
          { prop: 'code', label: '采购单编码' },
          { prop: 'projectName', label: '梁场名称' },
          { prop: 'createTimeStr', label: '创建时间' },
          { prop: 'userName', label: '创建人' },
          { prop: 'phoneNum', label: '手机号码' },
          { prop: 'stateStr', label: '状态' },
          { prop: 'handle', label: '操作', slot: true }
        ],
        tablePerformance: 'price_table',
        searchData: [{
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
          key: 'state',
          label: '状态',
          value: '',
          select: [
            { label: '全部', value: '' },
            { label: '待编制', value: '3' },
            { label: '审核中', value: '4' },
            { label: '已驳回', value: '5' },
            { label: '待配货', value: '0' },
            { label: '待确认', value: '1' },
            { label: '已确认', value: '2' },
            { label: '已强制关闭', value: '6' }
          ]
        }, {
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
        }, {
          key: 'userName',
          label: '创建人',
          value: '',
          type: 'text'
        }, {
          key: 'code',
          label: '采购单编码',
          value: '',
          type: 'text'
        }]
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
      writePriceMark (id) {
        this.$router.push({ name: 'pricingRemark', params: { id: id } })
      },
      viewDetail (id) {
        this.$router.push({ name: 'pricingDetail', params: { id: id } })
      }
    }
  }
</script>

<style scoped>
  .handle{
    font-size: 12px;
    color: #008aff;
    cursor:pointer;
    text-decoration: none;
  }
  .handle:hover{
    text-decoration: underline;
  }
</style>
