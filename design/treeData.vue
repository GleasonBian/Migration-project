<template>
  <tab-tree :fristData="fristData" :fristUrl="fristUrl" :subUrl="subUrl" :tabStyle="tabStyle"></tab-tree>
</template>

<script>
  export default {
    data () {
      return {
        fristData: [{
          type: 'expand',
          slot: true,
          prop: 'expand'
        }, {
          label: '类目',
          prop: 'frontName'
        }, {
          label: '创建时间',
          prop: 'createTime'
        }, {
          label: '状态',
          prop: 'status',
          sortable: true,
          width: '300px'
        }
        ],
        fristUrl: this.$Api.frontClass.loadFristListData,
        subUrl: this.$Api.frontClass.loadChildListData,
        tabStyle: {
          showHeader: false
        }
      }
    }
  }
</script>

<style scoped>
  .expandLeft {
    float: left;
    width: 70%;
    background: #1f1f1f;
  }

  .expandRight {
    float: right;
    width: 30%;
    background: red;
  }
</style>
