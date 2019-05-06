<template>
  <div>
    <div class="title">基本信息</div>
    <div class="box">
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
      <v-list :data="dataRemark" :data-list="dataListRemark" :list-style="listStyleRemark"></v-list>
    </div>
    <!--收货信息-->
    <div class="orderTitle"   @click="show"><span :class="orderShow ?'tranlateTitle':''"></span>收货信息</div>
    <div class="box">
      <v-list v-show="orderShow" :data="goodsData" :data-list="dataList" :list-style="listStyle">
      </v-list>
    </div>
    <!--发票信息-->
    <div class="orderTitle" @click="show1"><span :class="orderShow1 ?'tranlateTitle':''"></span >发票信息</div>
    <div class="box">
      <v-list v-show="orderShow1" :data="InvoiceData" :data-list="dataList.invoiceVO" :list-style="listStyle"></v-list>
    </div>
    <div class="title" style="margin-top: 15px;">商品明细</div>
    <table-list :data-header="dataHeader" :data-static="dataStatic" :refs="tablePerformance" :static="tableStatic">
      <template slot-scope="scope" slot="returnTypeDisplay">
        <span :title="scope.row.returnChangeReason">{{scope.row.returnTypeDisplay}}</span>
      </template>
      <template slot-scope="scope" slot="matchDegree">
        <div v-if="scope.row.matchDegree">{{scope.row.matchDegree}}%</div>
        <div v-else>0%</div>
      </template>
      <template slot-scope="scope" slot="contractGoodsFlag">
        {{scope.row.contractGoodsFlag ? '是' : '否'}}
      </template>
      <template slot-scope="scope" slot="materialState">
        <div class="color_red" v-if="scope.row.rejectFlag === 1">
          {{scope.row.materialStateDisplay}}({{scope.row.countReject}})
        </div>
        <div v-else>{{scope.row.materialStateDisplay}}</div>
      </template>
      <template slot-scope="scope" slot="relatedFileVOList">
        <div style="font-size: 12px;" v-if="scope.row.relatedFileVOList.length == 0">没有找到匹配的记录</div>
        <div v-if="scope.row.relatedFileVOList.length > 0">
          <div class="item_img" v-if="scope.row.relatedFileVOList.length > 0"
               v-for="(item, index) in scope.row.relatedFileVOList" :key="index" @click="getShowImgPath(item.filePath)">
            {{ item | itemImg }}
          </div>
        </div>
      </template>
      <template slot-scope="scope" slot="examine">
        <span class="handle" @click="toDismissal(scope.row)">审批记录</span>
      </template>
      <template slot-scope="scope" slot="historyPrice">
        <span class="handle" @click="toDetail(scope.row.goodsName)">历史价</span>
        <span v-if="$Utils.getPageElement($Consts.PERMISSION.editPurchaseList.code)" class="handle" @click="editPrice(scope.row)">修改价格</span>
      </template>
    </table-list>
    <div class="text_total_right">共&nbsp;{{totalNum}}&nbsp;类物资，合计金额：￥{{goodsPriceTotle}}</div>
    <div class="title" style="margin-top: 10px;">其他资料</div>
    <table-list :data-header="dataImgHeader" :url="imgTableUrl" :params="page" @get-table-data="getImgTableData"
                :refs="tablePerformanceImg">
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
    <!--<div v-show="showOpinion">-->
    <!--<div class="title" style="margin-top: 10px;">审批意见<span style="font-size: 12px;">（同意时，选填审批意见；驳回时，必填。）</span></div>-->
    <!--<div>-->
    <!--<el-input type="textarea" :rows="4" placeholder="请输入审批意见（200个字以内）" v-model="comment"></el-input>-->
    <!--</div>-->
    <!--<div style="margin-top: 20px;display: flex;justify-content: center;align-items: center;">-->
    <!--<el-button type="primary" @click="onAgree" style="margin-right: 50px;">同意</el-button>-->
    <!--<el-button type="danger" @click="onReject">驳回</el-button>-->
    <!--</div>-->
    <!--</div>-->

    <!--历史价-->
    <!-- <v-dialog :dialog="historyDialog">
      <v-search :data="historyDialogSearchData" @on-click="historyDialogSearchDataClick"></v-search>
      <table-list :data-header="historyDialogHeader" :url="historyDialogUrl" :params="historyDialogPage" :refs="historyDialogDataRefs" @get-table-data="historyDialogGetTableData" v-show="isShowHistory"></table-list>
      <v-page :data="historyDialogPage" :dataArr="[historyDialogDataSearch]"></v-page>
    </v-dialog> -->
    <!--历史价-->
    <history-dialog :historyDialog="historyDialog" :historyDialogPage="historyDialogPage"
                    :historyDialogDataRefs="historyDialogDataRefs" :isShowHistory="isShowHistory"
                    :historyDialogSearchData="historyDialogSearchData"
                    :historyDialogUrl="historyDialogUrl"></history-dialog>
    <v-dialog :dialog="priceDialog">
      <form-group :data="priceDialogData" :dataBut="dataBut" @on-cancel="cancelPrice" :custom="true"
                  @on-ok="onPriceSave"></form-group>
    </v-dialog>
    <!-- 审批记录 -->
    <v-dialog :dialog="dialogDataView" @on-cancel="viewCancel">
      <div>物资名称：{{goodsName}}</div>
      <br/>
      <table-list :data-header="dataHeaderView" :url="tabUrlView" :params="pageView" @get-table-data="getTableDataView"
                  :refs="tablePerformanceView"></table-list>
      <v-page :data="pageView" :dataArr="[]"></v-page>
    </v-dialog>
  </div>
