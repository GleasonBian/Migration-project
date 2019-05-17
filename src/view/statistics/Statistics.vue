<template>
  <div>
    <h4>梁场审批事项概览<span class="color_red">*</span><span class="font_no_weight">按梁场统计物资内部审批进度总体情况</span></h4>
    <span>梁场名称：</span>
    <el-select v-model="valueProject1" placeholder="请选择" @change="changeProject1">
      <el-option
        v-for="item in optionsProject"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span style="margin-left: 40px;">创建时间：</span>
    <el-date-picker  style="margin-right:5px"
                    v-model="valuePicker1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false"
                    @change="changePicker1">
    </el-date-picker>
    <el-button type="" @click="cancel1">重置</el-button>
    <div class="big_btn">
      <el-button type="primary" @click="exportExamine">导出审批统计</el-button>
    </div>
    <h4>历史销售价格明细<span class="color_red">*</span><span class="font_no_weight">按梁场统计物资梁场采购历史价格，以系统数据为准</span></h4>
    <span>梁场名称：</span>
    <el-select v-model="valueProject2" placeholder="请选择" @change="changeProject2">
      <el-option
        v-for="item in optionsProject"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span style="margin-left: 40px;">创建时间：</span>
    <el-date-picker  style="margin-right:5px"
                    v-model="valuePicker2"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false"
                    @change="changePicker2">
    </el-date-picker>
    <el-button type="" @click="cancel2">重置</el-button>
    <div class="big_btn">
      <el-button type="primary" @click="exportPrice">导出历史价格</el-button>
    </div>
    <h4>厂商采购占比统计</h4>
    <span>梁场名称：</span>
    <el-select v-model="valueProject3" placeholder="请选择" @change="changeProject3">
      <el-option
        v-for="item in optionsProject"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span style="margin-left: 40px;">创建时间：</span>
    <el-date-picker style="margin-right:5px"
                    v-model="valuePicker3"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changePicker3">
    </el-date-picker>
    <el-button type="" @click="cancel3">重置</el-button>
    <div class="big_btn">
      <el-button type="primary" @click="exportSupplierPurchase">导出厂商占比</el-button>
    </div>
    <h4>各地区采购销售总金额</h4>
    <span style="margin-left: 40px;">创建时间：</span>
    <el-date-picker  style="margin-right:5px"
                    v-model="valuePicker4"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changePicker4">
    </el-date-picker>
    <el-button type="" @click="cancel4">重置</el-button>
    <div class="big_btn">
      <el-button type="primary" @click="exportAmountMoney">导出采购销售总金额</el-button>
    </div>
    <h4>采购单物资明细</h4>
    <span>梁场名称：</span>
    <el-select v-model="valueProject5" placeholder="请选择" @change="changeProject5">
      <el-option
        v-for="item in optionsProject"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span style="margin-left: 40px;">创建时间：</span>
    <el-date-picker  style="margin-right:5px"
                    v-model="valuePicker5"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changePicker5">
    </el-date-picker>
    <el-button type="" @click="cancel5">重置</el-button>
    <div class="big_btn">
      <el-button type="primary" @click="exportListPurchaseGoods">导出采购单物资明细</el-button>
    </div>
    <h4>现场未收货物资</h4>
    <span>梁场名称：</span>
    <el-select v-model="valueProject6" placeholder="请选择" @change="changeProject6">
      <el-option
        v-for="item in optionsProject"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span style="margin-left: 40px;">创建时间：</span>
    <el-date-picker  style="margin-right:5px"
                    v-model="valuePicker6"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changePicker6">
    </el-date-picker>
    <el-button type="" @click="cancel6">重置</el-button>
    <div class="big_btn">
      <el-button type="primary" @click="exportSceneGoods">导出现场未收货物资</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        valueProject1: '',
        valueProject2: '',
        valueProject3: '',
        valueProject5: '',
        valueProject6: '',
        optionsProject: [],
        urlBeamField: this.$Api.orderManger.getProjectList,
        projectId1: '',
        projectId2: '',
        projectId3: '',
        projectId5: '',
        projectId6: '',
        valuePicker1: '',
        valuePicker2: '',
        valuePicker3: '',
        valuePicker4: '',
        valuePicker5: '',
        valuePicker6: '',
        startTime1: '',
        endTime1: '',
        startTime2: '',
        endTime2: '',
        startTime3: '',
        endTime3: '',
        startTime4: '',
        endTime4: '',
        startTime5: '',
        endTime5: '',
        startTime6: '',
        endTime6: '',
        tabBut: [
          {text: '导出销售历史价格', key: 'export-price'},
          {text: '导出梁场审批事项', key: 'export-examine'},
          {text: '导出梁场供应商采购金额', key: 'export-supplier-purchase'}
        ],
        urlPrice: this.$Api.statistics.exportHistoryPrice,
        urlExamine: this.$Api.statistics.salesAndPurchaseMangeList,
        urlSupplierPurchase: this.$Api.statistics.findProjectPlanGoodsVOList,
        urlAmountMoney: this.$Api.statistics.findPurchaseAndSalesByRegion,
        urlListPurchaseGoods: this.$Api.statistics.exportPurchaseGoods,
        urlSceneGoods: this.$Api.statistics.ExportSceneNoDeliveryGoodsList
      }
    },
    created () {
      this.getBeamField()
    },
    methods: {
      getBeamField () {
        this.$Ajax.post({
          url: this.urlBeamField,
          data: {},
          cb: res => {
            if (res.data.result) {
              let arrBeamData = res.data.data
              this.optionsProject = this.fliterSelectBeam(arrBeamData)
            }
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
      cancel1 () {
        this.valueProject1 = ''
        this.valuePicker1 = ''
        this.projectId1 = ''
        this.startTime1 = ''
      },
      cancel2 () {
        this.valueProject2 = ''
        this.valuePicker2 = ''
        this.projectId2 = ''
        this.startTime2 = ''
      },
      cancel3 () {
        this.valueProject3 = ''
        this.valuePicker3 = ''
        this.projectId3 = ''
        this.startTime3 = ''
      },
      cancel4 () {
        this.valuePicker4 = ''
        this.startTime4 = ''
      },
      cancel5 () {
        this.valueProject5 = ''
        this.valuePicker5 = ''
        this.projectId5 = ''
        this.startTime5 = ''
      },
      cancel6 () {
        this.valueProject6 = ''
        this.valuePicker6 = ''
        this.projectId6 = ''
        this.startTime6 = ''
      },
      changePicker1 (res) {
        this.startTime1 = this.$Date.dateFormat(res[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        this.endTime1 = this.$Date.dateFormat(res[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      changePicker2 (res) {
        this.startTime2 = this.$Date.dateFormat(res[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        this.endTime2 = this.$Date.dateFormat(res[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      changePicker3 (res) {
        this.startTime3 = this.$Date.dateFormat(res[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        this.endTime3 = this.$Date.dateFormat(res[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      changePicker4 (res) {
        this.startTime4 = this.$Date.dateFormat(res[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        this.endTime4 = this.$Date.dateFormat(res[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      changePicker5 (res) {
        this.startTime5 = this.$Date.dateFormat(res[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        this.endTime5 = this.$Date.dateFormat(res[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      changePicker6 (res) {
        this.startTime6 = this.$Date.dateFormat(res[0], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
        this.endTime6 = this.$Date.dateFormat(res[1], this.$Date.ISO8601_FORMAT_WITHOUT_TIME)
      },
      changeProject1 (res) {
        this.projectId1 = res
      },
      changeProject2 (res) {
        this.projectId2 = res
      },
      changeProject3 (res) {
        this.projectId3 = res
      },
      changeProject5 (res) {
        this.projectId5 = res
      },
      changeProject6 (res) {
        this.projectId6 = res
      },
      exportExamine () {
        let str = ''
        if (this.startTime1) {
          str += '?startTime=' + this.startTime1 + '&endTime=' + this.endTime1
        } else {
          str += '?startTime=&endTime='
        }
        if (this.projectId1) {
          str += '&projectId=' + this.projectId1
        } else {
          str += '&projectId='
        }
        location.href = this.urlExamine + str
      },
      exportPrice () {
        let str = ''
        if (this.startTime2) {
          str += '?startTime=' + this.startTime2 + '&endTime=' + this.endTime2
        } else {
          str += '?startTime=&endTime='
        }
        if (this.projectId2) {
          str += '&projectId=' + this.projectId2
        } else {
          str += '&projectId='
        }
        location.href = this.urlPrice + str
      },
      exportSupplierPurchase () {
        let str = ''
        if (this.startTime3) {
          str += '?startTime=' + this.startTime3 + '&endTime=' + this.endTime3
        } else {
          str += '?startTime=&endTime='
        }
        if (this.projectId3) {
          str += '&projectId=' + this.projectId3
        } else {
          str += '&projectId='
        }
        location.href = this.urlSupplierPurchase + str
      },
      exportAmountMoney () {
        let str = ''
        if (this.startTime4) {
          str += '?startTime=' + this.startTime4 + '&endTime=' + this.endTime4
        } else {
          str += '?startTime=&endTime='
        }
        location.href = this.urlAmountMoney + str
      },
      exportListPurchaseGoods () {
        let str = ''
        if (this.startTime5) {
          str += '?startTime=' + this.startTime5 + '&endTime=' + this.endTime5
        } else {
          str += '?startTime=&endTime='
        }
        if (this.projectId5) {
          str += '&projectId=' + this.projectId5
        } else {
          str += '&projectId='
        }
        location.href = this.urlListPurchaseGoods + str
      },
      exportSceneGoods () {
        let str = ''
        if (this.startTime6) {
          str += '?startTime=' + this.startTime6 + '&endTime=' + this.endTime6
        } else {
          str += '?startTime=&endTime='
        }
        if (this.projectId6) {
          str += '&projectId=' + this.projectId6
        } else {
          str += '&projectId='
        }
        location.href = this.urlSceneGoods + str
      }
    }
  }
</script>

<style>
  .color_red {
    color: #ff8400;
    margin-left: 30px
  }

  .font_no_weight {
    font-weight: normal;
  }

  .big_btn {
    margin-top: 10px;
  }

</style>
