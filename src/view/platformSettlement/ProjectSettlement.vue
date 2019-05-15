<template>
  <div>
    <h4>平台结算-梁场结算</h4>
    <div>
      <span style="margin-left: 40px;">选择年份：</span>
      <el-select v-model="valueYear" @change="changeYear">
        <el-option
          v-for="item in optionsYear"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div id="myChart" style="height: 300px;width: 100%;"></div>
    <v-search :data="searchData" @on-click="searchDataClick"></v-search>
    <table-list :data-header="TableDataHeader" :url="urlProject"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="number">
        {{scope.index + 1}}
      </template>
      <template slot-scope="scope" slot="operation">
        <span class="handle" @click="onView(scope.row)">查看</span>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        valueYear: '',
        optionsYear: [{
          value: 2017,
          label: '2017年'
        }, {
          value: 2018,
          label: '2018年'
        }, {
          value: 2019,
          label: '2019年'
        }, {
          value: 2020,
          label: '2020年'
        }],
        urlProject: this.$Api.platformSettlement.gysSettlementPager,
        urlProjectBar: this.$Api.platformSettlement.gysSettlementHistogram,
        settTotalCostArr: [],
        totalCostArr: [],
        searchData: [
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          },
          {
            label: '日期选择',
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
        TableDataHeader: [
          {prop: 'number', label: '排名', width: '60', slot: true},
          {label: '梁场名称', prop: 'projectName'},
          {label: '物资金额', prop: 'totalCost'},
          {label: '已结算金额', prop: 'settTotalCost'},
          {label: '剩余应结算金额', prop: 'noSettTotalCost'},
          {label: '已付货款百分比', prop: 'settRate'},
          {label: '操作', prop: 'operation', slot: true}
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          isTotal: 0,
          dataSource: 1,
          refs: 'tab_project_settlement_list'
        },
        tablePerformance: 'tab_project_settlement_list'
      }
    },
    created () {
      let date = new Date()
      this.valueYear = date.getFullYear()
      this.getProjectBar()
      this.getBeamField()
    },
    mounted () {
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
            let arrBeamData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(arrBeamData)
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
      changeYear () {
        this.getProjectBar()
      },
      getProjectBar () {
        let startTime = this.valueYear + '-01-01'
        let endTime = this.valueYear + '-12-31'
        this.$Ajax.post({
          url: this.urlProjectBar,
          data: {
            isTotal: 1,
            startTime: startTime,
            endTime: endTime,
            dataSource: 1
          },
          cb: res => {
            this.settTotalCostArr = res.data.settTotalCost
            this.totalCostArr = res.data.totalCost
            this.drawLine()
          }
        })
      },
      drawLine () {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['应收金额', '实际收款金额']
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额（元）'
            }
          ],
          series: [
            {
              name: '应收金额',
              type: 'bar',
              data: _this.totalCostArr,
              itemStyle: {
                normal: {
                  color: '#09f'
                }
              },
              label: {
                normal: {
                  show: true,
                  color: '#999',
                  position: ['40%', -20],
                  formatter: function (params) {
                    if (params.value && params.value > 0) {
                      return ''
                    } else {
                      return '暂无数据'
                    }
                  }
                }
              }
            },
            {
              name: '实际收款金额',
              type: 'bar',
              data: _this.settTotalCostArr,
              itemStyle: {
                normal: {
                  color: '#f69'
                }
              }
            }
          ]
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
      },
      onView (row) {
        let routeData = this.$router.resolve({
          name: 'projectSettlementDetails',
          params: {projectId: row.projectId}
        })
        window.open(routeData.href, '_blank')
      }
    }
  }
</script>

<style scoped>
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
