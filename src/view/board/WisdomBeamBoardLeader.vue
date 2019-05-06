<template>
  <div>
    <div class="box_board">
      <div class="board_title">智能铁路供应链看板</div>
      <img class="board_logo" src="../../static/img/wisdomBeam/logo.png" width="199" alt="" />
      <div class="board_time">{{timeNow}}</div>
      <!--经营概括-->
      <div class="box_management">
        <div id="chart_management" class="chart_management" :style="{width: '430px', height: '250px'}"></div>
      </div>

      <div class='box_swiper'>
        <!-- @mouseenter="stop" @mouseleave="start" -->
        <div class="Beam_all" @click='toInit'>总览</div>
        <div class="lcimgStyle">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/bczlq.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle zbq">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/bczbq.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle sys">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/syszlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle ws">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/wszlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle qj">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/qjzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle jb">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/jbzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle xy">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/xyzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle jnb">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/jnbzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle jn">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/jnzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle cyn">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/cynzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>

        <div class="lcimgStyle tt">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/ttzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>
        <div class="lcimgStyle lh">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/lhzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
          </div>
        </div>
        <swiper :options="swiperOption" ref="mySwiper" class='Box_swiper'>
          <!-- 这部分放你要渲染的那些内容 -->
          <swiper-slide v-for="(slide, index) in arrBeamData" :key="index">
            <div class="lcimgStyle" :class="slide.className">
              <div class="lcimgStyle_bczlq" v-show="!(projectId== 0)&&(projectId == slide.id)">
                <img :src="slide.src" alt="">
                <img src="../../static/img/icon_place.png" alt="">
              </div>
            </div>
          </swiper-slide>
          <!-- 这是轮播的小圆点 -->
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
        <div class="bgtiao"></div>
      </div>

      <!--供应商概括-->
      <div class="box_supplier">
        <div id="chart_supplier" class="chart_supplier" :style="{width: '430px', height: '250px'}"></div>
      </div>

      <!--厂商占比-->
      <div class="box_Vendors">
        <div id="chart_Vendors" class="chart_Vendors" :style="{width: '416px', height: '238px'}"></div>
      </div>

      <!--采购概括-->
      <div class="box_Purchase">
        <div id="chart_Purchase" class="chart_Purchase" :style="{width: '418px', height: '204px'}"></div>
      </div>

      <!--销售概括-->
      <div class="box_Sales">
        <div id="chart_Sales" class="chart_Sales" :style="{width: '418px', height: '204px'}"></div>
      </div>

      <!--梁场概括-->
      <div class="box_Project">
        <div id="chart_Project" class="chart_Project" :style="{width: '413px', height: '194px'}"></div>
        <div class="project_total clearfix">
          <div class="text_left pull-left">物资总数量：{{totalGoodsCount}}</div>
          <div class="text_right pull-right">订单总数量：{{totalListCount}}</div>
        </div>
      </div>

      <!--利润率排名-->
      <div class="box_profit">
        <ul>
          <li class="clearfix" v-for="item in dataGrosstAll"
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
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper'

  export default {
    data () {
      return {
        code: null,
        totalGoodsCount: '',
        totalListCount: '',
        ok: false,
        swiperOption: {
          effect: 'fade',
          fade: {
            crossFade: false
          },
          // speed: 500,
          loop: {

            default: true,
            loopAdditionalSlides: 3
          },
          // observeParents: true,
          // observer: true,
          // autoplay: {
          //   delay: 500, // 自动切换的时间间隔，单位ms
          //   disableOnInteraction: false // 用户操作swiper之后，是否禁止autoplay
          // },
          pagination: {
            el: '.swiper-pagination',
            initialSlide: 2,
            dynamicBullets: true,
            dynamicMainBullets: 0,
            clickable: true,
            renderBullet: (index, className) => {
              let _html = ''
              if (this.arrBeamData[index] !== undefined) {
                _html += '<div class="' + className + '">' + this.arrBeamData[index].shortName + '</div>'
              }
              return _html
            }
          },

          /** ********************************************* */
          // pagination: {
          //   el: '.swiper-pagination',
          //   clickable: true,
          //   type: 'custom',
          //   dynamicBullets: true,
          //   dynamicMainBullets: 0,
          //   // 自定义分页器样式
          //   renderCustom: function (swiper, current, total) {
          //     const activeColor = 'red'
          //     const normalColor = '#aeaeae'
          //     let color = ''
          //     let paginationStyle = ''
          //     let html = ''
          //     for (let i = 1; i <= total; i++) {
          //       if (i === current) {
          //         color = activeColor
          //       } else {
          //         color = normalColor
          //       }
          //       paginationStyle = `background:${color};opacity:1;margin-right:0px;width:367px !important;height:50px;border-radius:20px;`
          //       html += `<div class="swiper-pagination-bullet" style=${paginationStyle}></div>`

          //       // '<div class="' + className + '">' + this.arrBeamData[index].shortName + '</div>'
          //     }
          //     return html
          //   }
          // },

          /** ********************************************* */

          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },

          on: {
            slideChange: () => {
              if (this.swiper.activeIndex === 0) {
                this.toInit()
                this.projectId = this.arrBeamData[this.swiper.activeIndex].id
                this.refreshData(this.projectId)
              } else {
                this.projectId = this.arrBeamData[this.swiper.activeIndex].id
                this.refreshData(this.projectId)
              }
            }
          }

        },
        arrBeamData: [],
        timeNow: '',
        timer: null,
        lastDate: '',
        urlManagement: this.$Api.wisdomBeam.manageSummary, // 可视化看板=>经营概括柱状图
        urlSupplier: this.$Api.wisdomBeam.supplierSummary, // 可视化看板=>供应商概括柱状图
        urlSalesOver: this.$Api.wisdomBeam.salesOverview, // 可视化看板=>销售概览柱状图
        urlPurchaseOver: this.$Api.wisdomBeam.purchaseOverview, // 可视化看板=>采购概览柱状图
        urlProjectOver: this.$Api.wisdomBeam.projectOverview, // 可视化看板=>梁场概览柱状图
        urlGrossPro: this.$Api.wisdomBeam.grossProfitRate, // 可视化看板=>毛利率排名柱状图
        urlSupplierType: this.$Api.wisdomBeam.supplierTypeRate, // 可视化看板=>厂商占比柱状图
        startTimeYear: '',
        endTimeYear: '',
        projectId: '0',
        dataManagementAll: [], // 经营概括  res.data.data
        managementData: [], // 当前梁场 经营概括 数据

        dataSupplierAll: [], // 供应商概括  res.data.data
        supplierData: [], // 当前梁场 供应商 数据

        dataVendorsAll: [], // 厂商占比
        vendorsData: [], // 当前梁场 厂商占比 数据

        dataPurchaseAll: [], // 采购概览
        PurchaseData: [], // 当前梁场 采购概览 数据

        dataSalesAll: [], // 销售概览
        SalesData: [], // 当前梁场 销售概览 数据

        dataProjectAll: [], // 梁场概览
        ProjectData: [], // 当前梁场 梁场概览 数据

        startTime: '',
        dataGrosstAll: [], // 利润率排名数据
        show: null
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    created () {
      this.getBeamField()
      this.getMonthAndYear()
      this.getDateAndMonth()
      this.getCurrentTime()
      clearInterval(this.timer)
      this.timer = null
      this.setTimer()
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    update () {

    },
    mounted () {
      this.getData()
      this.swiper.slideTo(0, 0, false)
      this.swiper.activeIndex = 2
    },
    destroyed: function () {
      // 每次离开当前界面时，清除定时器
      clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      // stop () {
      //   this.swiper.autoplay.stop()
      // },
      // start () {
      //   this.swiper.autoplay.start()
      // },
      toInit () {
        this.getData()
        this.swiper.slideTo(0, 0, true)
      },
      refreshData (id) {
        this.projectId = id
        this.managementData = (this.dataManagementAll[this.projectId])
        this.supplierData = (this.dataSupplierAll[this.projectId])
        this.vendorsData = this.dataVendorsAll
        this.PurchaseData = (this.dataPurchaseAll[this.projectId])
        this.SalesData = (this.dataSalesAll[this.projectId])
        this.ProjectData = (this.dataProjectAll[this.projectId])
        this.totalGoodsCount = this.ProjectData.totalGoodsCount[0]
        this.totalListCount = this.ProjectData.totalListCount[0]

        this.drawBar('chart_management', this.managementData)

        this.drawBarTwo('chart_supplier', this.supplierData)
        this.VendorsBar('chart_Vendors', this.vendorsData)

        this.PurchaseBar('chart_Purchase', this.PurchaseData)

        this.PurchaseBar('chart_Sales', this.SalesData)

        this.projectLine('chart_Project', this.ProjectData)
      },
      getPathImg (name) {
        return require('../../static/img/wisdomBeam/' + name + '.png')
      },
      // 获取梁场信息
      getBeamField () {
        this.$Ajax.post({
          url: this.$Api.wisdomBeam.ProjectList,
          data: {},
          cb: res => {
            if (res.data.result) {
              this.arrBeamData = res.data.data
              this.arrBeamData[1].className = 'tt'
              this.arrBeamData[2].className = 'jn'
              this.arrBeamData[3].className = 'jnb'
              this.arrBeamData[4].className = 'ws'
              this.arrBeamData[5].className = 'qj'
              this.arrBeamData[6].className = 'zbq'
              this.arrBeamData[7].className = 'xy'
              this.arrBeamData[8].className = 'sys'
              this.arrBeamData[9].className = 'lh'
              this.arrBeamData[10].className = ''
              this.arrBeamData[11].className = 'cyn'
              this.arrBeamData[12].className = 'jb'
              this.arrBeamData[1].src = this.getPathImg('ttzlc')
              this.arrBeamData[2].src = this.getPathImg('jnzlc')
              this.arrBeamData[3].src = this.getPathImg('jnbzlc')
              this.arrBeamData[4].src = this.getPathImg('wszlc')
              this.arrBeamData[5].src = this.getPathImg('qjzlc')
              this.arrBeamData[6].src = this.getPathImg('bczbq')
              this.arrBeamData[7].src = this.getPathImg('xyzlc')
              this.arrBeamData[8].src = this.getPathImg('syszlc')
              this.arrBeamData[9].src = this.getPathImg('lhzlc')
              this.arrBeamData[10].src = this.getPathImg('bczlq')
              this.arrBeamData[11].src = this.getPathImg('cynzlc')
              this.arrBeamData[12].src = this.getPathImg('jbzlc')

              // 本地顺序
              // this.BeamFieldListAll[1].className = 'ws'
              // this.BeamFieldListAll[2].className = 'xy'
              // this.BeamFieldListAll[3].className = 'lh'
              // this.BeamFieldListAll[4].className = 'tt'
              // this.BeamFieldListAll[5].className = 'jn'
              // this.BeamFieldListAll[6].className = 'qj'
              // this.BeamFieldListAll[7].className = 'jb'
              // this.BeamFieldListAll[8].className = 'cyn'
              // this.BeamFieldListAll[9].className = 'jnb'
              // this.BeamFieldListAll[10].className = ''
              // this.BeamFieldListAll[11].className = 'sys'
              // this.BeamFieldListAll[12].className = 'zbq'
              // this.BeamFieldListAll[1].src = this.getPathImg('wszlc')
              // this.BeamFieldListAll[2].src = this.getPathImg('xyzlc')
              // this.BeamFieldListAll[3].src = this.getPathImg('lhzlc')
              // this.BeamFieldListAll[4].src = this.getPathImg('ttzlc')
              // this.BeamFieldListAll[5].src = this.getPathImg('jnzlc')
              // this.BeamFieldListAll[6].src = this.getPathImg('qjzlc')
              // this.BeamFieldListAll[7].src = this.getPathImg('jbzlc')
              // this.BeamFieldListAll[8].src = this.getPathImg('cynzlc')
              // this.BeamFieldListAll[9].src = this.getPathImg('jnbzlc')
              // this.BeamFieldListAll[10].src = this.getPathImg('bczlq')
              // this.BeamFieldListAll[11].src = this.getPathImg('syszlc')
              // this.BeamFieldListAll[12].src = this.getPathImg('bczbq')
              this.show = true
            }
          }
        })
      },
      getData () {
        this.getDataManagement() // 经营概括
        this.getDataSupplier() // 供应商概括
        this.getDataVendors() // 厂商占比
        this.getDataPurchase() // 采购概览
        this.getDataSales() // 销售概览
        this.getDataProject() // 梁场概览
        this.getDataGrossPro() // 利润率排名
      },
      // 经营概括
      getDataManagement () {
        this.$Ajax.post({
          url: this.urlManagement,
          data: {
            startTime: this.startTimeYear,
            endTime: this.endTimeYear
          },
          cb: res => {
            if (res.data.result) {
              this.dataManagementAll = res.data.data
              this.managementData = (this.dataManagementAll[this.projectId])
              this.drawBar('chart_management', this.managementData)
            }
          }
        })
      },
      // 供应商概括
      getDataSupplier () {
        this.$Ajax.post({
          url: this.urlSupplier,
          data: {
            startTime: this.startTimeYear,
            endTime: this.endTimeYear
          },
          cb: res => {
            if (res.data.result) {
              this.dataSupplierAll = res.data.data

              this.supplierData = (this.dataSupplierAll[this.projectId])
              this.drawBarTwo('chart_supplier', this.supplierData)
            }
          }
        })
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

      drawBar (id, dataValue) {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            itemGap: 6,
            x: '110px',
            y: '25px',
            data: [{
              name: '供应',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '对账',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '开票',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '结算',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '回款',
              textStyle: {
                color: '#fff'
              }
            }
            ]
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            inverse: false,
            minInterval: 1,
            type: 'category',
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
                color: '#074044',
                width: 1,
                type: 'dashed'
              }
            }
          }],
          yAxis: [{
            type: 'value',
            name: '金额/万',
            nameTextStyle: {
              color: '#49a3ff',
              fontSize: 12
            },
            splitLine: {
              lineStyle: {
                color: '#074044',
                width: 1,
                type: 'dashed'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              },
              formatter: function (v) {
                return parseInt(v)
              }
            },
            axisLine: {
              lineStyle: {
                width: 0
              }
            }
          }],
          series: [{
            name: '结算',
            type: 'line',
              // stack: '广告',
            color: '#00AEFF',
            data: dataValue === undefined ? '' : dataValue.settment
          },
          {
            name: '对账',
            type: 'line',
              // stack: '广告',
            color: '#FF8800',
            data: dataValue === undefined ? '' : dataValue.reconciliation
          },
          {
            name: '开票',
            type: 'line',
              // stack: '广告',
            color: '#79E62B',
            data: dataValue === undefined ? '' : dataValue.invoice
          },
          {
            name: '回款',
            type: 'line',
              // stack: '广告',
            color: '#7000DD',
            data: dataValue === undefined ? '' : dataValue.back
          },
          {
            name: '供应',
            type: 'line',
              // stack: '广告',
            color: '#FF0C3E',
            data: dataValue === undefined ? '' : dataValue.supply
          }
          ]
        })
      },

      drawBarTwo (id, dataValue) {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            itemGap: 6,
            x: '110px',
            y: '25px',
            data: [{
              name: '采购',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '对账',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '开票',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '结算',
              textStyle: {
                color: '#fff'
              }
            },
            {
              name: '付款',
              textStyle: {
                color: '#fff'
              }
            }
            ]
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            inverse: false,
            minInterval: 1,
            type: 'category',
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
                color: '#074044',
                width: 1,
                type: 'dashed'
              }
            }
          }],
          yAxis: [{
            type: 'value',
            name: '金额/万',
            nameTextStyle: {
              color: '#49a3ff',
              fontSize: 12
            },
            splitLine: {
              lineStyle: {
                color: '#074044',
                width: 1,
                type: 'dashed'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 9
              },
              formatter: function (v) {
                return parseInt(v)
              }
            },
            axisLine: {
              lineStyle: {
                width: 0
              }
            }
          }],
          series: [{
            name: '结算',
            type: 'line',
              // stack: '广告',
            color: '#00AEFF',
            data: dataValue === undefined ? '' : dataValue.settment
          },
          {
            name: '对账',
            type: 'line',
              // stack: '广告',
            color: '#FF8800',
            data: dataValue === undefined ? '' : dataValue.reconciliation
          },
          {
            name: '开票',
            type: 'line',
              // stack: '广告',
            color: '#79E62B',
            data: dataValue === undefined ? '' : dataValue.invoice
          },
          {
            name: '付款',
            type: 'line',
              // stack: '广告',
            color: '#7000DD',
            data: dataValue === undefined ? '' : dataValue.back
          },
          {
            name: '采购',
            type: 'line',
              // stack: '广告',
            color: '#FF0C3E',
            data: dataValue === undefined ? '' : dataValue.supply
          }
          ]
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
            // min: 0,
            // max: 200,
            // splitNumber: 2
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
            inverse: false,
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
  .box_profit {
    width: 430px;
    height: 520px;
    position: absolute;
    left: 52px;
    bottom: 26px;
  }

  .box_profit ul {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  .box_profit ul li {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin-bottom: 2px;
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
    width: 250px;
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

  .box_board {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    box-sizing: border-box;
    padding-top: 20px;
    background-image: url(../../static/img/wisdomBeam/bj.png);
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

  .box_management {
    width: 430px;
    height: 250px;
    position: absolute;
    left: 52px;
    top: 198px;
  }

  .chart_management {
    width: 430px;
    height: 250px;
  }

  .box_supplier {
    width: 430px;
    height: 250px;
    position: absolute;
    right: 52px;
    top: 198px;
  }

  .chart_supplier {
    width: 430px;
    height: 250px;
  }

  .box_Vendors {
    width: 416px;
    height: 238px;
    position: absolute;
    right: 70px;
    top: 520px;
  }

  .chart_Vendors {
    width: 430px;
    height: 250px;
  }

  .box_Sales {
    position: absolute;
    right: 510px;
    top: 840px;
  }

  .chart_Sales {
    /* width: 430px;
    height: 250px; */
  }

  .box_Purchase {
    position: absolute;
    right: 70px;
    top: 840px;
  }

  .chart_Purchase {
    /* width: 430px;
    height: 250px; */
  }

  .box_Project {
    position: absolute;
    right: 981px;
    top: 840px;
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

  .chart_Project {
    /* width: 430px;
    height: 250px; */
  }

  .box_swiper {
    width: 877px;
    height: 635px;
    position: absolute;
    left: 516px;
    top: 146px;
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



  .Beam_swiper {
    color: #01fafe;
    border: 1px solid #01fafe;
    position: absolute;
    bottom: 0;
    height: 48px;
    width: 877px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .Beam_slider {
    border: 1px solid #01fafe;
    width: 119px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .Box_swiper {
    height: 635px;
  }

  .bgtiao {
    background: url('../../static/img/wisdomBeam/all.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 48px;
    bottom: 7px;
  }

  .swiper-pagination {
    /* border: 1px solid red;
    width: 630px;
    left: 119px;
    display: flex; */
  }

  .swiper-pagination>>>.swiper-pagination-bullet {
    /* border: 1px solid #333d6f88; */
    height: 42px;
    border-radius: 0;
    opacity: 1.0;
    background: none;
    color: #fffefe;
    font-size: 15px;
    width: 119px !important;
    line-height: 42px;
    text-align: center;
    transform: scale(1);
    width: 200px;
    /*display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    margin: 0 0 0 -24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    transform: scale(1);
    padding: 0 26px; */
  }

  .lcimgStyle {
    /* border: 1px solid red; */
    position: absolute;
    top: 140px;
    right: 146px;
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
    /* display: none; */
  }

  .lcimgStyle_bczlq img:nth-of-type(2) {
    position: absolute;
    bottom: 0;
  }

  .zbq {
    top: 160px;
    right: 163px;
  }

  .sys {
    top: 45px;
    right: 32px;
  }

  .ws {
    top: 340px;
    right: 360px;
  }

  .qj {
    top: 272px;
    right: 260px;
  }

  .jb {
    top: 186px;
    right: 243px;
  }

  .xy {
    top: 205px;
    right: 215px;
  }

  .jnb {
    top: 196px;
    right: 162px;
  }

  .jn {
    top: 212px;
    right: 152px;
  }

  .cyn {
    top: 193px;
    right: 130px;
  }

  .tt {
    top: 260px;
    right: 110px;
  }

  .lh {
    top: 292px;
    right: 104px;
  }

  .swiper-button-prev {
    left: 47px;
    top: 603px;
    background-image: url('../../static/img/wisdomBeam/left.png');
    /* background-image: url('../../static/img/wisdomBeam/one.png'); */
    background-size: auto;
  }

  .swiper-button-next {
    right: 47px;
    top: 603px;
    background-image: url('../../static/img/wisdomBeam/right.png');
    background-size: auto;
  }

  .swiper-pagination>>>.swiper-pagination-bullet-active {
    background: url('../../static/img/wisdomBeam/action.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 0px 4px;
    margin-left: 1px;
  }

</style>
