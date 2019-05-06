<template>
  <v-dialog :dialog="goodsDialog">
    <div>
      <v-search :data="SearchData" @on-click="searchDataClick" style="margin-bottom: 20px">
        <template slot="type" slot-scope="scope">
          <el-select v-model="scope.rows.value"  placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </v-search>
      <table-list :data-header="goodsDataHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsListTable"
                  :params="params">
        <template slot-scope="scope" slot="operation">
          <div class="mCen1">
            <TabBut  :data="upTabButData"  @on-select="onselect(scope.row)"></TabBut>
          </div>
        </template>
      </table-list>
      <v-page :data="page" :dataArr="[params]"></v-page>
    </div>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        tableUrl: this.$Api.sale.findWarehouseListByVO,
        SearchData: [
          {
            label: '仓库名称：',
            value: '',
            key: 'name'
          }
        ],
        goodsListTable: 'tab_goodsTable_list',
        params: {},
        goodsDataHeader: [
          {prop: 'warehouseName', label: '名称'},
          {prop: 'warehouseAddress', label: '地址'},
          {label: '操作', slot: true, prop: 'operation', width: '150px'}
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_goodsTable_list'
        },
        upTabButData: [
          {
            text: '选择',
            key: 'on-select',
            type: 'text'
          }
        ],
        options: []
      }
    },
    created () {
      this.getphases()
    },
    props: {
      selectClassItem: {
        type: Object
      },
      goodsDialog: {
        type: Object
      }
    },
    methods: {
      onselect (row) {
        this.goodsDialog.show = false
        this.$emit('on-select-result', row)
      },
      getphases () {
        this.$Ajax.post({
          url: this.$Api.orderManger.getProjectList,
          data: {},
          cb: res => {
            if (res.status === 200) {
              this.options = res.data.data
              this.options.unshift({id: '', projectName: '全部'})
            }
          }
        })
      },
      searchDataClick (res) {
        this.params = res
        this.tableRefresh()
      },
      tableRefresh () {
        this.$Utils.pageUpdateTable([this.params, this.page], this.goodsListTable, this)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      }
    }
  }
</script>

<style>
</style>
