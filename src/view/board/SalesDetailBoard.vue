<template>
  <div>
    <div class="title">清单采购配货</div>
    <div class="box">
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <br>
    <div class="title" style="margin-top: 10px;">备注</div>
    <div class="box" style="font-size: 14px;color: gray;padding: 5px;">{{dataList.remark ? dataList.remark : '无'}}</div>
    <br>
    <div class="title" style="margin-top: 15px;">商品明细</div>
    <table-list :data-header="dataHeader" :data-static="dataStatic" :refs="tablePerformance" :static="tableStatic" v-show="isSalesShow">
      <template slot-scope="scope" slot="relatedFileVOList">
        <div style="font-size: 12px;" v-if="scope.row.relatedFileVOList.length == 0">没有找到匹配的记录</div>
        <div v-if="scope.row.relatedFileVOList.length > 0">
          <div class="item_img" v-if="scope.row.relatedFileVOList.length > 0"  v-for="(item, index) in scope.row.relatedFileVOList" :key="index" @click="getShowImgPath(item.filePath)">{{ item | itemImg }}</div>
        </div>
      </template>
      <template slot-scope="scope" slot="historyPrice">
        <span class="handle" @click="toDetail(scope.row.goodsName, 'sa')">销售交易明细</span>
        <span class="handle" @click="toDetail(scope.row.goodsName, 'pu')">采购交易明细</span>
      </template>
    </table-list>
    <table-list :data-header="dataHeaderPur" :data-static="dataStatic" :refs="tablePerformance" :static="tableStatic" v-show="!isSalesShow">
      <template slot-scope="scope" slot="relatedFileVOList">
        <div style="font-size: 12px;" v-if="scope.row.relatedFileVOList.length == 0">没有找到匹配的记录</div>
        <div v-if="scope.row.relatedFileVOList.length > 0">
          <div class="item_img" v-if="scope.row.relatedFileVOList.length > 0"  v-for="(item, index) in scope.row.relatedFileVOList" :key="index" @click="getShowImgPath(item.filePath)">{{ item | itemImg }}</div>
        </div>
      </template>
      <template slot-scope="scope" slot="historyPrice">
        <span class="handle" @click="toDetail(scope.row.goodsName, 'sa')">销售交易明细</span>
        <span class="handle" @click="toDetail(scope.row.goodsName, 'pu')">采购交易明细</span>
      </template>
    </table-list>
    <div class="text_total_right">共&nbsp;{{totalNum}}&nbsp;类物资，合计采购金额：￥{{goodsPriceTotle}}</div>
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

    <br>
    <div class="title" style="margin-top: 10px;">梁场审批记录</div>
    <table-list :data-header="approvalHeader" :url="approvalUrl" :params="approvalPage" :refs="approvalRef">
    </table-list>
    <br>

    <!-- null -->
    <div>
      <div class="title" style="margin-top: 10px;">销售定价内部审批记录</div>
      <table-list :data-header="approvalHeaderInside" :url="approvalUrlInside" :params="approvalPageInside" :refs="approvalRefInside">
      </table-list>
      <br>
      <div v-show="showOpinionS">
        <div class="title" style="margin-top: 10px;">审批意见<span style="font-size: 12px;">（同意时，选填审批意见；驳回时，必填。）</span></div>
        <div>
          <el-input type="textarea" :rows="4" placeholder="请输入审批意见（200个字以内）" v-model="comment"></el-input>
        </div>
        <div style="margin-top: 20px;display: flex;justify-content: center;align-items: center;">
          <el-button type="primary" @click="onAgree('sa')" style="margin-right: 50px;">同意销售定价</el-button>
          <el-button type="danger" @click="onReject('sr')">驳回销售定价</el-button>
        </div>
      </div>
    </div>

    <!-- ! -->
    <div v-show="!isSalesShow">
      <div class="title" style="margin: 10px 0">采购定价内部审批记录</div>
      <table-list :data-header="approvalHeaderInside" :url="approvalUrlInsidePur" :params="approvalPageInsidePur" :refs="approvalRefInsidePur">
      </table-list>
      <br>
      <div v-show="showOpinionP">
        <div class="title" style="margin-top: 10px;">审批意见<span style="font-size: 12px;">（同意时，选填审批意见；驳回时，必填。）</span></div>
        <div>
          <el-input type="textarea" :rows="4" placeholder="请输入审批意见（200个字以内）" v-model="commentPur"></el-input>
        </div>
        <div style="margin-top: 20px;display: flex;justify-content: center;align-items: center;">
          <el-button type="primary" @click="onAgree('pa')" style="margin-right: 50px;">同意采购定价</el-button>
          <el-button type="danger" @click="onReject('pr')">驳回采购定价</el-button>
        </div>
      </div>
    </div>



    <!--历史价-->
    <!-- <v-dialog :dialog="historyDialog">
      <v-search :data="historyDialogSearchData" @on-click="historyDialogSearchDataClick"></v-search>
      <table-list :data-header="historyDialogHeader" :url="salesUrl" :params="historyDialogPage" :refs="historyDialogDataRefs" @get-table-data="historyDialogGetTableData" v-show="salesUrlShow"></table-list>
      <v-page :data="historyDialogPage" :dataArr="[historyDialogDataSearch]"></v-page>
    </v-dialog> -->
    <!--历史价-->
    <history-dialog :historyDialog="historyDialog" :historyDialogPage="historyDialogPage"
                    :historyDialogDataRefs="historyDialogDataRefs" :isShowHistory="isShowHistory"
                    :historyDialogSearchData="historyDialogSearchData" :historyDialogUrl="historyDialogUrl"></history-dialog>

    <v-dialog :dialog="historyDialogPur">
      <v-search :data="historyDialogSearchDataPur" @on-click="historyDialogSearchDataClickPur"></v-search>
      <table-list :data-header="historyDialogHeader" :url="purchaseUrl" :params="historyDialogPagePur" :refs="historyDialogDataRefsPur" @get-table-data="historyDialogGetTableDataPur" v-show="purchaseUrlShow"></table-list>
      <v-page :data="historyDialogPagePur" :dataArr="[historyDialogDataSearchPur]"></v-page>
    </v-dialog>

  </div>
