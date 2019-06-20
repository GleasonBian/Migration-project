<template>
  <div class="">
    <v-list :data="demandDetaildData" :data-list="demandDetailList" :list-style="listStyle"></v-list>
    <v-list :data="demandRemarkData" :data-list="demandDetailList" :list-style="listStyleRemark">
      <template v-slot:enclosure="scope">
        <table-list :data-header="dataHeaderEnclosure" :static="true" :dataStatic="dataTableEnclosure"
                    :refs="tableDemandEnclosure">
          <template v-slot:downFile="scope">
            <a :href="getHrefFile(scope.row.filePath)">下载</a>
          </template>
        </table-list>
      </template>
    </v-list>
    <br><br>
    <!--收货信息-->
    <div class="orderTitle"   @click="show"><span :class="orderShow ?'tranlateTitle':''"></span>收货信息</div>
    <div class="box">
      <v-list v-show="orderShow" :data="goodsData" :data-list="demandDetailList" :list-style="listStyle">
      </v-list>
    </div>
    <!--发票信息-->
    <div class="orderTitle" @click="show1"><span :class="orderShow1 ?'tranlateTitle':''"></span >发票信息</div>
    <div class="box">
      <v-list v-show="orderShow1" :data="InvoiceData" :data-list="demandDetailList.invoiceVO" :list-style="listStyle"></v-list>
    </div>
    <br>
    <div style="overflow: hidden">
      <tab-but :data="tabButAfterSale" @return-goods="returnGoods" @exchange-goods="exchangeGoods"
               style="float: left;"></tab-but>
      <tab-but :data="tabButTableOffer" @purPackChoice="toDetailsPage"
               style="float: right;"></tab-but>
    </div>
    <div style="margin-bottom: 10px;">商品明细</div>
    <table-list :data-header="dataHeaderGoods" :static=true :dataStatic="dataTableGoodsAll"
                :refs="tableDemandGoodsDetail">
      <!--<template v-slot:expand="scope">-->
      <!--<table-list :data-header="dataHeaderGoods1" :tabStyle="TabStyle1" :static=true :dataStatic="getDataGoodsRelation(scope.row)" :refs="tableDemandGoodsDetail">-->
      <!--</table-list>-->
      <!--</template>-->
      <template v-slot:returnTypeDisplay="scope">
        <span :title="scope.row.returnChangeReason">{{scope.row.returnTypeDisplay}}</span>
      </template>
      <template v-slot:goodsCode="scope">
        <div v-if="scope.row.type === 1">{{scope.row.goodsId}}</div>
        <div v-else>
          <div v-if="scope.row.goodsProviderVO">
            <el-button type="text">已关联商品</el-button>
          </div>
          <el-button v-else type="text" class="el-table__expand-column" ref="aaa">未关联商品</el-button>
        </div>
      </template>
      <template v-slot:totalGoodsPrice="scope">
        <div v-if="scope.row.type === 1">{{scope.row.unitPrice * scope.row.goodsCount}}</div>
        <div v-else>-</div>
      </template>
      <template v-slot:historyPrice="scope">
        <span class="handle" @click="toDetail(scope.row.goodsName)">历史价</span>
        <span v-if="$Utils.getPageElement($Consts.PERMISSION.purchasePlanEdit.code)" class="handle"
              @click="toEdit(scope.row)">编辑物资</span>
        <span v-if="$Utils.getPageElement($Consts.PERMISSION.editPurchasePlan.code)" class="handle"
              @click="editPrice(scope.row)">修改价格</span>
        <span v-if="$Utils.getPageElement($Consts.PERMISSION.editPurchasePlanPoint.code)" class="handle"
              @click="editPoint(scope.row)">修改税点</span>
      </template>
      <template v-slot:examine="scope">
        <a class="handle" :class="[!scope.row.rejectFlag ? '' : 'text_red']" @click="toDismissal(scope.row)">审批记录</a>
      </template>
      <template v-slot:matchDegree="scope">
        <div v-if="scope.row.matchDegree">{{scope.row.matchDegree}}%</div>
        <div v-else>0%</div>
      </template>
    </table-list>

    <!--<div style="margin: 10px 0">审批意见</div>-->
    <!--<table-list :data-header="dataHeaderOpinion" :static=true :dataStatic="dataTableOpinion" :refs="tableDemandOpinion"></table-list>-->
    <div class="title" style="margin-top: 10px;">其他资料</div>
    <table-list :data-header="dataImgHeader" :url="imgTableUrl" :params="pageInfo" @get-table-data="getImgTableData"
                :refs="tablePerformanceImg">
      <template v-slot:fileOldName="scope">
        <div>{{scope.row.fileOldName}}</div>
      </template>
      <template v-slot:btnDownLoad="scope">
        <el-button size="mini" type="text" @click="getShowImgPath(scope.row)">下载</el-button>
      </template>
    </table-list>
    <v-page :data="pageInfo"></v-page>
    <div style="margin: 10px 0">
      <el-button @click="returnList">返回列表</el-button>
    </div>
    <!--编辑物资-->
    <v-dialog :dialog="editDialog">
      <form-group :data="dataFormDialog" :dataBut="dataFormDialogBut" :custom=true @on-ok="saveDataFormDialog"
                  @on-cancel="cancelDataFormDialog"></form-group>
    </v-dialog>
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

    <!-- 审批记录 -->
    <examine-dialog :dialogDataView="dialogDataView" :pageView="pageView" :goodsName="goodsName"
                    :tablePerformanceView="tablePerformanceView"></examine-dialog>
    <v-dialog :dialog="priceDialog">
      <form-group :data="priceDialogData" :dataBut="dataBut" @on-cancel="cancelPrice" :custom="true"
                  @on-ok="onPriceSave"></form-group>
    </v-dialog>
    <v-dialog :dialog="pointDialog">
      <form-group :data="pointDialogData" :dataBut="dataButPoint" @on-cancel="cancelPoint" :custom="true"
                  @on-ok="onPointSave"></form-group>
    </v-dialog>
    <!--申请退货-->
    <v-dialog :dialog="returnGoodsDialog">
      <div>选择退货商品(已选择 {{this.selectionReturnGoods.length ? this.selectionReturnGoods.length : 0}} 条)</div>
      <table-list style="margin: 20px 0" :dataHeader="tableHeaderReturnGoods" :url="tableUrlReturnGoods"
                  :refs="tablePerformanceReturnGoods"
                  :params="pageReturnGoods" @selection-change="selectionChangeReturnGoods">
      </table-list>
      <form-group :data="returnGoodsDialogData" :dataBut="dataButReturnGoods" @on-cancel="cancelReturnGoods"
                  :custom="true"
                  @on-ok="onSaveReturnGoods"></form-group>
    </v-dialog>
    <!--申请换货-->
    <v-dialog :dialog="exchangeGoodsDialog">
      <div>选择换货商品(已选择 {{this.selectionExchangeGoods.length ? this.selectionExchangeGoods.length : 0}} 条)</div>
      <table-list style="margin: 20px 0" :dataHeader="tableHeaderExchangeGoods" :url="tableUrlReturnGoods"
                  :refs="tablePerformanceExchangeGoods"
                  :params="pageExchangeGoods" @selection-change="selectionChangeExchangeGoods">
        <template v-slot:typeModel="scope">
          <el-input v-model="scope.row.typeModel" size="small" placeholder="请输入规格型号"></el-input>
        </template>
        <template v-slot:brandName="scope">
          <el-input v-model="scope.row.brandName" size="small" placeholder="请输入品牌"></el-input>
        </template>
        <template v-slot:unit="scope">
          <el-input v-model="scope.row.unit" size="small" placeholder="请输入单位"></el-input>
        </template>
        <template v-slot:totalGoodsPrice="scope">
          {{accMul(scope.row.goodsCount, scope.row.unitPrice)}}
        </template>
        <template v-slot:remark="scope">
          <el-input v-model="scope.row.remark" size="small" placeholder="请输入其他要求"></el-input>
        </template>
      </table-list>
      <form-group :data="exchangeGoodsDialogData" :dataBut="dataButExchangeGoods" @on-cancel="cancelExchangeGoods"
                  :custom="true"
                  @on-ok="onSaveExchangeGoods"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import historyDialog from '../examine/historyDialog.vue'
  import examineDialog from '../examine/examineDialog.vue'
  export default {
    components: {historyDialog, examineDialog},
    data () {
      return {
        tabButTableOffer: [{text: '按供应商查看', key: 'purPackChoice'}],
        tablePerformanceView: 'details_tb_examine',
        goodsName: '',
        pageView: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [5, 10, 20],
          pageSize: 5,
          refs: 'details_tb_examine'
        },
        dialogDataView: {show: false, title: '物资审批记录', width: '700px'},
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
        TabStyle: {
          cellClassName: function ({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 0 && row.type === 1) {
              return 'ColumnHidden'
            } else if (columnIndex === 0 && !row.goodsProviderVO) {
              return 'ColumnHidden'
            }
          }
        },
        TabStyle1: {
          cellClassName: function ({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 0) {
              return 'ColumnHidden'
            }
          },
          showHeader: false
        },
        listStyle: {
          listwidth: '120px',
          class: 'purchase_list'
        },
        listStyleRemark: {
          listwidth: '120px'
        },
        demandDetailList: {},
        dataTableEnclosure: [],
        demandDetaildData: [
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
          {prop: 'quotationEndTime', label: '报价截止时间'}
        ],
        demandRemarkData: [
          {prop: 'remark', label: '备注'}
          // {prop: 'enclosure', label: '附件', slot: true}
        ],
        urlDemandDetail: this.$Api.procurement.getPurchasePlanById,
        dataHeaderEnclosure: [{
          prop: 'fileOldName',
          label: '文件名称'
        }, {
          prop: 'downFile',
          label: '下载',
          slot: true
        }],
        tableDemandEnclosure: 'table_demand_enclosure',
        tableDemandGoodsDetail: 'table_demand_goods_detail',
        tableDemandOpinion: 'table_demand_opinion',
        dataHeaderGoods: [{
          prop: 'skuId',
          label: '商品编码'
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'typeModel',
          label: '规格型号',
          showOverflowTooltip: true
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'goodsCount',
          label: '数量'
        }, {
          prop: 'unitPrice',
          label: '单价'
        }, {
          prop: 'taxPoint',
          label: '税点'
        }, {
          prop: 'totalGoodsPrice',
          label: '采购金额'
        }, {
          prop: 'winSupplierName',
          label: '中标供应商'
        }, {
          prop: 'purpose',
          label: '用途'
        }, {
          prop: 'remark',
          label: '其他要求'
        }, {
          prop: 'purchaseRemark',
          label: '采购备注'
        }, {
          prop: 'returnTypeDisplay',
          label: '售后情况',
          slot: true
        }, {
          prop: 'purchaseGuidancePrice',
          label: '采购指导价'
        }, {
          prop: 'matchDegree',
          label: '匹配度',
          slot: true
        }, {
          prop: 'stateDisplay',
          label: '物资状态'
        }, {
          prop: 'historyPrice',
          label: '操作',
          slot: true
        }, {
          prop: 'examine',
          label: '审批记录',
          slot: true
        }],
        dataHeaderGoods1: [{
          type: 'expand',
          prop: 'expand',
          slot: true
        }, {
          prop: 'goodsCode',
          label: '商品编号'
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'typeModel',
          label: '规格型号'
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'price',
          label: '单价'
        }, {
          prop: 'goodsCount',
          label: '数量'
        }, {
          prop: 'totalGoodsPrice ',
          label: '采购金额'
        }, {
          prop: 'purpose',
          label: '用途'
        }, {
          prop: 'remark',
          label: '其他要求'
        }, {
          prop: 'purchaseRemark',
          label: '采购备注'
        }, {
          prop: 'returnTypeDisplay',
          label: '售后情况',
          slot: true
        }, {
          prop: 'purchaseGuidancePrice',
          label: '采购指导价'
        }, {
          prop: 'matchDegree',
          label: '匹配度',
          slot: true
        }],
        dataTableGoodsAll: [],
        dataHeaderOpinion: [
          {
            prop: 'createTimeStr',
            label: '时间'
          },
          {
            prop: 'userName',
            label: '姓名'
          },
          {
            prop: 'phone',
            label: '联系方式'
          },
          {
            prop: 'result',
            label: '接单结果'
          },
          {
            prop: 'remark',
            label: '接单意见'
          }
        ],
        dataTableOpinion: [],
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
        idNum: '',
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
              labelWidth: '100px'
            },
            {
              prop: 'updateReason',
              label: '修改原因：',
              value: '',
              labelWidth: '100px',
              required: true,
              rules: [{required: true, message: '请填写修改原因', trigger: 'blur,change'}]
            }
          ]
        },
        dataBut: [{text: '取消', key: 'cancel'}, {text: '提交', key: 'ok', type: 'primary'}],
        pointDialog: {
          width: '400px',
          show: false,
          title: '修改税点'
        },
        pointDialogData: {
          from: [
            {
              prop: 'taxPoint',
              label: '税点：',
              type: 'number',
              value: '',
              labelWidth: '120px'
            }
          ]
        },
        dataButPoint: [{text: '取消', key: 'cancel'}, {text: '提交', key: 'ok', type: 'primary'}],
        priceGoodsId: '',
        tabButAfterSale: [
          {text: '申请换货', key: 'exchange-goods'},
          {text: '申请退货', key: 'return-goods'}
        ],
        returnGoodsDialog: {
          width: '900px',
          show: false,
          title: '申请退货'
        },
        exchangeGoodsDialog: {
          width: '900px',
          show: false,
          title: '申请换货'
        },
        returnGoodsDialogData: {
          from: [
            {
              prop: 'reason',
              label: '退货原因',
              type: 'textarea',
              value: '',
              labelWidth: '80px',
              placeholder: '请输入退货原因（200个字以内）',
              required: true,
              rules: [{required: true, message: '请输入退货原因', trigger: 'blur,change'}]
            }
          ]
        },
        dataButReturnGoods: [{text: '取消', key: 'cancel'}, {text: '提交', key: 'ok', type: 'primary'}],
        tableHeaderReturnGoods: [
          {type: 'selection'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'unitPrice', label: '单价'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'totalGoodsPrice', label: '小计'},
          {prop: 'remark', label: '其他要求'}
        ],
        tableUrlReturnGoods: this.$Api.procurement.returnChangeGoods,
        pageReturnGoods: {
          id: this.$route.params.id,
          refs: 'table_return_goods'
        },
        tablePerformanceReturnGoods: 'table_return_goods',
        selectionReturnGoods: [],
        exchangeGoodsDialogData: {
          from: [
            {
              prop: 'reason',
              label: '换货原因',
              type: 'textarea',
              value: '',
              labelWidth: '80px',
              placeholder: '请输入换货原因（200个字以内）',
              required: true,
              rules: [{required: true, message: '请输入换货原因', trigger: 'blur,change'}]
            }
          ]
        },
        dataButExchangeGoods: [{text: '取消', key: 'cancel'}, {text: '提交', key: 'ok', type: 'primary'}],
        tableHeaderExchangeGoods: [
          {type: 'selection'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号', slot: true},
          {prop: 'brandName', label: '品牌', slot: true},
          {prop: 'unit', label: '单位', slot: true},
          {prop: 'unitPrice', label: '单价'},
          {prop: 'totalGoodsPrice', label: '小计', slot: true},
          {prop: 'remark', label: '其他要求', slot: true}
        ],
        pageExchangeGoods: {
          id: this.$route.params.id,
          refs: 'table_exchange_goods'
        },
        tablePerformanceExchangeGoods: 'table_exchange_goods',
        selectionExchangeGoods: [],
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
        orderShow1: false,
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
            placeholder: '请填写修改原因',
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
        dataFormDialogBut: [{text: '取消', key: 'cancel'}, {text: '提交', type: 'primary', key: 'ok'}]
      }
    },
    created () {
      let id = this.$route.params.id
      this.idNum = id
      this.pageInfo.purchaseId = id
      this.getDemantData(this.idNum)
      this.approvalPageInside.purchasePlanId = id
      this.getBeamField()
    },
    methods: {
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
            this.getDemantData(this.idNum)
          }
        })
      },
      cancelDataFormDialog () {
        this.editDialog.show = false
      },
      show () {
        this.orderShow = !this.orderShow
      },
      show1 () {
        this.orderShow1 = !this.orderShow1
      },
      accMul (arg1, arg2) {
        if (isNaN(arg1)) {
          arg1 = 0
        }
        if (isNaN(arg2)) {
          arg2 = 0
        }
        arg1 = Number(arg1)
        arg2 = Number(arg2)

        let m = 0
        let s1 = arg1.toString()
        let s2 = arg2.toString()
        try {
          m += s1.split('.')[1].length
        } catch (e) {
        }
        try {
          m += s2.split('.')[1].length
        } catch (e) {
        }
        return (Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)).toFixed(4)
      },
      returnGoods () {
        this.returnGoodsDialog.show = true
      },
      exchangeGoods () {
        this.exchangeGoodsDialog.show = true
      },
      selectionChangeReturnGoods (s) {
        this.selectionReturnGoods = s
      },
      selectionChangeExchangeGoods (s) {
        this.selectionExchangeGoods = s
      },
      cancelReturnGoods () {
        let _this = this
        this.returnGoodsDialog.show = false
        this.getDemantData(this.idNum)
        Vue.nextTick().then(function () {
          _this.$Utils.pageUpdateTable([_this.pageReturnGoods], _this.tablePerformanceReturnGoods, _this)
        })
        this.$bus.emit('form-clear')
      },
      cancelExchangeGoods () {
        let _this = this
        this.exchangeGoodsDialog.show = false
        this.getDemantData(this.idNum)
        Vue.nextTick().then(function () {
          _this.$Utils.pageUpdateTable([_this.pageExchangeGoods], _this.tablePerformanceExchangeGoods, _this)
        })
        this.$bus.emit('form-clear')
      },
      onSaveReturnGoods (res) {
        if (this.selectionReturnGoods && this.selectionReturnGoods.length > 0) {
          let json = res
          json.number = this.demandDetailList.number
          json.returnTypeCode = 1
          json.purchasePlanGoodsVOS = this.selectionReturnGoods
          this.$Ajax.post({
            url: this.$Api.procurement.checkReturnChanageGoodsToSettlement,
            data: {
              json: JSON.stringify(json)
            },
            cb: res => {
              if (!res.data.result) {
                this.$alert(res.data.message, '提示', {
                  confirmButtonText: '确定'
                })
              } else {
                this.$Ajax.post({
                  url: this.$Api.procurement.returnOperation,
                  data: {
                    json: JSON.stringify(json)
                  },
                  cb: res => {
                    if (res.data.result) {
                      this.cancelReturnGoods()
                    }
                  }
                })
              }
            }
          })
        } else {
          this.$message('请选择退货商品')
        }
      },
      onSaveExchangeGoods (res) {
        if (this.selectionExchangeGoods && this.selectionExchangeGoods.length > 0) {
          let json = res
          json.number = this.demandDetailList.number
          json.returnTypeCode = 2
          json.purchasePlanGoodsVOS = this.selectionExchangeGoods
          this.$Ajax.post({
            url: this.$Api.procurement.checkReturnChanageGoodsToSettlement,
            data: {
              json: JSON.stringify(json)
            },
            cb: res => {
              if (!res.data.result) {
                this.$alert(res.data.message, '提示', {
                  confirmButtonText: '确定'
                })
              } else {
                this.$Ajax.post({
                  url: this.$Api.procurement.changeOperation,
                  data: {
                    json: JSON.stringify(json)
                  },
                  cb: res => {
                    if (res.data.result) {
                      this.cancelExchangeGoods()
                    }
                  }
                })
              }
            }
          })
        } else {
          this.$message('请选择换货商品')
        }
      },
      editPrice (row) {
        this.priceGoodsId = row.id
        this.priceDialog.show = true
      },
      getImgTableData (data) {
        this.pageInfo.totalNum = data.data.total
      },
      editPoint (row) {
        this.priceGoodsId = row.id
        this.pointDialog.show = true
      },
      cancelPrice () {
        this.$bus.emit('form-clear')
        this.priceDialog.show = false
      },
      cancelPoint () {
        this.$bus.emit('form-clear')
        this.pointDialog.show = false
      },
      onPriceSave (res) {
        let params = {
          goodsId: this.priceGoodsId,
          price: res.price,
          updateReason: res.updateReason
        }
        this.$Ajax.post({
          url: this.$Api.order.updatePricePlan,
          data: params,
          cb: res => {
            if (res.data.result) {
              this.$message('修改成功')
              this.$bus.emit('form-clear')
              this.priceDialog.show = false
              this.getDemantData(this.idNum)
            }
          }
        })
      },
      onPointSave (res) {
        let params = {
          goodsId: this.priceGoodsId,
          taxPoint: res.taxPoint
        }
        this.$Ajax.post({
          url: this.$Api.order.updateTaxPoint,
          data: params,
          cb: res => {
            if (res.data.result) {
              this.$message('修改成功')
              this.$bus.emit('form-clear')
              this.pointDialog.show = false
              this.getDemantData(this.idNum)
            }
          }
        })
      },
      toDetailsPage () {
        let routeData = this.$router.resolve({
          name: 'purPackListElse',
          params: {id: this.idNum}
        })
        window.open(routeData.href, '_blank')
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
        this.ajaxPost(this.$Api.orderManger.getProjectList, {}, (res) => {
          if (res.data.result) {
            this.historyDialogSearchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(res.data.data)
              }
            })
          }
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
      historyDialogGetTableData (data) {
        this.historyDialogPage.totalNum = data.data.total
      },
      historyDialogSearchDataClick (res) {
        if (res.goodsName === undefined) {
          res.goodsName = ''
        }
        this.historyDialogDataSearch = res
        this.historyDialogPage.goodsName = res.goodsName
        this.historyDialogPage.model = ''
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
      getDataGoodsRelation (res) {
        let arrRelation = []
        if (res.goodsProviderVO) {
          res.goodsProviderVO.goodsCount = res.goodsCount
          res.goodsProviderVO.totalGoodsPrice = res.totalGoodsPrice
          arrRelation.push(res.goodsProviderVO)
          return arrRelation
        }
      },
      ajaxPost (url, data, cb) {
        this.$Ajax.post({
          url: url,
          data: data,
          cb: cb
        })
      },
      getHrefFile (path) {
        return this.$ImgPath.imgApi.imgApi + '/' + path
      },
      getDemantData (id) {
        this.ajaxPost(this.urlDemandDetail, {id: id}, (res) => {
          if (res.data.result) {
            this.demandDetailList = res.data.data
            this.demandDetailList.expressAddress = this.demandDetailList.areaName + this.demandDetailList.expressAddress
            this.dataTableEnclosure = this.demandDetailList.relatedFileVOList
            this.dataTableGoodsAll = this.demandDetailList.purchasePlanGoodsVOList
//            this.dataTableOpinion = this.demandDetailList.purchaseRequestAuditVOList
          }
        })
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      returnList () {
        this.jumpPage('procurementList')
      },
      getShowImgPath (item) {
        if (this.demandDetailList.planSourceCode === 40) {
          location.href = item.lubanPath
        } else {
          location.href = this.$Api.order.downloadrelatedFile + '/' + item.id
        }
      }
    }
  }
</script>

<style scoped>
  .handle {
    font-size: 14px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin-right: 15px;
  }
  .title {
    line-height: 40px;
    font-size: 16px;
  }
  .handle:hover {
    text-decoration: underline;
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
  .ColumnHidden {
    visibility: hidden
  }

  .purchase_list > .v_list_li {
    width: 33% !important;
    float: left
  }

  .v_list_cont {
    width: 100%
  }
</style>
