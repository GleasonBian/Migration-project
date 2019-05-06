<template>
  <div>
    <div class="box_board">
      <div class="board_title">智能铁路供应链看板</div>
      <img class="board_logo" src="../../static/img/wisdomBeam/logo.png" width="199" alt="" />
      <div class="board_time">{{timeNow}}</div>

      <!--梁场名称-->
      <div class="box_jump">
        <div class="jump_project">{{projectName}}</div>
        <div class="clearfix">
          <div class="jump_btn pull-left">
             <!-- @click="toBoardHome" -->
            <img src="../../static/img/wisdomBeam/btn1.png" width="143" alt="" />
          </div>
          <div class="jump_btn pull-left">
            <!-- @click="toBoardHome" -->
            <img src="../../static/img/wisdomBeam/btn2.png" width="143" alt="" />
          </div>
        </div>
      </div>
      <!--厂商占比-->
      <div class="box_Vendors">
        <div id="chart_Vendors" class="chart_Vendors" :style="{width: '370px', height: '250px'}"></div>
      </div>
      <!--利润率排名-->
      <div class="box_profit">
        <div class="box_ul">
          <div class="box_ul_long clearfix"
            :style="{width: (arrSlice(dataGrosstAll)).length * 390 + 'px', left: leftValue + 'px'}">
            <ul v-for="arrData in (arrSlice(dataGrosstAll))">
              <li class="clearfix" v-for="item in arrData"
                :class="item.grossProfitRate <= 35 ? 'box_red_gross' : 'box_blue_gross'">
                <div class="pull-left profit_left">{{item.shortName}}</div>
                <div class="pull-left profit_center">
                  <div class="center_inside" :style="{width: (item.grossProfitRate + '%')}"></div>
                </div>
                <div class="pull-right profit_right">{{item.grossProfitRate}}%</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="profit_arrow">
          <div @click="upPage">
            <img src="../../static/img/wisdomBeam/left.png" alt="">
          </div>
          <div @click="downPage">
            <img src="../../static/img/wisdomBeam/right.png" alt="">
          </div>
        </div>
      </div>
      <!--采购概览-->
      <div class="box_Purchase">
        <div id="chart_Purchase" class="chart_Purchase" :style="{width: '480px', height: '200px'}"></div>
      </div>
      <!--销售概览-->
      <div class="box_Sales">
        <div id="chart_Sales" class="chart_Sales" :style="{width: '480px', height: '200px'}"></div>
      </div>
      <!--梁场概览-->
      <div class="box_Project">
        <div id="chart_Project" class="chart_Project" :style="{width: '479px', height: '234px'}"></div>
        <div class="project_total clearfix">
          <div class="text_left pull-left">物资总数量：{{totalGoodsCount}}</div>
          <div class="text_right pull-right">订单总数量：{{totalListCount}}</div>
        </div>
      </div>
      <!-- 标点 -->
      <div class="box_swiper">
        <div class="Beam_all" @click='toInit'>总览</div>
        <div class="lcimgStyle tt">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/ttzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle jn">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/jnzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle jnb">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/jnbzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle ws">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/wszlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle qj">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/qjzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle zbq">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/bczbq.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle xy">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/xyzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle sys">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/syszlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle lh">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/lhzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/bczlq.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle cyn">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/cynzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>
        <div class="lcimgStyle jb">
          <div class="lcimgStyle_bczlq">
            <img v-show="flag" src="../../static/img/wisdomBeam/jbzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>
        <div class='Box_swiper'>
          <div v-for="(slide, index) in BeamFieldListAll" :key="index">
            <div class="lcimgStyle" :class="slide.className">
              <div class="lcimgStyle_bczlq" v-show="!(projectId== 0)&&(projectId == slide.id)">
                <img :src="slide.src" alt="">
                <img src="../../static/img/icon_place.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航栏 -->
      <div class="Bar_Box">
        <div v-for="(item,index) in BeamFieldListAll" @click="getInfo(item)">{{item.shortName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        flag: false,
        BeamFieldList: [], // 梁场信息
        BeamFieldListAll: [], // 去掉总览 之后的数据
        BeamFieldListOne: [], // 总览数据
        leftValue: 0,
        totalGoodsCount: '',
        totalListCount: '',
        timeNow: '',
        timer: null,
        timerLeftValue: null,
        lastDate: '',
        startTimeYear: '',
        endTimeYear: '',
        startTime: '',
        projectName: '世界高铁网',
        projectId: '0',
        dataVendorsAll: [], // 厂商占比
        vendorsData: [], // 当前梁场 厂商占比 数据
        dataGrosstAll: [], // 利润率排名数据
        dataPurchaseAll: [], // 采购概览
        PurchaseData: [], // 当前梁场 采购概览 数据

        dataSalesAll: [], // 销售概览
        SalesData: [], // 当前梁场 销售概览 数据

        dataProjectAll: [], // 梁场概览
        ProjectData: [], // 当前梁场 梁场概览 数据
        urlVendors: '',
        urlSalesOver: this.$Api.wisdomBeam.salesOverview, // 可视化看板=>销售概览柱状图
        urlPurchaseOver: this.$Api.wisdomBeam.purchaseOverview, // 可视化看板=>采购概览柱状图
        urlProjectOver: this.$Api.wisdomBeam.projectOverview, // 可视化看板=>梁场概览柱状图
        urlSupplierType: this.$Api.wisdomBeam.supplierTypeRate, // 可视化看板=>厂商占比柱状图
        urlGrossPro: this.$Api.wisdomBeam.grossProfitRate // 可视化看板=>利润率排名
      }
    },
    created () {
      this.getBeamField()
      this.getCurrentTime()
      this.getMonthAndYear()
      this.getDateAndMonth()
      clearInterval(this.timer)
      clearInterval(this.timerLeftValue)
      this.timer = null
      this.timerLeftValue = null
      this.setTimer()
      if (this.timerLeftValue == null) {
        this.timerLeftValue = setInterval(this.getLeftValue, 3000)
      }
    },
    mounted () {
      this.getData()
    },
    destroyed: function () {
      // 每次离开当前界面时，清除定时器
      clearInterval(this.timer)
      clearInterval(this.timerLeftValue)
      this.timer = null
      this.timerLeftValue = null
    },
    methods: {
      toInit () {
        this.flag = false
        this.projectId = this.BeamFieldListOne.id
        this.projectName = '世界高铁网'
        this.refreshData()
      },
      getInfo (val) {
        this.projectName = val.shortName
        this.projectId = val.id
        this.refreshData()
      },
      refreshData () {
        this.vendorsData = this.dataVendorsAll
        this.PurchaseData = (this.dataPurchaseAll[this.projectId])
        this.SalesData = (this.dataSalesAll[this.projectId])
        this.ProjectData = (this.dataProjectAll[this.projectId])
        this.totalGoodsCount = this.ProjectData.totalGoodsCount[0]
        this.totalListCount = this.ProjectData.totalListCount[0]
        this.VendorsBar('chart_Vendors', this.vendorsData)

        this.PurchaseBar('chart_Purchase', this.PurchaseData)

        this.PurchaseBar('chart_Sales', this.SalesData)

        this.projectLine('chart_Project', this.ProjectData)
      },
      getPathImg (name) {
        return require('../../static/img/wisdomBeam/' + name + '.png')
      },
      getBeamField () {
        this.$Ajax.post({
          url: this.$Api.wisdomBeam.ProjectList,
          data: {},
          cb: res => {
            this.BeamFieldList = res.data.data
            this.BeamFieldListAll = this.BeamFieldList.slice(1)
            this.BeamFieldListOne = this.BeamFieldList[0]

            // 线上顺序
            this.BeamFieldListAll[0].className = 'tt'
            this.BeamFieldListAll[1].className = 'jn'
            this.BeamFieldListAll[2].className = 'jnb'
            this.BeamFieldListAll[3].className = 'ws'
            this.BeamFieldListAll[4].className = 'qj'
            this.BeamFieldListAll[5].className = 'zbq'
            this.BeamFieldListAll[6].className = 'xy'
            this.BeamFieldListAll[7].className = 'sys'
            this.BeamFieldListAll[8].className = 'lh'
            this.BeamFieldListAll[9].className = ''
            this.BeamFieldListAll[10].className = 'cyn'
            this.BeamFieldListAll[11].className = 'jb'
            this.BeamFieldListAll[0].src = this.getPathImg('ttzlc')
            this.BeamFieldListAll[1].src = this.getPathImg('jnzlc')
            this.BeamFieldListAll[2].src = this.getPathImg('jnbzlc')
            this.BeamFieldListAll[3].src = this.getPathImg('wszlc')
            this.BeamFieldListAll[4].src = this.getPathImg('qjzlc')
            this.BeamFieldListAll[5].src = this.getPathImg('bczbq')
            this.BeamFieldListAll[6].src = this.getPathImg('xyzlc')
            this.BeamFieldListAll[7].src = this.getPathImg('syszlc')
            this.BeamFieldListAll[8].src = this.getPathImg('lhzlc')
            this.BeamFieldListAll[9].src = this.getPathImg('bczlq')
            this.BeamFieldListAll[10].src = this.getPathImg('cynzlc')
            this.BeamFieldListAll[11].src = this.getPathImg('jbzlc')

            // 本地顺序
            // this.BeamFieldListAll[0].className = 'ws'
            // this.BeamFieldListAll[1].className = 'xy'
            // this.BeamFieldListAll[2].className = 'lh'
            // this.BeamFieldListAll[3].className = 'tt'
            // this.BeamFieldListAll[4].className = 'jn'
            // this.BeamFieldListAll[5].className = 'qj'
            // this.BeamFieldListAll[6].className = 'jb'
            // this.BeamFieldListAll[7].className = 'cyn'
            // this.BeamFieldListAll[8].className = 'jnb'
            // this.BeamFieldListAll[9].className = ''
            // this.BeamFieldListAll[10].className = 'sys'
            // this.BeamFieldListAll[11].className = 'zbq'
            // this.BeamFieldListAll[0].src = this.getPathImg('wszlc')
            // this.BeamFieldListAll[1].src = this.getPathImg('xyzlc')
            // this.BeamFieldListAll[2].src = this.getPathImg('lhzlc')
            // this.BeamFieldListAll[3].src = this.getPathImg('ttzlc')
            // this.BeamFieldListAll[4].src = this.getPathImg('jnzlc')
            // this.BeamFieldListAll[5].src = this.getPathImg('qjzlc')
            // this.BeamFieldListAll[6].src = this.getPathImg('jbzlc')
            // this.BeamFieldListAll[7].src = this.getPathImg('cynzlc')
            // this.BeamFieldListAll[8].src = this.getPathImg('jnbzlc')
            // this.BeamFieldListAll[9].src = this.getPathImg('bczlq')
            // this.BeamFieldListAll[10].src = this.getPathImg('syszlc')
            // this.BeamFieldListAll[11].src = this.getPathImg('bczbq')
          }
        })
      },
      toBoardHome (res) {
        let routeData = this.$router.resolve({
          name: 'boardHome'
        })
        window.open(routeData.href, '_blank')
      },
      getLeftValue () {
        let length = this.arrSlice(this.dataGrosstAll).length
        let leftMax = (length) * (-390)
        if (length > 1) {
          this.leftValue = this.leftValue - 390
          if (this.leftValue <= leftMax) {
            this.leftValue = 0
          }
        } else {}
      },
      arrSlice (data) {
        var result = []
        for (var i = 0; i < data.length; i += 6) {
          result.push(data.slice(i, i + 6))
        }
        return result
      },
      upPage () {
        clearInterval(this.timerLeftValue)
        let length = this.arrSlice(this.dataGrosstAll).length
        let leftMax = (length) * (-390)
        if (length > 1) {
          this.leftValue = this.leftValue - 390
          if (this.leftValue <= leftMax) {
            this.leftValue = 0
          }
        } else {}
      },
      downPage () {
        clearInterval(this.timerLeftValue)
        let length = this.arrSlice(this.dataGrosstAll).length
        let leftMax = (length) * (-390)
        if (length > 1) {
          this.leftValue = this.leftValue - 390
          if (this.leftValue <= leftMax) {
            this.leftValue = 0
          }
        } else {}
      },
      // 显示当前时间
      getCurrentTime () {
        let now = new Date()
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let day = now.getDate()
        let hours = now.getHours()
        let minutes = now.getMinutes()
        let seconds = now.getSeconds()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (day >= 0 && day <= 9) {
          day = '0' + day
        }
        if (hours >= 0 && hours <= 9) {
          hours = '0' + hours
        }
        if (minutes >= 0 && minutes <= 9) {
          minutes = '0' + minutes
        }
        if (seconds >= 0 && seconds <= 9) {
          seconds = '0' + seconds
        }
        this.timeNow = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes
      },
      // 当前时间定时器
      setTimer () {
        if (this.timer == null) {
          this.timer = setInterval(this.getCurrentTime, 1000)
        }
      },
      // 获取当前时间最近12个月
      getMonthAndYear () {
        // 获取当前日期
        let dataNow = new Date()
        // 获取上月月份
        let month = dataNow.getMonth() + 1
        // 获取当前年份
        let year = dataNow.getFullYear()
        // 获取上月最后一天日期
        let lastDate = new Date(year, month - 1, 0)
        this.lastDate = lastDate
        month = (month < 10 ? '0' + month : month)
        let monthNow = lastDate.getMonth() + 2
        let monthNowAll = (monthNow < 10 ? '0' + monthNow : monthNow)
        let now = (lastDate.getFullYear() + '/' + monthNowAll.toString() + '')
        let nowStr = (lastDate.getFullYear().toString().substring(2) + '/' + monthNow.toString() + '')
        let d = new Date(now.replace(/[^\d]/g, '/') + '/1')
        let result = [nowStr]
        let resultOld = [now]
        for (var i = 0; i < 11; i++) {
          d.setMonth(d.getMonth() - 1)
          var m = d.getMonth() + 1
          let mAll = m < 10 ? '0' + m : m
          result.push((d.getFullYear()).toString().substring(2) + '/' + m)
          resultOld.push((d.getFullYear()) + '/' + mAll)
        }
        resultOld = resultOld.reverse()
        this.startTimeYear = (resultOld[0].replace('/', '-')) + '-01'
        this.endTimeYear = (resultOld[11].replace('/', '-')) + '-' + lastDate.getDate()
        this.startTime = (resultOld[11].replace('/', '-')) + '-01'
        return result.reverse()
      },
      // 获取当前轴日期
      getDateAndMonth () {
        let arr = []
        let now = new Date().getTime()
        let year = new Date().getFullYear()
        let month = new Date().getMonth() + 1 // 获取当前月份(0-11,0代表1月)
        let oneDayTime = 60 * 60 * 24 * 1000 // 一天的秒数
        for (var i = 6; i >= 0; i--) {
          var dd = new Date(now - i * oneDayTime).getDate()
          arr.push(dd < 10 ? month + '/' + dd : month + '/' + dd + '')
        }
        this.startTimeMonth = year + '-' + (arr[0].replace('/', '-'))
        this.endTimeMonth = year + '-' + (arr[6].replace('/', '-'))
        return arr
      },
      getData () {
        this.getDataVendors() // 厂商占比
        this.getDataGrossPro() // 利润率排名
        this.getDataPurchase() // 采购概览
        this.getDataSales() // 销售概览
        this.getDataProject() // 梁场概览
      },
      // 厂商占比
      getDataVendors () {
        this.$Ajax.post({
          url: this.urlSupplierType,
          data: {
            startTime: this.startTimeYear,
            endTime: this.endTimeYear
          },
          cb: res => {
            if (res.data.result) {
              let iteme = []
              res.data.data.supplierTypeMoney.map(item => {
                iteme.push(item.toFixed(2))
              })
              let itemm = []
              res.data.data.supplierTypeRate.map(item => {
                itemm.push(item.toFixed(2))
              })
              res.data.data.supplierTypeMoney = iteme
              res.data.data.supplierTypeRate = itemm
  
              this.dataVendorsAll = res.data.data
              this.vendorsData = this.dataVendorsAll
              this.VendorsBar('chart_Vendors', this.vendorsData)
            }
          }
        })
      },
      // 利润率排名
      getDataGrossPro () {
        this.$Ajax.post({
          url: this.urlGrossPro,
          data: {
            startTime: this.startTime,
            endTime: this.endTimeYear
          },
          cb: res => {
            if (res.data.result) {
              this.dataGrosstAll = res.data.data
            }
          }
        })
      },
      // 梁场概览
      getDataProject () {
        this.$Ajax.post({
          url: this.urlProjectOver,
          data: {
            startTime: this.startTimeYear,
            endTime: this.endTimeYear
          },
          cb: res => {
            if (res.data.result) {
              this.dataProjectAll = res.data.data
              this.ProjectData = (this.dataProjectAll[this.projectId])
              this.totalGoodsCount = this.ProjectData.totalGoodsCount[0]
              this.totalListCount = this.ProjectData.totalListCount[0]
              this.projectLine('chart_Project', this.ProjectData)
            }
          }
        })
      },
      // 采购概览
      getDataPurchase () {
        this.$Ajax.post({
          url: this.urlPurchaseOver,
          data: {
            startTime: this.startTimeMonth,
            endTime: this.endTimeMonth
          },
          cb: res => {
            if (res.data.result) {
              this.dataPurchaseAll = res.data.data
              this.PurchaseData = (this.dataPurchaseAll[this.projectId])
              this.PurchaseBar('chart_Purchase', this.PurchaseData)
            }
          }
        })
      },
      // 销售概览
      getDataSales () {
        this.$Ajax.post({
          url: this.urlSalesOver,
          data: {
            startTime: this.startTimeMonth,
            endTime: this.endTimeMonth
          },
          cb: res => {
            if (res.data.result) {
              this.dataSalesAll = res.data.data
              this.SalesData = (this.dataSalesAll[this.projectId])
              this.PurchaseBar('chart_Sales', this.SalesData)
            }
          }
        })
      },
      VendorsBar (id, dataValue) {
        // let _this = this
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            // formatter: '{b}:{c}%',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            itemWidth: 10,
            itemHeight: 8,
            itemGap: 10,
            x: '300px',
            y: '20px',
            data: [{
              name: '数量',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '金额',
              textStyle: {
                color: '#fff'
              }
            }
            ]
          },
          grid: {
            left: '0%',
            right: '0%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            minInterval: 1,
            type: 'category',
            data: ['厂商', '一批', '综合服务商'],
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              }
            },
            axisLine: {
              lineStyle: {
                color: '#074044',
                width: 1
              }
            }
          }],
          yAxis: [{
            name: '百分比%',
            nameTextStyle: {
              color: '#49a3ff',
              fontSize: 12
            },
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#074044',
                width: 1
              }
            },
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              },
              interval: 0,
              showMinLabel: true,
              formatter: '{value}'
            }
            // min: 0,
            // max: 100,
            // splitNumber: 10
          }],
          series: [{
            name: '数量',
            type: 'bar',
            color: 'rgba(41, 73, 163, 0.56)',
            barWidth: 20,
            data: dataValue === undefined ? '' : dataValue.supplierTypeRate // 数量数据
          },
          {
            name: '金额',
            type: 'bar',
            barWidth: 20,
            color: 'rgba(110, 255, 104, 0.56)',
            data: dataValue === undefined ? '' : dataValue.supplierTypeMoney // 全额数据
          }
          ]
        })
      },

      PurchaseBar (id, dataValue) {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            // formatter: '{b}:{c}%',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            itemWidth: 10,
            itemHeight: 8,
            itemGap: 10,
            x: '230px',
            y: '20px',
            data: [{
              name: '待报价',
              textStyle: {
                color: '#fff',
                fontSize: 12 // 字体大小
              }
            },
            {
              name: '待审批',
              textStyle: {
                color: '#fff',
                fontSize: 12 // 字体大小
              }
            },
            {
              name: '待验收',
              textStyle: {
                color: '#fff',
                fontSize: 12 // 字体大小
              }
            }
            ]
          },
          grid: {
            left: '0%',
            right: '0%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            minInterval: 1,
            type: 'category',
            data: _this.getDateAndMonth(),
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              }
            },
            axisLine: {
              lineStyle: {
                color: '#074044',
                width: 1
              }
            }
          }],
          yAxis: [{
            name: '单位/个',
            nameTextStyle: {
              color: '#49a3ff',
              fontSize: 10
            },
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#074044',
                width: 1
              }
            },
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              },
              formatter: function (v) {
                return parseInt(v)
              }
            }
          }],
          series: [{
            name: '待报价',
            type: 'bar',
            color: '#248cf9',
            barWidth: 8,
            data: dataValue === undefined ? '' : dataValue.nodeliveryCount // 数量数据
              // data: [500, 20, 10]
          },
          {
            name: '待审批',
            type: 'bar',
            barWidth: 8,
            color: '#fed601',
            data: dataValue === undefined ? '' : dataValue.auditpassCount // 全额数据
              // data: [20, 40, 30]
          },
          {
            name: '待验收',
            type: 'bar',
            barWidth: 8,
            color: '#eb6f49',
            data: dataValue === undefined ? '' : dataValue.acceptanceCount // 全额数据
              // data: [20, 40, 30]
          }
          ]
        })
      },
      // 梁场概览折线图
      calMax (arr) {
        let max = 1
        for (var i = 1; i < arr.length; i++) {
          if (max < arr[i]) {
            max = arr[i]
          }
        }
        var maxint = Math.ceil(max / 10)
        var maxval = maxint * 10
        return maxval
      },
      calMin (arr) {
        let min = 0
        for (var i = 1; i < arr.length; i++) {
          if (min > arr[i]) {
            min = arr[i]
          }
        }
        var minint = Math.ceil(min / 10)
        var minval = minint * 10
        return minval
      },
      projectLine (id, datavalue) {
        let _this = this
        let minGoods = _this.calMin(datavalue.goodsCount)
        let maxGoods = _this.calMax(datavalue.goodsCount)
        let minOrder = _this.calMin(datavalue.listCount)
        let maxOrder = _this.calMax(datavalue.listCount)
        let intervalLeft = (maxGoods - minGoods) / 5
        let intervalRight = (maxOrder - minOrder) / 5
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: _this.getMonthAndYear(),
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              }
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#034673',
                width: '1'
              }
            }
          },
          yAxis: [{
            name: '单位/条',
            type: 'value',
            nameTextStyle: {
              color: '#49a3ff',
              fontSize: 12
            },
            splitLine: {
              lineStyle: {
                color: '#034673',
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#034673',
                width: '0'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              }
            },
            splitNumber: 5,
            min: minGoods,
            max: maxGoods,
            interval: intervalLeft
          },
          {
            name: '单位/条',
            type: 'value',
            nameTextStyle: {
              color: '#49a3ff',
              fontSize: 12
            },
            splitLine: {
              lineStyle: {
                color: '#034673',
                width: 1
              }
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#034673',
                width: '0'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              }
            },
            splitNumber: 5,
            min: minOrder,
            max: maxOrder,
            interval: intervalRight
          }
          ],
          series: [{
            name: '物资总数量',
            type: 'line',
            // stack: '物资总数量',
            yAxisIndex: 0,
            data: datavalue.goodsCount,
            lineStyle: {
              normal: {
                color: '#28eefc'
              }
            },
            itemStyle: {
              normal: {
                color: '#28eefc'
              }
            }
          },
          {
            name: '订单总数量',
            type: 'line',
            // stack: '订单总数量',
            yAxisIndex: 1,
            data: datavalue.listCount,
            lineStyle: {
              normal: {
                color: '#fff006'
              }
            },
            itemStyle: {
              normal: {
                color: '#fff006'
              }
            }
          }
          ]
        })
      }
    },
    watch: {}
  }
