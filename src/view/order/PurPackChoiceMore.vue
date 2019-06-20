<template>
  <div>
    <div class="title">按供应商查看</div>
    <div>
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <div class="collapse_title">
      <div class="collapse_title_item" v-if="tbDataList.supplierManagerProviderVO">{{tbDataList.supplierManagerProviderVO.enterpriseName}}</div>
      <div class="collapse_title_item" v-if="tbDataList.supplierManagerProviderVO">{{tbDataList.supplierManagerProviderVO.contactName}}&nbsp; &nbsp;{{tbDataList.supplierManagerProviderVO.contactPhone}}</div>
      <div class="collapse_title_item">报价总额:{{tbDataList.totalGoodsPrice}}</div>
    </div>
    <table-list :data-header="dataHeader" :data-static="tbDataList.quotationGoodsVOList"  :static="tableStatic">
      <template v-slot:reason="scope">
        <el-input v-model="scope.row.reason" :disabled="scope.row.quotationStateCode == 0"></el-input>
      </template>
    </table-list>
    <div style="margin-top: 20px;display: flex;justify-content: center">
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </div>
</template>


<script>
  export default {
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
        tbDataList: {
          supplierManagerProviderVO: {
            contactName: '',
            enterpriseName: ''
          }
        },
        listStyle: {
          class: ['pannel']
        },
        tableStatic: true,
        dataHeader: [
          { prop: 'id', label: '序号' },
          { prop: 'goodsName', label: '商品名称' },
          { prop: 'typeModel', label: '规格型号' },
          { prop: 'brandName', label: '品牌' },
          { prop: 'unit', label: '计量单位' },
          { prop: 'goodsCount', label: '采购数量' },
          { prop: 'unitGoodsPrice', label: '报价' },
          { prop: 'totalGoodsPrice', label: '金额' },
          { prop: 'remark', label: '备注' },
          { prop: 'quotationStateStr', label: '中标状态' },
          { prop: 'reason', label: '中标理由', slot: true }
        ]
      }
    },
    created () {
      this.id = this.$route.params.id
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.$Ajax.get({
          url: this.$Api.order.newBidQuotationByCompanyDetail,
          data: {
            params: {
              quotationId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.dataList = res.data.data.listPurchaseVO
              this.tbDataList = res.data.data.quotationVO
            }
          }
        })
      },
      itemSelect (id, item) {
        this.selects[id] = item
      },
      onSave () {
        let ls = []
        this.tbDataList.quotationGoodsVOList.map(x => {
          ls.push({
            quotationGoodsId: x.id,
            reason: x.reason ? x.reason : ''
          })
        })
        this.$Ajax.post({
          url: this.$Api.order.saveBidQuotationByCompany,
          data: {
            quotationId: this.tbDataList.id,
            bidQuotationInfos: JSON.stringify(ls)
          },
          cb: res => {
            if (res.status === 200) {
              if (res.data.result) {
                this.$message('保存成功')
                this.$router.go(-2)
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
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    background-color: #e5e5e5;
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
