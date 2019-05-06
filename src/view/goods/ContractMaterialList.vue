<template>
  <div>
    <v-search :data="searchData" @on-click="searchDataClick">
    </v-search>
    <div class="clearfix">
      <tab-but class="pull-left" :data="tabButData" @on-add="add" @import-batch="onImport"
               @batch-delete="batchDelete"></tab-but>
      <tab-but class="pull-right" :data="tabButDataRight" @down-load="downLoad"></tab-but>
    </div>
    <table-list :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="tablePerformance"
                :params="page" @selection-change="selectionChange">
      <template slot-scope="scope" slot="number">
        <div>{{scope.index + 1}}</div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--新增合同物资-->
    <v-dialog :dialog="dialogDataAdd">
      <form-group :data="dataFormAdd" @on-cancel="cancelAdd" @on-ok="okAdd" :clear=true :custom=true
                  :data-but="dataButAdd" class="box_form">
        <template slot-scope="scope" slot="price">
          <el-input type="number" v-model="price" @wheel.native.prevent size="small" :min="0" placeholder="请输入销售"
                    @change="priceChange" @blur="priceChange"></el-input>
        </template>
      </form-group>
    </v-dialog>
    <!--批量导入-->
    <v-dialog :dialog="initTabData" :dialog-footer="dialogEditFooter" @on-cancel="initWareouseCancel">
      <div style="margin-top: 20px; width: 100%">
        <el-row>
          <el-col :span="12">
            <div style="margin-top: 8px; margin-right: 20px">选择文件</div>
            <div>
              <v-upload :data="uploadData" :customBeforeUpload=true @on-success="uploadSuccess">
                <div>
                  <el-button size="small" type="primary">点击上传</el-button>
                </div>
              </v-upload>
            </div>
          </el-col>
        </el-row>
      </div>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        uploadData: {
          url: this.$Api.contractGoods.importContractGoods,
          listType: 'text',
          showFileList: false,
          name: 'file',
          data: {},
          custom: true
        },
        initTabData: {width: '600px', show: false},
        dialogEditFooter: [{text: '取消', key: 'cancel'}],
        price: '',
        tableUrl: this.$Api.contractGoods.list,
        searchData: [
          {
            label: '物资名称：',
            value: '',
            placeholder: '请输入',
            key: 'goodsName'
          },
          {
            label: '品牌：',
            value: '',
            placeholder: '请输入',
            key: 'brand'
          },
          {
            label: '厂家：',
            value: '',
            placeholder: '请输入',
            key: 'companyName'
          }
        ],
        tabButData: [{
          text: '新增',
          key: 'add'
        }, {
          text: '批量导入',
          key: 'import-batch'
        }, {
          text: '批量删除',
          key: 'batch-delete'
        }],
        tabButDataRight: [{
          text: '下载模板',
          key: 'down-load'
        }],
        tableHeader: [
          {type: 'selection'},
          {prop: 'number', label: '序号', width: '60', slot: true},
          {label: '商品名称', prop: 'goodsName'},
          {label: '商品别名', prop: 'goodsAlias'},
          {label: '规格型号', prop: 'model'},
          {label: '品牌', prop: 'brand'},
          {label: '厂家', prop: 'companyName'},
          {label: '单位', prop: 'unit'},
          {label: '销售价格', prop: 'price'}
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_contract_material_list'
        },
        tablePerformance: 'tab_contract_material_list',
        dataSearch: {},
        dialogDataAdd: {show: false, title: '新增合同物资', width: '500px'},
        dataButAdd: [{text: '取消', key: 'cancel'}, {text: '确定', type: 'primary', key: 'ok'}],
        dataFormAdd: {
          from: [
            {
              prop: 'goodsName',
              label: '商品名称：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入商品名称',
              rules: [{required: true, message: '请输入商品名称', trigger: 'blur,change'}]
            },
            {
              prop: 'goodsAlias',
              label: '商品别名：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入商品别名'
            },
            {
              prop: 'model',
              label: '规格型号：',
              value: '',
              labelWidth: '120px',
              placeholder: '请输入规格型号',
              required: true,
              rules: [{required: true, message: '请输入规格型号', trigger: 'blur,change'}]
            },
            {
              prop: 'unit',
              label: '计量单位：',
              value: '',
              labelWidth: '120px',
              required: true,
              placeholder: '请输入计量单位',
              rules: [{required: true, message: '请输入计量单位', trigger: 'blur,change'}]
            },
            {
              prop: 'price',
              label: '销售价格：',
              value: '',
              type: 'number',
              labelWidth: '120px',
              required: true,
              custom: true,
              placeholder: '请输入销售价格',
              rules: [{required: true, message: '请输入销售价格', trigger: 'blur,change'}]
            },
            {
              prop: 'brand',
              label: '品牌：',
              value: '',
              labelWidth: '120px',
              required: false,
              placeholder: '请输入品牌'
            },
            {
              prop: 'companyName',
              label: '厂家：',
              value: '',
              labelWidth: '120px',
              required: false,
              placeholder: '请输入厂家'
            }
          ]
        },
        selection: [],
        selectionIds: []
      }
    },
    created () {
    },
    methods: {
      selectionChange (selection) {
        this.selection = selection
        this.selectionIds = this.selection.map(item => {
          return item.id
        })
      },
      priceChange () {
        this.dataFormAdd.from.map(item => {
          if (item.prop === 'price') {
            item.value = this.price
          }
        })
      },
      formClear () {
        this.$bus.emit('form-clear')
      },
      add () {
        this.dialogDataAdd.show = true
      },
      cancelAdd () {
        this.dialogDataAdd.show = false
        this.formClear()
        this.price = ''
      },
      okAdd (res) {
        this.$Ajax.post({
          url: this.$Api.contractGoods.saveContractGoods,
          data: res,
          cb: res => {
            if (res.data.result) {
              this.cancelAdd()
              this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      downLoad () {
        location.href = this.$Api.contractGoods.downloadTemplate
      },
      searchDataClick (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      onImport (id) {
        this.initTabData.show = true
      },
      batchDelete () {
        if (this.selectionIds && this.selectionIds.length > 0) {
          this.$Ajax.post({
            url: this.$Api.contractGoods.deleteContractGoods,
            data: {
              ids: this.selectionIds
            },
            cb: res => {
              if (res.data.result) {
                this.$message('删除成功')
                this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
              }
            }
          })
        } else {
          this.$message('请选择合同物资')
        }
      },
      initWareouseCancel () {
        this.initTabData.show = false
        this.$bus.emit('clear-files')
      },
      uploadSuccess (res) {
        if (res.result) {
          this.$message('上传文件成功')
          this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
        } else {
          this.$message.error(res.message)
        }
      }
    }
  }
</script>

<style scoped>
</style>