</script>

<style scoped>
  .box_board {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    box-sizing: border-box;
    padding-top: 20px;
    background-image: url(../../static/img/wisdomBeam/bj_yg.png);
    position: relative;
  }

  .board_title {
    font-size: 40px;
    color: #daf9ff;
    text-align: center;
  }

  .board_logo {
    position: absolute;
    left: 162px;
    top: 16px;
  }

  .board_time {
    position: absolute;
    top: 62px;
    right: 47px;
    font-size: 24px;
    color: #01fafe;
  }

  .box_jump {
    width: 380px;
    height: 130px;
    position: absolute;
    left: 56px;
    top: 156px;
  }

  .box_jump .jump_project {
    font-size: 32px;
    color: #fff;
    height: 84px;
    line-height: 84px;
    text-align: center
  }

  .box_jump .jump_btn {
    width: 50%;
    cursor: pointer;
    text-align: center
  }

  .box_Vendors {
    width: 416px;
    height: 238px;
    position: absolute;
    left: 60px;
    top: 370px;
  }

  .chart_Vendors {
    width: 430px;
    height: 250px;
  }

  .box_profit {
    width: 390px;
    height: 300px;
    position: absolute;
    left: 51px;
    bottom: 56px;
  }

  .box_profit .box_ul {
    width: 100%;
    height: 270px;
    overflow: hidden;
    position: relative
  }

  .box_profit .box_ul_long {
    position: absolute;
    left: 0px;
  }

  .box_profit ul {
    width: 390px;
    height: 270px;
    float: left;
    padding: 10px;
    box-sizing: border-box;
  }

  .box_profit ul li {
    height: 42px;
    line-height: 42px;
    font-size: 16px;
  }

  .box_profit ul li.box_red_gross {
    color: #eb3600;
  }

  .box_profit ul li.box_blue_gross {
    color: #33ccff;
  }

  .box_profit .profit_left {
    width: 70px;
    height: 100%;
    text-align: left;
    overflow: hidden;
  }

  .box_profit .profit_center {
    width: 220px;
    height: 14px;
    margin-top: 12px;
    margin-left: 10px;
    border: 1px solid transparent;
    border-radius: 7px;
    padding: 2px 3px;
    box-sizing: border-box;
  }

  .box_profit .center_inside {
    overflow: hidden;
    height: 8px;
    border-radius: 4px;
  }

  .box_profit .box_red_gross .profit_center {
    border-color: #eb3600;
  }

  .box_profit .box_red_gross .center_inside {
    background: #eb3600;
  }

  .box_profit .box_blue_gross .profit_center {
    border-color: #33ccff;
  }

  .box_profit .box_blue_gross .center_inside {
    background: #33ccff;
  }

  .box_profit .profit_right {
    width: 70px;
    height: 100%;
    text-align: right;
    overflow: hidden;
  }

  .box_Project {
    position: absolute;
    right: 60px;
    bottom: 60px;
  }

  .project_total {
    position: absolute;
    width: 280px;
    height: 14px;
    font-size: 12px;
    line-height: 14px;
    left: 68px;
    top: 30px;
  }

  .project_total .text_left {
    color: #28eefc
  }

  .project_total .text_right {
    color: #fff006
  }

  .box_Sales {
    position: absolute;
    right: 60px;
    top: 190px;
  }

  .box_Purchase {
    position: absolute;
    right: 60px;
    top: 480px;
  }

  .Bar_Box {
    /* border: 1px solid red; */
    width: 878px;
    position: absolute;
    bottom: 49px;
    display: flex;
    left: 466px;
    height: 96px;
    display: flex;
    flex-wrap: wrap;
    background: url('../../static/img/wisdomBeam/area.png') 100% 100% no-repeat;
  }

  .Bar_Box div {
    width: 145px;
    /* border: 1px solid hotpink; */
    height: 48px;
    color: #fff;
    line-height: 48px;
    text-align: center;
    cursor: pointer;
  }

  .box_swiper {
    width: 877px;
    height: 635px;
    position: absolute;
    left: 466px;
    top: 152px;
  }

  .Beam_all {
    border: 1px solid #333d6f88;
    width: 68px;
    height: 26px;
    position: absolute;
    top: 0;
    font-size: 14px;
    color: #daf9ff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    cursor: pointer;
  }

  .lcimgStyle {
    position: absolute;
    top: 179px;
    right: 70px;
    width: 160px;
  }

  .lcimgStyle_bczlq {
    position: relative;
    height: 100px;
  }

  .lcimgStyle_bczlq img:nth-of-type(1) {
    position: absolute;
    left: 15px;
    top: 10px;
  }

  .lcimgStyle_bczlq img:nth-of-type(2) {
    position: absolute;
    bottom: 0;
  }

  .zbq {
    top: 202px;
    right: 93px;
  }

  .sys {
    top: 60px;
    right: -68px;
  }

  .ws {
    top: 418px;
    right: 327px;
  }

  .qj {
    top: 338px;
    right: 210px;
  }

  .jb {
    top: 226px;
    right: 190px;
  }

  .xy {
    top: 250px;
    right: 155px;
  }

  .jnb {
    top: 240px;
    right: 92px;
  }

  .jn {
    top: 260px;
    right: 80px;
  }

  .cyn {
    top: 234px;
    right: 50px;
  }

  .tt {
    top: 322px;
    right: 25px;
  }

  .lh {
    top: 362px;
    right: 18px;
  }

  .Box_swiper {
    height: 635px;
  }

  .profit_arrow {
    /* border: 1px solid red; */
    width: 160px;
    margin: 5px auto;
    display: flex;
  }

  .profit_arrow div {
    /* border: 1px solid blueviolet; */
    width: 80px;
    text-align: center;
    height: 27px;
    cursor: pointer;
  }

</style>