</template>


<script>
  import historyDialog from '../examine/historyDialog.vue'
  export default {
    components: {historyDialog},
    data () {
      return {
        isDistribution: false,
        approve: '',
        showOpinion: false,
        comment: '',
        approvalHeaderInside: [
          {prop: 'dueTime', label: '更新时间'},
          {prop: 'dueName', label: '审批节点'},
          {prop: 'duePerson', label: '负责人'},
          {prop: 'state', label: '状态'},
          {prop: 'comment', label: '审核意见'}
        ],
        approvalUrlInside: this.$Api.order.listHistoryCommentInner,
        approvalPageInside: {id: 0},
        approvalRefInside: 'price_salesRemark_table_Inside',
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
          {prop: 'code', label: '采购单号'},
          {prop: 'planSourceDisplay', label: '计划来源'},
          {prop: 'stateStr', label: '采购状态'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'organisation', label: '所属组织'},
          {prop: 'typeStr', label: '物资类型'},
          {prop: 'lubanPlanCode', label: '鲁班计划'},
          {prop: 'orderAccount', label: '下单账号'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'userName', label: '创建人'},
//          {prop: 'phoneNum', label: '创建人手机号码'},
          {prop: 'expectedTime', label: '期望到货时间'}
        ],
        dataList: {},
        listStyle: {
          class: ['pannel']
        },
        dataRemark: [
          {prop: 'remark', label: '备注'}
        ],
        dataListRemark: {},
        listStyleRemark: {
          class: ['width_100%'],
          listwidth: '42px'
        },
        tablePerformance: '',
        tableStatic: true,
        dataStatic: [],
        dataHeader: [
          {prop: 'skuId', label: '商品编号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'count', label: '数量'},
          {prop: 'unit', label: '单位'},
          {prop: 'purpose', label: '用途'},
          {prop: 'pricingAnalysis', label: '定价说明'},
          {prop: 'remarkForPrice', label: '其他要求'},
          {prop: 'purchaseRemark', label: '采购备注'},
          {prop: 'contractGoodsFlag', label: '是否为合同物资', slot: true},
          {prop: 'quotationEnumDisplay', label: '报价类型'},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
          {prop: 'marketPrice', label: '项目调查价'},
//          {prop: 'pricingAnalysis', label: '第三方报价'},
//          { prop: 'relatedFileVOList', label: '定价分析依据图片', width: '150', slot: true },
          {prop: 'recommendGoodsPrice', label: '世界高铁网价'},
          {prop: 'stockPrice', label: '进货价格'},
          {prop: 'materialState', label: '物资状态', slot: true},
          {prop: 'totalGoodsPrice', label: '采购金额'},
          {prop: 'saleGuidancePrice', label: '销售指导价'},
          {prop: 'matchDegree', label: '匹配度', slot: true},
//          {prop: 'remark', label: '销售备注'},
          {prop: 'examine', label: '审批记录', slot: true},
          {prop: 'historyPrice', label: '操作', slot: true}
//          { prop: 'priceCompost', label: '价格组成' }
        ],
        imgPath: this.$Api.imgApi,
        popoverImgPath: 'https://gw.alicdn.com/tfs/TB1KF_ybRTH8KJjy0FiXXcRsXXa-890-1186.png',
        dialogVisible: false,
        goodsPriceTotle: '',
        totalNum: '',
        dataImgHeader: [
          {prop: 'fileOldName', label: '文件名称', slot: true},
          {prop: 'fileSize', label: '文件大小'},
          {prop: 'btnDownLoad', label: '操作', slot: true}
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
        historyDialogUrl: this.$Api.order.priceRecord,
        historyDialogPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          goodsName: '',
          refs: 'table_historyPrice_list'
        },
        historyDialogDataRefs: 'table_historyPrice_list',
        historyDialogDataSearch: {},
        historyDialogSearchData: [{label: '商品名称', value: '', key: 'goodsName', placeholder: '请输入商品名称'}, {
          label: '梁场名称：',
          value: '',
          placeholder: '请选择',
          key: 'projectId',
          select: []
        }],
        isShowHistory: false,
        priceDialog: {
          width: '400px',
          show: false,
          title: '修改价格'
        },
        priceDialogData: {
          from: [
            {
              prop: 'price',
              label: '价格：',
              type: 'number',
              value: '',
              labelWidth: '120px'
            },
            {
              prop: 'pricingAnalysis',
              label: '定价说明：',
              value: '',
              labelWidth: '120px'
            },
            {
              prop: 'updateReason',
              label: '修改原因：',
              value: '',
              labelWidth: '120px',
              required: true,
              rules: [{required: true, message: '请填写修改原因', trigger: 'blur,change'}]
            }
          ]
        },
        dataBut: [{text: '取消', key: 'cancel'}, {text: '提交', key: 'ok', type: 'primary'}],
        priceGoodsId: '',
        dialogDataView: {show: false, title: '物资审批记录', width: '700px'},
        dataHeaderView: [
          {prop: 'createTimeStr', label: '更新时间'},
          {prop: 'nodeName', label: '审批节点'},
          {prop: 'createrName', label: '姓名'},
          {prop: 'appstateDisplay', label: '审批状态'},
          {prop: 'remark', label: '审批意见'}
        ],
        tabUrlView: this.$Api.examine.queryGoodsApprovalRecord,
        pageView: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          refs: 'supply_chain_table_examine'
        },
        tablePerformanceView: 'supply_chain_table_examine',
        goodsName: '',
        goodsData: [
          {label: '收货人', prop: 'expressLinkMan'},
          {label: '联系电话', prop: 'expressLinkManPhone'},
          {label: '收货地址', prop: 'expressAddress'}
        ],
        InvoiceData: [
          {label: '发票类型', prop: 'invoiceTypeString'},
          {label: '纳税人识别号', prop: 'taxpayCode'},
          {label: '单位名称', prop: 'companyName'},
          {label: '开户银行账户', prop: 'accountNumber'},
          {label: '开户银行', prop: 'openAccount'},
          {label: '注册电话', prop: 'registryPhone'},
          {label: '注册地址', prop: 'registryAddress'},
          {label: '收票人姓名', prop: 'receiverName'},
          {label: '收票人手机', prop: 'receiverPhone'},
          {label: '收票人地址', prop: 'receiverAddr'}
        ],
        orderShow: false,
        orderShow1: false
      }
    },
    created () {
      this.id = this.$route.params.id
      this.page.purchaseId = this.id
      this.getTableData()
      this.approvalPage.id = this.id
      this.approvalPageInside.id = this.id
      this.approve = this.$route.params.approve
      if (this.approve === '1') {
        this.showOpinion = true
      }
      this.getBeamField()
    },
    methods: {
      show () {
        this.orderShow = !this.orderShow
      },
      show1 () {
        this.orderShow1 = !this.orderShow1
      },
      toDismissal (res) {
        this.goodsName = res.goodsName
        this.dialogDataView.show = true
        this.pageView.goodsId = res.id
        this.pageView.typeCode = 2
        this.$Utils.pageUpdateTable([[], this.pageView], this.tablePerformanceView, this)
      },
      viewCancel () {
        this.dialogDataView.show = false
      },
      getTableDataView (data) {
        this.pageView.totalNum = data.data.total
      },
      editPrice (row) {
        this.priceGoodsId = row.id
        this.priceDialog.show = true
      },
      cancelPrice () {
        this.$bus.emit('form-clear')
        this.priceDialog.show = false
      },
      onPriceSave (res) {
        let params = {
          goodsId: this.priceGoodsId,
          price: res.price,
          pricingAnalysis: res.pricingAnalysis,
          updateReason: res.updateReason
        }
        this.$Ajax.post({
          url: this.$Api.order.updatePrice,
          data: params,
          cb: res => {
            if (res.data.result) {
              this.$message('修改成功')
              this.$bus.emit('form-clear')
              this.priceDialog.show = false
              this.getTableData()
            }
          }
        })
      },
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
      toDetail (goodsName) {
        this.historyDialogSearchData.map(item => {
          if (item.key !== 'goodsName') {
            item.value = ''
          }
        })
        this.historyDialogPage.goodsName = goodsName
        this.historyDialogPage.projectId = ''
        this.historyDialogSearchData[0].value = goodsName
        this.$Utils.pageUpdateTable([this.historyDialogPage], this.historyDialogDataRefs, this)
        this.isShowHistory = true
        this.historyDialog.show = true
      },
      submitApproval (state) {
        this.$Ajax.get({
          url: this.$Api.order.approval,
          data: {
            params: {
              businessId: this.dataList.businessType + this.id,
              comment: this.comment,
              state: state,
              businessType: this.dataList.businessType
            }
          },
          cb: res => {
            this.$message(res.data.message)
            if (res.data.result) {
              this.$router.push({name: 'orderSales'})
            }
          }
        })
      },
      onAgree () {
        this.submitApproval(1)
      },
      onReject () {
        if (this.comment !== '') {
          this.submitApproval(0)
        } else {
          this.$message.error('请输入审批意见')
        }
      },
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
            if (res.data.result) {
              this.dataList = res.data.data
              console.log()
              if (this.dataList.state === 0) {
                this.isDistribution = true
                this.showOpinion = false
              }
              if (this.dataList.state === 10) {
                this.showOpinion = true
              }
              this.dataStatic = res.data.data.listPurchaseGoodsList ? res.data.data.listPurchaseGoodsList : []
              this.goodsPriceTotle = res.data.data.goodsPriceTotle
              this.totalNum = res.data.data.listPurchaseGoodsList.length ? res.data.data.listPurchaseGoodsList.length : 0
            }
          }
        })
      },
      getShowImgPath (item) {
        if (this.dataList.planSourceCode === 40) {
          location.href = item.lubanPath
        } else {
          location.href = this.$Api.order.downloadrelatedFile + '/' + item.id
        }
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
  .title {
    margin-bottom: 10px;
    font-size: 18px;
    border-left: solid #008aff 4px;
    padding-left: 5px;
  }

  .box {
    padding: 0px 5px;
    border: solid #e5e5e5 1px;
  }

  .item_img {
    font-size: 12px;
    color: #008aff;
  }

  .item_img:hover {
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
  .orderTitle{
    height: 48px;
    background: rgba(250, 250, 250, 1);
    border: 1px solid rgba(233, 233, 233, 1);
    border-radius: 2px;
    line-height: 48px;
    position: relative;
    text-indent: 45px;
    margin-top:10px;
  }
  .orderTitle span{
    position: absolute;
    left: 25px;
    top:18px;
    width: 0;
    height:0;
    border:6px solid transparent;
    border-left-color:rgba(0, 0, 0, 0.6);
    transition:all 0.3s linear;
  }
  .tranlateTitle{
    transform: rotate(90deg);
    transition:all 0.3s linear;
  }
</style>
<style>
  .text_total_right {
    text-align: right;
    line-height: 40px;
    font-size: 14px;
  }

  .pannel .v_list_li {
    float: left;
    width: 33% !important;
  }
</style>
