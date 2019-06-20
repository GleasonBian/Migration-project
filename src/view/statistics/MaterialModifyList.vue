<template>
  <div>
    <el-tabs>
      <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
        <el-tab-pane label="采购物资修改记录" name="first">
        </el-tab-pane>
        <el-tab-pane label="销售物资修改记录"
                     name="second">
        </el-tab-pane>
        <el-tab-pane label="物资删除记录"
                     name="third">
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <div v-show="showPurchase">
      <v-search :data="searchDataPurchase" @on-click="searchPurchase"></v-search>
      <table-list :data-header="dataHeaderPurchase" :url="tabUrlPurchase" :params="pagePurchase"
                  @get-table-data="getTableDataPurchase"
                  :refs="tableRefPurchase">
        <template v-slot:record="scope">
          <a class="handle" @click="toRecordPurchase(scope.row)">查看</a>
        </template>
      </table-list>
      <v-page :data="pagePurchase" :dataArr="[dataSearchPurchase]"></v-page>
    </div>
    <div v-show="showSale">
      <v-search :data="searchDataSale" @on-click="searchSale"></v-search>
      <table-list :data-header="dataHeaderSale" :url="tabUrlSale" :params="pageSale" @get-table-data="getTableDataSale"
                  :refs="tableRefSale">
        <template v-slot:record="scope">
          <a class="handle" @click="toRecordSale(scope.row)">查看</a>
        </template>
      </table-list>
      <v-page :data="pageSale" :dataArr="[dataSearchSale]"></v-page>
    </div>
    <div v-show="showDel">
      <v-search :data="searchDataDel" @on-click="searchDel"></v-search>
      <table-list :data-header="dataHeaderDel" :url="tabUrlDel" :params="pageDel" @get-table-data="getTableDataDel"
                  :refs="tableRefDel">
        <template v-slot:deletedReason="scope">
          <div :title="scope.row.deletedReason" style="width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.deletedReason}}</div>
        </template>
        <template v-slot:record="scope">
          <a class="handle" @click="toRecordDel(scope.row)">查看</a>
        </template>
      </table-list>
      <v-page :data="pageDel" :dataArr="[dataSearchDel]"></v-page>
    </div>
    <v-dialog :dialog="dialogDataPurchase" @on-cancel="viewCancelPurchase">
      <table-list :data-header="dataHeaderDetailPurchase" :data-static="dataStaticPurchase"
                  :static="tableStaticPurchase"></table-list>
    </v-dialog>
    <v-dialog :dialog="dialogDataSale" @on-cancel="viewCancelSale">
      <table-list :data-header="dataHeaderDetailSale" :data-static="dataStaticSale" :static="tableStaticSale"></table-list>
    </v-dialog>
    <!--删除记录查看-->
    <v-dialog :dialog="dialogDataDel" @on-cancel="viewCancelDel">
      <div>
        <span class="width_120">删除人：</span>
        <span>{{dataDelDetails.userName}}</span>
      </div>
      <div>
        <span class="width_120">删除时间：</span>
        <span>{{dataDelDetails.createTimeStr}}</span>
      </div>
      <div>
        <span class="width_120">删除原因：</span>
        <span>{{dataDelDetails.deletedReason}}</span>
      </div>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    data () {
      return {
        showPurchase: true,
        showSale: false,
        showDel: false,
        activeName: 'first',
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlStatePurchase: this.$Api.statistics.getEnumValuesPlan,
        urlStateSale: this.$Api.statistics.getEnumValues,
        searchDataPurchase: [
          {
            label: '采购单号：',
            value: '',
            placeholder: '请输入采购单号',
            key: 'code'
          },
          {
            label: '梁场名称：',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
            select: []
          },
          {
            label: '创建时间：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          },
          {
            label: '商品名称：',
            value: '',
            placeholder: '请输入商品名称',
            key: 'goodsName'
          },
          {
            key: 'stateCode',
            label: '物资状态：',
            value: '',
            select: []
          },
          {
            label: '修改人：',
            value: '',
            placeholder: '',
            key: 'userName'
          }
        ],
        searchDataSale: [
          {
            label: '采购单号：',
            value: '',
            placeholder: '请输入采购单号',
            key: 'code'
          },
          {
            label: '梁场名称：',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
            select: []
          },
          {
            label: '创建时间：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          },
          {
            label: '商品名称：',
            value: '',
            placeholder: '请输入商品名称',
            key: 'goodsName'
          },
          {
            key: 'stateCode',
            label: '物资状态：',
            value: '',
            select: [
              {label: '待配货', value: '10'},
              {label: '审批中', value: '20'},
              {label: '已通过', value: '30'}
            ]
          },
          {
            label: '修改人：',
            value: '',
            placeholder: '',
            key: 'userName'
          }
        ],
        dataSearchPurchase: {},
        dataSearchSale: {},
        dataHeaderPurchase: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'unitPrice', label: '采购价'},
          {prop: 'totalGoodsPrice', label: '采购金额'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'stateDisplay', label: '物资状态'},
          {prop: 'purchasePlanNumber', label: '采购单号'},
          {prop: 'userName', label: '修改人'},
          {prop: 'updateReason', label: '修改原因'},
          {prop: 'createTimeStr', label: '修改时间'},
          {prop: 'record', label: '修改记录', slot: true}
        ],
        dataHeaderSale: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'purpose', label: '用途'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'pricingAnalysis', label: '定价说明'},
          {prop: 'recommendGoodsPrice', label: '世界高铁网价'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'stateDisplay', label: '物资状态'},
          {prop: 'code', label: '采购单号'},
          {prop: 'userName', label: '修改人'},
          {prop: 'updateReason', label: '修改原因'},
          {prop: 'createTimeStr', label: '修改时间'},
          {prop: 'record', label: '修改记录', slot: true}
        ],
        tableRefPurchase: 'table_ref_purchase',
        tableRefSale: 'table_ref_sale',
        tabUrlPurchase: this.$Api.statistics.findPagePurchasePlanGoodsUpdateRecordList,
        tabUrlSale: this.$Api.statistics.findPageListPurchaseGoodsUpdateRecordList,
        pagePurchase: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_ref_purchase'
        },
        pageSale: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_ref_sale'
        },
        dialogDataPurchase: {show: false, title: '物资修改记录', width: '1000px'},
        dialogDataSale: {show: false, title: '物资修改记录', width: '1000px'},
        dialogDataDel: {show: false, title: '删除原因', width: '700px'},
        dataHeaderDetailPurchase: [
          {prop: 'name', label: ''},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'unitPrice', label: '采购价'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'remark', label: '其他要求'}
        ],
        tableStaticPurchase: true,
        dataStaticPurchase: [],
        dataHeaderDetailSale: [
          {prop: 'name', label: ''},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'recommendGoodsPrice', label: '世界高铁网价'},
          {prop: 'purpose', label: '用途'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'pricingAnalysis', label: '定价说明'}
        ],
        tableStaticSale: true,
        dataStaticSale: [],
        searchDataDel: [
          {
            label: '采购单号：',
            value: '',
            placeholder: '请输入采购单号',
            key: 'code'
          },
          {
            label: '梁场名称：',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
            select: []
          },
          {
            label: '创建时间：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          },
          {
            label: '商品名称：',
            value: '',
            placeholder: '请输入商品名称',
            key: 'goodsName'
          },
          {
            key: 'stateCode',
            label: '删除来源：',
            value: '',
            select: [
              {label: '采购计划', value: '1'},
              {label: '梁场采购单', value: '2'}
            ]
          }
        ],
        dataSearchDel: {},
        pageDel: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_ref_del'
        },
        tableRefDel: 'table_ref_del',
        dataHeaderDel: [
          {prop: 'code', label: '采购单号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'purpose', label: '用途'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'deletedReason', label: '删除原因', width: '130', slot: true},
          {prop: 'userName', label: '删除人'},
          {prop: 'createTimeStr', label: '删除时间'},
          {prop: 'businessTypeDisplay', label: '来源'},
          {prop: 'record', label: '修改记录', slot: true}
        ],
        tabUrlDel: this.$Api.statistics.findPageGoodsDeletedRecordList,
        tableStaticDel: true,
        dataStaticDel: [],
        dataDelDetails: {}
      }
    },
    computed: {},
    created () {
      this.getBeamField()
      this.getStatePurchase()
      this.getStateSale()
    },
    methods: {
      getBeamField () {
        this.$Ajax.post({
          url: this.urlBeamField,
          data: {},
          cb: res => {
            if (res.data.result) {
              let arrBeamData = res.data.data
              this.searchDataPurchase.map(item => {
                if (item.key === 'projectId') {
                  item.select = this.fliterSelectBeam(arrBeamData)
                }
              })
              this.searchDataSale.map(item => {
                if (item.key === 'projectId') {
                  item.select = this.fliterSelectBeam(arrBeamData)
                }
              })
              this.searchDataDel.map(item => {
                if (item.key === 'projectId') {
                  item.select = this.fliterSelectBeam(arrBeamData)
                }
              })
            }
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
      getStatePurchase () {
        this.$Ajax.post({
          url: this.urlStatePurchase,
          data: {},
          cb: res => {
            if (res.data.result) {
              let arrStateDataPurchase = res.data.data
              this.searchDataPurchase.map(item => {
                if (item.key === 'stateCode') {
                  item.select = this.fliterSelectState(arrStateDataPurchase)
                }
              })
            }
          }
        })
      },
      getStateSale () {
        this.$Ajax.post({
          url: this.urlStateSale,
          data: {},
          cb: res => {
            if (res.data.result) {
              let arrStateDataPurchase = res.data.data
              this.searchDataSale.map(item => {
                if (item.key === 'stateCode') {
                  item.select = this.fliterSelectState(arrStateDataPurchase)
                }
              })
            }
          }
        })
      },
      fliterSelectState (res) {
        let arrState = []
        if (res.length) {
          res.map(item => {
            arrState.push({label: item.display, value: item.code})
          })
        }
        return arrState
      },
      pageUpdateTable (data, ref) {
        this.$Utils.pageUpdateTable(data, ref, this)
      },
      searchPurchase (res) {
        this.dataSearchPurchase = res
        if (JSON.stringify(this.dataSearchPurchase) === '{}') {
          this.pagePurchase.offset = 0
          this.pagePurchase.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchPurchase, this.pagePurchase], this.tableRefPurchase)
      },
      searchSale (res) {
        this.dataSearchSale = res
        if (JSON.stringify(this.dataSearchSale) === '{}') {
          this.pageSale.offset = 0
          this.pageSale.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchSale, this.pageSale], this.tableRefSale)
      },
      searchDel (res) {
        this.dataSearchDel = res
        if (JSON.stringify(this.dataSearchDel) === '{}') {
          this.pageDel.offset = 0
          this.pageDel.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchDel, this.pageDel], this.tableRefDel)
      },
      getTableDataPurchase (data) {
        this.pagePurchase.totalNum = data.data.total
      },
      getTableDataSale (data) {
        this.pageSale.totalNum = data.data.total
      },
      getTableDataDel (data) {
        this.pageDel.totalNum = data.data.total
      },
      toRecordPurchase (res) {
        this.getDataDetailPurchase(res.id)
        this.dialogDataPurchase.show = true
      },
      viewCancelPurchase () {
        this.dialogDataPurchase.show = false
      },
      toRecordSale (res) {
        this.getDataDetailSale(res.id)
        this.dialogDataSale.show = true
      },
      viewCancelSale () {
        this.dialogDataSale.show = false
      },
      toRecordDel (res) {
        this.getDataDetailDel(res.id)
        this.dialogDataDel.show = true
      },
      viewCancelDel () {
        this.dialogDataDel.show = false
      },
      getDataDetailPurchase (id) {
        this.$Ajax.post({
          url: this.$Api.statistics.getPurchasePlanGoodsUpdateRecordVOById,
          data: {id: id},
          cb: res => {
            if (res.data.result) {
              let data = res.data.data
              let arr = []
              arr.push(
                {
                  name: '新商品信息',
                  goodsName: data.goodsName,
                  typeModel: data.typeModel,
                  brandName: data.brandName,
                  unit: data.unit,
                  goodsCount: data.goodsCount,
                  unitPrice: data.unitPrice,
                  taxPoint: data.taxPoint,
                  remark: data.remark
                }
              )
              arr.push(
                {
                  name: '原商品信息',
                  goodsName: data.oldGoodsName,
                  typeModel: data.oldTypeModel,
                  brandName: data.oldBrandName,
                  unit: data.oldUnit,
                  goodsCount: data.oldGoodsCount,
                  unitPrice: data.oldUnitPrice,
                  taxPoint: data.oldTaxPoint,
                  remark: data.oldRemark
                }
              )
              this.dataStaticPurchase = arr
            }
          }
        })
      },
      getDataDetailSale (id) {
        this.$Ajax.post({
          url: this.$Api.statistics.getListPurchaseGoodsUpdateRecordVOById,
          data: {id: id},
          cb: res => {
            if (res.data.result) {
              let data = res.data.data
              let arr = []
              arr.push(
                {
                  name: '新商品信息',
                  goodsName: data.goodsName,
                  model: data.model,
                  brand: data.brand,
                  unit: data.unit,
                  count: data.count,
                  recommendGoodsPrice: data.recommendGoodsPrice,
                  purpose: data.purpose,
                  remark: data.remark,
                  pricingAnalysis: data.pricingAnalysis
                }
              )
              arr.push(
                {
                  name: '原商品信息',
                  goodsName: data.oldGoodsName,
                  model: data.oldModel,
                  brand: data.oldBrand,
                  unit: data.oldUnit,
                  count: data.oldCount,
                  recommendGoodsPrice: data.oldRecommendGoodsPrice,
                  purpose: data.oldPurpose,
                  remark: data.oldRemark,
                  pricingAnalysis: data.oldPricingAnalysis
                }
              )
              this.dataStaticSale = arr
            }
          }
        })
      },
      getDataDetailDel (id) {
        this.$Ajax.post({
          url: this.$Api.statistics.getGoodsDeletedRecordVOById,
          data: {id: id},
          cb: res => {
            if (res.data.result) {
              this.dataDelDetails = res.data.data
            }
          }
        })
      },
      tabClick (res) {
        let _this = this
        if (res.index === '0') {
          this.showPurchase = true
          this.showSale = false
          this.showDel = false
          Vue.nextTick().then(function () {
            _this.pageUpdateTable([_this.dataSearchPurchase, _this.pagePurchase], _this.tableRefPurchase)
          })
        } else if (res.index === '1') {
          this.showPurchase = false
          this.showSale = true
          this.showDel = false
          Vue.nextTick().then(function () {
            _this.pageUpdateTable([_this.dataSearchSale, _this.pageSale], _this.tableRefSale)
          })
        } else if (res.index === '2') {
          this.showPurchase = false
          this.showSale = false
          this.showDel = true
          Vue.nextTick().then(function () {
            _this.pageUpdateTable([_this.dataSearchDel, _this.pageDel], _this.tableRefDel)
          })
        }
      }
    }
  }
</script>

<style scoped>
  .handle {
    font-size: 12px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }

  .handle.text_red {
    color: #ff0000
  }
</style>
<style>
  .width_120 {width: 90px;display: inline-block;text-align: right;color: #000;}
</style>
