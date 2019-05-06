<template>
  <div>
    <!-- 审批记录 -->
    <v-dialog :dialog="dialogDataView">
      <div>物资名称：{{goodsName}}</div>
      <br/>
      <table-list :data-header="dataHeaderView" :url="tabUrlView" :params="pageView" @get-table-data="getTableDataView"
                  :refs="tablePerformanceView"></table-list>
      <v-page :data="pageView" :dataArr="[]"></v-page>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'examine-dialog',
    props: {
      pageView: {
        type: Object
      },
      dialogDataView: {
        type: Object
      },
      goodsName: {
        type: String
      },
      tablePerformanceView: {
        type: String
      }
    },
    data () {
      return {
        dataHeaderView: [
          {prop: 'createTimeStr', label: '更新时间'},
          {prop: 'nodeName', label: '审批节点'},
          {prop: 'createrName', label: '姓名'},
          {prop: 'appstateDisplay', label: '审批状态'},
          {prop: 'remark', label: '审批意见'}
        ],
        tabUrlView: this.$Api.examine.queryGoodsApprovalRecord
      }
    },
    computed: {},
    created () {
    },
    methods: {
      getTableDataView (data) {
        this.pageView.totalNum = data.data.total
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
