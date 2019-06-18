<template>
  <div class="container-main">
    <div class='main-main'>
      <div class='business-name'>经营业务</div>
      <div class="business" >
        <router-link v-for="(item,index) in overview" :key="index" :to="item.to" v-show="item.code" class="business-item">{{item.name}}</router-link>
        <div @click="toZhang" class="business-item">张吉怀TV看板</div>
      </div>
    </div>
     <v-dialog :dialog="goodsOffDialog" :dialogFooter="goodsOffFooterDialog" @on-ok="goodsOffOk">
        <p>
        <span>time：</span><el-input-number v-model="time" @change="timechange" :min="1" label="刷新时间"></el-input-number>（刷新时间,单位:分钟）
       </p>
       <p>
        <span>day：</span><el-input-number v-model="day" @change="daychange" :min="1" label="展示数据"></el-input-number>（展示数据,单位:天）
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
      goodsOffDialog: {
        width: '30%',
        show: false,
        title: '提示'
      },
      goodsOffFooterDialog: [
          {text: '确定', key: 'ok', type: 'primary'},
          {text: '取消', key: 'cancel'}
      ],
      day: 10,
      time: 30
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
      location.replace('http://tv.tiezong.sjgtw.com/?projectId=108310742448000&time=' + this.time + '&day=' + this.day)
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
  line-height: 110px;
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
</style>