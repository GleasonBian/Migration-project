<template>
  <div>
    <div>
      <v-search :data="searchData" @on-click="search" :width="widthLabel"></v-search>
      <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                  :refs="tableRef">
        <template slot-scope="scope" slot="examinePlan">
          <a class="handle" @click="toDismissal(scope.row, '1')">审批记录</a>
        </template>
        <template slot-scope="scope" slot="examineList">
          <a class="handle" @click="toDismissal(scope.row, '2')">审批记录</a>
        </template>
      </table-list>
      <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    </div>
    <!-- 审批记录 -->
    <examine-dialog :dialogDataView="dialogDataView" :pageView="pageView" :goodsName="goodsName"
                    :tablePerformanceView="tablePerformanceView"></examine-dialog>
  </div>
</template>

<script>
  import examineDialog from '../examine/examineDialog.vue'
  export default {
    components: {examineDialog},
    data () {
      return {
        widthLabel: '154px',
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlPurchasePlanGoods: this.$Api.statistics.getPurchasePlanGoodsState,
        urlListPurchaseGoods: this.$Api.statistics.getListPurchaseGoodsMaterialState,
        searchData: [
          {
            label: '采购单号:',
            value: '',
            placeholder: '请输入采购单号',
            key: 'code'
          },
          {
            label: '梁场名称:',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
            select: []
          },
          {
            label: '创建时间:',
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
            label: '商品名称:',
            value: '',
            placeholder: '请输入商品名称',
            key: 'goodsName'
          },
          {
            label: '采购计划物资状态:',
            value: '',
            placeholder: '请选择',
            key: 'purchasePlanGoodsCode',
            select: []
          },
          {
            label: '梁场采购单物资状态:',
            value: '',
            placeholder: '请选择',
            key: 'listPurchaseGoodsCode',
            select: []
          }
        ],
        dataSearch: {},
        dataHeader: [
          {prop: 'purchasePlanNumber', label: '采购单号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'recommendGoodsPrice', label: '销售价格'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'planStateDisplay', label: '采购计划物资状态'},
          {prop: 'examinePlan', label: '采购计划审批记录', slot: true},
          {prop: 'materialStateDisplay', label: '梁场采购单物资状态'},
          {prop: 'examineList', label: '梁场采购单审批记录', slot: true}
        ],
        tableRef: 'table_ref_material_modify_list',
        tabUrl: this.$Api.statistics.findMaterialsApprovalState,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_ref_material_modify_list'
        },
        goodsName: '',
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
          refs: 'product_data_table_examine'
        },
        tablePerformanceView: 'product_data_table_examine'
      }
    },
    computed: {},
    created () {
      this.getBeamField()
      this.getPurchasePlanGoods()
      this.getListPurchaseGoods()
    },
    methods: {
      getBeamField () {
        this.$Ajax.post({
          url: this.urlBeamField,
          data: {},
          cb: res => {
            if (res.data.result) {
              let arrBeamData = res.data.data
              this.searchData.map(item => {
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
      getPurchasePlanGoods () {
        this.$Ajax.post({
          url: this.urlPurchasePlanGoods,
          data: {},
          cb: res => {
            if (res.data.result) {
              let arrData = res.data.data
              this.searchData.map(item => {
                if (item.key === 'purchasePlanGoodsCode') {
                  item.select = arrData
                }
              })
            }
          }
        })
      },
      getListPurchaseGoods () {
        this.$Ajax.post({
          url: this.urlListPurchaseGoods,
          data: {},
          cb: res => {
            if (res.data.result) {
              let arrData = res.data.data
              this.searchData.map(item => {
                if (item.key === 'listPurchaseGoodsCode') {
                  item.select = arrData
                }
              })
            }
          }
        })
      },
      pageUpdateTable (data, ref) {
        this.$Utils.pageUpdateTable(data, ref, this)
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.pageUpdateTable([this.dataSearch, this.page], this.tableRef)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      toDismissal (res, type) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
        this.dialogDataView.show = true
        this.pageView.goodsId = res.id
        this.pageView.typeCode = type
        this.$Utils.pageUpdateTable([[], this.pageView], this.tablePerformanceView, this)
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
