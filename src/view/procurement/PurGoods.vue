<template>
  <div>
    <div class="title">分物资查看</div>
    <div>
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <div>
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in dataList.purchasePlanGoodsVOList" :key="index">
          <template slot="title">
            <div class="collapse_title">
              <div class="collapse_title_item">{{item.goodsName}}</div>
              <div class="collapse_title_item" :title="item.typeModel" style="display:inline-block;width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">规格型号:{{item.typeModel}}</div>
              <div class="collapse_title_item">品牌:{{item.brandName}}</div>
              <div class="collapse_title_item">计量单位:{{item.unit}}</div>
              <div class="collapse_title_item">采购数量:{{item.goodsCount}}</div>
              <div class="collapse_title_item">金额:{{item.quotationGoodsMoneyTotal}}</div>
              <div class="collapse_title_item">中标数量:{{item.biddingDesc}}</div>
              <div class="collapse_title_item" :class="[item.stateCode == 60 ? 'color_red' : '']">状态:{{item.stateDisplay}}</div>
            </div>
          </template>
          <single-tb :dataLs="item.quotationGoodsVOList" :id="item.id" @on-item-select="itemSelect"
                     @refresh-data="getTableData"></single-tb>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div style="margin-top: 20px;display: flex;justify-content: center">
      <el-button type="primary" @click="onsubmit" style="margin-left: 50px;">提交审批</el-button>
    </div>
    <!--<div style="margin-top: 20px;display: flex;justify-content: center">-->
    <!--<el-button type="primary" @click="onSave">保存</el-button>-->
    <!--</div>-->
  </div>
</template>


<script>
  import SingleTb from './SingleSelectTb.vue'
  export default {
    components: {SingleTb},
    data () {
      return {
        id: '',
        data: [
          {prop: 'projectName', label: '下单梁场'},
          {prop: 'stateStr', label: '状态'},
          {prop: 'number', label: '采购计划单号'},
          {prop: 'buyUserName', label: '下单人'},
          {prop: 'buyLinkManPhone', label: '联系方式'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'expectedDeliveryTime', label: '期望到货时间'}
        ],
        purchasePlanGoodsVOList: [],
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
      onsubmit () {
        this.$Ajax.post({
          url: this.$Api.procurement.submitInnerAudit,
          data: {
            purchasePlanId: this.id
          },
          cb: res => {
            this.$message(res.data.message)
            if (res.data.result) {
              this.$router.push({name: 'procurementList'})
            }
          }
        })
      },
      getTableData () {
        this.$Ajax.get({
          url: this.$Api.procurement.purchasePlanNewBidQuotationByGoodsList,
          data: {
            params: {
              purchasePlanId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              let json = {}
              this.dataList = res.data.data
              this.purchasePlanGoodsVOList = this.dataList.purchasePlanGoodsVOList
              this.purchasePlanGoodsVOList.map(ntem => {
                json[ntem.id] = ntem
              })
              this.dataList.purchasePlanGoodsVOList = this.dataList.purchasePlanGoodsVOList.map(item => {
                item.quotationGoodsVOList.map = item.quotationGoodsVOList.map(quo => {
                  quo.stateCode = json[quo.listPurchaseGoodsId].stateCode
                  quo.stateDisplay = json[quo.listPurchaseGoodsId].stateDisplay
                  if (quo.approveState === 1) {
                    quo.approveState = '已中标'
                  } else {
                    quo.approveState = '未中标'
                  }
                  return quo
                })
                return item
              })
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
  .title {
    padding-bottom: 10px;
    font-size: 18px;
    border-bottom: 1px solid #e5e5e5;
  }

  .collapse_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .collapse_title_item {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
</style>
<style>
  .pannel .v_list_li {
    float: left;
    width: 33% !important;
  }
  .el-collapse-item__header{
    height: auto !important;
  }
</style>
