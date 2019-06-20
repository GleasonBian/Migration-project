<template>
  <div>
    <el-row>
      <el-col class="box_icon_bodrd" :span="6">
        <div class="box_icon_bodrd_img">{{formatData(profitDetailsData.totalMoney)}}</div>
        <div class="box_icon_bodrd_text">采购金额</div>
      </el-col>
      <el-col class="box_icon_bodrd" :span="6">
        <div class="box_icon_bodrd_img">{{formatData(profitDetailsData.grossProfit)}}</div>
        <div class="box_icon_bodrd_text">毛利润</div>
      </el-col>
      <el-col class="box_icon_bodrd" :span="6">
        <div class="box_icon_bodrd_img">{{formatData(profitDetailsData.supplierCount)}}</div>
        <div class="box_icon_bodrd_text">供应商总量</div>
      </el-col>
      <el-col class="box_icon_bodrd" :span="6">
        <div class="box_icon_bodrd_img">0</div>
        <div class="box_icon_bodrd_text">新增供应商</div>
      </el-col>
    </el-row>
    <div class="contract_title">供应商专员绩效</div>
    <el-row class="box_search">
      <el-col :span="8">
        <span>时间段：</span>
        <el-radio-group v-model="radioTime" @change="changeTime">
          <el-radio-button v-for="(item, index) in dateTimeRadio" :key="index" :label="item.label"></el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="8">
        <span>姓名：</span>
        <el-input style="width: auto" v-model="nameValue"></el-input>
      </el-col>
      <el-col :span="8" class="base_search_button">
        <el-button @click="submit" type="primary">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <table-list :data-header="profitDetailsHeader" :refs="profitDetailsRefs" :url="urlDetails"
                :params="pageProfitDetails">
      <template v-slot:number="scope">
        {{scope.index + 1}}
      </template>
      <template v-slot:totalMoney="scope">
        {{formatData(scope.row.totalMoney)}}
      </template>
      <template v-slot:totalCost="scope">
        {{formatData(scope.row.totalCost)}}
      </template>
      <template v-slot:grossProfit="scope">
        {{formatData(scope.row.grossProfit)}}
      </template>
      <template v-slot:handle="scope">
        <a class="handle" @click="toGoodsDetails(scope.row)">绩效明细</a>
      </template>
    </table-list>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        nameValue: '',
        radioTime: '',
        valuePicker: '',
        dateTimeRadio: [
          {
            label: '本月'
          },
          {
            label: '本季度'
          },
          {
            label: '3月内'
          }
        ],
        idCode: 0,
        profitDetailsHeader: [
          {prop: 'number', label: '排名', width: '60', slot: true},
          {prop: 'userName', label: '姓名'},
          {prop: 'totalMoney', label: '采购金额', slot: true},
          {prop: 'totalCost', label: '采购成本', slot: true},
          {prop: 'grossProfit', label: '毛利润', slot: true},
          {prop: 'grossProfitRate', label: '利润率'},
          {prop: 'projectCount', label: '服务梁场数量'},
          {prop: 'materialCount', label: '物资数量'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        urlProfitDetails: this.$Api.board.profitPager,
        urlDetails: this.$Api.board.totalPerformanceDetailPager,
        profitDetailsRefs: 'purchase_details_table',
        pageProfitDetails: {
          limit: 100,
          type: 3,
          refs: 'purchase_details_table'
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
        data.type = 3
        this.ajaxPost(this.urlProfitDetails, data, (res) => {
          this.profitDetailsData = res.data.rows[0]
        })
      },
      pageUpdateTable () {
        this.$Utils.pageUpdateTable([[], this.pageProfitDetails], this.profitDetailsRefs, this)
      },
      changeTime (res) {
        if (res) {
          this.valuePicker = ''
        }
        let date = new Date()
        let dateNow = this.$Date.dateFormat(date, this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        let dateCurrentMonth = this.$Date.dateFormat(new Date(date.getFullYear(), date.getMonth(), '1'), this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        let dateQuarterNow = this.getQuarterNow(date)
        let dataThreeMonths = this.getThreeMonths(date)
        this.pageProfitDetails.endTime = dateNow
        switch (res) {
          case '本月':
            this.pageProfitDetails.startTime = dateCurrentMonth
            break
          case '本季度':
            this.pageProfitDetails.startTime = dateQuarterNow
            break
          case '3月内':
            this.pageProfitDetails.startTime = dataThreeMonths
            break
        }
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
      // 获取三个月内开始日期
      getThreeMonths (date) {
        let dataMonths = ''
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        if (month < 3) {
          dataMonths = new Date((year - 1), (month + 9), '1')
        } else {
          dataMonths = new Date(year, (month - 3), '1')
        }
        return this.$Date.dateFormat(dataMonths, this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      toGoodsDetails (res) {
        let routeData = this.$router.resolve({
          name: 'performanceDetails',
          params: {id: res.userId, type: 3}
        })
        window.open(routeData.href, '_blank')
      },
      submit () {
        if (this.nameValue && this.nameValue !== '') {
          this.pageProfitDetails.userName = this.nameValue
        }
        this.pageUpdateTable()
      },
      reset () {
        this.radioTime = ''
        this.nameValue = ''
        delete this.pageProfitDetails.startTime
        delete this.pageProfitDetails.endTime
        delete this.pageProfitDetails.userName
        this.pageUpdateTable()
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

  .box_icon_bodrd {
    padding: 20px;
  }

  .box_icon_bodrd_img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    background: url(../../static/img/icon_board.png);
    background-size: 100%;
    text-align: center;
    line-height: 100px;
    color: #5a9df8;
  }

  .box_icon_bodrd_text {
    font-size: 18px;
    margin-top: 20px;
    line-height: 30px;
    text-align: center;
  }

  .box_search {
    margin: 20px 0;
    font-size: 14px;
  }
</style>
