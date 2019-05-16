<template>
  <div>
    <h4>经营概述</h4>
    <!-- <el-row style="" class="box_board">
      <el-col class="box_icon_bodrd_border" :span="8">
        <div class="">
          <div class="box_icon_bodrd_text">{{formatData(profitDetailsData.totalMoney)}}</div>
        </div>
        <div class="box_icon_bodrd_text text_other">销售金额</div>
      </el-col>
      <el-col class="box_icon_bodrd_border" :span="8">
        <div class="">
          <div class="box_icon_bodrd_text">{{formatData(profitDetailsData.totalCost)}}</div>
        </div>
        <div class="box_icon_bodrd_text text_other">采购成本</div>
      </el-col>
      <el-col class="box_icon_bodrd_border" :span="8">
        <div class="">
          <div class="box_icon_bodrd_text">{{formatData(profitDetailsData.grossProfit)}}</div>
        </div>
        <div class="box_icon_bodrd_text text_other">毛利润</div>
      </el-col>
    </el-row> -->
    <div class="contract_title">经营明细</div>
    <div class="clearfix">
      <div class="btn_search_time pull-left">
        <span>时间段：</span>
        <el-radio-group v-model="radioTime" @change="changeTime">
          <el-radio-button v-for="(item, index) in dateTimeRadio" :key="index" :label="item.label"></el-radio-button>
        </el-radio-group>
        <span style="margin-left: 20px;"> 选择时间段：</span>
        <el-date-picker style="padding-top: 1px;"
                        v-model="valuePicker"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="changePicker">
        </el-date-picker>
      </div>
      <!-- <el-button class="pull-right" type="primary" @click="toPageBoard">梁场概述</el-button> -->
      <el-button class="pull-right" type="primary" @click="toPageBoard1">梁场概述</el-button>
    </div>
    <table-list :data-header="profitDetailsHeader" :refs="profitDetailsRefs" :url="urlProfitDetails"
                :params="pageProfitDetails" :tabStyle="tabStyle">
      <template slot-scope="scope" slot="number">
        {{scope.index + 1}}
      </template>
      <template slot-scope="scope" slot="totalMoney">
        {{formatData(scope.row.totalMoney)}}
      </template>
      <template slot-scope="scope" slot="totalCost">
        {{formatData(scope.row.totalCost)}}
      </template>
      <template slot-scope="scope" slot="grossProfit">
        {{formatData(scope.row.grossProfit)}}
      </template>
      <template slot-scope="scope" slot="handle">
        <a class="handle" @click="toProfitDetails(scope.row)">月份排名</a>
        <a class="handle" @click="toGoodsDetails(scope.row)">物资明细</a>
      </template>
    </table-list>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        radioTime: '',
        valuePicker: '',
        dateTimeRadio: [
          {
            label: '当日'
          },
          {
            label: '本周'
          },
          {
            label: '本月'
          }
        ],
        idCode: 0,
        tabStyle: {
          showSummary: true,
          summaryMethod: this.summaryMethod
        },
        profitDetailsHeader: [
          {prop: 'number', label: '序号', width: '60', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'materialCount', label: '销售数量(种)'},
          {prop: 'supplierCount', label: '供应商数量（家）'},
          {prop: 'totalMoney', label: '销售金额', slot: true},
          // {prop: 'totalCost', label: '采购成本', slot: true},
          // {prop: 'grossProfit', label: '毛利润', slot: true},
          // {prop: 'grossProfitRate', label: '毛利率'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        urlProfitDetails: this.$Api.board.profitPager,
        profitDetailsRefs: 'profit_details_infoinfo_table',
        pageProfitDetails: {
          limit: 100,
          isProject: 1,
          refs: 'profit_details_infoinfo_table'
        },
        profitDetailsData: {},
        typeTime: ''
      }
    },
    created () {
      this.getDetailsData()
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
      toPageBoard () {
        let routeData = this.$router.resolve({
          name: 'wisdomBeamBoardLeader'
        })
        window.open(routeData.href, '_blank')
      },
      toPageBoard1 () {
        let routeData = this.$router.resolve({
          name: 'HomeBtn'
        })
        window.open(routeData.href, '_blank')
      },
  
      toProfitDetails (res) {
        let routeData = this.$router.resolve({
          name: 'profitDetailsElse',
          params: {id: res.projectID, name: res.projectName}
        })
        window.open(routeData.href, '_blank')
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
        this.ajaxPost(this.urlProfitDetails, data, (res) => {
          this.profitDetailsData = res.data.rows[0]
        })
      },
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([[], this.pageProfitDetails], this.profitDetailsRefs, this)
      },
      changePicker (res) {
        if (res) {
          this.radioTime = ''
        }
        let startTime = this.$Date.dateFormat(res[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        let endTime = this.$Date.dateFormat(res[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        this.pageProfitDetails.startTime = startTime
        this.pageProfitDetails.endTime = endTime
        this.pageUpdateTable()
      },
      changeTime (res) {
        if (res) {
          this.valuePicker = ''
        }
        let date = new Date()
        let dateNow = this.$Date.dateFormat(date, this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        let dateCurrentMonth = this.$Date.dateFormat(new Date(date.getFullYear(), date.getMonth(), '1'), this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        let dataWeek = this.getWeek(date)
        this.pageProfitDetails.endTime = dateNow
        switch (res) {
          case '当日':
            this.pageProfitDetails.startTime = dateNow
            break
          case '本周':
            this.pageProfitDetails.startTime = dataWeek
            break
          case '本月':
            this.pageProfitDetails.startTime = dateCurrentMonth
            break
        }
        this.pageUpdateTable()
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
      summaryMethod (param) {
        let _this = this
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (column.property === 'materialCount' || column.property === 'supplierCount' || column.property === 'totalMoney' || column.property === 'totalCost' || column.property === 'grossProfit') {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return (Number(prev) + Number(curr)).toFixed(4)
                } else {
                  if (column.property === 'materialCount' || column.property === 'supplierCount') {
                    return prev
                  } else {
                    return _this.formatData(prev)
                  }
                }
              }, 0)
            }
          } else if (column.property === 'projectName') {
            sums[index] = '总计'
            return sums
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      toGoodsDetails (res) {
        let routeData = this.$router.resolve({
          name: 'profitGoodsDetailsElse',
          params: {state: 'detail', id: res.projectID, name: res.projectName}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: profitGoodsDetails, params: {id: this.pageProfitDetails.projectId, date: res.reportDate}})
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

  .box_board{background: #f8f8f8;padding: 20px;margin-bottom: 20px;}
  .box_icon_bodrd_border{height: 140px;border-right: 1px solid #bbbbbb;}
  .box_icon_bodrd_border:last-child{border-right: none;}
  .box_icon_bodrd_text {
    font-size: 18px;
    margin-top: 20px;
    line-height: 30px;
    text-align: center;
  }
  .box_icon_bodrd_text.text_other{color: #444444;margin-top: 40px;}
</style>
