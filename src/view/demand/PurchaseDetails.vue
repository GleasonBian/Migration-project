<template>
  <div class="">
    <v-list :data="demandDetaildData" :data-list="demandDetailList" :list-style="listStyle"></v-list>
    <v-list :data="demandRemarkData" :data-list="demandDetailList" :list-style="listStyleRemark">
      <template v-slot:enclosure="scope">
        <table-list :data-header="dataHeaderEnclosure" :static="true" :dataStatic="dataTableEnclosure" :refs="tableDemandEnclosure">
          <template v-slot:downFile="scope">
            <a :href="getHrefFile(scope.row.filePath)">下载</a>
          </template>
        </table-list>
      </template>
    </v-list>
    <div style="margin: 10px 0">商品明细</div>
    <table-list :data-header="dataHeaderGoods" :tabStyle="TabStyle" :static=true :dataStatic="dataTableGoodsAll" :refs="tableDemandGoodsDetail">
      <template v-slot:goodsCode="scope">
        <div v-if="scope.row.type === 1">{{scope.row.goodsId}}</div>
        <div v-else-if="demandDetailList.stateStr === '待接单'">
          <div v-if="scope.row.goodsProviderVO">
            <el-button type="text"  @click="relativeGoods(scope.row)">已关联商品</el-button>
          </div>
          <el-button v-else type="text" class="el-table__expand-column" @click="relativeGoods(scope.row)" ref="aaa">未关联商品</el-button>
        </div>
        <div v-else>
          <div v-if="scope.row.goodsProviderVO">已关联商品</div>
          <div v-else>未关联商品</div>
        </div>
      </template>
      <template v-slot:expand="scope">
        <table-list :data-header="dataHeaderGoods1" :tabStyle="TabStyle1" :static=true :dataStatic="getDataGoodsRelation(scope.row)" :refs="tableDemandGoodsDetail">

        </table-list>
      </template>
      <template v-slot:totalGoodsPrice="scope">
        <div v-if="scope.row.type === 1">{{scope.row.unitPrice * scope.row.goodsCount}}</div>
        <div v-else>-</div>
      </template>
      <template v-slot:unitPrice="scope">
        <el-input v-if="demandDetailList.stateStr === '待接单'" v-model="scope.row.unitPrice" type="number" @blur="changePrice(scope.row)"></el-input>
        <div v-else>{{scope.row.unitPrice}}</div>
      </template>
    </table-list>
    <div style="margin: 10px 0">审批意见</div>
    <table-list :data-header="dataHeaderOpinion" :static=true :dataStatic="dataTableOpinion" :refs="tableDemandOpinion"></table-list>
    <div style="margin: 10px 0">
      <el-button @click="returnList">返回列表</el-button>
      <el-button v-if="demandDetailList.stateStr === '待接单'" @click="rejected">驳回</el-button>
      <el-button v-if="demandDetailList.stateStr === '待接单'" @click="changeOrder">接单转为订单</el-button>
    </div>
    <v-dialog :dialog="dialogGoods">
      <form-group :data="goodsDialogData" :dataBut="dataGoodsBut" :custom=true
                  @on-ok="saveGoodsData" @on-cancel="cancelGoods" @close-dialog="closeDialogGoods">
        <template v-slot:searchGoodsData="scope">
          <v-search :data="searchGoodsData" @on-click="searchGoods"></v-search>
        </template>
        <template v-slot:selectedGoods="scope">
          <table-list :data-header="DialogdataHeaderGoods" :url="tabGoodsUrl" :params="pageGoods"
                       @get-table-data="getTableGoodsData" :refs="tableContractGoods">
            <template slot="goodsRadio1" slot-scope="scope">
              <el-radio v-model="goodsRadioRow" :label="scope.row">&nbsp; </el-radio>
            </template>
          </table-list>
          <v-page :data="pageGoods" :dataArr="[dataSearchGoods]"></v-page>
        </template>
      </form-group>
    </v-dialog>
    <v-dialog :dialog="dialogReject">
      <form-group :custom=true :data="RejectDialogFormData" :dataBut="RejectDialogdataBut" @on-cancel="Rejectcancel" @on-ok="RejectSave"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
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
        RejectDialogdataBut: [
          {
            text: '取消',
            key: 'cancel'
          }, {
            text: '确定',
            type: 'primary',
            key: 'ok'
          }
        ],
        RejectDialogFormData: {
          from: [
            {
              prop: 'remark',
              label: '接单备注：',
              value: '',
              type: 'textarea',
              labelWidth: '150px',
              rows: 5
            }
          ]
        },
        dialogReject: {
          show: false,
          title: '驳回意见',
          width: '800px'
        },
        dialogGoods: {
          show: false,
          title: '选择商品',
          width: '900px'
        },
        searchGoodsData: [{
          key: 'name',
          label: '商品名称：',
          value: '',
          type: 'text'
        }, {
          key: 'brand',
          label: '品牌：',
          value: '',
          type: 'text'
        }, {
          key: 'areaId',
          label: '区域：',
          value: '',
          select: []
        }],
        goodsRadioRow: {},
        DialogdataHeaderGoods: [{
          prop: 'goodsRadio1',
          slot: true,
          width: '50px'
        }, {
          prop: 'goodsCode',
          label: '商品编号'
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'goodsSpec',
          label: '规格型号'
        }, {
          prop: 'className',
          label: '三级类目'
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }],
        tabGoodsUrl: this.$Api.demand.findGoodsGroupByNameAndBrand,
        pageGoods: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_contract_goods'
        },
        goodsDialogData: {
          from: [
            {
              prop: 'searchGoodsData',
              custom: true
            }, {
              prop: 'selectedGoods',
              custom: true
            }
          ]
        },
        dataGoodsBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
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
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'creater', label: '创建人'},
          {prop: 'typeStr', label: '采购类型'},
          {prop: 'expectedDeliveryTime', label: '期望到货时间'},
          {prop: 'stateStr', label: '需求状态'},
          {prop: 'buyUserName', label: '采购员'},
          {prop: 'buyLinkManPhone', label: '联系方式'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'expressLinkMan', label: '收货人'},
          {prop: 'expressLinkManPhone', label: '收货人联系方式'},
          {prop: 'expressAddress', label: '收货地址'}
        ],
        demandRemarkData: [
          {prop: 'remark', label: '备注'},
          {prop: 'enclosure', label: '附件', slot: true}
        ],
        urlDemandDetail: this.$Api.demand.getPurchaseRequestById,
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
          type: 'expand',
          prop: 'expand',
          slot: true
        }, {
          prop: 'goodsCode',
          label: '商品编号',
          slot: true
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
          prop: 'unitPrice',
          label: '单价',
          slot: true
        }, {
          prop: 'goodsCount',
          label: '数量'
        }, {
          prop: 'remark',
          label: '其他要求'
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
          prop: 'goodsSpec',
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
          prop: 'remark',
          label: '其他要求'
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
        tableContractGoods: 'table_contract_goods',
        dataSearchGoods: [],
        selectRow: {},
        id: ''
      }
    },
    created () {
      this.id = this.$route.params.id
      this.getDemantData(this.id)
      this.getAreaInfo()
    },
    methods: {
      getAreaInfo () {
        this.ajaxPost(this.$Api.demand.getAreaInfo, {}, (res) => {
          if (res.data.result) {
            this.searchGoodsData[2].select = res.data.data
            this.searchGoodsData[2].select.map((item) => {
              item.disabled = false
            })
          }
        })
      },
      changePrice (row) {
        this.ajaxPost(this.$Api.demand.updatePurchaseRequestGoods, {purchaseRequestGoodsId: row.id, unitPrice: row.unitPrice}, (res) => {
          if (res.data.result) {
          }
        })
      },
      getDataGoodsRelation (res) {
        if (res.goodsProviderVO) {
          let arrRelation = []
          res.goodsProviderVO.goodsCount = res.goodsCount
          res.goodsProviderVO.totalGoodsPrice = res.totalGoodsPrice
          arrRelation.push(res.goodsProviderVO)
          return arrRelation
        } else {
          return []
        }
      },
      // 转为订单
      changeOrder () {
        let flag = true
        let tempList = this.dataTableGoodsAll
        if (tempList.length === 0) {
          return
        }
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i].type === 2 && !tempList[i].goodsProviderVO) {
            flag = false
            break
          }
        }
        if (flag) {
          this.ajaxPost(this.$Api.demand.purchaseRequestToOrderForm, {purchaseRequestId: this.demandDetailList.id}, (res) => {
            if (res.data.result) {
              this.jumpPage('demandPurchase')
            }
          })
        } else {
          this.$alert('采购需求中有未关联商品的采购物资。请先将关联商品。', '温馨提示', {
            confirmButtonText: '确定'
          })
        }
      },
      Rejectcancel () {
        this.showHideDialog(this.dialogReject, false)
      },
      RejectSave (res) {
        let remark
        if (res.remark) {
          remark = res.remark
        } else {
          remark = ''
        }
        this.ajaxPost(this.$Api.demand.savePurchaseRequestAudit, {purchaseRequestId: this.demandDetailList.id, remark: remark}, (res) => {
          if (res.data.result) {
            this.getDemantData(this.$route.params.id)
            this.showHideDialog(this.dialogReject, false)
          }
        })
      },
      rejected () {
        this.showHideDialog(this.dialogReject, true)
      },
      getTableGoodsData (data) {
        this.pageGoods.totalNum = data.data.total
      },
      searchGoods (res) {
        this.dataSearchGoods = res
        if (JSON.stringify(this.dataSearchGoods) === '{}') {
          this.pageGoods.offset = 0
          this.pageGoods.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchGoods, this.pageGoods], this.tableContractGoods, this)
      },
      cancelGoods () {
        this.showHideDialog(this.dialogGoods, false)
      },
      closeDialogGoods () {
        this.showHideDialog(this.dialogGoods, false)
      },
      showHideDialog (name, b) {
        name.show = b
      },
      saveGoodsData (res) {
        console.info(this.goodsRadioRow)
        if (JSON.stringify(this.goodsRadioRow) !== '{}') {
          this.ajaxPost(this.$Api.demand.doLinkGoods, {purchaseRequestGoodsId: this.selectRow.id, goodsId: this.goodsRadioRow.id, unitPrice: this.goodsRadioRow.price}, (res) => {
            if (res.data.result) {
              this.selectRow.goodsProviderVO = this.goodsRadioRow
              this.selectRow.unitPrice = this.goodsRadioRow.price
              this.pageUpdateTable([this.searchGoodsData, this.pageGoods], this.tableContractGoods, this)
              this.showHideDialog(this.dialogGoods, false)
              this.getDemantData(this.id)
            }
          })
        } else {
          this.$message('请选择商品')
        }
      },
      relativeGoods (row) {
        this.goodsRadioRow = {}
        this.selectRow = row
        this.showHideDialog(this.dialogGoods, true)
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
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
            this.dataTableGoodsAll = this.demandDetailList.purchaseRequestGoodsVOList
            this.dataTableOpinion = this.demandDetailList.purchaseRequestAuditVOList
          }
        })
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      returnList () {
        this.jumpPage('demandPurchase')
      }
    }
  }
</script>

<style>
  .ColumnHidden {visibility: hidden}
  .purchase_list > .v_list_li{width: 33% !important;float: left}
  .v_list_cont{width: 100%}
</style>
