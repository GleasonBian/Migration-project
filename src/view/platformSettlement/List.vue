<template>
  <div>
    <h4>平台结算管理</h4>
    <div>
      <el-radio-group v-model="radioTime" @change="changeTime">
        <el-radio-button v-for="(item, index) in dateTimeRadio" :key="index" :label="item.label"></el-radio-button>
      </el-radio-group>
      <span style="margin-left: 40px;">日期选择：</span>
      <el-date-picker style="padding-top: 1px;"
                      v-model="valuePicker"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :clearable="false"
                      @change="changePicker">
      </el-date-picker>
      <span style="margin-right: 20px;"></span>
      <el-button @click="submit" type="primary">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
    <div>
      <el-row :gutter="40">
        <el-col :span="12">
          <div style="margin-bottom: 10px" class="clearfix">
            <div class="pull-left">
              <div id="myChartSupplier" :style="{width: '350px', height: '350px'}"></div>
            </div>
            <div class="pull-left box_legend">
              <div class="clearfix">
                <div class="pull-left legend_icon pie_color1"></div>
                <div class="pull-left legend_text">
                  <div>已结算金额&占比</div>
                  <div>{{dataSupplierPie.settTotalCost ? dataSupplierPie.settTotalCost : 0}}</div>
                </div>
              </div>
              <div class="clearfix">
                <div class="pull-left legend_icon pie_color2"></div>
                <div class="pull-left legend_text">
                  <div>剩余应结算金额&占比</div>
                  <div>{{dataSupplierPie.noSettTotalCost ? dataSupplierPie.noSettTotalCost : 0}}</div>
                </div>
              </div>
              <!--<div class="clearfix">-->
                <!--<div class="pull-left legend_icon pie_color1"></div>-->
                <!--<div class="pull-left legend_text">已结算金额&占比</div>-->
              <!--</div>-->
              <!--<div class="clearfix">-->
                <!--<div class="pull-left legend_icon pie_color2"></div>-->
                <!--<div class="pull-left legend_text"></div>-->
              <!--</div>-->
            </div>
          </div>
          <div class="box_boadr_home">
            <el-row class="boadr_home_title">
              <el-col class="title_left" :span="12">供应商结算</el-col>
              <el-col class="title_right" :span="12">
                <el-button type="text" @click="toSupplierDetails">更多</el-button>
              </el-col>
            </el-row>
            <div class="board_box">
              <table-list :data-header="dataSupplier" :refs="dataSupplierRefs" :url="urlSupplier"
                          :params="pageSupplier">
                <template slot-scope="scope" slot="number">
                  {{scope.index + 1}}
                </template>
              </table-list>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="margin-bottom: 10px" class="clearfix">
            <div class="pull-left">
              <div id="myChartProject" :style="{width: '350px', height: '350px'}"></div>
            </div>
            <div class="pull-left box_legend">
              <div class="clearfix">
                <div class="pull-left legend_icon pie_color3"></div>
                <div class="pull-left legend_text">
                  <div>已收款金额&占比</div>
                  <div>{{dataProjectPie.settTotalCost ? dataProjectPie.settTotalCost : 0}}</div>
                </div>
              </div>
              <div class="clearfix">
                <div class="pull-left legend_icon pie_color4"></div>
                <div class="pull-left legend_text">
                  <div>剩余应收金额&占比</div>
                  <div>{{dataProjectPie.noSettTotalCost ? dataProjectPie.noSettTotalCost : 0}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="box_boadr_home">
            <el-row class="boadr_home_title">
              <el-col class="title_left" :span="12">梁场结算</el-col>
              <el-col class="title_right" :span="12">
                <el-button type="text" @click="toProjectDetails">更多</el-button>
              </el-col>
            </el-row>
            <div class="board_box">
              <table-list :data-header="dataProject" :refs="dataProjectRefs" :url="urlSupplier"
                          :params="pageProject">
                <template slot-scope="scope" slot="number">
                  {{scope.index + 1}}
                </template>
              </table-list>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        radioTime: '',
        dateTimeRadio: [
          {
            label: '本周'
          },
          {
            label: '本月'
          },
          {
            label: '本季度'
          }
        ],
        valuePicker: '',
        pageSupplier: {
          limit: 10,
          isTotal: 0,
          dataSource: 2,
          refs: 'platfor_settlement_supplier_list'
        },
        dataSupplierRefs: 'platfor_settlement_supplier_list',
        urlSupplier: this.$Api.platformSettlement.gysSettlementPager,
        dataSupplierPie: {},
        dataSupplier: [
          {prop: 'number', label: '序号', width: '60', slot: true},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'totalCost', label: '应结算金额'},
          {prop: 'settTotalCost', label: '已结算金额'},
          {prop: 'noSettTotalCost', label: '剩余应结算金额'}
        ],
        pageProject: {
          limit: 10,
          isTotal: 0,
          dataSource: 1,
          refs: 'platfor_settlement_project_list'
        },
        dataProjectRefs: 'platfor_settlement_project_list',
        dataProject: [
          {prop: 'number', label: '序号', width: '60', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'totalCost', label: '应收金额'},
          {prop: 'settTotalCost', label: '已收金额'},
          {prop: 'noSettTotalCost', label: '剩余应收金额'}
        ],
        dataProjectPie: {}
      }
    },
    created () {
      this.getSupplierPie()
      this.getProjectPie()
    },
    mounted () {
    },
    methods: {
      pageUpdateTableSupplier () {
        this.$Utils.pageUpdateTable([[], this.pageSupplier], this.dataSupplierRefs, this)
      },
      pageUpdateTableProject () {
        this.$Utils.pageUpdateTable([[], this.pageProject], this.dataProjectRefs, this)
      },
      changePicker (res) {
        if (res) {
          this.radioTime = ''
        }
        let startTime = this.$Date.dateFormat(res[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        let endTime = this.$Date.dateFormat(res[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        this.pageSupplier.startTime = startTime
        this.pageSupplier.endTime = endTime
        this.pageProject.startTime = startTime
        this.pageProject.endTime = endTime
      },
      changeTime (res) {
        if (res) {
          this.valuePicker = ''
        }
        let date = new Date()
        let dateNow = this.$Date.dateFormat(date, this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        let dateCurrentMonth = this.$Date.dateFormat(new Date(date.getFullYear(), date.getMonth(), '1'), this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        let dateQuarterNow = this.getQuarterNow(date)
        let dataWeek = this.getWeek(date)
        this.pageSupplier.endTime = dateNow
        this.pageProject.endTime = dateNow
        switch (res) {
          case '本周':
            this.pageSupplier.startTime = dataWeek
            this.pageProject.startTime = dataWeek
            break
          case '本月':
            this.pageSupplier.startTime = dateCurrentMonth
            this.pageProject.startTime = dateCurrentMonth
            break
          case '本季度':
            this.pageSupplier.startTime = dateQuarterNow
            this.pageProject.startTime = dateCurrentMonth
            break
        }
        this.submit()
      },
      // 获取本季度开始日期
      getQuarterNow (date) {
        let dateQuarter = ''
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        if (month < 3) {
          dateQuarter = new Date(year, '0', '1')
        } else if (month < 6) {
          dateQuarter = new Date(year, '3', '1')
        } else if (month < 9) {
          dateQuarter = new Date(year, '6', '1')
        } else {
          dateQuarter = new Date(year, '9', '1')
        }
        return this.$Date.dateFormat(dateQuarter, this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      // 获取本周开始日期
      getWeek (date) {
        let year = date.getFullYear()
        let month = date.getMonth()
        let nowDay = date.getDate()
        let day = date.getDay() === 0 ? 7 : date.getDay()
        let weekStartDate = new Date(year, month, nowDay - (day - 1))
        return this.$Date.dateFormat(weekStartDate, this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      submit () {
        this.getSupplierPie()
        this.getProjectPie()
        this.pageUpdateTableSupplier()
        this.pageUpdateTableProject()
      },
      reset () {
        this.radioTime = ''
        this.valuePicker = ''
        delete this.pageSupplier.startTime
        delete this.pageSupplier.endTime
        delete this.pageProject.startTime
        delete this.pageProject.endTime
        this.getSupplierPie()
        this.getProjectPie()
        this.pageUpdateTableSupplier()
        this.pageUpdateTableProject()
      },
      // 获取供应商饼图数据
      getSupplierPie () {
        let json = {}
        json.dataSource = 2
        if (this.pageSupplier.startTime) {
          json.startTime = this.pageSupplier.startTime
          json.endTime = this.pageSupplier.endTime
        }
        this.$Ajax.post({
          url: this.urlSupplier,
          data: json,
          cb: res => {
            this.dataSupplierPie = res.data.rows[0]
            this.drawLineSupplier()
          }
        })
      },
      // 饼图
      drawLine (id, color1, color2, data) {
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          calculable: true,
          series: [
            {
              type: 'pie',
              radius: '70%', // 饼图的半径大小
              center: ['50%', '50%'], // 饼图的位置
              label: {            // 饼图图形上的文本标签
                normal: {
                  show: true,
                  position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 300,
                    fontSize: 16    // 文字的字体大小
                  },
                  formatter: function (data) { return data.percent.toFixed(2) + '%' }
                }
              },
              hoverAnimation: false,
              data: [
                {value: data.settTotalCost ? data.settTotalCost : 0, name: '已结算金额', itemStyle: {normal: {color: color1}}},
                {value: data.noSettTotalCost ? data.noSettTotalCost : 0, name: '剩余应结算金额', itemStyle: {normal: {color: color2}}}
              ]
            }
          ]
        })
      },
      // 供应商饼图
      drawLineSupplier () {
        this.drawLine('myChartSupplier', '#C3CDFF', '#8399FF', this.dataSupplierPie)
      },
      // 获取梁场饼图数据
      getProjectPie () {
        let json = {}
        json.dataSource = 1
        if (this.pageProject.startTime) {
          json.startTime = this.pageProject.startTime
          json.endTime = this.pageProject.endTime
        }
        this.$Ajax.post({
          url: this.urlSupplier,
          data: json,
          cb: res => {
            this.dataProjectPie = res.data.rows[0]
            this.drawLineProject()
          }
        })
      },
      // 梁场饼图
      drawLineProject () {
        this.drawLine('myChartProject', '#bdd8f4', '#5c9bf2', this.dataProjectPie)
      },
      jumpPage (name, params) {
        let routeData = this.$router.resolve({
          name: name,
          params: params
        })
        window.open(routeData.href, '_blank')
      },
      toSupplierDetails () {
        this.jumpPage('supplierSettlement', {})
      },
      toProjectDetails () {
        this.jumpPage('projectSettlement', {})
      }
    }
  }
</script>

<style scoped>
  .chart_title{text-align: center;width:350px;font-size: 16px;line-height: 30px;}
  .box_legend{margin-top: 130px;}
  .box_legend>.clearfix{margin-bottom: 10px;}
  .box_legend .legend_icon{width: 30px;height:48px;}
  .box_legend .legend_text{font-size:12px;height:20px;line-height: 24px;margin-left: 10px;}
  .pie_color1{background:#C3CDFF;}
  .pie_color2{background:#8399FF;}
  .pie_color4{background:#5c9bf2;}
  .pie_color3{background:#bdd8f4;}
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
</style>
