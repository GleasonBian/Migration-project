<template>
    <div>
        <v-search :data="searchData" @on-click="search"></v-search>
        <tab-but :data="tabButData" @on-add="add"></tab-but>
        <tab-tree :header-data="headerData" :url="url" :sub-url="subUrl" :params="page" :refs="page.refs"
                  :no-expand="noExpand" :slot-arr="slotArr" @get-table-data="getTableData">
            <template slot-scope="scope" slot="useFlagValue">
                <template v-if="scope.row.level === 1">
                    <span @click="fn1(scope.row)">我是小一</span>
                </template>
                <template v-else-if="scope.row.level === 2">
                    <span  @click="fn1(scope.row)">我是小22222222</span>
                </template>
                <template v-else-if="scope.row.level === 3">
                    <span  @click="fn1(scope.row)">加快速度符合上述地方很少的发挥地方</span>
                </template>
                <template v-else>
                    <span  @click="fn1(scope.row)">我是其他</span>
                </template>
            </template>
            <template slot-scope="scope" slot="operate">
                <template v-if="scope.row.level === 1">
                    <span>000000000</span>
                </template>
                <template v-else-if="scope.row.level === 2">
                    <span>1111111111</span>
                </template>
                <template v-else-if="scope.row.level === 3">
                    <span>66666666666</span>
                </template>
                <template v-else>
                    <span>我是其他</span>
                </template>
            </template>
        </tab-tree>
        <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [{
          key: 'baseClassName',
          label: '类目:',
          value: '',
          placeholder: '请输入'
        }],
        tabButData: [{
          text: '新增一级类目',
          key: 'add'
        }],
        headerData: [{
          type: 'expand',
          slot: true,
          prop: 'expand'
        }, {
          label: '类目名称',
          prop: 'baseClassName'
        }, {
          label: '排序号',
          prop: 'sortBy'
        }, {
          label: '类目编号',
          prop: 'code',
          sortable: true
        }, {
          label: '创建时间',
          prop: 'createTimeStr',
          sortable: true
        }, {
          prop: 'useFlagValue',
          label: '是否启用',
          slot: true
        }, {
          label: '操作',
          slot: true,
          prop: 'operate',
          width: '300px'
        }],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_name_12'
        },
        dataSearch: [],
        url: this.$Api.baseGoods.baseClassJSONData,
        subUrl: this.$Api.baseGoods.childBaseClassJSONData,
        tablePerformance: 'tab_name_12',
        noExpand: 2,
        slotArr: ['useFlagValue', 'operate']
      }
    },
    methods: {
      getTableData (res) {
        this.page.totalNum = res.data.total
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      add () {
        console.log('2262')
      },
      fn1 (row) {
        this.$bus.emit('update-tab-tree-node', row)
        /* this.page.offset = 0
        this.page.currentPage = 1 */
        // this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      }
    }
  }
</script>

<style scoped>
</style>
