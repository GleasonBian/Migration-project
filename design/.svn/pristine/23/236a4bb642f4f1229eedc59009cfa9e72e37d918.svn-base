<template>
  <div>
    <v-search :data="searchData"></v-search>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="tabParams">
      <template slot-scope="scope" slot="jname">
        <tab-but :data="tabData11" @on-del="tabDels(scope.row)" @on-edit="tabEdit(scope.row)"></tab-but>
      </template>
    </table-list>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tabUrl: this.$Api.tab.tab,
        tabParams: {
          order: 'asc',
          offset: 0,
          limit: 20,
          tableName: ''
        },
        dataHeader: [{
          prop: 'id',
          label: '日期',
          type: 'selection'
        }, {
          prop: 'id',
          label: '日期'
        }, {
          prop: 'tableName',
          label: '名称'
        }, {
          prop: 'className',
          label: '地区'
        }, {
          prop: 'createType',
          label: '城市'
        }, {
          prop: 'comment',
          label: '地区详情'
        }, {
          prop: 'userId',
          label: 'zip名称'
        }, {
          prop: 'cz',
          label: '操作',
          slot: 'jname'
        }],
        searchData: [{
          label: 'fdfasfd',
          value: '',
          key: 'lll'
        }, {
          label: 'startTime',
          value: '',
          key: 'startTime',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }]
      }
    }
  }
</script>

<style scoped>

</style>
