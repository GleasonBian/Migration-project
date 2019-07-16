<template>
  <div>
    <div class="box_board">
      <div class="board_title">智能铁路供应链看板</div>
      <img class="board_logo" src="../../static/img/wisdomBeam/logo.png" width="199" alt="" />
      <div class="board_time">{{timeNow}}</div>
      <!--经营概括-->
      <div class="box_management" @mouseenter="enter()" @mouseleave="leave()">
        <div id="chart_management" class="chart_management" :style="{width: '430px', height: '250px'}"></div>
      </div>

      <div class='box_swiper'>
        <div class="Beam_all" @mouseenter="enter()" @mouseleave="leave()" @click='toInit'>总览</div>
        <div class="imgall">
          <div>
            <div>
              <img src="../../static/img/lc.png" alt="">
            </div>
            <div>梁场</div>
          </div>
          <div>
            <div>
              <img src="../../static/img/gys.png" alt="">
            </div>
            <div>供应商</div>
          </div>
          <div>
            <div>
              <img src="../../static/img/gyz.png" alt="">
            </div>
            <div>供应中</div>
          </div>
        </div>
        <div class="lcimgStyle">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/bczlq.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/zlqGif.gif" class="zlqGif" alt="" /> -->
            <div v-show="index==0?true:false" class="zlqgifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle zbq">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/bczbq.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/zbqGif.gif" class="zbqGif" alt="" /> -->
            <div v-show="index==0?true:false" class="zbqgifClass">
              <img src="../../static/img/icon_place2.png" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle sys">

          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/syszlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/sysGif.gif" class="sysGif" alt="" /> -->
            <div v-show="index==0?true:false" class="sysgifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle ws">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/wszlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/wsGif.gif" class="wsGif" alt="" /> -->
            <div v-show="index==0?true:false" class="wsgifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle qj">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/qjzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/qjGif.gif" class="qjGif" alt="" /> -->
            <div v-show="index==0?true:false" class="qjgifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle jb">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/jbzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/jbGif.gif" class="jbGif" alt="" /> -->
            <div v-show="index==0?true:false" class="jbgifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle xy">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/xyzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/xyGif.gif" class="xyGif" alt="" /> -->
            <div v-show="index==0?true:false" class="xygifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle jnb">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/jnbzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/jnbGif.gif" class="jnbGif" alt="" /> -->
            <div v-show="index==0?true:false" class="jnbgifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle jn">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/jnzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/jnGif.gif" class="jnGif" alt="" /> -->
            <div v-show="index==0?true:false" class="jngifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle cyn">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/cynzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/cynGif.gif" class="cynGif" alt="" /> -->
            <div v-show="index==0?true:false" class="cyngifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle tt">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/ttzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/ttGif.gif" class="ttGif" alt="" /> -->
            <div v-show="index==0?true:false" class="ttgifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
            </div>
          </div>
        </div>

        <div class="lcimgStyle lh">
          <div class="lcimgStyle_bczlq">
            <img v-show="ok" src="../../static/img/wisdomBeam/lhzlc.png" alt="" />
            <img src="../../static/img/icon_place.png" alt="">
            <!-- <img src="../../static/img/wisdomBeam/lhGif.gif" class="lhGif" alt="" /> -->
            <div v-show="index==0?true:false" class="lhgifClass">
              <img src="../../static/img/icon_place2.png" style="display:none;" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
              <img src="../../static/img/icon_place2.png" alt="">
            </div>
          </div>
        </div>

        <div class='Box_swiper'>
          <div v-for="(slide, index) in arrBeamData" :key="index">
            <div class="lcimgStyle" :class="slide.className">
              <div class="lcimgStyle_bczlq" v-show="!(projectId == 0)&&(projectId == slide.id)">
                <img :src="slide.src" alt="">
                <img src="../../static/img/icon_place.png" alt="">
                <img :src="slide.gifSrc" :class="slide.classGifName" alt="" />
                <div :class="slide.gifClass" v-if="!(slide.gifClass == 'jngifClass')&&!(slide.gifClass == 'qjgifClass')&&!(slide.gifClass == 'lhgifClass')&&!(slide.gifClass == 'cyngifClass')&&!(slide.gifClass == 'jbgifClass')&&!(slide.gifClass == 'sysgifClass')">
                  <img src="../../static/img/icon_place2.png" alt="">
                  <img src="../../static/img/icon_place2.png" alt="">
                  <img src="../../static/img/icon_place2.png" alt="">
                </div>

                <div :class="slide.gifClass" v-else-if="!(slide.gifClass == 'sysgifClass')">
                  <img src="../../static/img/icon_place2.png" alt="">
                  <img src="../../static/img/icon_place2.png" alt="">
                  <img src="../../static/img/icon_place2.png" alt="">
                  <img src="../../static/img/icon_place2.png" alt="">
                </div>

                <div :class="slide.gifClass" v-else>
                  <img src="../../static/img/icon_place2.png" alt="">
                  <img src="../../static/img/icon_place2.png" alt="">
                </div>

              </div>
            </div>
          </div>

          <div class="bgtiao" @mouseenter="enter()" @mouseleave="leave()">
            <div class="prev" @click="prev">
              <img src="../../static/img/wisdomBeam/left.png" alt="">
            </div>
            <div class="pageListStyle">
              <div class="pageAll" ref="pageAll">
                <div class="pagesStyle" :class="{active:item.id==projectId}" ref="pagesStyle"
                  v-for="(item,index) in arrBeamData" @click="getInfo(item,index)">
                  {{item.shortName}}
                </div>
              </div>
            </div>
            <div class="next" @click="next" ref="disabled">
              <img src="../../static/img/wisdomBeam/right.png" alt="">
            </div>
          </div>
        </div>


      </div>

      <!--供应商概括-->
      <div class="box_supplier" @mouseenter="enter()" @mouseleave="leave()">
        <div id="chart_supplier" class="chart_supplier" :style="{width: '430px', height: '250px'}"></div>
      </div>

      <!--厂商占比-->
      <div class="box_Vendors" @mouseenter="enter()" @mouseleave="leave()">
        <div id="chart_Vendors" class="chart_Vendors" :style="{width: '416px', height: '238px'}"></div>
      </div>

      <!--采购概括-->
      <div class="box_Purchase" @mouseenter="enter()" @mouseleave="leave()">
        <div id="chart_Purchase" class="chart_Purchase" :style="{width: '418px', height: '204px'}"></div>
      </div>

      <!--销售概括-->
      <div class="box_Sales" @mouseenter="enter()" @mouseleave="leave()">
        <div id="chart_Sales" class="chart_Sales" :style="{width: '418px', height: '204px'}"></div>
      </div>

      <!--梁场概括-->
      <div class="box_Project" @mouseenter="enter()" @mouseleave="leave()">
        <div id="chart_Project" class="chart_Project" :style="{width: '413px', height: '194px'}"></div>
        <div class="project_total clearfix">
          <div class="text_left pull-left">物资总数量：{{totalGoodsCount}}</div>
          <div class="text_right pull-right">订单总数量：{{totalListCount}}</div>
        </div>
      </div>

      <!--利润率排名-->
      <div class="box_profit" @mouseenter="enter()" @mouseleave="leave()">
        <div id="chart_Profit" class="chart_Profit" :style="{width: '430px', height: '580px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        code: null,
        totalGoodsCount: '',
        totalListCount: '',
        ok: false,
        arrBeamData: [],
        index: 0,
        timeNow: '',
        timer: null,
        lastDate: '',
        urlManagement: this.$Api.wisdomBeam.manageSummary, // 可视化看板=>经营概括柱状图
        urlSupplier: this.$Api.wisdomBeam.supplierSummary, // 可视化看板=>供应商概括柱状图
        urlSalesOver: this.$Api.wisdomBeam.salesOverview, // 可视化看板=>销售概览柱状图
        urlPurchaseOver: this.$Api.wisdomBeam.purchaseOverview, // 可视化看板=>采购概览柱状图
        urlProjectOver: this.$Api.wisdomBeam.projectOverview, // 可视化看板=>梁场概览柱状图
        urlMaterialRank: this.$Api.wisdomBeam.materialRank, // 可视化看板=>毛利率排名柱状图
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
        dataMoney: [], // 物资排名数据
        dataGoodsName: [], // 物資
        currentPage: 1, // 当前页
        pageWidth: 0, // 偏移量
        pageTimer: null, // 导航栏定时器

        widthPage:632,
      }
    },
    components: {},
    created() {
      this.getBeamField()
      this.getMonthAndYear()
      this.getDateAndMonth()
      this.getCurrentTime()
      clearInterval(this.timer)
      this.timer = null
      this.setTimer()
      this.pageChangeHandle()
    },
    computed: {},
    updated() {},
    mounted() {
      this.getData()
    },
    destroyed: function () {
      // 每次离开当前界面时，清除定时器
      clearInterval(this.timer)
      this.timer = null
    },
    methods: {
      enter() {
        clearInterval(this.pageTimer)
      },
      leave() {
        this.pageChangeHandle()
      },
      isFiveMultiply(num) {
        // 当前第几页
        if (num % 5 === 0) {
          this.currentPage++
          if (this.currentPage > (this.arrBeamData.length % 5)) {
            this.currentPage = 1
            this.$refs.pageAll.style.marginLeft = 0 + 'px'
          } else {
            this.$refs.pageAll.style.marginLeft = '-' + (this.widthPage * (this.currentPage - 1)) + 'px'
          }
        }
        // 当前页是否为最后一页
      },
      /**
       * 定时器  60000
       */
      pageChangeHandle() {
        this.pageTimer = setInterval(() => {
          // 记录当前选中项
          this.index++
          if (this.index >= this.arrBeamData.length) {
            this.index = 0
            this.pageWidth = 0
          }
          if (this.index === 0) {
            this.getData()
            this.flag = false
            this.projectId = 0
            this.index = 0
          }
          this.projectId = this.arrBeamData[this.index].id
          this.refreshData(this.projectId)

          // 选项卡 翻页
          this.isFiveMultiply(this.index)
        }, 3000)
      },
      /**
       * 上一页
       */
      prev() {
        // 当前页 小于等于 总页数
        if (this.currentPage <= (this.arrBeamData.length % 5)) {
          // this.currentPage -= 1 // 进入上一页 (进入上一页)
          if (this.index != 0) {
            this.currentPage -= 1 // 进入上一页 (进入上一页)
            this.$refs.pageAll.style.marginLeft = '-' + (this.widthPage * (this.currentPage - 1)) + 'px' // 计算上一个宽度
            this.index = (this.currentPage * 5) - 5 // 索定当前下标
            this.projectId = this.arrBeamData[this.index].id // 加载当前下标的 id
            this.refreshData(this.projectId) // 根据id 加载数据
          } else {
            return
          }


        } else if (this.currentPage >= (this.arrBeamData.length % 5)) {
          this.$refs.pageAll.style.marginLeft = 0 + 'px'
          this.currentPage = 0
          this.index = 0
          this.projectId = this.arrBeamData[this.index].id
          this.refreshData(this.projectId)
        }
      },
      /**
       * 下一页
       */
      next() {
        // 当前页 小于 总页数
        if (this.currentPage < (this.arrBeamData.length % 5)) {
          this.currentPage += 1 // 进入下一页 (进入下一页)
          this.$refs.pageAll.style.marginLeft = '-' + (this.widthPage * (this.currentPage - 1)) + 'px' // 计算下一个宽度
          this.index = (this.currentPage * 5) - 5 // 索定当前下标
          this.projectId = this.arrBeamData[this.index].id // 加载当前下标的 id
          this.refreshData(this.projectId) // 根据id 加载数据
        } else if (this.currentPage >= (this.arrBeamData.length % 5)) {
          this.$refs.pageAll.style.marginLeft = 0 + 'px'
          this.currentPage = 0
          this.index = 0
          this.projectId = this.arrBeamData[this.index].id
          this.refreshData(this.projectId)
        }
      },
      /**
       * 当前选中项
       */
      getInfo(val, i) {
        this.index = i
        this.projectId = val.id
        this.refreshData(this.projectId)
      },
      /**
       * 总览
       */
      toInit() {
        this.getData()
        this.flag = false
        this.projectId = 0
        this.index = 0
        if (this.currentPage <= (this.arrBeamData.length % 5)) {
          this.currentPage = 1 // 进入上一页 (进入上一页)
          this.$refs.pageAll.style.marginLeft = '-' + (this.widthPage * (this.currentPage - 1)) + 'px' // 计算上一个宽度
          this.index = (this.currentPage * 5) - 5 // 索定当前下标
          this.projectId = this.arrBeamData[this.index].id // 加载当前下标的 id
          this.refreshData(this.projectId) // 根据id 加载数据
        } else if (this.currentPage >= (this.arrBeamData.length % 5)) {
          this.$refs.pageAll.style.marginLeft = 0 + 'px'
          this.currentPage = 0
          this.index = 0
          this.projectId = this.arrBeamData[this.index].id
          this.refreshData(this.projectId)
        }
      },
      /**
       * 获取对应梁场的全部数据
       */
      refreshData(id) {
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
      /**
       * 获取图片
       */
      getPathImg(name) {
        return require('../../static/img/wisdomBeam/' + name + '.png')
      },
      getGifImg(name) {
        return require('../../static/img/wisdomBeam/' + name + '.gif')
      },
      // 获取梁场信息
      getBeamField() {
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

              this.arrBeamData[1].classGifName = 'ttGif'
              this.arrBeamData[2].classGifName = 'jnGif'
              this.arrBeamData[3].classGifName = 'jnbGif'
              this.arrBeamData[4].classGifName = 'wsGif'
              this.arrBeamData[5].classGifName = 'qjGif'
              this.arrBeamData[6].classGifName = 'zbqGif'
              this.arrBeamData[7].classGifName = 'xyGif'
              this.arrBeamData[8].classGifName = 'sysGif'
              this.arrBeamData[9].classGifName = 'lhGif'
              this.arrBeamData[10].classGifName = 'zlqGif'
              this.arrBeamData[11].classGifName = 'cynGif'
              this.arrBeamData[12].classGifName = 'jbGif'

              this.arrBeamData[1].gifSrc = this.getGifImg('ttGif')
              this.arrBeamData[2].gifSrc = this.getGifImg('jnGif')
              this.arrBeamData[3].gifSrc = this.getGifImg('jnbGif')
              this.arrBeamData[4].gifSrc = this.getGifImg('wsGif')
              this.arrBeamData[5].gifSrc = this.getGifImg('qjGif')
              this.arrBeamData[6].gifSrc = this.getGifImg('zbqGif')
              this.arrBeamData[7].gifSrc = this.getGifImg('xyGif')
              this.arrBeamData[8].gifSrc = this.getGifImg('sysGif')
              this.arrBeamData[9].gifSrc = this.getGifImg('lhGif')
              this.arrBeamData[10].gifSrc = this.getGifImg('zlqGif')
              this.arrBeamData[11].gifSrc = this.getGifImg('cynGif')
              this.arrBeamData[12].gifSrc = this.getGifImg('jbGif')

              this.arrBeamData[1].gifClass = 'ttgifClass'
              this.arrBeamData[2].gifClass = 'jngifClass'
              this.arrBeamData[3].gifClass = 'jnbgifClass'
              this.arrBeamData[4].gifClass = 'wsgifClass'
              this.arrBeamData[5].gifClass = 'qjgifClass'
              this.arrBeamData[6].gifClass = 'zbqgifClass'
              this.arrBeamData[7].gifClass = 'xygifClass'
              this.arrBeamData[8].gifClass = 'sysgifClass'
              this.arrBeamData[9].gifClass = 'lhgifClass'
              this.arrBeamData[10].gifClass = 'zlqgifClass'
              this.arrBeamData[11].gifClass = 'cyngifClass'
              this.arrBeamData[12].gifClass = 'jbgifClass'

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
            }
          }
        })
      },
      /**
       * 获取当前梁场 所有数据
       */
      getData() {
        this.getDataManagement() // 经营概括
        this.getDataSupplier() // 供应商概括
        this.getDataVendors() // 厂商占比
        this.getDataPurchase() // 采购概览
        this.getDataSales() // 销售概览
        this.getDataProject() // 梁场概览
        this.getDataGrossPro() // 利润率排名
      },
      // 经营概括
      getDataManagement() {
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
      getDataSupplier() {
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
      getDataVendors() {
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
      getDataPurchase() {
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
      getDataSales() {
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
      getDataProject() {
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
      // 物资排名
      getDataGrossPro() {
        this.$Ajax.post({
          url: this.urlMaterialRank,
          data: {
            // startTime: this.startTime,
            // endTime: this.endTimeYear
          },
          cb: res => {
            if (res.data.result) {
              let dataMoney = []
              let dataGoodsName = []
              res.data.data.map(item => {
                dataMoney.push(item.money)
                dataGoodsName.push(item.goodsName)
              })
              let allData = []
              allData.push({
                dataMoney: dataMoney,
                dataGoodsName: dataGoodsName
              })
              this.ProfitBar('chart_Profit', allData)
            }
          }
        })
      },
      // 显示当前时间
      getCurrentTime() {
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
      setTimer() {
        if (this.timer == null) {
          this.timer = setInterval(this.getCurrentTime, 1000)
        }
      },
      // 获取当前时间最近12个月
      getMonthAndYear() {
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
      getDateAndMonth() {
        const temp = []
        let year
        for (let i = 0; i < 7; i++) {
          const time = new Date(new Date().setDate((new Date().getDate() + i) - 6))
          year = time.getFullYear()
          const month = `0${time.getMonth() + 1}`.slice(-2)
          const strDate = `0${time.getDate()}`.slice(-2)
          temp.push(`${month}/${strDate}`)
        }
        this.startTimeMonth = year + '-' + (temp[0].replace('/', '-'))
        this.endTimeMonth = year + '-' + (temp[6].replace('/', '-'))
        return temp
      },
      /**
       * 物资排名
       */
      ProfitBar(id, dataValue) {
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: '金额/万',
            nameLocation: 'end', // ---轴名称相对位置
            // nameTextStyle: { // ---坐标轴名称样式
            //   color: '#49a3ff',
            //   padding: [-15, -20, 0, -15] // ---坐标轴名称相对位置
            // },
            nameGap: 15,
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
                color: '#49a3ff',
                width: 1,
                type: 'solid'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: true,
              inside: true,
              lengt: 10
            }
          },
          yAxis: {
            inverse: true,
            type: 'category',
            // data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
            data: dataValue[0].dataGoodsName,
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                color: '#49a3ff',
                fontSize: 12
              },
              formatter: function (params) {
                if (params.length > 4) {
                  return params.substring(0, 4) + '...'
                } else {
                  return params
                }
              }
            },
            axisLine: {
              lineStyle: {
                color: '#49a3ff',
                width: 1,
                type: 'solid'
              }
            }
          },
          series: [{
            name: '金额',
            type: 'bar',
            barWidth: 10,
            color: '#28eefc',
            data: dataValue[0].dataMoney,
            // data: [100, 200, 300, 400, 1000, 300]
          }]
        })
      },
      /**
       * 经营概括 折线图
       */
      drawBar(id, dataValue) {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            itemGap: 6,
            x: '30px',
            y: '25px',
            top: '1%',
            data: [{
                name: '已供应',
                textStyle: {
                  color: '#fff',
                }
              },
              {
                name: '对账中',
                textStyle: {
                  color: '#fff'
                }
              },
              {
                name: '已开票',
                textStyle: {
                  color: '#fff'
                }
              },
              {
                name: '应收账款',
                textStyle: {
                  color: '#fff'
                }
              },
              {
                name: '已回款',
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
              color: '#49a3ff'
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
              name: '应收账款',
              type: 'line',
              // stack: '广告',
              color: '#00AEFF',
              data: dataValue === undefined ? '' : dataValue.settment
            },
            {
              name: '对账中',
              type: 'line',
              // stack: '广告',
              color: '#FF8800',
              data: dataValue === undefined ? '' : dataValue.reconciliation
            },
            {
              name: '已开票',
              type: 'line',
              // stack: '广告',
              color: '#79E62B',
              data: dataValue === undefined ? '' : dataValue.invoice
            },
            {
              name: '已回款',
              type: 'line',
              // stack: '广告',
              color: '#7000DD',
              data: dataValue === undefined ? '' : dataValue.back
            },
            {
              name: '已供应',
              type: 'line',
              // stack: '广告',
              color: '#FF0C3E',
              data: dataValue === undefined ? '' : dataValue.supply
            }
          ]
        })
      },
      /**
       * 供应商概括 折线图
       */
      drawBarTwo(id, dataValue) {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            itemGap: 6,
            x: '25px',
            y: '25px',
            top: '1%',
            data: [{
                name: '已采购',
                textStyle: {
                  color: '#fff'
                }
              },
              {
                name: '对账中',
                textStyle: {
                  color: '#fff'
                }
              },
              {
                name: '已开票',
                textStyle: {
                  color: '#fff'
                }
              },
              {
                name: '应付金额',
                textStyle: {
                  color: '#fff'
                }
              },
              {
                name: '已付款',
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
              name: '应付金额',
              type: 'line',
              // stack: '广告',
              color: '#00AEFF',
              data: dataValue === undefined ? '' : dataValue.settment
            },
            {
              name: '对账中',
              type: 'line',
              // stack: '广告',
              color: '#FF8800',
              data: dataValue === undefined ? '' : dataValue.reconciliation
            },
            {
              name: '已开票',
              type: 'line',
              // stack: '广告',
              color: '#79E62B',
              data: dataValue === undefined ? '' : dataValue.invoice
            },
            {
              name: '已付款',
              type: 'line',
              // stack: '广告',
              color: '#7000DD',
              data: dataValue === undefined ? '' : dataValue.back
            },
            {
              name: '已采购',
              type: 'line',
              // stack: '广告',
              color: '#FF0C3E',
              data: dataValue === undefined ? '' : dataValue.supply
            }
          ]
        })
      },
      /**
       * 厂商占比 柱状图
       */
      VendorsBar(id, dataValue) {
        // let _this = this
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
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
          }],
          series: [{
              name: '数量',
              type: 'bar',
              color: 'rgba(41, 73, 163, 0.56)',
              barWidth: 20,
              data: dataValue === undefined ? '' : dataValue.supplierTypeRate, // 数量数据
            },
            {
              name: '金额',
              type: 'bar',
              barWidth: 20,
              color: 'rgba(110, 255, 104, 0.56)',
              data: dataValue === undefined ? '' : dataValue.supplierTypeMoney, // 全额数据
            }
          ]
        })
      },
      /**
       * 销售概览 采购概览 共用 柱状图
       */
      PurchaseBar(id, dataValue) {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById(id))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
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
      /**
       * 梁场概览 折线图
       */
      calMax(arr) {
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
      calMin(arr) {
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
      projectLine(id, datavalue) {
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
              yAxisIndex: 0,
              data: datavalue.goodsCount,
              lineStyle: {
                normal: {
                  color: '#28eefc'
                }
              },
              itemStyle: {
                normal: {
                  color: '#28eefc',
                }
              }
            },
            {
              name: '订单总数量',
              type: 'line',
              yAxisIndex: 1,
              data: datavalue.listCount,
              lineStyle: {
                normal: {
                  color: '#fff006'
                }
              },
              itemStyle: {
                normal: {
                  color: '#fff006',
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
    height: 580px;
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
    background-image: url(../../static/img/wisdomBeam/1.png);
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

  .box_Purchase {
    position: absolute;
    right: 70px;
    top: 840px;
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
    position: relative;
  }


  .lcimgStyle {
    position: absolute;
    top: 140px;
    right: 146px;
    width: 160px;
  }

  .lcimgStyle_bczlq {
    position: relative;
    height: 100px;
  }

  .lcimgStyle_bczlq img {
    position: absolute;
  }

  .lcimgStyle_bczlq img:nth-of-type(1) {
    left: 12px;
    top: 15px;
  }

  .lcimgStyle_bczlq img:nth-of-type(2) {
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
  .ws>.lcimgStyle_bczlq>img:nth-of-type(1) {
    left: -118px;
    top: 30px;
  }
  

  .qj {
    top: 272px;
    right: 260px;
  }
  .qj>.lcimgStyle_bczlq>img:nth-of-type(1) {
    left: -116px;
    top: 31px;
  }

  .jb {
    top: 186px;
    right: 243px;
  }

  .jb>div>img:nth-of-type(1) {
    left: -106px;
    top: 15px;
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

  .jn>div>img:nth-of-type(1) {
    left: 12px;
    top: 59px;
  }

  .cyn {
    top: 193px;
    right: 130px;
  }

  .cyn>div>img:nth-of-type(1) {
    left: 12px;
    top: 59px;
  }

  .tt {
    top: 260px;
    right: 110px;
  }

  .lh {
    top: 292px;
    right: 104px;
  }

  .ttGif {
    left: -71px;
    top: 56px;
  }

  .ttgifClass {
    /* border: 1px solid red; */
  }

  .ttgifClass img:nth-of-type(1) {
    left: -84px;
    top: 51px;
  }

  .ttgifClass img:nth-of-type(2) {
    left: -32px;
    top: 79px;
  }

  .ttgifClass img:nth-of-type(3) {
    left: -28px;
    top: 109px;
  }

  .jnGif {
    left: -40px;
    top: 64px;
  }

  .jngifClass {
    /* border: 1px solid red; */
  }

  .jngifClass img:nth-of-type(1) {
    left: 7px;
    top: 51px;
  }

  .jngifClass img:nth-of-type(2) {
    left: -42px;
    top: 70px;

  }

  .jngifClass img:nth-of-type(3) {
    left: -52px;
    top: 103px;
  }

  .jngifClass img:nth-of-type(4) {
    left: 17px;
    top: 130px;
  }

  .jnbGif {
    left: -37px;
    top: 74px;
  }

  .jnbgifClass {
    /* border: 1px solid red; */
  }

  .jnbgifClass img:nth-of-type(1) {
    left: -25px;
    top: 71px;
  }

  .jnbgifClass img:nth-of-type(2) {
    left: -49px;
    top: 121px;

  }

  .jnbgifClass img:nth-of-type(3) {
    left: 21px;
    top: 143px;
  }

  .wsGif {
    left: 8px;
    top: 36px;
  }

  .wsgifClass {
    /* border: 1px solid red; */
  }

  .wsgifClass img:nth-of-type(1) {
    left: 43px;
    top: 29px;
  }

  .wsgifClass img:nth-of-type(2) {
    left: 121px;
    top: 44px;

  }

  .wsgifClass img:nth-of-type(3) {
    left: 25px;
    top: 102px;
  }

  .qjGif {
    left: -54px;
    top: 48px;
  }

  .qjgifClass {
    /* border: 1px solid red; */
  }

  .qjgifClass img:nth-of-type(1) {
    left: 61px;
    top: 44px;
  }

  .qjgifClass img:nth-of-type(2) {
    left: 135px;
    top: 102px;

  }

  .qjgifClass img:nth-of-type(3) {
    left: -64px;
    top: 103px;
  }

  .qjgifClass img:nth-of-type(4) {
    left: 22px;
    top: 116px;
  }

  .zbqGif {
    left: -26px;
    top: 87px;
  }

  .zbqgifClass {
    /* border: 1px solid red; */
  }

  .zbqgifClass img:nth-of-type(1) {
    left: 16px;
    top: 108px;
  }

  .zbqgifClass img:nth-of-type(2) {
    left: -21px;
    top: 107px;

  }

  .zbqgifClass img:nth-of-type(3) {
    left: -31px;
    top: 124px;
  }

  .xyGif {
    left: -21px;
    top: 66px;
  }

  .xygifClass {
    /* border: 1px solid red; */
  }

  .xygifClass img:nth-of-type(1) {
    left: 39px;
    top: 60px;
  }

  .xygifClass img:nth-of-type(2) {
    left: 30px;
    top: 109px;

  }

  .xygifClass img:nth-of-type(3) {
    left: -30px;
    top: 99px;
  }

  .sysGif {
    right: 146px;
    top: 85px;
  }

  .sysgifClass {
    /* border: 1px solid red; */
  }

  .sysgifClass img:nth-of-type(1) {
    left: -116px;
    top: 224px;
  }

  .sysgifClass img:nth-of-type(2) {
    left: -146px;
    top: 224px;

  }

  .lhGif {
    left: -134px;
    top: 55px;
  }

  .lhgifClass {
    /* border: 1px solid red; */
  }

  .lhgifClass img:nth-of-type(1) {
    left: -38px;
    top: 48px;
  }

  .lhgifClass img:nth-of-type(2) {
    left: -32px;
    top: 78px;

  }

  .lhgifClass img:nth-of-type(3) {
    left: -144px;
    top: 91px;
  }

  .lhgifClass img:nth-of-type(4) {
    left: -58px;
    top: 143px;
  }

  .zlqGif {
    left: -93px;
    top: 87px;
  }

  .zlqgifClass {
    /* border: 1px solid red; */
  }

  .zlqgifClass img:nth-of-type(1) {
    left: -2px;
    top: 127px;
  }

  .zlqgifClass img:nth-of-type(2) {
    left: -38px;
    top: 128px;

  }

  .zlqgifClass img:nth-of-type(3) {
    left: -99px;
    top: 158px;
  }

  .cynGif {
    left: -69px;
    top: 70px;
  }

  .cyngifClass {
    /* border: 1px solid red; */
  }

  .cyngifClass img:nth-of-type(1) {
    left: -54px;
    top: 75px;
  }

  .cyngifClass img:nth-of-type(2) {
    left: -17px;
    top: 73px;

  }

  .cyngifClass img:nth-of-type(3) {
    left: -81px;
    top: 125px;
  }

  .cyngifClass img:nth-of-type(4) {
    left: -7px;
    top: 151px;
  }

  

  .jbGif {
    left: -71px;
    top: 79px;
  }

  .jbgifClass {
    /* border: 1px solid red; */
  }

  .jbgifClass img:nth-of-type(1) {
    left: 62px;
    top: 78px;
  }

  .jbgifClass img:nth-of-type(2) {
    left: 4px;
    top: 122px;

  }

  .jbgifClass img:nth-of-type(3) {
    left: 36px;
    top: 132px;
  }

  .jbgifClass img:nth-of-type(4) {
    left: -79px;
    top: 188px;
  }


  .bgtiao {
    background: url('../../static/img/wisdomBeam/all.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 0;
    width: 876px;
    height: 47.5px;
    bottom: 0px;
    display: flex;
    position: absolute;
  }

  .pageListStyle {
    width: 634px;
    height: 48px;
    display: -webkit-box;
    position: relative;
    bottom: 302px;
    top: 3%;
    left: 120.9px;
    overflow: hidden;
  }

  .pagesStyle {
    width: 126.569px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
  }

  .pageAll {
    display: flex;
  }

  .prev,
  .next {
    width: 119px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    cursor: pointer;
  }

  .prev {
    position: absolute;
    left: 0;
  }

  .next {
    position: absolute;
    right: 0;
  }

  .active {
    background: url('../../static/img/wisdomBeam/action111.png');
    /* background: url('../../static/img/wisdomBeam/action1.png'); */
    background-size: 100% 91%;
    background-repeat: no-repeat;
    /* width: 127px; */
  }

  .imgall {
    /* border: 1px solid red; */
    /* width: 200px; */
    /* margin: 112px 305px; */
    position: absolute;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    font-size: 14px;
  }

  .imgall>div {
    /* border: 1px solid red; */
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 30px;
  }

  .imgall>div>div:nth-of-type(1) {
    width: 56px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .imgall>div>div:nth-of-type(2) {
    width: 56px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

  }

  .lcimgStyle_bczlq>img:nth-of-type(2) {
    width: 22px;
    height: 22px;
    position: absolute;
    background: url('../../static/img/icon_place.png') no-repeat;
    background-size: 100% 100%;
    animation-timing-function: linear;
    animation-name: shake;
    /* 规定动画完成一个周期所花费的秒或毫秒 */
    animation-duration: 1s;
    /* 播放次数 */
    animation-iteration-count: infinite;
    border-radius: 50%;
  }

  .lcimgStyle_bczlq>div>img {
    width: 18px;
    height: 18px;
    position: absolute;
    background: url('../../static/img/icon_place2.png') no-repeat;
    background-size: 100% 100%;
    animation-timing-function: linear;
    animation-name: shakegreen;
    /* 规定动画完成一个周期所花费的秒或毫秒 */
    animation-duration: 1s;
    /* 播放次数 */
    animation-iteration-count: infinite;
    border-radius: 50%;
  }

  /* 定义动画 */

  @keyframes shake {
    from {
      transform: scale(.9, .9);
    }

    to {
      transform: scale(1.1, 1.1);
      box-shadow: 0px 0px 5px #06d5fa;
    }
  }

  /* 定义动画 */

  @keyframes shakegreen {
    from {
      transform: scale(.9, .9);
    }

    to {
      transform: scale(1.1, 1.1);
      box-shadow: 0px 0px 5px #02ff77;
    }
  }
</style>