<template>
  <div class="container-main">
    <div class='main-main'>
      <div class='business-name'>经营业务</div>
      <div class="business" >
        <router-link v-for="(item,index) in overview" :key="index" :to="item.to" class="business-item" v-show="item.code">{{item.name}}</router-link>
      </div>      
      <!-- <div class='business-name'>内部业务</div>
      <div class="business" >
        <router-link  v-for="(item,index) in inBuss" :key="index" :to="item.to" class="business-item">{{item.name}}</router-link>
      </div>
      <div class='business-name'>外部业务</div>
      <div class="business" >
        <router-link  v-for="(item,index) in waibu" :key="index" :to="item.to" class="business-item">{{item.name}}</router-link>
      </div> -->
    </div>
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
      ]
    }
  },
  computed: {},

  watch: {},

  methods: {},
  /**
   *
   * 生命周期
   *
   */
  created () {},
  mounted () {
    console.log()
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