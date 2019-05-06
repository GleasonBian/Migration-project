<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @push-order="pushOrder"></tab-but>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" :refs="tableDemandSceneList"
                @get-table-data="getTableData" @selection-change="selectionChange">
      <template slot-scope="scope" slot="code">
        <span class="handle font_14" v-if="scope.row.codes && scope.row.codes.indexOf(',') != -1" @click="codeDetails(scope.row.codes)">详情</span>
        <span v-else>{{scope.row.code}}</span>
      </template>
      <template slot-scope="scope" slot="lubanPlanCode">
        <span class="handle font_14" v-if="scope.row.lubanPlanCodes && scope.row.lubanPlanCodes.indexOf(',') != -1" @click="lubanCodeDetails(scope.row.lubanPlanCodes)">详情</span>
        <span v-else>{{scope.row.lubanPlanCode}}</span>
      </template>
      <template slot-scope="scope" slot="pushState">
        <span v-show="!scope.row.pushState">失败</span>
        <span v-show="scope.row.pushState === 1">成功</span>
        <span v-show="scope.row.pushState === 2">推送中</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <span class="handle" @click="onDetails(scope.row)">查看</span>
        <span class="handle" @click="pushGoods(scope.row)">推送商品</span>
        <span v-show="!scope.row.pushState" class="handle" @click="pushAgain(scope.row)">再次推送</span>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--采购单号弹出框-->
    <v-dialog :dialog="dataDialog">
      <div style="word-break:break-all">{{codeStr}}</div>
    </v-dialog>
    <!--鲁班计划弹出框-->
    <v-dialog :dialog="dataLubanDialog">
      <div style="word-break:break-all">{{codeLubanStr}}</div>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataDialog: {
          show: false,
          title: '采购单号',
          width: '700px'
        },
        codeStr: '',
        dataLubanDialog: {
          show: false,
          title: '鲁班计划',
          width: '700px'
        },
        codeLubanStr: '',
        searchData: [
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          }, {
            key: 'orderSourceEnumCode',
            label: '订单来源：',
            value: '',
            select: []
          }, {
            key: 'startTime',
            label: '创建时间：',
            value: '',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            key: 'orderNumber',
            label: '订单编号:',
            value: '',
            placeholder: '请输入订单编号'
          }, {
            key: 'code',
            label: '采购单号:',
            value: '',
            placeholder: '请输入采购单号'
          }, {
            key: 'lubanOrderNo',
            label: '鲁班订单:',
            value: '',
            placeholder: '请输入鲁班订单'
          }, {
            key: 'goodsName',
            label: '商品名称:',
            value: '',
            placeholder: '请输入商品名称'
          }, {
            key: 'pushState',
            label: '推送状态：',
            value: '',
            select: [
              { label: '成功', value: '1' },
              { label: '失败', value: '0' },
              { label: '推送中', value: '2' }
            ]
          }, {
            key: 'userName',
            label: '创建人:',
            value: '',
            placeholder: '请输入创建人'
          }, {
            key: 'lubanPlanCode',
            label: '鲁班计划:',
            value: '',
            placeholder: '请输入鲁班计划'
          }
        ],
        dataSearch: {},
        btnData: [{
          text: '推送订单',
          key: 'push-order'
        }],
        dataHeader: [
          {
            prop: 'orderNumber',
            label: '订单编号'
          }, {
            label: '采购单号',
            prop: 'code',
            slot: true
          }, {
            label: '鲁班计划',
            prop: 'lubanPlanCode',
            slot: true
          }, {
            prop: 'relationOrderNumber',
            label: '关联订单'
          }, {
            prop: 'lubanOrderNo',
            label: '鲁班订单'
          }, {
            prop: 'projectName',
            label: '梁场名称'
          }, {
            prop: 'orderAmount',
            label: '订单金额'
          }, {
            prop: 'pushState',
            label: '推送状态',
            slot: true
          }, {
            prop: 'userName',
            label: '创建人'
          }, {
            prop: 'createTimeStr',
            label: '创建时间'
          }, {
            prop: 'operation',
            label: '操作',
            width: '250px',
            slot: true
          }
        ],
        tabUrl: this.$Api.sale.saleOrderListData,
        tableDemandSceneList: 'table_paanned_transfer_order',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_paanned_transfer_order'
        },
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlOrderState: this.$Api.sale.getOrderState,
        urlSourceState: this.$Api.sale.getPlanSourceState,
        arrBeamData: [],
        selection: [],
        selectionIds: []
      }
    },
    created () {
      this.getBeamField()
      this.getOrderState()
      this.getSourceState()
    },
    methods: {
      codeDetails (str) {
        this.codeStr = str
        this.dataDialog.show = true
      },
      lubanCodeDetails (str) {
        this.codeLubanStr = str
        this.dataLubanDialog.show = true
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
      },
      pushOrder () {
        let routeData = this.$router.resolve({
          name: 'pushOrderList'
        })
        window.open(routeData.href, '_blank')
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
      getBeamField () {
        this.ajaxPost(this.urlBeamField, (res) => {
          if (res.data.result) {
            this.arrBeamData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(this.arrBeamData)
              }
            })
          }
        })
      },
      getOrderState () {
        this.ajaxPost(this.urlOrderState, (res) => {
          if (res.data.result) {
            this.searchData.map(item => {
              if (item.key === 'orderStateCode') {
                item.select = res.data.data
              }
            })
          }
        })
      },
      getSourceState () {
        this.ajaxPost(this.urlSourceState, (res) => {
          if (res.data.result) {
            this.searchData.map(item => {
              if (item.key === 'orderSourceEnumCode') {
                item.select = res.data.data
              }
            })
          }
        })
      },
      selectionChange (selection) {
        this.selection = selection
        this.selectionIds = this.selection.map(item => {
          return item.id
        })
      },
      onDetails (res) {
        let routeData = this.$router.resolve({
          name: 'plannedTransferOrderDetails',
          params: {id: res.id}
        })
        window.open(routeData.href, '_blank')
      },
      pushGoods (row) {
        this.$confirm('确定要推送商品吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$Ajax.post({
            url: this.$Api.sale.pushAllGoods,
            data: {
              json: row.listPurchaseIds
            },
            cb: (res) => {
              if (res.data.result) {
                this.$message('推送商品成功')
                this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
              }
            }
          })
        }).catch(() => {
        })
      },
      pushAgain (row) {
        let params = {}
        params.listPurchaseIdsStr = row.listPurchaseIds
        params.orderId = row.id
        this.$confirm('确定要再次推送订单吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$Ajax.post({
            url: this.$Api.sale.againPush,
            data: {
              json: JSON.stringify(params)
            },
            cb: (res) => {
              if (res.data.result) {
                this.$message('推送订单成功')
                this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
              }
            }
          })
        }).catch(() => {
        })
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
    margin-left: 5px;
  }
  .handle.font_14{font-size: 14px;}
  .handle:hover {
    text-decoration: none;
  }

  .txtRed {
    color: red;
  }
</style>
<style>
</style>
