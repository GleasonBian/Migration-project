<template>
  <div>
    <div class="title">采购计划详情</div>
    <div class="box">
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
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
    <br>
    <br>
    <div style="overflow: hidden;" v-if="dataList.stateCode !== 10">
      <tab-but :data="getTabButTable()" @onPush="onPush" @toCheckTime="toCheckTime" @toDeleteData="toDeleteData"
               style="float: left;"></tab-but>
      <tab-but :data="tabButTableOffer" @purPackChoice="purPackChoice" @purGoodsChoice="purGoodsChoice"
               style="float: right;"></tab-but>
    </div>
    <table-list :data-header="dataGoodsHeader" :url="goodsTableUrl" :params="pageGoods" @get-table-data="goodsTableData"
                :refs="refGoods" @selection-change="selectionChange">
      <template slot-scope="scope" slot="returnTypeDisplay">
        <span :title="scope.row.returnChangeReason">{{scope.row.returnTypeDisplay}}</span>
      </template>
      <template slot-scope="scope" slot="matchDegree">
        <div v-if="scope.row.matchDegree">{{scope.row.matchDegree}}%</div>
        <div v-else>0%</div>
      </template>
      <template slot-scope="scope" slot="remark">
        <el-input v-model="scope.row.remark"
                  @change="remarkChange(scope.row.id, scope.row.remark)"></el-input>
      </template>
      <template slot-scope="scope" slot="purchaseRemark">
        <el-input v-model="scope.row.purchaseRemark"
                  @change="purchaseRemarkChange(scope.row.id, scope.row.purchaseRemark)"></el-input>
      </template>
      <template slot-scope="scope" slot="stateDisplay">
        <span :class="[scope.row.stateCode == 60 ? 'color_red' : '']">{{scope.row.stateDisplay}}</span>
      </template>
      <template slot-scope="scope" slot="purchaseGuidancePrice">
        <el-input type="number" v-model="scope.row.purchaseGuidancePrice" @wheel.native.prevent
                  @change="recommendPriceChange(scope.row.id, scope.row.purchaseGuidancePrice)"></el-input>
      </template>
      <template slot-scope="scope" slot="historyPrice">
        <span class="handle" @click="toDetail(scope.row.goodsName)">历史价</span>
      </template>
      <template slot-scope="scope" slot="examine">
        <a class="handle" :class="[!scope.row.rejectFlag ? '' : 'text_red']" @click="toDismissal(scope.row)">审批记录</a>
      </template>
      <template slot-scope="scope" slot="handle">
        <span class="handle" @click="toEdit(scope.row)">编辑物资</span>
      </template>
    </table-list>
    <v-page :data="pageGoods"></v-page>
    <br>

    <!-----------------------------供应商列表---------------------------------->
    <!--<el-button type="primary" style="margin: 10px 0px;" @click="showPurchaseDialog">新增供应商</el-button>-->
    <!--<div class="purchase_item">-->
    <!--<el-collapse accordion>-->
    <!--<el-collapse-item v-for="(item, index) in dataStaticLs" :key="index">--><!--<template slot="title">-->
    <!--<div class="header_title">-->
    <!--<div class="header_title_item">{{item.companyName}}</div>-->
    <!--<div class="header_title_item">{{item.operatorName}}</div>-->
    <!--<div class="header_title_item">报价总额:{{item | totalPrice}}</div>-->
    <!--</div>-->
    <!--</template>-->
    <!--<div>-->
    <!--<table-list :data-header="dataHeader" :data-static="item.quotationGoodsVOList"  :static="tableStatic">-->
    <!--<template slot-scope="scope" slot="unitGoodsPrice">-->
    <!--<el-input type="number" v-model="scope.row.unitGoodsPrice"></el-input>-->
    <!--</template>-->
    <!--<template slot-scope="scope" slot="totalGoodsPrice">-->
    <!--<span>{{scope.row | itemTotal($Utils)}}</span>-->
    <!--</template>-->
    <!--</table-list>-->
    <!--</div>-->
    <!--<div style="margin: 10px 0px;">-->
    <!--<el-button type="primary" @click="showImportDialog(item.id)">导入报价</el-button>-->
    <!--<el-button type="primary" @click="viewMore(item.id)">查看更多</el-button>-->
    <!--</div>-->
    <!--</el-collapse-item>-->
    <!--</el-collapse>-->
    <!--</div>-->
    <!-----------------------------保存---------------------------------->
    <!--<div style="margin-top: 20px;display: flex;justify-content: center">-->
    <!--<el-button type="primary" @click="onSave">保存</el-button>-->
    <!--</div>-->

    <!-----------------------------新增供应商弹框---------------------------------->
    <v-dialog :dialog="purchaseDialog">
      <v-search :data="searchData" @on-click="search"></v-search>
      <table-list :data-header="pDataHeader" :url="pTabUrl" :params="page" @get-table-data="getTableData"
                  :refs="tablePerformance">
        <template slot-scope="scope" slot="handle">
          <a class="add_item" @click="addPurchaseItem(scope.row.id)"
             v-loading.fullscreen.lock="fullscreenLoading">添加</a>
        </template>
      </table-list>
      <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    </v-dialog>
    <!-----------------------------导入报价弹框---------------------------------->
    <v-dialog :dialog="importDialog" :dialogFooter="importFooterDialog" @on-ok="importOkDialog">
      <div>说明：请先下载模板,并按照模板格式填写内容,然后选择上传图片或表格;<a style="color: #3a8ee6" :href="downLoadUrl">下载模板</a></div>
      <div style="display: flex; margin-top: 20px">
        <div style="margin-top: 8px; margin-right: 20px">选择文件</div>
        <div class="uploadBtn">
          <v-upload :data="uploadData" :customBeforeUpload="customBeforeUpload" @on-success="uploadSuccess">
            <div>
              <el-button size="small" type="primary">点击上传</el-button>
            </div>
          </v-upload>
        </div>
      </div>
    </v-dialog>
    <!-----------------------------设置截止时间---------------------------------->
    <v-dialog :dialog="dateDialog">
      <form-group :data="dataFormDate" :data-but="dataButDate" @on-ok="checkDate" :custom=true>
      </form-group>
    </v-dialog>

    <div class="title" style="margin-top: 10px;">其他资料</div>
    <table-list :data-header="dataImgHeader" :url="imgTableUrl" :params="pageInfo" @get-table-data="getImgTableData"
                :refs="tablePerformanceImg">
      <template slot-scope="scope" slot="fileOldName">
        <div>{{scope.row.fileOldName}}</div>
      </template>
      <template slot-scope="scope" slot="btnDownLoad">
        <el-button size="mini" type="text" @click="getShowImgPath(scope.row)">下载</el-button>
      </template>
    </table-list>
    <v-page :data="pageInfo"></v-page>


    <div style="margin-top: 20px;display: flex;justify-content: center" v-show="!showOpinion">
      <el-button type="primary" @click="toClose" v-if="dataList.stateCode !== 10">关闭询价</el-button>
      <!--<el-button type="primary" @click="onsubmit" style="margin-left: 50px;">{{txtBtn}}</el-button>-->
      <!--<el-button type="primary" @click="onsubmit" v-show="showBtn" style="margin-left: 50px;">{{txtBtn}}</el-button>-->
    </div>

    <br>
    <div v-show="showOpinion">
      <div class="title" style="margin-top: 10px;">审批意见<span style="font-size: 12px;">（同意时，选填审批意见；驳回时，必填。）</span></div>
      <div>
        <el-input type="textarea" :rows="4" placeholder="请输入审批意见（200个字以内）" v-model="comment"></el-input>
      </div>
      <div style="margin-top: 20px;display: flex;justify-content: center;align-items: center;">
        <el-button type="primary" @click="onsubmit" v-show="showBtn" style="margin-right: 50px;">{{txtBtn}}</el-button>
        <el-button type="primary" @click="onAgree" style="margin-right: 50px;" v-show="isRejected">同意</el-button>
        <el-button type="danger" @click="onReject" v-show="isRejected">驳回</el-button>
      </div>
    </div>

    <!--历史价-->
    <!-- <v-dialog :dialog="historyDialog">
      <v-search :data="historyDialogSearchData" @on-click="historyDialogSearchDataClick"></v-search>
      <table-list :data-header="historyDialogHeader" :url="historyDialogUrl" :params="historyDialogPage"
                  :refs="historyDialogDataRefs" @get-table-data="historyDialogGetTableData"
                  v-show="isShowHistory"></table-list>
      <v-page :data="historyDialogPage" :dataArr="[historyDialogDataSearch]"></v-page>
    </v-dialog> -->

    <!--历史价-->
    <history-dialog :historyDialog="historyDialog" :historyDialogPage="historyDialogPage"
                    :historyDialogDataRefs="historyDialogDataRefs" :isShowHistory="isShowHistory"
                    :historyDialogSearchData="historyDialogSearchData"
                    :historyDialogUrl="historyDialogUrl"></history-dialog>

    <!--编辑物资-->
    <v-dialog :dialog="editDialog">
      <form-group :data="dataFormDialog" :dataBut="dataFormDialogBut" :custom=true @on-ok="saveDataFormDialog"
                  @on-cancel="cancelDataFormDialog"></form-group>
    </v-dialog>

    <!-- 审批记录 -->
    <examine-dialog :dialogDataView="dialogDataView" :pageView="pageView" :goodsName="goodsName"
                    :tablePerformanceView="tablePerformanceView"></examine-dialog>
    <!--删除原因-->
    <v-dialog :dialog="dialogDataDel" @on-cancel="viewCancelDel">
      <form-group :data="dataFormDel" @on-cancel="cancelDialog" :custom="true" @on-ok="okReject" :data-but="dataBut">
      </form-group>
    </v-dialog>
  </div>
