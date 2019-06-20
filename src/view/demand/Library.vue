<template>
  <div>
    <v-search :data="SearchData" @on-click="searchDataClick"></v-search>
    <!--<tab-but :data="tabBut" @on-add="tabAdd"></tab-but>-->
    <table-list :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsMealListTable" :params="page">
      <template v-slot:operation="scope">
        <div class="mCen1">
          <TabBut :data="upTabButData" @on-view="onView(scope.row)"></TabBut>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableUrl: this.$Api.demand.loadApplicaFormListByPager,
        goodsMealListTable: 'tab_sales_list',
        SearchData: [
          {
            label: '订单编号：',
            value: '',
            placeholder: '请输入',
            key: 'orderCode'
          }, {
            label: '梁场名称：',
            value: '',
            placeholder: '请选择',
            key: 'projectId',
            select: []
          }, {
            label: '创建时间：',
            value: '',
            key: 'receiveStartTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            label: '仓库名称：',
            value: '',
            placeholder: '请选择',
            key: 'warehouseId',
            select: []
          }, {
            label: '供应验收单号：',
            value: '',
            placeholder: '请输入',
            key: 'applicaFormCode'
          }, {
            label: '出库单状态：',
            value: '',
            placeholder: '请选择',
            key: 'stateCode',
            select: [
              {value: '0', label: '待验收'},
              {value: '1', label: '已验收'},
              {value: '2', label: '结算中'},
              {value: '3', label: '已完成'}
            ]
          }, {
            key: 'materialName',
            label: '物资名称',
            value: '',
            type: 'text'
          }
        ],
        tableHeader: [
          {label: '供应验收单号', prop: 'applicaFormCode'},
          {label: '仓库名称', prop: 'warehouseName'},
          {label: '梁场名称', prop: 'projectName'},
          {label: '关联订单号', prop: 'orderCode'},
          {label: '采购员', prop: 'listPurchaserName'},
          {label: '状态', prop: 'stateStr'},
          {label: '创建人', prop: 'applicaUserName'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '操作', slot: true, prop: 'operation', width: '200px'}
        ],
        dataSearch: {},
        upTabButData: [
          {
            text: '查看',
            key: 'on-view',
            type: 'text'
          }
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_sales_list'
        },
        tabBut: [{text: '创建采购计划', key: 'add'}]
      }
    },
    created () {
      let api1 = this.$Api.orderManger.getProjectList
      let api2 = this.$Api.demand.loadWarehouseList
//      let api3 = this.$Api.demand.loadApplicaStateList
      this.getSelect(api1, this.SearchData[1].select, '1')
      this.getSelect(api2, this.SearchData[3].select, '2')
//      this.getSelect(api3, this.SearchData[5].select, '3')
    },
    methods: {
      getSelect (api, select, type) {
        this.$Ajax.post({
          url: api,
          cb: (res) => {
            if (res.data.data) {
              if (type !== '3') {
                res.data.data.map(item => {
                  if (type === '1') {
                    select.push({value: item.id, label: item.projectName})
                  } else if (type === '2') {
                    select.push({value: item.id, label: item.warehouseName})
                  }
                })
              } else {
                for (let item in res.data.data) {
                  select.push({value: item, label: res.data.data[item]})
                }
              }
            }
          }
        })
      },
      tabAdd () {
        let routeData = this.$router.resolve({
          name: 'demandLibraryAdd'
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'demandLibraryAdd'})
      },
      onView (row) {
        let routeData = this.$router.resolve({
          name: 'demandLibraryView1',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'demandLibraryView1', params: {id: row.id}})
      },
      searchDataClick (res) {
        if (res.endTime) {
          res.receiveEndTime = res.endTime
          delete res.endTime
        }
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.pageUpdateTable([this.dataSearch, this.page], this.goodsMealListTable, this)
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      }
    }
  }
</script>

<style scoped>
</style>
