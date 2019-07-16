<!-- 采购部负责人 -->
<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @to-pass="exportIns"></tab-but>
    
    <el-table :data="dataList" style="width: 100%">
      <el-table-column prop="month" label="月份" align='center'></el-table-column>
      <el-table-column prop="deptTotalCost" label="采购金额" align='center'></el-table-column>
      <el-table-column prop="totalSaveAmount" label="采购节约金额" align='center'></el-table-column>
      <el-table-column prop="totalSaveRate" label="降低成本率" align='center'></el-table-column>
      <el-table-column prop="resultIndex" label="考核结果" align='center'></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="exportSub(scope.row)" type="text" size="small">导出明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchData:[{
            label: '选择年份：',
            value: '',
            key: 'year',
            date: {
              type: 'year',
              valueFormat:'yyyy'
            }
          }],
        dataSearch:{
          year:'2009'
        },
        dataList:[],
        
        btnData: [{
          text: '导出考核',
          key: 'to-pass',
          disabled: false
        }],
      };
    },
    created() {
      this.getData()
    },
    methods: {
      getData(){
        this.$Ajax.post({
          url: this.$Api.board.buyerLeaderResult,
          data: this.dataSearch,
          cb: res => {
            res.data.map(item =>{
              item.totalSaveRate = item.totalSaveRate + '%'
            })
            this.dataList = res.data
          }
        })
      },

      search (res) {
        console.log(res)
        this.dataSearch = res
        this.getData()
      },
      exportIns(){
        console.log('导出考核')
      },
      exportSub(val){
        console.log('导出明细',val)
      },
    },
  }
</script>
<style>
</style>