</template>


<script>
  import historyDialog from '../examine/historyDialog.vue'
  import examineDialog from '../examine/examineDialog.vue'
  export default {
    components: {historyDialog, examineDialog},
    data () {
      return {
        tablePerformanceView: 'search_tb_examine',
        goodsName: '',
        pageView: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          refs: 'search_tb_examine'
        },
        dialogDataView: {show: false, title: '物资审批记录', width: '700px'},
        fullscreenLoading: false,
        isRejected: false,
        txtBtn: '提交审批',
        showBtn: false,
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
        approvalUrlInside: this.$Api.procurement.listHistoryCommentInner,
        approvalPageInside: {purchasePlanId: 0},
        approvalRefInside: 'price_salesRemark_table_Inside',
        id: '',
        data: [
          {prop: 'number', label: '计划单号'},
          {prop: 'planSourceDisplay', label: '计划来源'},
          {prop: 'stateStr', label: '计划状态'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'organization', label: '所属组织'},
          {prop: 'typeStr', label: '物资类型'},
          {prop: 'expectedDeliveryTime', label: '期望到货时间'},
          {prop: 'lubanPlanCode', label: '鲁班计划'},
          {prop: 'orderAccount', label: '创建人账号'},
          {prop: 'userName', label: '用户姓名'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'quotationEndTime', label: '报价截止时间'},
          {prop: '', label: '备注'}
        ],
        dataList: {},
        listStyle: {
          class: ['pannel']
        },
        dataHeader: [
          {prop: 'quotationId', label: '序号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '计量单位'},
          {prop: 'goodsCount', label: '采购数量'},
          {prop: 'unitGoodsPrice', label: '报价', slot: true},
          {prop: 'totalGoodsPrice', label: '金额', slot: true},
          {prop: 'remark', label: '备注'},
          {prop: 'quotationStateStr', label: '报价状态'}
        ],
        dataStaticLs: [],
        tableStatic: true,
        purchaseDialog: {
          width: '1000px',
          show: false,
          title: '选择供应商'
        },
        searchData: [{
          key: 'enterpriseName',
          label: '企业名称',
          value: ''
        }, {
          key: 'supplierType',
          label: '企业类型',
          value: '',
          select: []
        }],
        dataSearch: {},
        tablePerformance: 'purchase_dialog_table',
        pTabUrl: this.$Api.order.loadEnterpriseData,
        pDataHeader: [
          {prop: 'enterpriseId', label: '序号'},
          {prop: 'enterpriseName', label: '企业名称'},
          {prop: 'enterpriseArea', label: '企业地址'},
          {prop: 'supplierTypeDisplay', label: '企业类型'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'purchase_dialog_table'
        },
        importDialog: {
          width: '30%',
          show: false,
          title: '模板导入'
        },
        dateDialog: {
          width: '500px',
          show: false,
          title: '设置截止时间'
        },
        importFooterDialog: [
          {text: '确定', key: 'ok', type: 'primary'}
        ],
        downLoadUrl: this.$Api.order.downloadTemplate,
        customBeforeUpload: true,
        uploadData: {
          url: this.$Api.order.importExcelOnePurchase,
          name: 'file',
          showFileList: false,
          listType: 'text',
          custom: true
        },
        dataImgHeader: [
          {prop: 'fileOldName', label: '文件名称', slot: true},
          {prop: 'fileSize', label: '文件大小'},
          {prop: 'btnDownLoad', label: '操作', slot: true}
        ],
        imgTableUrl: this.$Api.order.getVoucherList,
        pageInfo: {
          purchaseId: 0,
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_purchase_search'
        },
        tablePerformanceImg: 'table_purchase_search',
        tabButTable: [{text: '推送给供应商', key: 'onPush'}, {text: '选择截止日期', key: 'toCheckTime'}, {
          text: '删除',
          key: 'toDeleteData'
        }],
        tabButTableElse: [{text: '推送给供应商', key: 'onPush'}, {text: '选择截止日期', key: 'toCheckTime'}],
        tabButTableOffer: [{text: '按供应商查看', key: 'purPackChoice'}, {text: '分物资查看', key: 'purGoodsChoice'}],
        dataGoodsHeader: [
          {type: 'selection'},
          {prop: 'skuId', label: '商品编码'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '计量单位'},
          {prop: 'goodsCount', label: '采购数量'},
          {prop: 'unitPrice', label: '采购价格'},
          {prop: 'totalGoodsPrice', label: '采购金额'},
          {prop: 'stateDisplay', label: '状态', slot: true},
          {prop: 'purpose', label: '用途'},
          {prop: 'remark', label: '其他要求', slot: true, width: '160px'},
          {prop: 'purchaseRemark', label: '采购备注', slot: true, width: '160px'},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
          {prop: 'pushedSupplierNames', label: '已推送供应商'},
          {prop: 'winSupplierName', label: '中标供应商'},
          {prop: 'purchaseGuidancePrice', label: '采购指导价', slot: true},
          {prop: 'matchDegree', label: '匹配度', slot: true},
          {prop: 'historyPrice', label: '历史价', slot: true},
          {prop: 'examine', label: '审批记录', slot: true},
          {prop: 'handle', label: '操作', slot: true}
        ],
        goodsTableUrl: this.$Api.procurement.purchasePlanByPager,
        pageGoods: {
          purchasePlanId: 0,
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_procurement_list'
        },
        refGoods: 'table_procurement_list',
        idsArray: [],
        dataFormDate: {
          from: [{
            prop: 'quotationEndTime',
            label: '期望到货时间：',
            labelWidth: '150px',
            value: '',
            date: {
              type: 'date'
            }
          }]
        },
        dataButDate: [{
          text: '确定',
          key: 'ok',
          type: 'primary'
        }],
        saveDateUrl: this.$Api.procurement.updateQuotationEndTime,
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
        historyDialogUrl: this.$Api.procurement.priceRecord,
        historyDialogPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
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
        hasWinSupplier: false,
        editDialog: {
          width: '30%',
          show: false,
          title: '编辑物资'
        },
        dataFormDialog: {
          from: [{
            prop: 'goodsName',
            label: '商品名称：',
            value: '',
            required: true,
            placeholder: '',
            labelWidth: '120px',
            rules: [{required: true, message: '请填写商品名称', trigger: 'blur,change'}]
          }, {
            prop: 'typeModel',
            label: '规格型号：',
            value: '',
            required: true,
            placeholder: '',
            labelWidth: '120px',
            rules: [{required: true, message: '请填写规格型号', trigger: 'blur,change'}]
          }, {
            prop: 'brandName',
            label: '品牌：',
            value: '',
            placeholder: '',
            labelWidth: '120px',
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'unit',
            label: '计量单位：',
            value: '',
            required: true,
            placeholder: '',
            labelWidth: '120px',
            rules: [{required: true, message: '请填写单位', trigger: 'blur,change'}]
          }, {
            prop: 'goodsCount',
            label: '采购数量：',
            value: null,
            type: 'number',
            labelWidth: '120px',
            placeholder: '请填写采购数量',
            required: true,
            rules: [{required: true, message: '请填写采购数量', trigger: 'blur,change'}]
          }, {
            prop: 'purpose',
            label: '用途：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写用途',
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'remark',
            label: '其他要求：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写要求',
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'purchaseRemark',
            label: '采购备注：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写备注',
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'updateReason',
            label: '修改原因：',
            value: '',
            labelWidth: '120px',
            placeholder: '请修改原因',
            required: true,
            rules: [{required: true, message: '请填写修改原因', trigger: 'blur,change'}]
          }, {
            prop: 'id',
            label: 'id：',
            value: '',
            display: 'none',
            placeholder: '',
            labelWidth: '120px'
          }]
        },
        dataFormDialogBut: [{text: '取消', key: 'cancel'}, {text: '提交', type: 'primary', key: 'ok'}],
        dialogDataDel: {show: false, title: '删除原因', width: '500px'},
        dataFormDel: {
          from: [{
            prop: 'deletedReason',
            label: '删除原因',
            value: '',
            labelWidth: '100px',
            required: true,
            placeholder: '请输入删除原因',
            rules: [{required: true, message: '请输入删除原因', trigger: 'blur,change'}]
          }]
        },
        dataBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
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
      this.pageInfo.purchaseId = this.id
      this.pageGoods.purchasePlanId = this.id
      this.getDetail()
      this.approvalPageInside.purchasePlanId = this.id
      this.approve = this.$route.params.approve
      if (this.approve === '1') {
        this.showOpinion = true
      }
      this.getBeamField()
      this.getSupplierType()
    },
    methods: {
      show () {
        this.orderShow = !this.orderShow
      },
      show1 () {
        this.orderShow1 = !this.orderShow1
      },
      getSupplierType () {
        this.$Ajax.post({
          url: this.$Api.procurement.supplierTypes,
          data: {},
          cb: res => {
            if (res.data.result) {
              this.searchData.map(item => {
                if (item.key === 'supplierType') {
                  item.select = res.data.data
                }
              })
            }
          }
        })
      },
      toDismissal (res) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
        this.dialogDataView.show = true
        this.pageView.goodsId = res.id
        this.pageView.typeCode = 1
        this.$Utils.pageUpdateTable([[], this.pageView], this.tablePerformanceView, this)
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
      toEdit (row) {
        this.dataFormDialog.from.map(item => {
          if (item.prop === 'goodsName') {
            item.value = row.goodsName
          }
          if (item.prop === 'typeModel') {
            item.value = row.typeModel
          }
          if (item.prop === 'brandName') {
            item.value = row.brandName
          }
          if (item.prop === 'unit') {
            item.value = row.unit
          }
          if (item.prop === 'goodsCount') {
            item.value = row.goodsCount
          }
          if (item.prop === 'remark') {
            item.value = row.remark
          }
          if (item.prop === 'id') {
            item.value = row.id
          }
          if (item.prop === 'purpose') {
            item.value = row.purpose
          }
          if (item.prop === 'purchaseRemark') {
            item.value = row.purchaseRemark
          }
          if (item.prop === 'updateReason') {
            item.value = row.updateReason
          }
        })
        this.editDialog.show = true
      },
      saveDataFormDialog (res) {
        this.$Ajax.post({
          url: this.$Api.procurement.updatePurchasePlanGoodsById,
          data: {
            id: res.id,
            goodsName: res.goodsName,
            typeModel: res.typeModel,
            brandName: res.brandName ? res.brandName : '',
            unit: res.unit,
            goodsCount: res.goodsCount,
            purpose: res.purpose ? res.purpose : '',
            remark: res.remark ? res.remark : '',
            purchaseRemark: res.purchaseRemark ? res.purchaseRemark : '',
            updateReason: res.updateReason
          },
          cb: res => {
            this.$message(res.data.data)
            this.cancelDataFormDialog()
            // this.getDetail()
            this.$Utils.pageUpdateTable([this.pageGoods], this.refGoods, this)
          }
        })
      },
      cancelDataFormDialog () {
        this.editDialog.show = false
      },
      getTabButTable () {
        if (this.$Utils.getPageElement(this.$Consts.PERMISSION.detPurchasePlan.code)) {
          return this.tabButTable
        } else {
          return this.tabButTableElse
        }
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
      recommendPriceChange (goodsId, price) {
        if (price <= 0) {
          this.$message('请正确填写价格')
          this.$Utils.pageUpdateTable([this.pageGoods], this.refGoods, this)
          return false
        }
        this.$Ajax.get({
          url: this.$Api.procurement.savePurchaseGuidancePrice,
          data: {
            params: {
              goodsId: goodsId,
              purchaseGuidancePrice: price
            }
          },
          cb: res => {
            if (res.data.result) {
              this.$Utils.pageUpdateTable([this.pageGoods], this.refGoods, this)
            }
          }
        })
      },
      remarkChange (goodsId, remark) {
        this.$Ajax.post({
          url: this.$Api.procurement.savePurchaseGoodsRemark,
          data: {
            goodsId: goodsId,
            remark: remark
          },
          cb: res => {
            if (res.data.result) {
              this.$Utils.pageUpdateTable([this.pageGoods], this.refGoods, this)
            }
          }
        })
      },
      purchaseRemarkChange (goodsId, remark) {
        this.$Ajax.post({
          url: this.$Api.procurement.savePurchaseRemark,
          data: {
            goodsId: goodsId,
            purchaseRemark: remark
          },
          cb: res => {
            if (res.data.result) {
              this.$Utils.pageUpdateTable([this.pageGoods], this.refGoods, this)
            }
          }
        })
      },
      checkDate (res) {
        if (res.quotationEndTime === undefined) {
          this.$message.error('请选择期望到货时间')
          return
        }
        this.$Ajax.post({
          url: this.saveDateUrl,
          data: {
            purchasePlanId: this.id,
            quotationEndTime: res.quotationEndTime
          },
          cb: res => {
            if (res.data.result) {
              this.dateDialog.show = false
              this.getDetail()
            }
          }
        })
      },
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
      submitApproval (state) {
        this.$Ajax.get({
          url: this.$Api.procurement.approval,
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
              this.$router.push({name: 'detailsProcurement', params: {id: this.id}})
              // location.reload()
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
      toClose () {
        this.$Ajax.post({
          url: this.$Api.order.closeQuotation,
          data: {
            listPurchaseId: this.id
          },
          cb: res => {
            if (res.status === 200) {
              this.$message('关闭询价成功！')
              this.getDetail()
            }
          }
        })
      },
      selectionChange (selection) {
        this.hasWinSupplier = false
        selection.map((item) => {
          if (item.winSupplierName !== '' && item.winSupplierName !== null) {
            this.hasWinSupplier = true
          }
        })
        this.idsArray = selection.map(item => item.id)
      },
      selectall (selection) {
        this.hasWinSupplier = false
        let set = new Set(this.idsArray)
        selection.map((item) => {
          set.add(item.id)
          if (item.winSupplierName !== '' && item.winSupplierName !== null) {
            this.hasWinSupplier = true
          }
        })
        this.idsArray = Array.from(set)
//        this.$Utils.setSessionStorage('idsArray', this.idsArray.join(','))
      },
      select (selection, obj) {
        this.hasWinSupplier = false
        selection.map((item) => {
          if (item.winSupplierName !== '' && item.winSupplierName !== null) {
            this.hasWinSupplier = true
          }
        })
        let id = obj.id
        if (selection.includes(obj)) {
          this.idsArray.push(id)
        } else {
          this.idsArray.splice(this.idsArray.indexOf(id), 1)
        }
//        this.$Utils.setSessionStorage('idsArray', this.idsArray.join(','))
      },
      goodsTableData (data) {
        this.pageGoods.totalNum = data.data.total
        if (!this.$Utils.getPageElement(this.$Consts.PERMISSION.purchasePlan.code)) {
          let newHeader = []
          this.dataGoodsHeader.forEach((item, index) => {
            if (item.prop !== 'handle') {
              newHeader.push(item)
            }
          })
          this.dataGoodsHeader = newHeader
        }
//        let list = []
//        let arr = this.$Utils.getSessionStorage('idsArray')
//        arr = arr.split(',')
//        data.data.rows.map(item => {
//          arr.map(row => {
//            row = parseFloat(row)
//            if (item.id === row) {
//              list.push(item)
//            }
//          })
//        })
//        this.$nextTick(() => {
//          this.$bus.emit('set-tab-default-data', list, this.refGoods)
//        })
      },
      purGoodsChoice () {
        this.$router.push({name: 'purGoodsList', params: {id: this.id}})
      },
      purPackChoice () {
        this.$router.push({name: 'purPackList', params: {id: this.id}})
      },
      onPush () {
        if (this.idsArray.length === 0) {
          this.$message.error('请先选择商品！')
          return
        }
        if (this.hasWinSupplier) {
          this.$message.error('包含已中标的商品，不可推送！')
          return
        }
        this.purchaseDialog.show = true
      },
      toDeleteData () {
        if (this.idsArray.length === 0) {
          this.$message.error('请先选择商品！')
          return
        }
        this.dialogDataDel.show = true
      },
      viewCancelDel () {
        this.dialogDataDel.show = false
      },
      cancelDialog () {
        this.dialogDataDel.show = false
        this.$bus.emit('form-clear')
      },
      okReject (res) {
        let json = res
        json.ids = this.idsArray
        this.$Ajax.post({
          url: this.$Api.order.deleteGoods,
          data: {
            json: JSON.stringify(json)
          },
          cb: res => {
            if (res.data.result) {
              this.cancelDialog()
              this.$Utils.pageUpdateTable([this.pageGoods], this.refGoods, this)
              this.idsArray = []
            }
          }
        })
      },
      toCheckTime () {
        this.dateDialog.show = true
      },
      getShowImgPath (item) {
        if (this.dataList.planSourceCode === 40) {
          location.href = item.lubanPath
        } else {
          location.href = this.$Api.order.downloadrelatedFile + '/' + item.id
        }
      },
      getImgTableData (data) {
        this.pageInfo.totalNum = data.data.total
      },
      getDetail () {
        this.$Ajax.get({
          url: this.$Api.procurement.getPurchasePlanById,
          data: {
            params: {
              id: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.dataList = res.data.data
              if (this.dataList.stateStr === '报价中' || this.dataList.stateStr === '已驳回') {
                this.showBtn = true
              }
              if (this.dataList.state === 'APPROVING' && this.dataList.currentNodeOnUser) {
                this.isRejected = true
              }
            }
          }
        })
      },
      showPurchaseDialog () {
        this.purchaseDialog.show = true
      },
      closePurchaseDialog () {
        this.purchaseDialog.show = false
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      addPurchaseItem (id) {
        this.fullscreenLoading = true
        let ids = this.idsArray
        this.$Ajax.post({
          url: this.$Api.order.pushSuppliers,
          data: {
            supplierId: id,
            listPurchaseId: this.id,
            listPurchaseGoodsIds: ids,
            typeCode: 0
          },
          cb: res => {
            if (res.status === 200) {
              this.fullscreenLoading = false
              this.getDetail()
              this.closePurchaseDialog()
              this.$message('推送成功！')
              this.idsArray = []
              this.dateDialog.show = true
//              this.$Utils.setSessionStorage('idsArray', '')
              this.$Utils.pageUpdateTable([this.pageGoods], this.refGoods, this)
            }
          }
        })
      },
      showImportDialog (id) {
        this.downLoadUrl = this.downLoadUrl + '/' + id
        this.uploadData.url = this.$Api.order.importExcelOnePurchase + '/' + id
        this.importDialog.show = true
      },
      viewMore (id) {
        this.$router.push({name: 'purchaseMore', params: {id: id}})
      },
      hideImportDialog () {
        this.importDialog.show = false
      },
      uploadSuccess (res, file, fileList) {
        let _this = this
        if (res.result) {
          this.showAlert('上传成功', () => {
            _this.getDetail()
            _this.importOkDialog()
          })
        } else {
          this.showAlert(res.message, () => {
          })
        }
      },
      importOkDialog () {
        this.importDialog.show = false
      },
      showAlert (msg, myCallback) {
        this.$alert(msg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            myCallback()
          }
        })
      },
      onSave () {
        let flag = true
        let ls = []
        for (let j in this.dataStaticLs) {
          let data = this.dataStaticLs[j]
          let item = {}
          let goodsLs = []
          item.quotationId = data.id
          for (let i in data.quotationGoodsVOList) {
            let obj = data.quotationGoodsVOList[i]
            if (obj.unitGoodsPrice === null) {
              obj.unitGoodsPrice = 0
            }
            if (obj.unitGoodsPrice < 0) {
              flag = false
              break
            }
            goodsLs.push({
              quotationGoodsId: obj.id,
              unitGoodsPrice: obj.unitGoodsPrice
            })
          }
          item.quotationGoodsInfos = goodsLs
          ls.push(item)
        }
        if (!flag) {
          this.showAlert('报价商品中有未报价商品，请先填写再次保存', () => {
          })
        } else {
          this.$Ajax.post({
            url: this.$Api.order.updateQuotation,
            data: {
              quotationInfos: JSON.stringify(ls)
            },
            cb: res => {
              if (res.status === 200) {
                this.getDetail()
                this.$router.back()
              }
            }
          })
        }
      }
    },
    filters: {
      totalPrice: function (val) {
        let total = 0
        val.quotationGoodsVOList.map(x => {
          total += parseFloat(x.totalGoodsPrice)
        })
        val.totalGoodsPrice = total.toFixed(2)
        return val.totalGoodsPrice
      },
      itemTotal: function (val, util) {
        // val.totalGoodsPrice = parseFloat((val.goodsCount) * (val.unitGoodsPrice)).toFixed(2)
        val.totalGoodsPrice = util.multiplyTwo(val.goodsCount, val.unitGoodsPrice)
        return val.totalGoodsPrice
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

  .header_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #333;
  }

  .header_title_item {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }

  .add_item {
    color: #008aff;
    cursor: pointer;
    font-size: 12px;
  }

  .add_item:hover {
    text-decoration: underline;
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

  table {
    width: 100%;
  }

  .handle.text_red {
    color: #ff0000
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
  .pannel .v_list_li {
    float: left;
    width: 33% !important;
  }
</style>

