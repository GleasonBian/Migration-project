<template>
  <div>
    <v-search :data="Searchdata" @on-click="searchDataClick"></v-search>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @selection-change="selectionChange"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        Searchdata: [
          {label: '手机号', value: '', key: 'mobile'}
        ],
        TableDataHeader: [
          {type: 'selection', width: '10px'},
          {label: '手机号', prop: 'mobile'},
          {label: '短信内容', prop: 'content'},
          {label: '发送时间', prop: 'sendTimeStr'},
          {label: '状态', prop: 'msg'}
        ],
        DataUrl: this.$Api.smslog.smslogJSONData,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_msg_list'
        },
        tablePerformance: 'tab_msg_list',
        dataSearch: {}
      }
    },
    methods: {
      searchDataClick (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      selectionChange (selection) {
        this.selection = selection
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
        data.data.rows.map(item => {
          if (item.msg === 'Success') {
            item.msg = '成功'
          } else {
            item.msg = '失败'
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
