<!-- 采购专员 -->
<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <tab-but :data="btnData" @to-export="exportBuyerHandle" ></tab-but>
    <el-table :data="resData" :fit='true' :show-header="true" :highlight-current-row="true">
      <el-table-column type="index" label="序号"  align='center' header-align='center'></el-table-column>
      <el-table-column prop="userName" label="采购员"  align='center' header-align='center'></el-table-column>
      <el-table-column prop="saveAmount" label="采购节约金额"  align='center' header-align='center'></el-table-column>
      <el-table-column prop="userTotalCost" label="采购金额"  align='center' header-align='center'></el-table-column>
      <el-table-column prop="indexOneStr" label="采购金额指标"  align='center' header-align='center'></el-table-column>
      <el-table-column prop="avgUserDiffTime" label="采购响应时间"  align='center' header-align='center'></el-table-column>
      <el-table-column prop="indexTwoStr" label="响应时间指标"  align='center' header-align='center'></el-table-column>
      <el-table-column  label="操作" align='center' header-align='center'>
        <template slot-scope="scope">
          <el-button @click="exportDetail(scope.row)" type="text" size="small">导出明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.offset"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
import { log } from 'util';
export default {
  data () {
    return {
      searchData:[{
            label: '选择月份：',
            value: '',
            key: 'month',
            date: {
              type: 'month',
              valueFormat:'yyyy-MM',
              placeholder:"请选择",
            }
          }],

      month: '',
      resData: [],
      page: {
        total: 0,
        limit: 10,
        offset: 0,
        month: ''
      },
      tabFileUrl: this.$Api.board.PurchasingSpecialist,
      attacheTableRef: 'attache_table_ref',
      btnData:[
        {
            text: '导出考核',
            key: 'to-export',
            disabled: false,
        },
      ],
      btnDataDetail:[
        {
          text:'导出明细',
          key:'to-export',
          disabled: false
        }
      ]
    };
  },

  created(){
    this.getData();
    this.searchBoxDefaultTime()
  },
  methods: {
    /**
     * 搜索框 设置 默认时间
     */
    searchBoxDefaultTime(){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      month < 10 ? month = '0' + month : month = month
      this.page.month = year + '-' + month
    },
    /**
     * 获取 数据
     */
    getData () {
      this.$Ajax.post({
        url: this.$Api.board.PurchasingSpecialist,
        data: this.page,
        cb: res => {
          this.resData = res.data.rows;
          this.page.total = res.data.total
        }
      })
    },
    /**
     * 搜索
     */
    search (res) {
      console.log(res)
        this.page.month = res.month
        // this.limit = 10;
        this.offset = 0;
        this.getData()
      },
    /**
     * 导出 明细
     */
    exportDetail(row) {
      location.href = this.$Api.board.exportBuyerDetail + '?performanceId=' + row.id
    },
    /**
     * 分页 多少条
     */
    handleSizeChange(val) {
      this.page.limit = val;
    },
    /**
     * 分页 第几页
     */
    handleCurrentChange(val) {
      this.page.offset = (val - 1) * (this.page.limit === undefined ? 10 : this.page.limit);
    },
    /**
     * 导出考核
     */
    exportBuyerHandle(){
      location.href = this.$Api.board.exportBuyer + '?month=' + this.page.month;
    }
  },
}

</script>
<style>
</style>