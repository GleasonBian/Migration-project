<template>
  <div>
    <!--历史价-->
    <v-dialog :dialog="historyDialog">
      <v-search :data="historyDialogSearchData" @on-click="historyDialogSearchDataClick" @on-search-reset="searchReset"
                :resetOk="true"></v-search>
      <table-list :data-header="historyDialogHeader" :url="historyDialogUrl" :params="historyDialogPage"
                  :refs="historyDialogDataRefs" @get-table-data="historyDialogGetTableData"
                  v-show="isShowHistory">
      </table-list>
      <v-page :data="historyDialogPage" :dataArr="[historyDialogDataSearch]" :custom="true" @change-page="changePage"></v-page>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'history-dialog',
    props: {
      historyDialogPage: {
        type: Object
      },
      historyDialog: {
        type: Object
      },
      historyDialogDataRefs: {
        type: String
      },
      isShowHistory: {
        type: Boolean
      },
      historyDialogSearchData: {
        type: Array
      },
      historyDialogUrl: {
        type: String
      }
    },
    data () {
      return {
        historyDialogHeader: [
          {prop: 'recordTimeStr', label: '采购日期'},
          {prop: 'goodsName', label: '物资名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'unit', label: '计量单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'goodsPrice', label: '单价'},
          {prop: 'totalPrice', label: '金额'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'projectName', label: '梁场名称'}
        ],
        historyDialogDataSearch: {}
      }
    },
    computed: {},
    created () {
    },
    methods: {
      changePage () {
        this.$Utils.pageUpdateTable([this.historyDialogDataSearch, this.historyDialogPage], this.historyDialogDataRefs, this)
      },
      historyDialogGetTableData (data) {
        this.historyDialogPage.totalNum = data.data.total
      },
      historyDialogSearchDataClick (res) {
        if (res.goodsName === undefined) {
          res.goodsName = ''
        }
        if (res.model === undefined) {
          res.model = ''
        }
        this.historyDialogDataSearch = res
        this.historyDialogPage.goodsName = res.goodsName
        this.historyDialogPage.model = res.model
        if (res.projectId !== undefined) {
          this.historyDialogPage.projectId = res.projectId
        } else {
          delete this.historyDialogPage.projectId
        }
        if (JSON.stringify(this.historyDialogDataSearch) === '{}') {
          this.historyDialogPage.offset = 0
          this.historyDialogPage.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.historyDialogDataSearch, this.historyDialogPage], this.historyDialogDataRefs, this)
      },
      searchReset (res) {
        if (res.goodsName === undefined) {
          res.goodsName = ''
        }
        if (res.model === undefined) {
          res.model = ''
        }
        this.historyDialogDataSearch = res
        this.historyDialogPage.goodsName = res.goodsName
        this.historyDialogPage.model = res.model
        if (res.projectId !== undefined) {
          this.historyDialogPage.projectId = res.projectId
        } else {
          delete this.historyDialogPage.projectId
        }
        this.historyDialogPage.offset = 0
        this.historyDialogPage.currentPage = 1
        this.$Utils.pageUpdateTable([this.historyDialogDataSearch, this.historyDialogPage], this.historyDialogDataRefs, this)
      }
    },
    components: {}
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