</template>


<script>
  import historyDialog from '../examine/historyDialog.vue'
  export default {
    components: {historyDialog},
    data () {
      return {
        isSalesShow: true,
        isRejected: false,
        salesUrlShow: false,
        purchaseUrlShow: false,
        approve: '',
        showOpinionS: false,
        showOpinionP: false,
        comment: '',
        commentPur: '',
        approvalHeaderInside: [
          {prop: 'dueTime', label: '更新时间'},
          {prop: 'dueName', label: '审批节点'},
          {prop: 'duePerson', label: '负责人'},
          {prop: 'state', label: '状态'},
          {prop: 'comment', label: '审核意见'}
        ],
        approvalUrlInside: this.$Api.order.listHistoryCommentInner,
        approvalUrlInsidePur: this.$Api.procurement.listHistoryCommentInner,
        approvalPageInside: {id: 0},
        approvalPageInsidePur: {purchasePlanId: 0},
        approvalRefInside: 'price_salesRemark_table_Inside',
        approvalRefInsidePur: 'price_salesRemark_table_Inside_p',
        approvalHeader: [
          {prop: 'dueTime', label: '更新时间'},
          {prop: 'dueName', label: '审批节点'},
          {prop: 'duePerson', label: '负责人'},
          {prop: 'state', label: '状态'},
          {prop: 'comment', label: '审核意见'}
        ],
        approvalUrl: this.$Api.order.listHistoryComment,
        approvalPage: {id: 0},
        approvalRef: 'price_salesRemark_table',
        id: '', // purcharId
        data: [
          { prop: 'code', label: '采购单编码' },
          { prop: 'typeStr', label: '采购类型' },
          { prop: 'createTimeStr', label: '创建时间' },
          { prop: 'userName', label: '创建人' },
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
//          { prop: 'relatedFileVOList', label: '定价分析依据图片', width: '150', slot: true },
          { prop: 'recommendGoodsPrice', label: '世界高铁网价' },
          // { prop: 'taxPoint', label: '税点' },
          // { prop: 'unitPrice', label: '进货价格' },
          // { prop: 'supplierName', label: '供应商' },
          // { prop: 'grossMarginRatio', label: '毛利率' },
          { prop: 'totalGoodsPrice', label: '采购金额' },
          { prop: 'remarkForPrice', label: '备注' },
          {prop: 'historyPrice', label: '历史价', slot: true, width: '250'}
//          { prop: 'priceCompost', label: '价格组成' }
        ],
        dataHeaderPur: [
          { prop: 'goodsName', label: '商品名称' },
          { prop: 'model', label: '规格型号' },
          { prop: 'brand', label: '品牌' },
          { prop: 'count', label: '数量' },
          { prop: 'unit', label: '单位' },
          { prop: 'purpose', label: '用途' },
          { prop: 'remark', label: '其他要求' },
//          { prop: 'relatedFileVOList', label: '定价分析依据图片', width: '150', slot: true },
          { prop: 'recommendGoodsPrice', label: '世界高铁网价' },
          { prop: 'taxPoint', label: '税点' },
          { prop: 'unitPrice', label: '进货价格' },
          { prop: 'grossMarginRatio', label: '毛利率' },
          { prop: 'supplierName', label: '供应商' },
          { prop: 'totalGoodsPrice', label: '采购金额' },
          { prop: 'remarkForPrice', label: '备注' },
          {prop: 'historyPrice', label: '历史价', slot: true, width: '250'}
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
        tablePerformanceImg: 'price_remark_table',
        historyDialog: {
          width: '800px',
          show: false,
          title: '采购日期'
        },
        historyDialogPur: {
          width: '800px',
          show: false,
          title: '交易明细'
        },
        historyDialogHeader: [
          {prop: 'recordTimeStr', label: '采购日期'},
          {prop: 'goodsName', label: '物资名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'unit', label: '计量单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'goodsPrice', label: '单价'},
          {prop: 'totalPrice', label: '金额'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'projectName', label: '梁场名称'}
        ],
        historyDialogUrl: '',
        historyDialogPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          goodsName: '',
          refs: 'table_historyPrice_list'
        },
        historyDialogPagePur: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          goodsName: '',
          refs: 'table_historyPrice_list_pur'
        },
        historyDialogDataRefs: 'table_historyPrice_list',
        historyDialogDataRefsPur: 'table_historyPrice_list_pur',
        historyDialogDataSearch: {},
        historyDialogDataSearchPur: {},
        historyDialogSearchData: [{label: '商品名称', value: '', key: 'goodsName', placeholder: '请输入商品名称'}, {label: '梁场名称：', value: '', placeholder: '请选择', key: 'projectId', select: []}],
        historyDialogSearchDataPur: [{label: '商品名称', value: '', key: 'goodsName', placeholder: '请输入商品名称'}],
        isShowHistory: false,
        salesUrl: this.$Api.order.priceRecord,
        purchaseUrl: this.$Api.procurement.priceRecord,
        purchasePlanVO: {}
      }
    },
    created () {
      this.id = this.$route.params.id
      this.page.purchaseId = this.id
      this.getTableData()
      this.approvalPage.id = this.id
      this.approvalPageInside.id = this.id
      this.approve = this.$route.params.approve
      this.getBeamField()
    },
    methods: {
      getBeamField () {
        this.ajaxPost(this.$Api.orderManger.getProjectList, (res) => {
          if (res.data.result) {
            this.historyDialogSearchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(res.data.data)
              }
            })
          }
        })
      },
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      fliterSelectBeam (res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({label: item.projectName, value: item.id})
          })
        }
        return arrBeam
      },
      onSave () {
        this.myAlert('保存成功', () => {
          this.$router.back()
        })
      },
      onSavePush () {
        let flag = true
        for (let i in this.dataStatic) {
          let obj = this.dataStatic[i]
          if (!obj.pricingAnalysis || obj.recommendGoodsPrice <= 0) {
            flag = false
            break
          }
        }
        if (!flag) {
          this.myAlert('还有信息未填', () => {
          })
          return
        }
        this.$Ajax.post({
          url: this.$Api.order.submitInnerAudit,
          data: {
            listPurchaseId: this.id
          },
          cb: res => {
            this.$message(res.data.message)
            if (res.data.result) {
              this.$router.push({name: 'orderSales'})
            }
          }
        })
      },
      historyDialogGetTableData (data) {
        this.historyDialogPage.totalNum = data.data.total
      },
      historyDialogGetTableDataPur (data) {
        this.historyDialogPagePur.totalNum = data.data.total
      },
      historyDialogSearchDataClick (res) {
        if (res.goodsName === undefined) {
          res.goodsName = ''
        }
        this.historyDialogDataSearch = res
        this.historyDialogPage.goodsName = res.goodsName
        if (JSON.stringify(this.historyDialogDataSearch) === '{}') {
          this.historyDialogPage.offset = 0
          this.historyDialogPage.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.historyDialogPage], this.historyDialogDataRefs, this)
      },
      historyDialogSearchDataClickPur (res) {
        if (res.goodsName === undefined) {
          res.goodsName = ''
        }
        this.historyDialogDataSearchPur = res
        this.historyDialogPagePur.goodsName = res.goodsName
        if (JSON.stringify(this.historyDialogDataSearchPur) === '{}') {
          this.historyDialogPagePur.offset = 0
          this.historyDialogPagePur.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.historyDialogPagePur], this.historyDialogDataRefs, this)
      },
      toDetail (goodsName, type) {
        this.historyDialogSearchData.map(item => {
          if (item.key !== 'goodsName') {
            item.value = ''
          }
        })
        if (type === 'sa') {
          this.historyDialogPage.goodsName = goodsName
          this.historyDialogPage.projectId = ''
          this.historyDialogSearchData[0].value = goodsName
          this.historyDialog.show = true
          this.salesUrlShow = true
          this.purchaseUrlShow = false
          this.$Utils.pageUpdateTable([this.historyDialogPage], this.historyDialogDataRefs, this)
        } else {
          this.historyDialogPagePur.goodsName = goodsName
          this.historyDialogSearchDataPur[0].value = goodsName
          this.historyDialogPur.show = true
          this.salesUrlShow = false
          this.purchaseUrlShow = true
          this.$Utils.pageUpdateTable([this.historyDialogPagePur], this.historyDialogDataRefsPur, this)
        }
      },
      submitApproval (state, type) {
        let url = ''
        let params = {}
        if (type === 'sa' || type === 'sr') {
          url = this.$Api.order.approval
          params = {
            businessId: this.dataList.businessType + this.id,
            comment: this.comment,
            state: state,
            businessType: this.dataList.businessType
          }
        } else {
          url = this.$Api.procurement.approval
          params = {
            businessId: this.purchasePlanVO.businessType + this.purchasePlanVO.id,
            comment: this.commentPur,
            state: state,
            businessType: this.purchasePlanVO.businessType
          }
        }
        this.$Ajax.get({
          url: url,
          data: {
            params: params
          },
          cb: res => {
            this.$message(res.data.message)
            if (res.data.result) {
              location.reload()
            }
          }
        })
      },
      onAgree (type) {
        this.submitApproval(1, type)
      },
      onReject (type) {
        if (type === 'sr' && this.comment !== '') {
          this.submitApproval(0, type)
        } else if (type === 'pr' && this.commentPur !== '') {
          this.submitApproval(0, type)
        } else {
          this.$message.error('请输入审批意见')
        }
      },
      getImgTableData (data) {
        this.page.totalNum = data.data.total
      },
      getTableData () {
        this.$Ajax.get({
          url: this.$Api.order.approvalListPurchase,
          data: {
            params: {
              listPurchaseId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.dataList = res.data.data
              if (this.dataList.state === 10 && this.dataList.currentNodeOnUser) {
                this.showOpinionS = true
              }
              this.dataStatic = res.data.data.listPurchaseGoodsList ? res.data.data.listPurchaseGoodsList : []
              this.goodsPriceTotle = res.data.data.goodsPriceTotle
              this.totalNum = res.data.data.listPurchaseGoodsList.length ? res.data.data.listPurchaseGoodsList.length : 0
              this.purchasePlanVO = res.data.data.purchasePlanVO
              if (this.purchasePlanVO === null) {
                this.isSalesShow = true
              } else {
                this.isSalesShow = false
                this.approvalPageInsidePur.purchasePlanId = this.purchasePlanVO.id
                this.$Utils.pageUpdateTable([this.approvalPageInsidePur], this.approvalRefInsidePur, this)
                if (this.purchasePlanVO.state === 'APPROVING' && this.purchasePlanVO.currentNodeOnUser) {
                  this.showOpinionP = true
                }
              }
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
  .handle {
    font-size: 14px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin-right: 15px;
  }

  .handle:hover {
    text-decoration: underline;
  }
</style>
<style>
  .text_total_right{text-align: right;line-height: 40px;font-size: 14px;}
  .pannel .v_list_li{
    float: left;
    width: 33% !important;
  }
</style>
