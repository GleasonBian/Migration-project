<!-- 采购部负责人 -->
<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @to-pass="toPass"></tab-but>
    <table-list :data-header="dataHeaderData" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance" @selection-change="selectionChange">
      <template v-slot:handle="scope">
        <a class="handle" @click="toDetail(scope.row.goodsName)">导出明细</a>
      </template>
    </table-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchData: [{
          label: '梁场名称：',
          value: '',
          placeholder: '请选择',
          key: 'year',
          select: [{
            value: 2017,
            label: '2017年'
          }, {
            value: 2018,
            label: '2018年'
          }, {
            value: 2019,
            label: '2019年'
          }, {
            value: 2020,
            label: '2020年'
          }]
        }],
        dataSearch:'',
        btnData: [{
          text: '导出考核',
          key: 'to-pass',
          disabled: false
        }],
      };
    },

    created() {},
    components: {

    },

    computed: {

    },

    mounted: {

    },

    methods: {
      search(res) {
        this.dataSearch = res

        console.log(this.dataSearch)
      },
    },
  }
</script>
<style>
</style>