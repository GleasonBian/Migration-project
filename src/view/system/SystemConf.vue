<template>
  <div>
    <table-list :data-header="dataHeader" :static="static" :dataStatic="dataStatic" :refs="tablePerformance">
      <template v-slot:operation="scope">
        <tab-but :data="tabBut" @onRole="tabRole(scope.row)" @onPermissions="tabPermissions(scope.row)"></tab-but>
      </template>
    </table-list>
    <v-dialog :dialog="dialogDataPermissions">
      <el-tabs v-model="permissionsActive">
        <el-tab-pane label="菜单管理" name="permissions1">
          <tab-but :data="tabButSave" @onTabAddSave="saveRoleMenu"></tab-but>
          <tab-tree-list :data="treeData" :default-props="defaultProps" @check-change="getCheckedNodes"
                         class="box_menu"></tab-tree-list>
        </el-tab-pane>
      </el-tabs>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        dataHeader: [{prop: 'display', label: '名称'}, {prop: 'operation', label: '操作', slot: true}],
        static: true,
        dataStatic: [],
        tablePerformance: 'tab_permission_list',
        tabBut: [{text: '权限管理', key: 'onPermissions', type: 'text'}],
        dialogDataPermissions: {show: false, title: '权限分配'},
        permissionsActive: 'permissions1',
        tabButSave: [{text: '保存', key: 'onTabAddSave'}],
        treeData: {
          params: {},
          url: this.$Api.frontMenu.ruleMenuList,
          checkbox: true,
          checked: 'isChecked',
          checkedName: 'id',
          nodeKey: 'id',
          treeData: {
            id: 0,
            name: '菜单名称',
            children: []
          }
        },
        defaultProps: {label: 'name', children: 'children'},
        checkedNodesData: [],
        roleIds: ''
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getCheckedNodes (val, nodes, node, props, checkedKeys) {
        this.$bus.emit('tree-getCheckedKeys', (res) => {
          this.checkedNodesData = res()
        })
      },
      getData () {
        this.$Ajax.post({
          url: this.$Api.frontMenu.ruleList,
          data: {},
          cb: res => {
            if (res.status === 200) {
              this.dataStatic = res.data.data.frontRolelist
            }
          }
        })
      },
      tabPermissions (row) {
        console.log(row, '1233')
        this.dialogDataPermissions.show = true
        this.treeData.params.roleIds = row.code
        this.roleIds = row.code
        this.$bus.emit('updata-tab-tree-list')
      },
      saveRoleMenu () {
        let permissionIds = this.checkedNodesData.length > 0 ? this.checkedNodesData : []
        let params = {menuIds: permissionIds, roleIds: this.roleIds}
        this.$Ajax.post({
          url: this.$Api.frontMenu.saveRoleMenu,
          data: params,
          cb: res => {
            if (res.data.result) {
              this.$message('保存成功')
              this.dialogDataPermissions.show = false
            }
          }
        })
      }
    }
  }
</script>
<style scoped>

</style>
