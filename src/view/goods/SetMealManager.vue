<template>
  <div>
    <div class="base_btn_group">
      <el-button type="primary" size="mini" @click="onAdd">新增阶段</el-button>
    </div>
    <table-list :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsMealListTable"
                :params="params">
      <template v-slot:operation="scope">
        <div class="mCen1">
          <TabBut v-if='scope.row.state === 1' :data="noTabButData" @on-edit="edit(scope.row)" @on-view="onview(scope.row)" @on-enable="onenable(scope.row)" @on-del="ondel(scope.row)"></TabBut>
          <TabBut v-if="scope.row.state === 0" :data="okTabButData" @on-disable="ondisable(scope.row)" @on-view="onview(scope.row)"></TabBut>
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
          tableUrl: this.$Api.customPackage.getPhaseList,
          goodsMealListTable: 'tab_MealManager_list',
          tableHeader: [
            {label: '套餐名称', prop: 'name'},
            {label: '创建人', prop: 'userName'},
            {label: '创建时间', prop: 'createTimeStr'},
            {label: '状态', prop: 'stateStr'},
            {label: '操作', slot: true, prop: 'operation', width: '250px'}
          ],
          params: {},
          page: {
            totalNum: 0,
            currentPage: 1,
            offset: 0,
            refs: 'tab_MealManager_list'
          },
          noTabButData: [
            {
              text: '查看',
              key: 'on-view',
              type: 'text'
            }, {
              text: '编辑',
              key: 'edit',
              type: 'text'
            }, {
              text: '启动',
              key: 'on-enable',
              type: 'text'
            }, {
              text: '删除',
              key: 'del',
              type: 'text'
            }
          ],
          okTabButData: [
            {
              text: '查看',
              key: 'on-view',
              type: 'text'
            }, {
              text: '禁用',
              key: 'on-disable',
              type: 'text'
            }
          ]
        }
      },
      methods: {
        edit (row) {
          this.$router.push({name: 'newphase', params: {state: 'edit', id: row.id}})
        },
        onview (row) {
          this.$router.push({name: 'setmealdetail', params: {id: row.id}})
        },
        onAdd () {
          this.$router.push({name: 'newphase', params: {state: 'add', id: 0}})
        },
        getTableData (data) {
          this.page.totalNum = data.data.total
        },
        ondel (row) {
          this.$Ajax.post({
            url: this.$Api.customPackage.deletedPhase,
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
        ondisable (row) {
          this.$Ajax.post({
            url: this.$Api.customPackage.disabledPhase,
            data: {
              id: row.id
            },
            cb: res => {
              if (res.status === 200) {
                this.$message('禁用成功')
                this.tableRefresh()
              }
            }
          })
        },
        onenable (row) {
          this.$Ajax.post({
            url: this.$Api.customPackage.enabledPhase,
            data: {
              id: row.id
            },
            cb: res => {
              if (res.status === 200) {
                this.$message('启动成功')
                this.tableRefresh()
              }
            }
          })
        },
        tableRefresh () {
          this.$Utils.pageUpdateTable([this.params, this.page], this.goodsMealListTable, this)
        }
      }
    }
</script>

<style>
</style>
