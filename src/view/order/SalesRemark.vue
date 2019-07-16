<template>
  <div>
    <div class="title">清单采购配货</div>
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
    <!--分割线-->
    <div class="title" style="margin-top: 15px;">商品明细</div>
    <!--<el-button type="primary" @click="toNew" class="distribution">新增物资</el-button>-->
    <!--<el-button type="primary" @click="distribution" class="distribution">一键配货</el-button>-->
    <el-button type="primary" @click="batchInternal" class="distribution" :disabled="disabledInternal">批量内审</el-button>
    <el-button type="primary" @click="delGoods" class="distribution"
               v-show="$Utils.getPageElement($Consts.PERMISSION.detPurchaseList.code)">删除
    </el-button>
    <el-button type="primary" @click="btnSubmit" class="distribution" :disabled="disabledSubmit">确定</el-button>
    <el-button type="primary" @click="btnSave" class="distribution" :disabled="disabledSave">保存</el-button>
    <table-list :data-header="dataHeader" :data-static="dataStatic" :static="tableStatic" v-loading="loading"
                @selection-change="gooodsSelection">
      <template v-slot:returnTypeDisplay="scope">
        <span :title="scope.row.returnChangeReason">{{scope.row.returnTypeDisplay}}</span>
      </template>
      <template v-slot:matchDegree="scope">
        <div v-if="scope.row.matchDegree">{{scope.row.matchDegree}}%</div>
        <div v-else>0%</div>
      </template>
      <template v-slot:ifAssociate="scope">
        {{scope.row.ifAssociate ? '已关联' : '未关联'}}
      </template>
      <template v-slot:contractGoodsFlag="scope">
        {{scope.row.contractGoodsFlag ? '是' : '否'}}
      </template>
      <template v-slot:selection="scope">
        <el-checkbox v-if="scope.row.materialStateCode === 20" v-model="checkedFalse"></el-checkbox>
        <el-checkbox v-else v-model="checkedFalse" disabled></el-checkbox>
      </template>
      <template v-slot:materialState="scope">
        <div class="color_red" v-if="scope.row.rejectFlag === 1">
          {{scope.row.materialStateDisplay}}({{scope.row.countReject}})
        </div>
        <div v-else>{{scope.row.materialStateDisplay}}</div>
      </template>
      <template v-slot:pricingAnalysis="scope">
        <el-input type="number"
          v-if="(scope.row.contractGoodsFlag === 1 && scope.row.materialStateCode === 75) || (scope.row.materialStateCode === 10 || scope.row.materialStateCode === 20 || scope.row.materialStateCode === 50 || scope.row.materialStateCode === 65)"
          v-model="scope.row.pricingAnalysis"></el-input>
        <div v-else>{{scope.row.pricingAnalysis}}</div>
      </template>
      <template v-slot:remarkForPrice="scope">
        <el-input
          v-if="scope.row.materialStateCode === 10 || scope.row.materialStateCode === 20 || scope.row.materialStateCode === 50 || scope.row.materialStateCode === 65"
          v-model="scope.row.remarkForPrice"></el-input>
        <div v-else>{{scope.row.remarkForPrice}}</div>
      </template>
      <template v-slot:quotationEnumDisplay="scope">
        <el-select
          v-if="scope.row.materialStateCode === 10 || scope.row.materialStateCode === 20 || scope.row.materialStateCode === 50 || scope.row.materialStateCode === 65"
          v-model="scope.row.saveQuotationEnumCode" placeholder="请选择">
          <el-option
            v-for="item in optionsQuotationEnum"
            :key="item.code"
            :label="item.display"
            :value="item.code">
          </el-option>
        </el-select>
        <div v-else>{{scope.row.quotationEnumDisplay}}</div>
      </template>
      <template v-slot:relatedFileVOList="scope">
        <div style="font-size: 12px;" v-if="scope.row.relatedFileVOList.length == 0">没有找到匹配的记录</div>
        <div v-if="scope.row.relatedFileVOList.length > 0">
          <div class="item_img" v-if="scope.row.relatedFileVOList.length > 0"
               v-for="(item, index) in scope.row.relatedFileVOList" :key="index"
               @click="getShowImgPath(item.filePath, 1)">
            <el-tooltip :content="item | itemImg" placement="top">
              <div class="item_img1">{{ item | itemImg }}</div>
            </el-tooltip>
          </div>
        </div>
      </template>
      <template v-slot:recommendGoodsPrice="scope">
        <el-input
          v-if="scope.row.materialStateCode === 10 || scope.row.materialStateCode === 20 || scope.row.materialStateCode === 50 || scope.row.materialStateCode === 65"
          type="number" v-model="scope.row.recommendGoodsPrice"></el-input>
        <div v-else>{{scope.row.recommendGoodsPrice}}</div>
      </template>
      <template v-slot:saleGuidancePrice="scope">
        <el-input
          v-if="scope.row.materialStateCode === 10 || scope.row.materialStateCode === 20 || scope.row.materialStateCode === 50 || scope.row.materialStateCode === 65"
          type="number" v-model="scope.row.saleGuidancePrice" @wheel.native.prevent></el-input>
        <div v-else>{{scope.row.saleGuidancePrice}}</div>
      </template>
      <template v-slot:stockPrice="scope">
        <el-input type="number" v-model="scope.row.stockPrice" @wheel.native.prevent></el-input>
      </template>
      <template v-slot:priceCompost="scope">
        <el-input v-model="scope.row.priceCompost" @wheel.native.prevent></el-input>
      </template>
      <template v-slot:handle="scope">
        <!--<span class="handle" @click="openGoodsDialog(scope.row)">关联商品</span>-->
        <span class="handle" v-if="scope.row.materialStateCode < 70" @click="toEdit(scope.row)"
        v-show="$Utils.getPageElement($Consts.PERMISSION.editPurchase.code)">编辑物资</span>
        <span class="handle" @click="toEdit(scope.row)"
              v-show="$Utils.getPageElement($Consts.PERMISSION.editPurchaseCW.code)">编辑物资</span>
        <span v-if="!scope.row.contractGoodsFlag" class="handle" @click="contractMaterials(scope.row)">合同物资</span>
      </template>
      <!--<template v-slot:handle="scope">-->
      <!--<div class="mCen1">-->
      <!--<select-but :data="getSelectBtn(scope.row)" :ref="'select' + scope.row.id" :row="scope.row"-->
      <!--@change="selectChange"></select-but>-->
      <!--</div>-->
      <!--</template>-->

      <template v-slot:historyPrice="scope">
        <span class="handle" @click="toDetail(scope.row.goodsName)">历史价</span>
        <span class="handle" @click="toDismissal(scope.row)">审批记录</span>
      </template>
    </table-list>
    <div class="text_total_right">共&nbsp;{{totalNum}}&nbsp;类物资，合计金额：￥{{goodsPriceTotle}}</div>
    <!--分割线-->
    <div class="title" style="margin-top: 10px;">其他资料</div>
    <table-list :data-header="dataImgHeader" :url="imgTableUrl" :params="page" @get-table-data="getImgTableData"
                :refs="tablePerformance" @selection-change="selectionChange">
      <template v-slot:fileOldName="scope">
        <div>{{scope.row.fileOldName}}</div>
      </template>
      <template v-slot:btnDownLoad="scope">
        <el-button size="mini" type="text" @click="getShowImgPath(scope.row)">下载</el-button>
      </template>
    </table-list>
    <!--分割线-->
    <!--------------------------------------------分割线--展示图片-------------------------------------->
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <img width="100%" :src="popoverImgPath"/>
    </el-dialog>
    <!--------------------------------------------分割线--选择商品-------------------------------------->
    <v-dialog :dialog="goodsDialog">
      <v-search :data="searchData" @on-click="search"></v-search>
      <table-list :data-header="gDataHeader" :url="gTabUrl" :params="page1" @get-table-data="getTableData1"
                  :refs="tablePerformance1">
        <template v-slot:handle="scope">
          <a class="add_item" @click="addGoodsItem(scope.row)">关联商品</a>
        </template>
      </table-list>
      <v-page :data="page1" :dataArr="[dataSearch]"></v-page>
    </v-dialog>
    <el-dialog
      title="数据加载"
      :visible.sync="dialogVisiblesync"
      width="30%">
      <span>数据加载中，请稍等</span>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
    <!-- --------------------------------------------分割线--上传--------------------------------------------- -->

    <div style="margin-top: 20px;display: flex;justify-content: center;align-items: center;" v-show='isDistribution'>
      <el-button type="primary" @click="onSave">仅保存</el-button>
      <!--<el-button type="primary" @click="onSavePush">保存并推送配货信息给用户</el-button>-->
      <!--<el-button type="primary" @click="onSavePush">发起内部审批</el-button>-->
    </div>
    <!--编辑物资-->
    <v-dialog :dialog="editDialog">
      <form-group :data="dataFormDialog" :dataBut="dataFormDialogBut" :custom=true @on-ok="saveDataFormDialog"
                  @on-cancel="cancelDataFormDialog"></form-group>
    </v-dialog>
    <v-dialog :dialog="addDialog">
      <form-group :data="addDataFormDialog" :dataBut="dataFormDialogBut" :custom=true :clear=true
                  @on-ok="addSaveDataFormDialog" @on-cancel="addCancelDataFormDialog"></form-group>
    </v-dialog>

    <!--历史价-->
    <history-dialog :historyDialog="historyDialog" :historyDialogPage="historyDialogPage"
                    :historyDialogDataRefs="historyDialogDataRefs" :isShowHistory="isShowHistory"
                    :historyDialogSearchData="historyDialogSearchData"
                    :historyDialogUrl="historyDialogUrl"></history-dialog>

    <!-- 审批记录 -->
    <v-dialog :dialog="dialogDataView" @on-cancel="viewCancel">
      <div>物资名称：{{goodsName}}</div>
      <br/>
      <table-list :data-header="dataHeaderView" :url="tabUrlView" :params="pageView" @get-table-data="getTableDataView"
                  :refs="tablePerformanceView"></table-list>
      <v-page :data="pageView" :dataArr="[]"></v-page>
    </v-dialog>
    <!--删除原因-->
    <v-dialog :dialog="dialogDataDel" @on-cancel="viewCancelDel">
      <form-group :data="dataFormDel" @on-cancel="cancelDialog" :custom="true" @on-ok="okReject" :data-but="dataBut">
      </form-group>
    </v-dialog>
    <!-- 合同物资 -->
    <v-dialog :dialog="contractGoodsDialog">
      <v-search :data="searchDataContractGoods" @on-click="searchContractGoods"></v-search>
      <table-list :data-header="dataHeaderContractGoods" :url="ContractGoodsTabUrl" :params="pageContractGoods" @get-table-data="getTableDataContractGoods"
                  :refs="tablePerformanceContract">
        <template v-slot:number="scope">
          <div>{{scope.index + 1}}</div>
        </template>
        <template v-slot:handle="scope">
          <a class="add_item" @click="addPurchaseItem(scope.row.id)">添加</a>
        </template>
      </table-list>
      <v-page :data="pageContractGoods" :dataArr="[dataSearchContractGoods]"></v-page>
    </v-dialog>
  </div>
