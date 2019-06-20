<template>
  <div>
    <div class="title">清单采购配货</div>
    <div class="box"><v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list></div>
    <!----------------------------------------------------------分割线----------------------------------------------->
    <div class="title" style="margin-top: 15px;">待配货商品</div>
    <div class="choice">
      <!--<div class="handle">分类物资选择报价</div>-->
      <!--<div class="handle">整包选择报价</div>-->
      <el-button type="primary" @click="purGoodsChoice">分物资查看</el-button>
      <el-button type="primary" @click="purPackChoice">按供应商查看</el-button>
    </div>
    <table-list :data-header="dataHeader" :data-static="dataStatic"  :static="tableStatic">
      <template v-slot:relatedFileVOList="scope">
        <!--<cell-upload :data-list1="scope.row.relatedFileVOList"  :goods-id="scope.row.id" @on-success="cellOnSuccess" @on-show="onShowImg"></cell-upload>-->
        <div style="font-size: 12px;" v-if="scope.row.relatedFileVOList.length == 0">没有找到匹配的记录</div>
        <div v-if="scope.row.relatedFileVOList.length > 0">
          <div class="item_img1" v-if="scope.row.relatedFileVOList.length > 0"  v-for="(item, index) in scope.row.relatedFileVOList" :key="index" @click="getShowImgPath(item.filePath, 1)">
            <el-tooltip :content="item | itemImg" placement="top">
              <div class="item_img1">{{ item | itemImg }}</div>
            </el-tooltip>
          </div>
        </div>
      </template>
      <template v-slot:handle="scope">
        <!--<span class="handle" @click="delItem1(scope.row.id)">删除</span>-->
      </template>
    </table-list>
    <div class="text_total_right">共&nbsp;{{totalNum}}&nbsp;类物资，合计金额：￥{{goodsPriceTotle}}</div>
    <!--分割线-->
    <div class="title" style="margin-top: 10px;">其他资料</div>
    <table-list :data-header="dataImgHeader" :url="imgTableUrl" :params="page" @get-table-data="getImgTableData" :refs="tablePerformance" @selection-change="selectionChange">
      <template v-slot:fileOldName="scope">
        <div>{{scope.row.fileOldName}}</div>
      </template>
      <template v-slot:btnDownLoad="scope">
        <el-button size="mini" type="text" @click="getShowImgPath(scope.row)">下载</el-button>
      </template>
    </table-list>
    <v-page :data="page"></v-page>
    <!--分割线-->
    <div class="title" style="margin-top: 10px;">备注</div>
    <div class="box" style="font-size: 14px;color: gray;padding: 5px;">{{dataList.remark}}</div>
    <!----------------------------------------------分割线--上传----------------------------------------------->
    <div style="margin-top: 20px;display: flex;justify-content: center;align-items: center;">
      <el-button type="primary" @click="onSave">仅保存</el-button>
    </div>
  </div>
</template>


<script>
  import CellUpload from './CellUpload.vue'
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
        tablePerformance: 'price_remark_table',
        tableStatic: true,
        TabButData: [{
          text: '上传',
          key: 'add'
        }, {
          text: '删除所选',
          key: 'del'
        }],
        uploadData2: {
          name: 'file',
          src: '',
          showFileList: false,
          url: this.$Api.order.uploadImage,
          custom: true
        },
        imgTableUrl: this.$Api.order.getVoucherList,
        dataImgHeader: [
          { type: 'selection' },
          { prop: 'fileOldName', label: '文件名称', slot: true },
          { prop: 'fileSize', label: '文件大小' },
          { prop: 'btnDownLoad', label: '操作', slot: true }
        ],
        dataImgStatic: [],
        page: {
          purchaseId: '',
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'price_remark_table'
        },
        selection: [],
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
//          { prop: 'relatedFileVOList', label: '定价分析依据图片', width: '150', slot: true },
          { prop: 'recommendGoodsPrice', label: '世界高铁网价' },
          { prop: 'stockPrice', label: '进货价格' },
          { prop: 'totalGoodsPrice', label: '采购金额' },
          { prop: 'remarkForPrice', label: '备注' }
