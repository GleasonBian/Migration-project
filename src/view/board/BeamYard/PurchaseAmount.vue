<!-- 梁场指标 - 采购金额 -->
<template>
  <div>
    <div style="display: flex;justify-content: flex-start;align-items: center;">
      <div class="box_box">
        <div style="font-size:16px;">item.name</div>
        <div style="font-size:18px;">本月7,888.00元</div>
        <div style="font-size:14px;">(与上月)↑XXXX元</div>
      </div>
      <div class="box_box">
        <div id="myChart" style="height: 300px;width: 100%;"></div>
      </div>
    </div>

    <div class="titleStyle">每个物资销售价格明细</div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @to-export="exportIns"></tab-but>
    <el-table :data="dataList" style="width: 100%">
      <el-table-column type="index" label="序号" align='center'></el-table-column>
      <el-table-column prop="month" label="月份" align='center'></el-table-column>
      <el-table-column prop="projectName" label="梁场名称" align='center'></el-table-column>
      <el-table-column prop="retainedProfit" label="净利润" align='center'></el-table-column>
      <el-table-column prop="number" label="人数" align='center'></el-table-column>
      <el-table-column prop="personPer" label="人均净利润" align='center'></el-table-column>
      <el-table-column prop="grade" label="等级" align='center'></el-table-column>
      <el-table-column prop="personnel" label="人员名单" align='center'></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="exportSub(scope.row)" type="text" size="small">查看趋势图</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo"
      :page-sizes="[10, 20, 30, 40]" :page-size="page.limit" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--趋势图-->
    <v-dialog :dialog="initTabData" :dialog-footer="dialogEditFooter" @on-cancel="initWareouseCancel"
      @on-ok="initWareouseOk">
      <div style="margin-top: 20px; width: 100%">
        <v-search :data="searchData" @on-click="search"></v-search>
        <div id="myChartA" style="height: 400px;width: 1255px;border:1px solid red;"></div>
      </div>
    </v-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchData: [{
            label: '选择时间段：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          },
          {
            label: '梁场名称：',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
            select: []
          },
          {
            label: '物资名称：',
            value: '',
            placeholder: '请输入',
            key: 'goodsName'
          },
          {
            label: '供应商名称：',
            value: '',
            placeholder: '请输入',
            key: 'goodsNameA'
          }
        ],
        arrBeamData: [],
        dataSearch: {},
        dataList: [],
        btnData: [{
          text: '导出考核',
          key: 'to-export',
          disabled: false
        }],
        page: {
          limit: 10,
          pageNo: 1
        },
        total: 0,

        initTabData: {
          width: '1300px',
          show: false,
          title: '价格趋势图'
        },
        dialogEditFooter: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '保存',
          key: 'ok'
        }],
      };
    },
    created() {
      this.getBeamField()
      this.getData()
    },
    methods: {
      getBeamField() {
        this.$Ajax.post({
          url: this.$Api.board.getProjectList,
          cb: res => {
            this.arrBeamData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(this.arrBeamData)
              }
            })
          }
        })
      },
      fliterSelectBeam(res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({
              label: item.projectName,
              value: item.id
            })
          })
        }
        return arrBeam
      },

      getData() {
        let json;
        if (JSON.stringify(this.dataSearch) == '{}') {
          json = Object.assign(this.page)
        } else {
          json = Object.assign(this.dataSearch, this.page)
        }
        this.$Ajax.post({
          url: this.$Api.board.findPerformanceProjectDate,
          data: json,
          cb: res => {
            this.dataList = res.data.rows
            this.total = res.data.total
            this.drawLineSupplier() // 趋势图
          }
        })
      },


      search(res) {
        this.dataSearch = res
        this.page.pageNo = 1
        // this.getData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.limit = val
        this.page.pageNo = 1
        this.getData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.pageNo = val
        this.getData()
      },




      exportIns() {
        if (JSON.stringify(this.dataSearch) == '{}') {
          location.href = this.$Api.board.exportPerformanceProjectList
        } else {
          location.href = this.$Api.board.exportPerformanceProjectList + '?month=' + this.dataSearch.month
        }
      },


      exportSub(val) {
        console.log('查看趋势图', val)
        this.initTabData.show = true
        this.$nextTick(()=>{
          this.drawLineSupplierA()
        })
      },
      initWareouseCancel() {
        this.initTabData.show = false
        this.$bus.emit('clear-files')
      },
      initWareouseOk() {
        this.initTabData.show = false
        this.$bus.emit('clear-files')
      },

      drawLineSupplier() {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['应结算金额', '实际结算金额']
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }],
          yAxis: [{
            type: 'value',
            name: '金额（元）'
          }],
          series: [{
              name: '应结算金额',
              type: 'bar',
              // data: _this.totalCostArr,
              data: [10, 50, 30, 50, 90, 100, 80, 90, 100, 200],
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
                    if (params && params.value > 0) {
                      return ''
                    } else {
                      return '暂无数据'
                    }
                  }
                }
              }
            },
            {
              name: '实际结算金额',
              type: 'bar',
              // data: _this.settTotalCostArr,
              data: [10, 50, 30, 50, 90, 100, 80, 90, 100, 200],
              itemStyle: {
                normal: {
                  color: '#f69'
                }
              }
            }
          ]
        })
      },
      drawLineSupplierA() {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById('myChartA'))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          legend: {
            data: ['蒸发量', '降水量', '平均温度']
          },
          xAxis: [{
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }],
          yAxis: [{
              type: 'value',
              name: '水量',
              min: 0,
              max: 250,
              interval: 50,
              axisLabel: {
                formatter: '{value} ml'
              }
            },
            {
              type: 'value',
              name: '温度',
              min: 0,
              max: 25,
              interval: 5,
              axisLabel: {
                formatter: '{value} °C'
              }
            }
          ],
          series: [{
              name: '蒸发量',
              type: 'bar',
              data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            },
            {
              name: '降水量',
              type: 'bar',
              data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
              name: '平均温度',
              type: 'line',
              yAxisIndex: 1,
              data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
          ]
        })
      },
    },
  }
</script>
<style scoped>
  /* .monthClass{
    display: flex;margin-bottom: 20px;
  }
  .monthClass >>> .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 200px;
  } */
  .box_box {
    width: 300px;
    height: 200px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: #f2f2f2;
    text-decoration: none;
    color: #333333;
    margin: 40px 60px 0px 0px;
    border: 1px solid rgba(64, 160, 255, 0.568);
    border-radius: 5px;
    flex-direction: column;
    margin-bottom: 0px;
    margin-top: 0px;
  }

  .titleStyle {
    height: 120px;
    line-height: 120px;
    font-size: 22px;
  }
</style>