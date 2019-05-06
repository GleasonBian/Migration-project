<template>
  <div>
    <el-tabs v-model="tab_active">
      <el-tab-pane label="菜单管理" name="tab_menu">
        <tab-but :data="tabBut" @on-add="tabAdd"></tab-but>
        <tab-tree-list :data="treeData" :render-dom-le="renderDomLe" :render-dom-ri="renderDomRi"
                       :default-props="defaultProps" class="box_menu"></tab-tree-list>
      </el-tab-pane>
    </el-tabs>
    <v-dialog :dialog="dialogDataAdd">
      <form-group :data="dataFormAdd" @on-cancel="cancelAdd" @on-ok="okAdd" :clear=true :custom=true :data-but="dataButAdd" class="box_form"></form-group>
    </v-dialog>
    <v-dialog :dialog="dialogDataEdit">
      <form-group :data="dataFormEdit" @on-cancel="cancelEdit" @on-ok="okEdit" :custom=true :data-but="dataButEdit" class="box_form"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tab_active: 'tab_menu',
        tabBut: [{text: '创建', key: 'add', icon: 'el-icon-plus'}],
        treeData: {
          params: {},
          url: this.$Api.frontMenu.menuList,
          treeData: {
            id: 0,
            name: '菜单名',
            children: []
          }
        },
        defaultProps: {label: 'name', children: 'children'},
        dialogDataAdd: {show: false, title: '添加菜单', width: '30%'},
        dataButAdd: [{text: '取消', key: 'cancel'}, {text: '提交', type: 'primary', key: 'ok'}],
        dataFormAdd: {
          from: [{
            prop: 'parentId',
            label: '父菜单：',
            type: 'select',
            select: [],
            value: '',
            labelWidth: '120px'
          }, {
            prop: 'name',
            label: '菜单名称：',
            value: '',
            labelWidth: '120px',
            required: true,
            placeholder: '请输入菜单名称',
            rules: [{ required: true, message: '请输入菜单名称', trigger: 'blur,change' }]
          }, {
            prop: 'menuKey',
            label: '菜单标识：',
            value: '',
            labelWidth: '120px',
            required: true,
            placeholder: '请输入菜单名称',
            rules: [{ required: true, message: '请输入菜单名称', trigger: 'blur,change' }]
          }, {
            prop: 'url',
            label: 'url：',
            value: '',
            labelWidth: '120px',
            required: true,
            placeholder: '请输入url',
            rules: [{ required: true, message: '请输入url', trigger: 'blur,change' }]
          }, {
            prop: 'sort',
            label: '排序：',
            value: null,
            type: 'number',
            labelWidth: '120px',
            required: true,
            placeholder: '数字用于排序',
            rules: [{ required: true, message: '请输入数字用于排序', trigger: 'blur,change' }]
          }, {
            prop: 'isShow',
            label: '是否显示：',
            type: 'select',
            select: [
              { label: '是', value: '0' },
              { label: '否', value: '1' }
            ],
            value: '',
            labelWidth: '120px',
            required: true,
            rules: [{ required: true, message: '请选择', trigger: 'blur,change' }]
          }, {
            prop: 'description',
            label: '描述：',
            value: '',
            type: 'textarea',
            rows: 3,
            labelWidth: '120px',
            placeholder: '请填写描述'
          }]
        },
        dialogDataEdit: {show: false, title: '编辑菜单', width: '30%'},
        dataFormEdit: {
          from: [{
            prop: 'parentId',
            label: '父菜单：',
            type: 'select',
            disabled: true,
            select: [],
            value: '',
            labelWidth: '120px'
          }, {
            prop: 'name',
            label: '菜单名称：',
            value: '',
            labelWidth: '120px',
            required: true,
            placeholder: '请输入菜单名称',
            rules: [{ required: true, message: '请输入菜单名称', trigger: 'blur,change' }]
          }, {
            prop: 'menuKey',
            label: '菜单标识：',
            value: '',
            labelWidth: '120px',
            required: true,
            placeholder: '请输入菜单名称',
            rules: [{ required: true, message: '请输入菜单名称', trigger: 'blur,change' }]
          }, {
            prop: 'url',
            label: 'url：',
            value: '',
            labelWidth: '120px',
            required: true,
            placeholder: '请输入url',
            rules: [{ required: true, message: '请输入url', trigger: 'blur,change' }]
          }, {
            prop: 'sort',
            label: '排序：',
            value: null,
            type: 'number',
            labelWidth: '120px',
            required: true,
            placeholder: '数字用于排序',
            rules: [{ required: true, message: '请输入数字用于排序', trigger: 'blur,change' }]
          }, {
            prop: 'isShow',
            label: '是否显示：',
            type: 'select',
            select: [
              { label: '是', value: '0' },
              { label: '否', value: '1' }
            ],
            value: '',
            labelWidth: '120px',
            required: true,
            rules: [{ required: true, message: '请选择', trigger: 'blur,change' }]
          }, {
            prop: 'description',
            label: '描述：',
            value: '',
            type: 'textarea',
            rows: 3,
            labelWidth: '120px',
            placeholder: '请填写描述'
          }]
        },
        dataButEdit: [{text: '取消', key: 'cancel'}, {text: '提交', type: 'primary', key: 'ok'}]
      }
    },
    created () {
      this.getFaterMenu()
    },
    computed: {},
    filters: {},
    methods: {
      getFaterMenu () {
        this.$Ajax.post({
          url: this.$Api.frontMenu.menuList,
          data: {parentId: 0},
          cb: res => {
            console.log(res, '父级菜单')
            if (res.data.result) {
              res.data.data.map((item) => {
                item.label = item.name
                item.value = item.id
              })
              this.dataFormAdd.from[0].select = res.data.data
              let st = {label: '请选择', value: 0}
              this.dataFormAdd.from[0].select.unshift(st)
            }
          }
        })
      },
      tabAdd () {
        this.formClear()
        this.getFaterMenu()
        this.dialogDataAdd.show = true
      },
      editPage (data) {
        this.dataFormEdit.from[0].id = data.id
        console.log(data, '我是')
        if (data.parentId !== 0) {
          this.dataFormEdit.from[0].value = data.parentId
          let list = [{label: data.parentName, value: data.parentId}]
          this.dataFormEdit.from[0].select = list
        } else {
          this.dataFormEdit.from[0].select = []
          this.dataFormEdit.from[0].value = ''
        }
        this.dataFormEdit.from[1].value = data.name
        this.dataFormEdit.from[2].value = data.menuKey
        this.dataFormEdit.from[3].value = data.url
        this.dataFormEdit.from[4].value = data.sort
        this.dataFormEdit.from[5].value = data.isShow + ''
        this.dataFormEdit.from[6].value = data.description
        this.dialogDataEdit.show = true
      },
      MessageBox (id, parentId) {
        let self = this
        this.$confirm('删除菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.delPageMenu(id, parentId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      delPageMenu (id, parentId) {
        this.$Ajax.post({
          url: this.$Api.frontMenu.deleteMenu,
          data: {id},
          cb: res => {
            if (res.data.result) {
//              if (parentId === 0) {
//                this.getFaterMenu()
//              }
              this.$message('删除成功！')
              this.$bus.emit('updata-tab-tree-list')
            }
          }
        })
      },
      cancelAdd () {
        this.dialogDataAdd.show = false
        this.formClear()
      },
      cancelEdit () {
        this.cancelFunction(this.dialogDataEdit)
      },
      cancelFunction (dialogName) {
        dialogName.show = false
        this.formClear()
      },
      okAdd (res) {
        if (!res.parentId) {
          res.parentId = 0
        }
        console.log(res, '添加的值')
        this.commit(res, '添加成功', this.dialogDataAdd)
      },
      okEdit (res) {
        res.id = this.dataFormEdit.from[0].id
        if (!res.parentId) {
          res.parentId = 0
        }
        console.log(res, '编辑的值')
        this.commit(res, '编辑成功', this.dialogDataEdit)
      },
      commit (ress, msg, dialog) {
        if (ress.sort < 0) {
          this.$message('排序必须是大于0')
          return false
        }
        this.$Ajax.post({
          url: this.$Api.frontMenu.addMenu,
          data: ress,
          cb: res => {
            if (res.data.result) {
              console.log(ress.parentId, 'ress.parentId')
//              if (ress.parentId === 0) {
//                this.getFaterMenu()
//              }
              this.addFunction(msg, dialog)
              //  this.getAddMenuData()
            }
          }
        })
      },
      addFunction (msg, dialogName) {
        this.$message(msg)
        dialogName.show = false
        this.formClear()
        this.$bus.emit('updata-tab-tree-list')
      },
      formClear () {
        this.$bus.emit('form-clear')
      },
      renderDomLe () {
        return (
          <div class="tr_right">
              <div class="tr_list">菜单标识</div>
              <div class="tr_list">排序</div>
              <div class="tr_list">菜单等级</div>
              <div class="tr_list">描述</div>
              <div class="tr_list tr_list_2">操作</div>
          </div>
        )
      },
      renderDomRi (h, { node, data, store }) {
        return (
          <div class="tr_right">
          <div class="tr_list">{data.menuKey}</div>
          <div class="tr_list">{data.sort}</div>
          <div class="tr_list">{data.level}</div>
          <div class="tr_list">{data.description}</div>
          <div class="tr_list text_right">
          <el-button type="text" size="mini" on-click={ () => this.editPage(data)}>编辑</el-button>
          <el-button type="text" size="mini" on-click={ () => this.MessageBox(data.id, data.parentId)}>删除</el-button>
          </div>
          </div>
        )
      }
    },
    mounted () {
    }
  }
</script>

<style>
  .tr_right{ width: 100%;display: flex;justify-content: space-between;height: 26px}
  .tr_right .tr_list{width: 130px;display: flex;align-items: center;}
  .tr_list_2{display: flex;justify-content: center}
</style>
