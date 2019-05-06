<template>
  <div>
    <v-search :data="searchData" @on-click="search">
    </v-search>
    <table-list :dataHeader="tableHeader"  :url="tableUrl" :params="page" :refs="goodsMealListTable"
        @get-table-data="getTableData"  @selection-change="selectionChange">
      <template slot-scope="scope" slot="code">
        <span class="handle font_14" v-if="scope.row.codes && scope.row.codes.indexOf(',') != -1" @click="codeDetails(scope.row.codes)">详情</span>
        <span v-else>{{scope.row.code}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <div class="selectbtn">
          <span @click="onview(scope.row)">查看</span>
          <!-- <span @click="getShowImgPath()" >确认价格</span> -->
          <span  v-show="scope.row.orderStateCode === 10" @click="onCreate(scope.row)">出库</span>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--采购单号弹出框-->
    <v-dialog :dialog="dataDialog">
      <div style="word-break:break-all">{{codeStr}}</div>
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
        tableUrl: this.$Api.orderManger.selectLubanPushOrderList,
        goodsMealListTable: 'tab_saleOrder_list',
        searchData: [
          {
            label: '梁场名称：',
            value: '',
            key: 'projectId',
            select: []
          }, {
            label: '订单来源',
            value: '',
            key: 'orderSourceEnumCode',
            select: []
          }, {
            label: '创建时间：',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            label: '订单编号：',
            value: '',
            placeholder: '请输入',
            key: 'orderNumber'
          }, {
            label: '采购单号：',
            value: '',
            placeholder: '请输入',
            key: 'code'
          }, {
            label: '鲁班订单：',
            value: '',
            placeholder: '请输入',
            key: 'lubanOrderNo'
          }, {
            label: '物资名称：',
            value: '',
            placeholder: '请输入',
            key: 'goodsName'
          }, {
            label: '订单状态：',
            value: '',
            custom: true,
            key: 'orderStateCode',
            select: []
          }, {
            key: 'userName',
            label: '创建人',
            value: ''
          }
        ],
        tableHeader: [
          {type: 'selection'},
          {label: '订单编号', prop: 'orderNumber'},
          {label: '采购单号', prop: 'code', slot: true},
          {label: '鲁班订单', prop: 'lubanOrderNo'},
          {label: '订单来源', prop: 'orderTypeStr'},
          {label: '梁场名称', prop: 'projectName'},
          {label: '订单金额', prop: 'orderAmount'},
          {label: '创建人', prop: 'userName'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '订单状态', prop: 'orderStateDisplay'},
          {label: '操作', slot: true, prop: 'operation'}
        ],
        dataSearch: {},
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_saleOrder_list'
        },
        tableDemandSceneList: 'tab_saleOrder_list',
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlOrderState: this.$Api.sale.getOrderState,
        urlSourceState: this.$Api.sale.getPlanSourceState,
        selection: [],
        arrBeamData: [],
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
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearch, this.page], this.goodsMealListTable, this)
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
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      selectionChange (selection) {
        this.selection = selection
        this.selectionIds = this.selection.map(item => {
          return item.id
        })
      },
      // 出库
      onCreate (row) {
        let routeData = this.$router.resolve({
          name: 'libraryAdd',
          params: {
            id: row.id, orderCode: row.orderNumber, sign: 1
          }
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'libraryAdd', params: {id: row.id, orderCode: row.orderNumber}})
      },
      // 跳详情
      onview (row) {
        let routeData = this.$router.resolve({
          name: 'orderNewDetail',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
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
  .mCen1 .base_btn_group .el-button {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .selectbtn span{
    color: #1577fe;
    cursor:pointer
  }
  .uploadBtn .avatar-uploader .el-upload {
    border: 0px;
  }

</style>
