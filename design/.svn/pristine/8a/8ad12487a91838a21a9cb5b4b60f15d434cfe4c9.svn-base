<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance"></table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tabUrl: this.$Api.baseGoods.loadAttrListData,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'ggg'
        },
        dataSearch: {},
        dataHeader: [{
          prop: 'number',
          label: '序号',
          width: '60',
          slot: true
        }, {
          prop: 'attrName',
          label: '属性名称'
        }, {
          prop: 'type',
          label: '输入方式'
        }, {
          prop: 'createTime',
          label: '创建时间'
        }, {
          prop: 'useFlagValue',
          label: '是否启用',
          slot: true
        }, {
          prop: 'cz',
          label: '操作',
          slot: true
        }],
        tablePerformance: 'ggg',
        searchData: [{
          key: 'attrName',
          label: '属性名称',
          value: '',
          type: 'text'
        }, {
          key: 'startTime',
          label: '创建时间',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }]
      }
    },
    methods: {
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      }
    }
  }
</script>

<style>
</style>