//          { prop: 'priceCompost', label: '价格组成' }
        ],
        dataStatic: [],
        imgPath: this.$Api.imgApi,
        popoverImgPath: 'https://gw.alicdn.com/tfs/TB1KF_ybRTH8KJjy0FiXXcRsXXa-890-1186.png',
        dialogVisible: false,
        goodsPriceTotle: '',
        totalNum: ''
      }
    },
    created () {
      this.id = this.$route.params.id
      this.page.purchaseId = this.id
      this.uploadData2.url = this.uploadData2.url + '/' + this.id
      this.getTableData()
    },
    methods: {
      getImgTableData (data) {
        this.page.totalNum = data.data.total
      },
      purGoodsChoice () {
        this.$router.push({ name: 'purGoodsChoice', params: { id: this.id } })
      },
      purPackChoice () {
        this.$router.push({ name: 'purPackChoice', params: { id: this.id } })
      },
      delRecord () {
        if (this.selection.length <= 0) {
          this.$message('还没有选择图片')
        }
        let imgsId = []
        this.selection.map(x => {
          imgsId.push(x.id)
        })
        this.$Ajax.post({
          url: this.$Api.order.deleteVoucher,
          data: {
            ids: imgsId
          },
          cb: res => {
            if (res.status === 200) {
              this.$Utils.pageUpdateTable([this.page], this.tablePerformance, this)
            }
          }
        })
      },
      cellOnSuccess () {
        this.getTableData()
      },
      selectionChange (selection) {
        this.selection = selection
      },
      pricingAnalysisChange (id, pricingAnalysis) {
        this.$Ajax.post({
          url: this.$Api.order.saveThisPricingAnalysis,
          data: {
            id: id,
            pricingAnalysis: pricingAnalysis
          },
          cb: res => {
            if (res.status === 200) {
              this.getTableData()
            }
          }
        })
      },
      myAlert (msg, myCallback) {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          myCallback()
        }).catch(() => {
        })
      },
      delItem1 (id) {
        this.myAlert('确定要删除这条记录吗？', () => {
          this.delItem(id)
        })
      },
      delItem (id) {
        this.$Ajax.get({
          url: this.$Api.order.deleteListPurchaseGoodsById,
          data: {
            params: {
              listPurchaseGoodsId: id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.$message('删除成功')
              this.getTableData()
            }
          }
        })
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
      onUploadSuccess (res, file, fileList) {
        this.$Utils.pageUpdateTable([this.page], this.tablePerformance, this)
      },
      onShowImg (item) {
        this.popoverImgPath = item
        this.dialogVisible = true
      },
      getShowImgPath (item) {
        location.href = this.$Api.order.downloadrelatedFile + '/' + item.id
      },
      handleClose () {
        this.dialogVisible = false
      },
      onSave () {
        this.$alert('保存成功!', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: '保存成功'
            })
          }
        })
      }
    },
    filters: {
      itemImg (item) {
        return item.fileOldName
      }
    },
    components: { CellUpload }
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
    min-height: 30px;
  }
  .choice {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    height: 50px;
    align-items: center;
  }
  .item_img{
    font-size: 14px;
    color: #008aff;
  }
  .item_img1{
    font-size: 14px;
    color: #008aff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
    width: 120px;
  }
  .item_img1:hover{
    text-decoration: underline;
    cursor: pointer;
  }
  .item_img:hover{
    text-decoration: underline;
    cursor: pointer;
  }
  .handle{
    font-size: 14px;
    color: #008aff;
    cursor:pointer;
    text-decoration: none;
  }
  .handle:hover{
    text-decoration: underline;
  }
</style>
<style>
  .text_total_right{text-align: right;line-height: 40px;font-size: 14px;}
  .pannel .v_list_li{
    float: left;
    width: 33% !important;
  }
  .upload .el-button{
    padding: 5px 5px !important;
  }
  .upload .avatar-uploader .el-upload {
    border: none;
    border-radius: 0px;
  }
</style>
