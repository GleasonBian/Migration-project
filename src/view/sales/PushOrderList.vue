<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" :refs="tableDemandSceneList"
                @get-table-data="getTableData" @selection-change="selectionChange">
      <template v-slot:code="scope">
        <el-button type="text" @click="toDetails(scope.row)">{{scope.row.code}}</el-button>
      </template>
      <template v-slot:operation="scope">
        <el-button type="text" @click="pushGood(scope.row)">单个推送</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <div style="text-align: center">
      <!--<el-button type="primary" @click="pushGoods">推送商品</el-button>-->
      <el-button type="primary" @click="pushOrder">立即推送</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          }, {
            key: 'code',
            label: '采购单号:',
            value: '',
            placeholder: '请输入采购单号'
          }, {
            key: 'goodsName',
            label: '商品名称:',
            value: '',
            placeholder: '请输入商品名称'
          }, {
            key: 'userName',
            label: '创建人:',
            value: '',
            placeholder: '请输入创建人'
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
          }
        ],
        dataSearch: {},
        dataHeader: [
          {
            type: 'selection'
          }, {
            prop: 'code',
            label: '采购单号',
            slot: true
          }, {
            prop: 'planSourceDisplay',
            label: '计划来源'
          }, {
            prop: 'lubanPlanCode',
            label: '鲁班计划'
          }, {
            prop: 'projectName',
            label: '梁场名称'
          }, {
            prop: 'goodsNum',
            label: '商品数量'
          }, {
            prop: 'goodsPriceTotle',
            label: '总金额'
          }, {
            prop: 'expectedTime',
            label: '期望到货时间'
          }, {
            prop: 'stateStr',
            label: '计划状态'
          }, {
            prop: 'userName',
            label: '创建人'
          }, {
            prop: 'createTimeStr',
            label: '创建时间'
          }, {
            prop: 'operation',
            label: '操作',
            slot: true
          }
        ],
        tabUrl: this.$Api.sale.findListPurchasePagerByPush,
        tableDemandSceneList: 'table_push_order_list',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_push_order_list'
        },
        urlBeamField: this.$Api.orderManger.getProjectList,
        arrBeamData: [],
        selection: [],
        selectionIds: []
      }
    },
    created () {
      this.getBeamField()
    },
    methods: {
      toDetails (res) {
        let routeData = this.$router.resolve({
          name: 'salesDetail',
          params: {id: res.id}
        })
        window.open(routeData.href, '_blank')
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
        this.page.offset = 0
        this.page.currentPage = 1
        this.pageUpdateTable([this.dataSearch, this.page], this.tableDemandSceneList, this)
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
      selectionChange (selection) {
        this.selection = selection
        this.selectionIds = this.selection.map(item => {
          return item.id
        })
      },
      pushOrder () {
        let json = {}
        if (this.selectionIds.length) {
          this.$confirm('确定要推送订单吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            json.listPurchaseIds = this.selectionIds
            this.$Ajax.post({
              url: this.$Api.sale.push,
              data: {
                json: JSON.stringify(json)
              },
              cb: (res) => {
                if (res.data.result) {
                  this.$message('推送订单成功')
                  this.$router.push({name: 'plannedTransferOrder'})
                } else {
                  this.$message(res.data.message)
                }
              }
            })
          }).catch(() => {
          })
        } else {
          this.$message('请选择计划')
        }
      },
      pushGood (row) {
        this.$confirm('确定要推送订单吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$Ajax.post({
            url: this.$Api.sale.pushOrder,
            data: {
              id: row.id
            },
            cb: (res) => {
              if (res.data.result) {
                this.$message('推送商品成功')
                this.$router.push({name: 'plannedTransferOrder'})
              }
            }
          })
        }).catch(() => {
        })
      },
      pushGoods () {
        let json = {}
        if (this.selectionIds.length) {
          this.$confirm('确定要推送商品吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            json.listPurchaseIds = this.selectionIds
            this.$Ajax.post({
              url: this.$Api.sale.pushAllGoods,
              data: {
                json: JSON.stringify(json)
              },
              cb: (res) => {
                if (res.data.result) {
                  this.$message('推送商品成功')
                }
              }
            })
          }).catch(() => {
          })
        } else {
          this.$message('请选择计划')
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
    margin-left: 5px;
  }

  .handle:hover {
    text-decoration: none;
  }

  .txtRed {
    color: red;
  }
</style>
<style>
</style>