</template>


<script>
  import historyDialog from '../examine/historyDialog.vue'
  export default {
    components: {historyDialog},
    data () {
      return {
        loading: true,
        disabledInternal: false,
        disabledSave: false,
        disabledSubmit: false,
        valueQuotationEnum: '',
        optionsQuotationEnum: [],
        checkedFalse: false,
        isDistribution: false,
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
        dialogVisiblesync: false,
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
        listPurchaseGoodsId: '',
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
        tablePerformance: 'sales_remark_table',
        tablePerformance1: 'sales_goods_table',
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
          {type: 'selection'},
          {prop: 'fileOldName', label: '文件名称', slot: true},
          {prop: 'fileSize', label: '文件大小'},
          {prop: 'btnDownLoad', label: '操作', slot: true}
        ],
        dataImgStatic: [],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'sales_remark_table'
        },
        page1: {
          name: '',
          brand: '',
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'sales_goods_table'
        },
        selection: [],
        dataHeader: [
          {prop: 'selection', type: 'selection'},
          {prop: 'skuId', label: '商品编号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'count', label: '数量'},
          {prop: 'unit', label: '单位'},
          {prop: 'purpose', label: '用途'},
          {prop: 'marketPrice', label: '项目调查价'},
          {prop: 'pricingAnalysis', label: '定价说明', slot: true, width: '160'},
          {prop: 'remarkForPrice', label: '其他要求', slot: true, width: '120'},
          {prop: 'purchaseRemark', label: '采购备注'},
          {prop: 'contractGoodsFlag', label: '是否为合同物资', slot: true},
          {prop: 'quotationEnumDisplay', label: '报价类型', slot: true, width: '160'},
          {prop: 'returnTypeDisplay', label: '售后情况', slot: true},
//          { prop: 'relatedFileVOList', label: '定价分析依据图片', width: '122', slot: true },
          {prop: 'recommendGoodsPrice', label: '世界高铁网价', slot: true, width: '160'},
          {prop: 'totalGoodsPrice', label: '商品金额'},
          {prop: 'saleGuidancePrice', label: '销售指导价', slot: true, width: '120'},
          {prop: 'matchDegree', label: '匹配度', slot: true},
          {prop: 'ifAssociate', label: '是否关联商品', slot: true},
          {prop: 'stockPrice', label: '进货价格', slot: true, width: '120'},
          {prop: 'materialState', label: '物资状态', slot: true},
//          { prop: 'priceCompost', label: '价格组成', width: '250', slot: true },
          {prop: 'handle', label: '操作', slot: true, width: '200'},
          {prop: 'historyPrice', label: '历史价', slot: true, width: '160'}
        ],
        dataStatic: [],
        imgPath: this.$Api.imgApi,
        popoverImgPath: '',
        dialogVisible: false,
        goodsDialog: {
          width: '800px',
          show: false,
          title: '选择商品'
        },
        searchData: [{
          key: 'name',
          label: '商品名称',
          value: ''
        }, {
          key: 'goodsCode',
          label: '商品编码',
          value: ''
        }],
        dataSearch: {},
        gTabUrl: this.$Api.order.goodsList,
        gDataHeader: [
          {prop: 'goodsCode', label: '商品编码'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'goodsSpec', label: '规格型号'},
          {prop: 'unit', label: '单位'},
          {prop: 'price', label: '价格（市场价）'},
          {prop: 'lubanClassCode', label: '细目ID'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        goodsPriceTotle: '',
        totalNum: '',
        getGoodsListChange: [],
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
            prop: 'model',
            label: '规格型号：',
            value: '',
            required: true,
            placeholder: '',
            labelWidth: '120px',
            rules: [{required: true, message: '请填写规格型号', trigger: 'blur,change'}]
          }, {
            prop: 'brand',
            label: '品牌：',
            value: '',
            placeholder: '',
            labelWidth: '120px',
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'unit',
            label: '单位：',
            value: '',
            required: true,
            placeholder: '',
            labelWidth: '120px',
            rules: [{required: true, message: '请填写单位', trigger: 'blur,change'}]
          }, {
            prop: 'count',
            label: '采购数量：',
            value: '',
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
            prop: 'remarkForPrice',
            label: '其他要求：',
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
        dataFormDialogBut: [{text: '取消', key: 'cancel'}, {text: '提交', type: 'primary', key: 'ok'}],
        addDialog: {
          width: '30%',
          show: false,
          title: '新增物资'
        },
        addDataFormDialog: {
          from: [{
            prop: 'goodsName',
            label: '商品名称：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写商品名称',
            required: true,
            rules: [{required: true, message: '请填写商品名称', trigger: 'blur,change'}]
          }, {
            prop: 'model',
            label: '规格型号：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写规格型号',
            required: true,
            rules: [{required: true, message: '请填写规格型号', trigger: 'blur,change'}]
          }, {
            prop: 'brand',
            label: '品牌：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写品牌',
            required: true,
            rules: [{required: true, message: '请填写品牌', trigger: 'blur,change'}]
          }, {
            prop: 'unit',
            label: '单位：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写单位',
            required: true,
            rules: [{required: true, message: '请填写单位', trigger: 'blur,change'}]
          }, {
            prop: 'count',
            label: '采购数量：',
            value: '',
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
            required: true,
            rules: [{required: true, message: '请填写用途', trigger: 'blur,change'}]
          }, {
            prop: 'remarkForPrice',
            label: '其他要求：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写备注',
            required: true,
            rules: [{required: true, message: '请填写备注', trigger: 'blur,change'}]
          }, {
            prop: 'id',
            label: 'id：',
            value: '',
            display: 'none',
            placeholder: '',
            labelWidth: '120px'
          }]
        },
        historyDialog: {
          width: '1000px',
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
          label: '规格型号',
          value: '',
          key: 'model',
          placeholder: '请输入规格型号'
        }, {
          label: '梁场名称：',
          value: '',
          placeholder: '请选择',
          key: 'projectId',
          select: []
        }],
        isShowHistory: false,
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
        gooodsSelectionData: [],
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
        ids: '',
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
        orderShow1: false,
        contractGoodsDialog: {
          width: '1000px',
          show: false,
          title: '选择合同物资'
        },
        searchDataContractGoods: [{
          key: 'goodsName',
          label: '商品名称',
          value: ''
        }, {
          key: 'goodsAlias',
          label: '商品别名',
          value: ''
        }],
        dataSearchContractGoods: {},
        tablePerformanceContract: 'purchase_dialog_contract_table',
        ContractGoodsTabUrl: this.$Api.contractGoods.list,
        dataHeaderContractGoods: [
          {prop: 'number', label: '序号', width: '60', slot: true},
          {label: '商品名称', prop: 'goodsName'},
          {label: '商品别名', prop: 'goodsAlias'},
          {label: '规格型号', prop: 'model'},
          {label: '品牌', prop: 'brand'},
          {label: '单位', prop: 'unit'},
          {label: '销售价格', prop: 'price'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        pageContractGoods: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'purchase_dialog_contract_table'
        },
        goodsId: ''
      }
    },
    computed: {
    },
    created () {
      this.id = this.$route.params.id
      this.page.purchaseId = this.id
      this.uploadData2.url = this.uploadData2.url + '/' + this.id
      this.getTableData()
      this.approvalPage.id = this.id
      this.approvalPageInside.id = this.id
      this.getBeamField()
      this.getQuotationEnum()
    },
    methods: {
      show () {
        this.orderShow = !this.orderShow
      },
      show1 () {
        this.orderShow1 = !this.orderShow1
      },
      getQuotationEnum () {
        this.ajaxPost(this.$Api.order.getQuotationEnumValues, (res) => {
          if (res.data.result) {
            this.optionsQuotationEnum = res.data.data
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
      toDismissal (res) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
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
      batchInternal () {
        this.disabledInternal = true
        let arrData = this.getGoodsListChange
        let okCode = true
        this.gooodsSelectionData.map(item => {
          if (!item.pricingAnalysis || item.pricingAnalysis === '' || !item.recommendGoodsPrice || item.recommendGoodsPrice === '') {
            okCode = false
          }
        })
        if (arrData && arrData.length > 0) {
          if (okCode) {
            this.$confirm('确定要提交内审吗？', '操作提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.$Ajax.post({
                url: this.$Api.examine.batchInternalAudit,
                data: {
                  goodsIds: arrData
                },
                cb: res => {
                  if (res.data.result) {
                    this.$message('提交内审成功')
                    this.getTableData()
                    this.disabledInternal = false
                  }
                }
              })
            }).catch(() => {
              this.disabledInternal = false
            })
          } else {
            this.$message('您填写的信息不全，请完善信息再次提交')
            this.disabledInternal = false
          }
        } else {
          this.disabledInternal = false
          this.$message('请选择物资')
        }
      },
      btnAjax (type) {
        let json = {
          operateType: type,
          listPurchaseGoodsList: this.dataStatic
        }
        this.$Ajax.post({
          url: this.$Api.examine.operateListPurchaseGoodsVOS,
          data: {
            json: JSON.stringify(json)
          },
          cb: res => {
            if (res.data.result) {
              this.getTableData()
              this.$message(res.data.message)
              this.disabledSave = false
              this.disabledSubmit = false
            }
          }
        })
      },
      btnSave () {
        this.disabledSave = true
        let json = {
          operateType: 1,
          listPurchaseGoodsList: this.dataStatic
        }
        this.$Ajax.post({
          url: this.$Api.examine.getGrossMarginRatio,
          data: {
            json: JSON.stringify(json)
          },
          cb: res => {
            if (!res.data.result) {
              const h = this.$createElement
              this.$confirm(h('span', { style: 'color: red' }, res.data.message), '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                this.btnAjax(1)
              }).catch(() => {
                this.disabledSave = false
              })
            } else {
              this.$confirm('确定要保存吗？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                this.btnAjax(1)
              }).catch(() => {
                this.disabledSave = false
              })
            }
          }
        })
      },
      btnSubmit () {
        this.disabledSubmit = true
        let fixedPricesJson = []
        this.dataStatic.map(item =>{
          fixedPricesJson.push({
            goodsName:item.goodsName,
            attrValue:item.model,
            unit:item.unit,
            price:item.recommendGoodsPrice,
          })
        })
        this.$Ajax.post({
          url: this.$Api.examine.fixedPrices,
          data:{
            goodsPriceQOJson:JSON.stringify(fixedPricesJson)
          },
          cb: res => {
            console.log("res",res)
            if (!res.data.data) {
                if (res.data.result) {
                  let json = {
                    operateType: 2,
                    listPurchaseGoodsList: this.dataStatic
                  }
                  this.$Ajax.post({
                    url: this.$Api.examine.getGrossMarginRatio,
                    data: {
                      json: JSON.stringify(json)
                    },
                    cb: res => {
                      if (!res.data.result) {
                        const h = this.$createElement
                        this.$confirm(h('span', { style: 'color: red' }, res.data.message), '操作提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消'
                        }).then(() => {
                          this.btnAjax(2)
                        }).catch(() => {
                          this.disabledSubmit = false
                        })
                      } else {
                        this.$confirm('确定要保存吗？', '操作提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消'
                        }).then(() => {
                          this.btnAjax(2)
                        }).catch(() => {
                          this.disabledSubmit = false
                        })
                      }
                    }
                  })
                }else{
                  let goodsNameList = []
                  res.data.data.map(item =>{
                    goodsNameList.push(item.goodsName)
                  })
                  if (goodsNameList.length == 1) {
                    this.$confirm('提交的物资超过最高限报价，请重新报价', '操作提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                    }).then(() => {
                      this.disabledSubmit = false
                    }).catch(() => {
                      this.disabledSubmit = false
                    })
                  }else{
                    let allGoods = goodsNameList.join('、')
                    this.$confirm(allGoods + '超过最高限报价，请重新报价', '操作提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                    }).then(() => {
                      this.disabledSubmit = false
                    }).catch(() => {
                      this.disabledSubmit = false
                    })
                  }
                }
            }else{
              this.$message('暂无数据')
            }
          }
        })
      },
      getTableDataContractGoods (data) {
        this.pageContractGoods.totalNum = data.data.total
      },
      searchContractGoods (res) {
        this.dataSearchContractGoods = res
        if (JSON.stringify(this.dataSearchContractGoods) === '{}') {
          this.pageContractGoods.offset = 0
          this.pageContractGoods.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.dataSearchContractGoods, this.pageContractGoods], this.tablePerformanceContract, this)
      },
      contractMaterials (item) {
        this.goodsId = item.id
        if (item.recommendGoodsPrice) {
          this.contractGoodsDialog.show = true
        } else {
          this.$message('销售价未填写，请先将合同物资的销售价格填写完整')
        }
      },
      addPurchaseItem (id) {
        this.$confirm('点击合同物资将推送下一个环节，确定要推送吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$Ajax.post({
            url: this.$Api.examine.signContractGoods,
            data: {
              goodsId: this.goodsId,
              contractGoodsId: id
            },
            cb: res => {
              if (res.data.result) {
                this.$message('标记合同物资成功')
                this.getTableData()
              }
            }
          })
        }).catch(() => {
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
        this.historyDialogPage.model = ''
        this.historyDialogPage.projectId = ''
        this.historyDialogSearchData[0].value = goodsName
        this.$Utils.pageUpdateTable([this.historyDialogPage], this.historyDialogDataRefs, this)
        this.isShowHistory = true
        this.historyDialog.show = true
      },
      addSaveDataFormDialog (res) {
        this.$Ajax.post({
          url: this.$Api.order.addListPurchaseGoods,
          data: {
            listPurchaseId: this.id,
            goodsName: res.goodsName,
            brand: res.brand,
            model: res.model,
            unit: res.unit,
            count: res.count,
            purpose: res.purpose,
            remarkForPrice: res.remarkForPrice
          },
          cb: res => {
            if (res.data.result) {
              this.$message('新增成功！')
            }
            this.addCancelDataFormDialog()
            this.getTableData()
          }
        })
      },
      toNew () {
        this.$bus.emit('form-clear')
        this.addDialog.show = true
      },
      addCancelDataFormDialog () {
        this.addDialog.show = false
        this.$bus.emit('form-clear')
      },
      saveDataFormDialog (res) {
        this.$Ajax.post({
          url: this.$Api.order.updatePurchaseGoodsById,
          data: {
            id: this.ids,
            goodsName: res.goodsName,
            model: res.model,
            brand: res.brand ? res.brand : '',
            unit: res.unit,
            count: res.count,
            purpose: res.purpose ? res.purpose : '',
            remarkForPrice: res.remarkForPrice ? res.remarkForPrice : '',
            updateReason: res.updateReason
          },
          cb: res => {
            this.$message(res.data.data)
            this.cancelDataFormDialog()
            this.getTableData()
          }
        })
      },
      cancelDataFormDialog () {
        this.editDialog.show = false
        this.$bus.emit('form-clear')
      },
      toEdit (row) {
        this.dataFormDialog.from[0].value = row.goodsName
        this.dataFormDialog.from[1].value = row.model
        this.dataFormDialog.from[2].value = row.brand
        this.dataFormDialog.from[3].value = row.unit
        this.dataFormDialog.from[4].value = row.count
        this.dataFormDialog.from[5].value = row.purpose
        this.dataFormDialog.from[6].value = row.remarkForPrice
        this.dataFormDialog.from[7].value = row.updateReason
        this.editDialog.show = true
        this.ids = row.id
      },
      remarkForPriceChange (id, remarkForPrice) {
        this.$Ajax.post({
          url: this.$Api.order.saveThisRemarkForPrice,
          data: {
            id: id,
            remarkForPrice: remarkForPrice
          },
          cb: res => {
            if (res.status === 200) {
              this.getTableData()
            }
          }
        })
      },
      changeQuotationEnum (row) {
        this.$Ajax.post({
          url: this.$Api.order.updateQuotationEnum,
          data: {
            goodsId: row.id,
            quotationEnum: row.quotationEnumCode
          },
          cb: res => {
            if (res.status === 200) {
              this.getTableData()
            }
          }
        })
      },
      getImgTableData (data) {
        this.page.totalNum = data.data.total
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
        if (pricingAnalysis && pricingAnalysis !== '') {
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
        } else {
          this.$message.error('请输入定价说明')
        }
      },
      myConfirm (msg, myCallback) {
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
        this.myConfirm('确定要删除这条记录吗？', () => {
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
              if (res.data.result) {
                this.$message('删除成功')
                this.getTableData()
              } else {
                this.$message(res.data.message)
              }
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
            if (res.data.result) {
              this.dataList = res.data.data
              this.dataStatic = res.data.data.listPurchaseGoodsList ? res.data.data.listPurchaseGoodsList : []
              this.dataStatic.map(item => {
                if (item.remarkForPrice === 'undefined') {
                  item.remarkForPrice = null
                }
              })
              this.loading = false
              this.goodsPriceTotle = res.data.data.goodsPriceTotle
              this.totalNum = res.data.data.listPurchaseGoodsList.length ? res.data.data.listPurchaseGoodsList.length : 0
              if (this.dataList.state === 0) {
                this.isDistribution = true
              }
            }
          }
        })
      },
      recommendGoodsPriceChange (listPurchaseGoodsId, goodsId, price) {
        if (price <= 0) {
          this.$message('请正确填写价格')
          this.getTableData()
          return false
        }
        this.$Ajax.get({
          url: this.$Api.order.saveSellingPriceFun,
          data: {
            params: {
              listPurchaseGoodsId: listPurchaseGoodsId,
              goodsId: goodsId,
              type: 1,
              goodsPrice: price
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.getTableData()
              this.closeGoodsDialog()
            }
          }
        })
      },
      stockPriceChange (id, price) {
        if (price <= 0) {
          this.$message('请正确填写价格')
          this.getTableData()
          return false
        }
        this.$Ajax.get({
          url: this.$Api.order.saveThisStockPrice,
          data: {
            params: {
              id: id,
              stockPrice: price
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.getTableData()
              this.closeGoodsDialog()
            }
          }
        })
      },
      saleGuidancePriceChange (id, price) {
        if (price <= 0) {
          this.$message('请正确填写价格')
          this.getTableData()
          return false
        }
        this.$Ajax.get({
          url: this.$Api.order.saveSaleGuidancePrice,
          data: {
            params: {
              id: id,
              saleGuidancePrice: price
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.getTableData()
              this.closeGoodsDialog()
            }
          }
        })
      },
      priceCompostChange (id, priceCompost) {
        this.$Ajax.post({
          url: this.$Api.order.savePriceCompost,
          data: {
            listPurchaseGoodsId: id,
            priceCompost: priceCompost
          },
          cb: res => {
            if (res.status === 200) {
              this.getTableData()
            }
          }
        })
      },
      getTableData1 (data) {
        this.page1.totalNum = data.data.total
      },
      onUploadSuccess (res, file, fileList) {
        this.$Utils.pageUpdateTable([this.page], this.tablePerformance, this)
      },
      onShowImg (item) {
        this.popoverImgPath = item
        this.dialogVisible = true
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
      },
      openGoodsDialog (item) {
        this.listPurchaseGoodsId = item.id
        this.page1.name = item.goodsName
        this.page1.goodsCode = item.goodsCode ? item.goodsCode : ''
        this.searchData[0].value = item.goodsName
        this.searchData[1].value = item.goodsCode ? item.goodsCode : ''
        this.$Utils.pageUpdateTable([this.page1, this.dataSearch], this.tablePerformance1, this)
        this.goodsDialog.show = true
      },
      closeGoodsDialog () {
        this.goodsDialog.show = false
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page1.offset = 0
          this.page1.currentPage = 1
          this.page1.name = ''
        }
        this.$Utils.pageUpdateTable([this.page1, this.dataSearch], this.tablePerformance1, this)
      },
      addGoodsItem (row) {
        this.$Ajax.post({
          url: this.$Api.order.associatedGoodsInfo,
          data: {
            id: this.listPurchaseGoodsId,
            goodsCode: row.goodsCode,
            lubanClassCode: row.lubanClassCode
          },
          cb: res => {
            if (res.data.result) {
              this.$message(res.data.message)
              this.goodsDialog.show = false
              this.getTableData()
            }
          }
        })
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
            // this.$router.back()
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
//        this.$Ajax.post({
//          url: this.$Api.order.savePush,
//          data: {
//            listPurchaseId: this.id
//          },
//          cb: res => {
//            if (res.status === 200) {
//              this.onSave()
//            }
//          }
//        })
      },
      myAlert (msg, myCallback) {
        this.$alert(msg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            myCallback()
          }
        })
      },
      distribution () {
        this.dialogVisiblesync = true
        this.getAllocation()
      },
      getAllocation (loading) {
        this.$Ajax.post({
          url: this.$Api.order.oneKeyAllocation,
          data: {
            listPurchaseId: this.id
          },
          cb: res => {
            if (res.data.result) {
              this.dialogVisiblesync = false
              this.$message({
                message: '配货成功',
                type: 'success'
              })
              this.getTableData()
            }
          }
        })
      },
      delGoods () {
        if (this.getGoodsListChange.length) {
          this.dialogDataDel.show = true
        } else {
          this.$message('请选择物资')
        }
      },
      gooodsSelection (res) {
        this.gooodsSelectionData = res
        this.getGoodsListChange = this.gooodsSelectionData.map(item => item.id)
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
        json.ids = this.getGoodsListChange
        this.$Ajax.post({
          url: this.$Api.order.deleteListPurchase,
          data: {
            json: JSON.stringify(json)
          },
          cb: res => {
            if (res.data.result) {
              this.cancelDialog()
              this.getTableData()
            }
          }
        })
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
    min-height: 30px;
  }

  .item_img {
    font-size: 14px;
    color: #008aff;
  }

  .item_img:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .item_img1 {
    font-size: 14px;
    color: #008aff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 120px;
  }

  .item_img1:hover {
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

  .add_item {
    font-size: 14px;
    color: #008aff;
    cursor: pointer;
  }

  .add_item:hover {
    text-decoration: underline;
  }

  .distribution {
    margin: 14px 0 16px 26px;
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
    border-left-color:rgba(0, 0, 0, 0.647058823529412);
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

  .upload .el-button {
    padding: 5px 5px !important;
  }

  .upload .avatar-uploader .el-upload {
    border: none;
    border-radius: 0px;
  }
</style>
