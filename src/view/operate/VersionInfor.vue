<template>
  <div>
    <v-search :data="Searchdata" @on-click="searchDataClick"></v-search>
    <TabBut :data="TabButData" @on-add="onAdd"></TabBut>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @selection-change="selectionChange"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template v-slot:operation="scope">
        <TabBut :data="tbBut" @on-edit="onEdit(scope.row)" @on-del="onDel(scope.row)" @resource="onResource(scope.row)"></TabBut>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        Searchdata: [
          {label: '应用名称', value: '', key: 'channelName'},
          {label: '应用标示', value: '', key: 'channelCode'}
        ],
        TabButData: [{text: '新增', key: 'add'}],
        TableDataHeader: [
          {type: 'selection', width: '10px'},
          {label: '应用名称', prop: 'channelName'},
          {label: '应用标示', prop: 'channelCode'},
          {label: '说明', prop: 'title'},
          {label: 'Android下载地址', prop: 'androidDownloadUrl'},
          {label: 'IOS下载地址', prop: 'iosDownloadUrl'},
          {label: 'Android版本代码', prop: 'androidVersionCode'},
          {label: 'IOS版本代码', prop: 'iosVersionCode'},
          {label: '资源版本', prop: 'sourceVerionCode'},
          {label: '操作', prop: 'operation', slot: true, width: '200px'}
        ],
        tbBut: [
          {text: '编辑', key: 'edit', type: 'text'},
          {text: '删除', key: 'del', type: 'text'},
          {text: '资源包', key: 'resource', type: 'text'}
        ],
        DataUrl: this.$Api.operate.clientVersioninfoData,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_operate_vInfo'
        },
        tablePerformance: 'tab_operate_vInfo',
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
      },
      onEdit (row) {
        this.$router.push({name: 'versionInforEdit', params: {rows: row}})
      },
      onDel (row) {
        let ids = [row.id]
        this.$Ajax.post({
          url: this.$Api.operate.delete,
          data: {ids: ids},
          cb: res => {
            if (res.data.result) {
              this.$message('删除成功！')
              this.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      onResource (row) {
        this.$router.push({name: 'versionInfor1', params: {id: row.id}})
      },
      onAdd () {
        this.$router.push({name: 'versionInforAdd'})
      }
    }
  }
</script>

<style scoped>

</style>
