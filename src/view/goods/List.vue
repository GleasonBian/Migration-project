<template>
  <div>
    <v-search :data="SearchData" @on-click="searchDataClick">
      <template slot="phaseId" slot-scope="scope">
        <el-select v-model="scope.rows.value"  placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="state" slot-scope="scope">
        <el-select v-model="scope.rows.value"  placeholder="请选择">
          <el-option
            v-for="item in stateOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </v-search>
    <div class="base_btn_group">
      <el-button type="primary" size="mini" @click="onManage">套餐阶段管理</el-button>
      <el-button type="primary" size="mini" @click="onAdd">新增套餐</el-button>
    </div>
    <table-list :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsMealListTable"
                :params="params">
      <template v-slot:operation="scope">
        <div class="mCen1">
          <TabBut v-if='scope.row.state === 1' :data="upTabButData" @on-edit="edit(scope.row)" @on-view="onview(scope.row)" @on-up="onup(scope.row)" @on-del="ondel(scope.row)"></TabBut>
          <TabBut v-if="scope.row.state === 0" :data="dowmTabButData" @on-down="ondown(scope.row)" @on-view="onview(scope.row)"></TabBut>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[params]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableUrl: this.$Api.customPackage.getSetMealList,
        goodsMealListTable: 'tab_goodsMeal_list',
        options: [],
        stateOptions: [{id: '-1', name: '全部'}, {id: '0', name: '上架'}, {id: '1', name: '下架'}],
        SearchData: [
          {
            label: '套餐名称：',
            value: '',
            placeholder: '请输入',
            key: 'name'
          }, {
            label: '所属阶段：',
            value: '',
            placeholder: '请输入',
            custom: true,
            key: 'phaseId',
            prop: 'phaseId'
          }, {
            label: '状态：',
            value: '',
            placeholder: '请输入',
            custom: true,
            key: 'state',
            prop: 'state'
          }
        ],
        tableHeader: [
          {label: '套餐名称', prop: 'name'},
          {label: '所属阶段', prop: 'phaseName'},
          {label: '套餐描述', prop: 'describtion'},
          {label: '创建人', prop: 'userName'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '状态', prop: 'stateStr'},
          {label: '操作', slot: true, prop: 'operation', width: '250px'}
        ],
        params: {phaseId: -1, state: -1},
        upTabButData: [
          {
            text: '查看',
            key: 'on-view',
            type: 'text'
          }, {
            text: '编辑',
            key: 'edit',
            type: 'text'
          }, {
            text: '上架',
            key: 'on-up',
            type: 'text'
          }, {
            text: '删除',
            key: 'del',
            type: 'text'
          }
        ],
        dowmTabButData: [
          {
            text: '查看',
            key: 'on-view',
            type: 'text'
          }, {
            text: '下架',
            key: 'on-down',
            type: 'text'
          }
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_goodsMeal_list'
        }
      }
    },
    created () {
      this.getphases()
    },
    methods: {
      ondown (row) {
        this.$Ajax.post({
          url: this.$Api.customPackage.disableSetMealById,
          data: {
            id: row.id
          },
          cb: res => {
            if (res.status === 200) {
              this.$message('下架成功')
              this.tableRefresh()
            }
          }
        })
      },
      onup (row) {
        this.$Ajax.post({
          url: this.$Api.customPackage.enableSetMealById,
          data: {
            id: row.id
          },
          cb: res => {
            if (res.status === 200) {
              this.$message('上架成功')
              this.tableRefresh()
            }
          }
        })
      },
      edit (row) {
        this.$router.push({name: 'addmeal', params: {id: row.id, state: 'edit'}})
      },
      ondel (row) {
        this.$Ajax.post({
          url: this.$Api.customPackage.deletedSetMealById,
          data: {
            id: row.id
          },
          cb: res => {
            if (res.status === 200) {
              this.$message('删除成功')
              this.tableRefresh()
            }
          }
        })
      },
      getphases () {
        this.$Ajax.get({
          url: this.$Api.customPackage.getAllPhaselist,
          data: {},
          cb: res => {
            if (res.status === 200) {
              this.options = res.data
              this.options.unshift({id: -1, name: '全部'})
            }
          }
        })
      },
      onManage () {
        this.$router.push({name: 'setmealmanager'})
      },
      onAdd () {
        this.$Ajax.get({
          url: this.$Api.customPackage.createSetMeal,
          data: {},
          cb: res => {
            if (res.status === 200) {
              this.$router.push({name: 'addmeal', params: {id: res.data.data, state: 'Add'}})
            }
          }
        })
      },
      onview (row) {
        this.$router.push({name: 'goodsDetails', params: {id: row.id}})
      },
      searchDataClick (res) {
        if (!res.phaseId) {
          res.phaseId = -1
        }
        if (!res.state) {
          res.state = -1
        }
        this.params = res
        this.tableRefresh()
      },
      tableRefresh () {
        this.$Utils.pageUpdateTable([this.params, this.page], this.goodsMealListTable, this)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      }
    }
  }
</script>

<style scoped>
  .mCen1 .base_btn_group .el-button {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .uploadBtn .avatar-uploader .el-upload {
    border: 0px;
  }
</style>
