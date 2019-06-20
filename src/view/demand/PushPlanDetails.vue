<template>
    <div>
      <div class="title">采购单详情</div>
      <div class="box">
        <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
      </div>
      <div class="title" style="margin-top: 15px;">商品明细</div>
        <table-list :data-header="dataHeader" :data-static="dataStatic" :refs="tablePerformance" :static="tableStatic">
          <template v-slot:relatedFileVOList="scope">
            <div style="font-size: 12px;" v-if="scope.row.relatedFileVOList.length == 0">没有找到匹配的记录</div>
            <div v-if="scope.row.relatedFileVOList.length > 0">
              <div class="item_img" v-if="scope.row.relatedFileVOList.length > 0"  v-for="(item, index) in scope.row.relatedFileVOList" :key="index" @click="getShowImgPath(item.filePath)">{{ item | itemImg }}</div>
            </div>
          </template>
        </table-list>
        <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
          <img width="100%" :src="popoverImgPath"/>
        </el-dialog>
    </div>
</template>


<script>
  export default {
    data () {
      return {
        id: '', // purcharId
        data: [
          { prop: 'code', label: '采购单编码' },
          { prop: 'stateStr', label: '状态' },
          { prop: 'createTimeStr', label: '创建时间' },
          { prop: 'userName', label: '创建人' },
          { prop: 'phoneNum', label: '创建人手机号码' },
          { prop: 'projectName', label: '梁场名称' },
          { prop: 'expectedTime', label: '期望到货时间' }
        ],
        dataList: {
        },
        listStyle: {
          class: ['pannel']
        },
        tablePerformance: 'table_push_plan_details',
        tableStatic: true,
        dataStatic: [],
        dataHeader: [
          { prop: 'goodsName', label: '品名' },
          { prop: 'model', label: '规格型号' },
          { prop: 'brand', label: '品牌' },
          { prop: 'count', label: '数量' },
          { prop: 'unit', label: '单位' },
          { prop: 'remark', label: '其他要求' },
          { prop: 'pricingAnalysis', label: '定价分析' },
          { prop: 'relatedFileVOList', label: '定价分析依据图片', slot: true },
          { prop: 'stockPrice', label: '进货价格' },
          { prop: 'recommendGoodsPrice', label: '销售价格' },
          { prop: 'priceCompost', label: '价格组成' }
        ],
        imgPath: this.$Api.imgApi,
        popoverImgPath: 'https://gw.alicdn.com/tfs/TB1KF_ybRTH8KJjy0FiXXcRsXXa-890-1186.png',
        dialogVisible: false
      }
    },
    created () {
      this.id = this.$route.params.id
      this.getTableData()
    },
    methods: {
      getTableData () {
        this.$Ajax.get({
          url: this.$Api.order.priceDetail,
          data: {
            params: {
              listPurchaseId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.dataList = res.data.data
              this.dataStatic = res.data.data.listPurchaseGoodsList ? res.data.data.listPurchaseGoodsList : []
            }
          }
        })
      },
      getShowImgPath (item) {
        this.popoverImgPath = item
        this.dialogVisible = true
      },
      handleClose () {
        this.dialogVisible = false
      }
    },
    filters: {
      itemImg (item) {
        return item.fileOldName
      }
    }
  }
</script>
<style scoped>
  .title{
    margin-bottom: 10px;
    font-size: 18px;
    border-left: solid #008aff 4px;
    padding-left: 5px;
  }
  .box{
    padding: 0px 5px;
    border: solid #e5e5e5 1px;
  }
  .item_img{
    font-size: 12px;
    color: #008aff;
  }
  .item_img:hover{
    text-decoration: underline;
    cursor: pointer;
  }
</style>
<style>
  .pannel .v_list_li{
    float: left;
    width: 33% !important;
  }
</style>
