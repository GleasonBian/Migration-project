<template>
  <div>
    <div class="title">分物资选择报价</div>
    <div>
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <div>
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in dataList.listPurchaseGoodsList" :key="index">
          <template slot="title">
            <div class="collapse_title">
              <div class="collapse_title_item">{{item.goodsName}}</div>
              <div class="collapse_title_item">规格型号:{{item.model}}</div>
              <div class="collapse_title_item">品牌:{{item.brand}}</div>
              <div class="collapse_title_item">计量单位:{{item.unit}}</div>
              <div class="collapse_title_item">采购数量:{{item.count}}</div>
            </div>
          </template>
          <single-tb :dataLs="item.quotationGoodsVOList" :id = "item.id" @on-item-select="itemSelect"></single-tb>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--<div style="margin-top: 20px;display: flex;justify-content: center">-->
      <!--<el-button type="primary" @click="onSave">保存</el-button>-->
    <!--</div>-->
  </div>
</template>


<script>
  import SingleTb from './SingleSelectTb.vue'
  export default {
    components: { SingleTb },
    data () {
      return {
        id: '',
        data: [
          { prop: 'projectName', label: '下单梁场' },
          { prop: 'stateStr', label: '状态' },
          { prop: 'code', label: '采购单号' },
          { prop: 'userName', label: '下单人' },
          { prop: 'phoneNum', label: '联系方式' },
          { prop: 'createTimeStr', label: '创建时间' },
          { prop: 'expectedTime', label: '期望到货时间' }
        ],
        dataList: {},
        listStyle: {
          class: ['pannel']
        },
        selects: {}
      }
    },
    created () {
      this.id = this.$route.params.id
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.$Ajax.get({
          url: this.$Api.order.newBidQuotationByGoodsList,
          data: {
            params: {
              listPurchaseId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.dataList = res.data.data
            }
          }
        })
      },
      itemSelect (id, item) {
        item.reason = item.reason ? item.reason : ''
        this.selects[id] = item
      },
      onSave () {
        let ls = []
        for (let i in this.selects) {
          ls.push(this.selects[i])
        }
        this.$Ajax.post({
          url: this.$Api.order.saveBidQuotationByGoods,
          data: {
            listPurchaseId: this.id,
            bidQuotationInfos: JSON.stringify(ls)
          },
          cb: res => {
            if (res.status === 200) {
              if (res.data.result) {
                this.$message('保存成功')
                this.$router.back()
              } else {
                this.$message(res.data.message)
              }
            }
          }
        })
      }
    },
    filters: {}
  }
</script>
<style scoped>
  .title{
    padding-bottom: 10px;
    font-size: 18px;
    border-bottom: 1px solid #e5e5e5;
  }
  .collapse_title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .collapse_title_item{
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
</style>
<style>
  .pannel .v_list_li{
    float: left;
    width: 33% !important;
  }
</style>
