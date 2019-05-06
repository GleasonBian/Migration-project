<template>
  <div>
    <v-search :data="SearchData" @on-click="searchDataClick" style="margin-bottom: 20px"></v-search>
    <table-list :data-header="goodsDataHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsListTable"
                :params="params">
    </table-list>
    <v-page :data="page" :dataArr="[params]"></v-page>
    <el-row justify="center" type="flex">
      <el-col :span="3">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
      data () {
        return {
          tableUrl: this.$Api.customPackage.findGoodsGroupByNameAndBrand,
          SearchData: [
            {
              label: '搜索关键字：',
              value: '',
              placeholder: '请输入',
              key: 'name'
            }
          ],
          goodsListTable: 'tab_goodsTable_list',
          params: {},
          goodsDataHeader: [
            {type: 'selection'},
            {prop: 'goodsName', label: '商品名称'},
            {prop: 'brandName', label: '品牌'},
            {prop: 'id', label: '商品主键'},
            {prop: 'typeModel', label: '规格型号'},
            {prop: 'unit', label: '单位'},
            {prop: 'price', label: '价格（市场价）'}
          ],
          page: {
            totalNum: 0,
            currentPage: 1,
            offset: 0,
            refs: 'tab_goodsTable_list'
          }
        }
      },
      props: {
        selectClassItem: {
          type: Object
        }
      },
      methods: {
        onSubmit () {
          this.$bus.emit('selection-change', (data) => {
            let datalist = data()
            console.info(datalist)
            datalist.map((item) => {
              let parmas = {}
              parmas.mealGoodsClassifyId = this.selectClassItem.id
              parmas.goodsId = item.id
              this.saveClassGoods(parmas, item)
            })
          })
        },
        saveClassGoods (parmas, item) {
          this.$Ajax.post({
            url: this.$Api.customPackage.saveClassGoods,
            data: parmas,
            cb: res => {
              if (res.status === 200) {
                this.$emit('AddMeal-getData', res.data.data)
                this.$emit('closeDialog', 'close')
              }
            }
          })
        },
        searchDataClick (res) {
          this.params = res
          this.tableRefresh()
        },
        tableRefresh () {
          this.$Utils.pageUpdateTable([this.params, this.page], this.goodsListTable, this)
        },
        getTableData (data) {
          this.page.totalNum = data.data.total
        }
      }
    }
</script>

<style>
</style>
