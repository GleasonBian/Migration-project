<template>
  <div>
    <div v-for="(item, index) in classList" :key="index">
      <div class="base_btn_group">
        <div style="display: inline-block;margin-right: 100px">{{item.classifyName}}</div>
        <el-button type="primary" size="mini" @click="onAdd(item, index)">添加商品</el-button>
      </div>
      <table-list :data-header="dataHeader" :dataStatic="item.mealGoodsVOList" :static="true">
        <template v-slot:recommendGoodsCount="scope">
          <el-input type="number" min="0" v-model="scope.row.recommendGoodsCount" @blur="changeRecommendGoodsCount(scope.row)"></el-input>
        </template>
        <template v-slot:operation="scope">
          <tab-but :data="tabButTable" @on-del="ondel(scope.rows, scope.row, scope.index)"></tab-but>
        </template>
        <template v-slot:goodsState="scope">
          <span>上架</span>
        </template>
      </table-list>
    </div>
    <v-dialog :dialog="goodsDialog">
      <goods-table :selectClassItem="selectClassItem" @closeDialog="closeDialog" @AddMeal-getData="getDataTable1"></goods-table>
    </v-dialog>
  </div>
</template>

<script>
    import GoodsTable from './GoodsTable.vue'
    export default {
      data () {
        return {
          dataHeader: [
            {prop: 'goodsName', label: '商品名称', showOverflowTooltip: true},
            {prop: 'brandName', label: '品牌'},
            {prop: 'typeModel', label: '规格型号'},
            {prop: 'goodsUnitPrice', label: '商品价格（元）'},
            {prop: 'recommendGoodsCount', label: '推荐数量', slot: 'true'},
            {prop: 'stockNumber', label: '库存'},
            {prop: 'goodsState', label: '商品状态', slot: true},
            {prop: 'operation', label: '操作', slot: true}
          ],
          tabButTable: [{text: '删除', key: 'del'}],
          goodsDialog: {
            show: false,
            title: '从商品库配货：',
            width: '60%'
          },
          selectClassItem: {},
          selectIndex: ''
        }
      },
      props: {
        classList: {
          type: Array
        }
      },
      methods: {
        changeRecommendGoodsCount (row) {
          this.$Ajax.post({
            url: this.$Api.customPackage.changeRecommendGoodsCount,
            data: {
              id: row.id,
              recommendGoodsCount: row.recommendGoodsCount
            },
            cb: res => {
              if (res.status === 200) {
              }
            }
          })
        },
        ondel (rows, row, index) {
          this.$Ajax.post({
            url: this.$Api.customPackage.removeMealGoods,
            data: {
              mealGoodsId: row.id
            },
            cb: res => {
              if (res.status === 200) {
                this.$message('删除成功')
                rows.splice(index, 1)
              }
            }
          })
        },
        getDataTable1 (item) {
          if (this.classList[this.selectIndex].mealGoodsVOList === null) {
            this.classList[this.selectIndex].mealGoodsVOList = []
          }
          let mealGoodsVOList = this.classList[this.selectIndex].mealGoodsVOList
          mealGoodsVOList.push(item)
        },
        closeDialog () {
          this.goodsDialog.show = false
        },
        onAdd (item, index) {
          this.selectIndex = index
          this.selectClassItem = item
          this.goodsDialog.show = true
        }
      },
      components: {
        GoodsTable
      }
    }
</script>

<style>
</style>
