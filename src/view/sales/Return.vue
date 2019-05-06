<template>
  <div>
    <el-tabs>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="退货管理" name="first">
          <return-goods-manager :data-source-code="dataSourceCode" :type="dataType"></return-goods-manager>
        </el-tab-pane>
        <el-tab-pane label="换货管理" name="second">
          <exchange-goods-mananger :data-source-code="dataSourceCode" :type="dataType2"></exchange-goods-mananger>
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
  </div>
</template>

<script>
  import ReturnGoodsManager from './returnManager/ReturnGoodsManager.vue'
  import ExchangeGoodsMananger from './returnManager/ExchangeGoodsMananger.vue'
  export default {
    data () {
      return {
        activeName: 'first',
        dataType: 1,
        dataType2: 2,
        dataSourceCode: 1
      }
    },
    methods: {
    },
    components: {
      ReturnGoodsManager,
      ExchangeGoodsMananger
    }
  }
</script>

<style scoped>

</style>
