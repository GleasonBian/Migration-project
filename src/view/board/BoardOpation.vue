<template>
  <div class="container-main">
    <div class='main-main'>
      <div class='business-name'>经营业务</div>
      <div class="business" >
        <router-link v-for="(item,index) in overview" :key="index" :to="item.to" v-show="item.code" class="business-item">{{item.name}}</router-link>
        <div @click="toZhang" class="business-item suspension" v-if="$Utils.getPageElement($Consts.PERMISSION.ZhangjhStatement.code)">张吉怀TV看板</div>
      </div>
    </div>

    <div class='main-main' style="margin-top: 30px;">
      <div class='business-name'>绩效考核</div>
      <div class="business" >
        <router-link v-for="(item,index) in evaluation" :key="index" :to="item.to" v-show="item.code" class="business-item">{{item.name}}</router-link>
      </div>
    </div>

    <div class='main-main' style="margin-top: 30px;">
      <div class='business-name'>梁场指标</div>
      <div class="business" >
        <router-link v-for="(item,index) in otherview" :key="index" :to="item.to" v-show="item.code" class="business-item">
          <div>
            <div style="font-size:16px;">{{item.name}}</div>
            <div style="font-size:18px;">本月7,888.00元</div>
            <div style="font-size:14px;">(与上月)↑XXXX元</div>
          </div>
        </router-link>
      </div>
    </div>


    <v-dialog :dialog="goodsOffDialog" :dialogFooter="goodsOffFooterDialog" @on-ok="goodsOffOk">
      <p>
         <span>prId：</span><el-input v-model="projectId" style='width:180px' readonly></el-input>（projectId:项目ID）
      </p>
      <p>
        <span>time：</span><el-input-number v-model="time" @change="timechange" :min="5" controls-position="right" :step="5" step-strictly label="刷新时间"></el-input-number>（刷新时间,单位:分钟）
      </p>
      <p>
        <span>day ：</span><el-input-number v-model="day" @change="daychange" :min="1" controls-position="right" :step="2" step-strictly label="展示数据"></el-input-number>（展示数据,单位:天）
      </p>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'BoardOpation',
  components: {},
  data () {
    return {
      // 经营业务
      overview: [
        {
          name: '供应链看板',
          to: '/mainEmpty/HomeBtn',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.supplyChainKanBan.code)
        },
        {
          name: '经营概览',
          to: '/visualizationBoard/boardHome',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.BusinessOverview.code)
        },
        {
          name: '梁场结算单',
          to: '/platformSettlement/projectSettlement',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.BeamFieldStatement.code)
        },
        {
          name: '供应商结算单',
          to: '/platformSettlement/supplierSettlement',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.SupplierStatement.code)
        }
      ],
      // 绩效考核
      evaluation: [
        {
          name: '采购部负责人',
          to: '/visualizationBoard/principal',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.principalStatement.code)
        },
        {
          name: '采购专员',
          to: '/visualizationBoard/attache',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.attacheStatement.code)
        },
        {
          name: '现场实施',
          to: '/visualizationBoard/fieldConduct',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.fieldConductStatement.code)
        },
      ],
      // 梁场指标
      otherview: [
        {
          name: '销售金额',
          to: '/visualizationBoard/SalesAmount',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.SalesAmountStatement.code)
        },
        {
          name: '采购金额',
          to: '/visualizationBoard/PurchaseAmount',
          code: this.$Utils.getPageElement(this.$Consts.PERMISSION.PurchaseAmountStatement.code)
        },
      //   {
      //     name: '销售物资数量',
      //     to: '/visualizationBoard/boardHome',
      //     code: this.$Utils.getPageElement(this.$Consts.PERMISSION.BusinessOverview.code)
      //   },
      //   {
      //     name: '采购单数量',
      //     to: '/platformSettlement/projectSettlement',
      //     code: this.$Utils.getPageElement(this.$Consts.PERMISSION.BeamFieldStatement.code)
      //   },
      //   {
      //     name: '日均销售',
      //     to: '/platformSettlement/supplierSettlement',
      //     code: this.$Utils.getPageElement(this.$Consts.PERMISSION.SupplierStatement.code)
      //   },
      //   {
      //     name: '采购节约金额',
      //     to: '/platformSettlement/supplierSettlement',
      //     code: this.$Utils.getPageElement(this.$Consts.PERMISSION.SupplierStatement.code)
      //   },
      //   {
      //     name: '采购降低成本率',
      //     to: '/platformSettlement/supplierSettlement',
      //     code: this.$Utils.getPageElement(this.$Consts.PERMISSION.SupplierStatement.code)
      //   },
      //   {
      //     name: '每单金额',
      //     to: '/platformSettlement/supplierSettlement',
      //     code: this.$Utils.getPageElement(this.$Consts.PERMISSION.SupplierStatement.code)
      //   }
      ],
      


      goodsOffDialog: {
        width: '430px',
        show: false,
        title: '提示'
      },
      goodsOffFooterDialog: [
          {text: '确定', key: 'ok', type: 'primary'},
          {text: '取消', key: 'cancel'}
      ],
      day: 10, // 默认天数
      time: 10, // 默认时间
      projectId: '108310742448000' // 默认id
    }
  },
  computed: {},

  watch: {},

  methods: {
    daychange (val) {
      console.log(val)
      if (val < 1) {
        alert('输入的值不允许小于1')
        this.day = 10
      }
    },
    timechange (val) {
      if (val < 1) {
        alert('输入的值不允许小于1')
        this.time = 30
      }
    },
    toZhang () {
      this.goodsOffDialog.show = true
    },
    goodsOffOk () {
      this.goodsOffDialog.show = false
      let url = `http://tv.tiezong.sjgtw.com/?projectId=${this.projectId}&time=${this.time}&day=${this.day}`
      location.replace(url);
    }
  },
  /**
   *
   * 生命周期
   *
   */
  created () {},
  mounted () {

  }
}
</script>
<style  scoped>
.container-main {
  width: 100;
}
.main-main .business-name{
  margin-top: 25px;
}
.main-main .business-name:first-child{
  margin: 0px;
}

.business {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 30px;
}

.business-item {
  width: 250px;
  height: 110px;
  text-align: center;
  /* line-height: 110px; */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: #f2f2f2;
  text-decoration: none;
  color:#333333;
  margin:40px 60px 0px 0px;
  border: 1px solid rgba(64, 160, 255, 0.568);
  border-radius: 5px;
}
.business :last-child{
  margin-right: 0px;
}
.business-name{
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  border-bottom: 1px solid #BCBCBC;
  padding-bottom: 5px;
}
.suspension:hover{
  cursor:pointer;
}
</style>