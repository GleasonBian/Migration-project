<template>
  <div>
    <div style="width: 70%">
      <form-group :data="dataForm" class="box_pool" :dataBut="dataBut" @on-cancel="cancel" :custom=true @on-ok="save">
        <template slot-scope="scope" slot="picture">
          <div class="box_nowrap">图片要求：宽高比300x300，小于等于1M，格式为JPG/PNG/GIF</div>
          <v-upload :data="logoData" @on-success-header="logoDataSuccess"></v-upload>
        </template>
        <template slot-scope="scope" slot="mealGoodsClassifyVOList">
          <div class="base_btn_group">
            <el-button type="primary" size="mini" @click="onAdd">新建类目</el-button>
          </div>
          <table-list :data-header="dataHeader" :dataStatic="dataTable1" :static="true">
            <template slot-scope="scope" slot="operation">
              <tab-but :data="tabButTable" @on-del="tabTbDel(scope.row)" @on-edit="tabTbEdit(scope.row)"></tab-but>
            </template>
          </table-list>
          <add-class-goods :classList="dataTable1"></add-class-goods>
        </template>
      </form-group>
      <v-dialog :dialog="NewClassDialog">
        <form-group :custom=true :data="NewClassDialogData" :dataBut="dataBut" @on-cancel="cancel" @on-ok="onNewClassSave"></form-group>
      </v-dialog>
    </div>
  </div>
</template>

<script>
    import AddClassGoods from './AddClassGoods.vue'
    export default {
      data () {
        return {
          logoData: {
            src: '',
            showFileList: false,
            header: true,
            name: 'logoFile'
          },
          NewClassDialog: {
            show: false,
            title: '新建类目：',
            width: '40%'
          },
          NewClassDialogData: {
            from: [
              {
                prop: 'classifyName',
                label: '类目名称：',
                value: '',
                labelWidth: '150px',
                rules: [
                  { required: true, message: '请输入套餐名称', trigger: 'blur,change' }
                ]
              },
              {
                prop: 'sort',
                label: '类目排序：',
                value: '',
                labelWidth: '150px',
                type: 'number',
                min: 0,
                rules: [
                  { required: true, message: '请输入类目排序', trigger: 'blur,change' }
                ]
              }
            ]
          },
          dataForm: {
            from: [
              {
                label: '所属阶段:',
                select: [],
                prop: 'phaseId',
                labelWidth: '150px',
                value: '',
                rules: [{required: true, message: '请选择所属阶段', trigger: 'blur,change'}]
              },
              {
                prop: 'name',
                label: '套餐名称：',
                value: '',
                labelWidth: '150px',
                rules: [
                  { required: true, message: '请输入套餐名称', trigger: 'blur,change' },
                  {max: 15, message: '限制在15个汉字内', trigger: 'blur,change'}
                ]
              },
              {
                label: '套餐图片:',
                prop: 'picture',
                labelWidth: '150px',
                custom: true,
                value: ''
              },
              {
                label: '物资分类:',
                prop: 'mealGoodsClassifyVOList',
                labelWidth: '150px',
                value: '',
                custom: true
              },
              {
                label: '套餐描述:',
                prop: 'describtion',
                labelWidth: '150px',
                type: 'textarea',
                rows: 5,
                value: ''
              }
            ]
          },
          dataBut: [{text: '取消', key: 'cancel'}, {text: '保存', key: 'ok', type: 'primary'}],
          dataHeader: [{prop: 'classifyName', label: '类目'}, {prop: 'sort', label: '排序'}, {prop: 'operation', label: '操作', slot: true}],
          dataTable1: [],
          tabButTable: [{text: '删除', key: 'del'}, {text: '修改', key: 'edit'}],
          id: '',
          state: '',
          newClass: true,
          editClassRow: {}
        }
      },
      created () {
        this.state = this.$route.params.state
        this.id = this.$route.params.id
        this.getphases()
        if (this.state === 'edit') {
          this.getData(this.id)
        }
      },
      methods: {
        getData (id) {
          this.$Ajax.get({
            url: this.$Api.customPackage.getSetMealById,
            data: {
              params: {
                id: id
              }
            },
            cb: res => {
              if (res.status === 200) {
                let resdata = res.data.data
                this.dataForm.from.map((item) => {
                  item.value = resdata[item.prop]
                })
                this.dataTable1 = resdata.mealGoodsClassifyVOList
                this.logoData.src = this.$ImgPath.imgApi.imgApi + '/' + resdata.picture
              }
            }
          })
        },
        tabTbEdit (row) {
          this.editClassRow = row
          this.newClass = false
          this.NewClassDialog.show = true
          this.NewClassDialogData.from[0].value = row.classifyName
          this.NewClassDialogData.from[1].value = row.sort
        },
        logoDataSuccess (res) {
          this.dataForm.from[2].value = res.message
        },
        onAdd () {
          this.newClass = true
          this.NewClassDialog.show = true
          this.NewClassDialogData.from[0].value = ' '
          this.NewClassDialogData.from[1].value = ' '
        },
        onNewClassSave (res) {
          if (this.newClass) {
            res.setMealId = this.id
            this.$Ajax.post({
              url: this.$Api.customPackage.addNewClass,
              data: res,
              cb: res => {
                if (res.status === 200) {
                  this.$message('添加成功')
                  res.data.data.goodsGataTable1 = []
                  this.dataTable1.push(res.data.data)
                  this.NewClassDialog.show = false
                }
              }
            })
          } else {
            res.id = this.editClassRow.id
            res.setMealId = this.editClassRow.setMealId
            this.$Ajax.post({
              url: this.$Api.customPackage.editClass,
              data: res,
              cb: res1 => {
                if (res1.status === 200) {
                  this.$message('修改成功')
                  let datarow = JSON.parse(JSON.stringify(this.editClassRow)) // 复制
                  datarow.classifyName = res.classifyName
                  datarow.sort = res.sort
                  this.dataTable1.splice(this.dataTable1.indexOf(this.editClassRow), 1, datarow)
                  this.NewClassDialog.show = false
                }
              }
            })
          }
        },
        tabTbDel (row) {
          this.$Ajax.post({
            url: this.$Api.customPackage.deleteMealGoodsClassifyById,
            data: {
              id: row.id
            },
            cb: res => {
              if (res.status === 200) {
                this.$message('删除成功')
                this.dataTable1.splice(this.dataTable1.indexOf(row), 1)
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
                let options = []
                res.data.map((item) => {
                  let option = {}
                  option.label = item.name
                  option.value = item.id
                  options.push(option)
                })
                this.dataForm.from[0].select = options
              }
            }
          })
        },
        cancel () {
          this.$router.push({name: 'goodsList'})
        },
        save (params) {
          params.id = this.id
          delete params.mealGoodsClassifyVOList
          this.$Ajax.post({
            url: this.$Api.customPackage.saveSetMeal,
            data: params,
            cb: res => {
              if (res.status === 200) {
                this.$message('保存成功')
                this.$router.push({name: 'goodsList'})
              }
            }
          })
        }
      },
      components: {
        AddClassGoods
      }
    }
</script>

<style>
</style>
