<template>
  <div>
    <div class="title">清单采购配货</div>
    <div class="box">
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <div class="title" style="margin-top: 15px;">商品明细</div>
    <table-list :data-header="dataHeader" :data-static="dataStatic" :refs="tablePerformance" :static="tableStatic">
      <template slot-scope="scope" slot="relatedFileVOList">
        <div style="font-size: 12px;" v-if="scope.row.relatedFileVOList.length == 0">没有找到匹配的记录</div>
        <div v-if="scope.row.relatedFileVOList.length > 0">
          <div class="item_img" v-if="scope.row.relatedFileVOList.length > 0"  v-for="(item, index) in scope.row.relatedFileVOList" :key="index" @click="getShowImgPath(item.filePath)">{{ item | itemImg }}</div>
        </div>
      </template>
    </table-list>
    <div class="text_total_right">共&nbsp;{{totalNum}}&nbsp;类物资，合计金额：￥{{goodsPriceTotle}}</div>
    <div class="title" style="margin-top: 10px;">其他资料</div>
    <table-list :data-header="dataImgHeader" :url="imgTableUrl" :params="page" @get-table-data="getImgTableData" :refs="tablePerformanceImg">
      <template slot-scope="scope" slot="fileOldName">
        <div>{{scope.row.fileOldName}}</div>
      </template>
      <template slot-scope="scope" slot="btnDownLoad">
        <el-button size="mini" type="text" @click="getShowImgPath(scope.row)">下载</el-button>
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
          { prop: 'typeStr', label: '采购类型' },
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
        tablePerformance: '',
        tableStatic: true,
        dataStatic: [],
        dataHeader: [
          { prop: 'goodsName', label: '商品名称' },
          { prop: 'model', label: '规格型号' },
          { prop: 'brand', label: '品牌' },
          { prop: 'count', label: '数量' },
          { prop: 'unit', label: '单位' },
          { prop: 'purpose', label: '用途' },
          { prop: 'remark', label: '其他要求' },
          { prop: 'marketPrice', label: '项目调查价' },
          { prop: 'pricingAnalysis', label: '第三方报价' },
//          { prop: 'relatedFileVOList', label: '定价分析依据图片', slot: true },
          { prop: 'recommendGoodsPrice', label: '世界高铁网价' },
          { prop: 'stockPrice', label: '进货价格' },
          { prop: 'totalGoodsPrice', label: '采购金额' },
          { prop: 'remarkForBid', label: '备注' }
//          { prop: 'priceCompost', label: '价格组成' }
        ],
        imgPath: this.$Api.imgApi,
        popoverImgPath: 'https://gw.alicdn.com/tfs/TB1KF_ybRTH8KJjy0FiXXcRsXXa-890-1186.png',
        dialogVisible: false,
        goodsPriceTotle: '',
        totalNum: '',
        dataImgHeader: [
          { prop: 'fileOldName', label: '文件名称', slot: true },
          { prop: 'fileSize', label: '文件大小' },
          { prop: 'btnDownLoad', label: '操作', slot: true }
        ],
        imgTableUrl: this.$Api.order.getVoucherList,
        page: {
          purchaseId: '',
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'price_remark_table'
        },
        tablePerformanceImg: 'price_remark_table'
      }
    },
    created () {
      this.id = this.$route.params.id
      this.page.purchaseId = this.id
      this.getTableData()
    },
    methods: {
      getImgTableData (data) {
        this.page.totalNum = data.data.total
      },
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
              this.goodsPriceTotle = res.data.data.goodsPriceTotle
              this.totalNum = res.data.data.listPurchaseGoodsList.length ? res.data.data.listPurchaseGoodsList.length : 0
            }
          }
        })
      },
      getShowImgPath (item) {
        location.href = this.$Api.order.downloadrelatedFile + '/' + item.id
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
  .text_total_right{text-align: right;line-height: 40px;font-size: 14px;}
  .pannel .v_list_li{
    float: left;
    width: 33% !important;
  }
</style>
