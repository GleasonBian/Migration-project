<template>
  <div>
    <v-search :data="searchData" @on-click="searchDataClick">
    </v-search>
    <div class="clearfix">
      <tab-but class="pull-left" :data="tabButData" @import-batch="onImport"
               @batch-delete="batchDelete"></tab-but>
      <tab-but class="pull-right" :data="tabButDataRight" @down-load="downLoad"></tab-but>
    </div>
    <table-list :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="tablePerformance"
                :params="page" @selection-change="selectionChange">
      <template v-slot:number="scope">
        <div>{{scope.index + 1}}</div>
      </template>
      <template v-slot:purchaseNumber="scope">
        <a class="handle" @click="toSalesDetails(scope.row)">{{scope.row.purchaseNumber}}</a>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
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
          url: this.$Api.contractGoods.importProcurementReconiliationGoods,
          listType: 'text',
          showFileList: false,
          name: 'file',
          data: {},
          custom: true
        },
        initTabData: {width: '600px', show: false},
        dialogEditFooter: [{text: '取消', key: 'cancel'}],
        price: '',
        tableUrl: this.$Api.contractGoods.purchaseReconiliationList,
        searchData: [
          {
            label: '物资名称：',
            value: '',
            placeholder: '请输入',
            key: 'goodsName'
          },
          {
            label: '供应商名称：',
            value: '',
            placeholder: '请输入',
            key: 'providerName'
          },
          {
            key: 'startTime',
            label: '物资签收时间：',
            value: '',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          },
          {
            label: '计划单号：',
            value: '',
            placeholder: '请输入',
            key: 'purchaseNumber'
          },
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          },
          {
            key: 'goodsClassId',
            label: '库别：',
            value: '',
            select: []
          }
        ],
        tabButData: [{
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
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlWarehouse: this.$Api.orderManger.findGoodsClassList,
        tableHeader: [
          {type: 'selection'},
          {prop: 'number', label: '序号', width: '60', slot: true},
          {label: '商品名称', prop: 'goodsName'},
          {label: '规格型号', prop: 'model'},
          {label: '单位', prop: 'unit'},
          {label: '数量', prop: 'goodsCount'},
          {label: '采购价', prop: 'purchasePrice'},
          {label: '税点', prop: 'taxPoint'},
          {label: '合计', prop: 'sumCount'},
          {label: '梁场名称', prop: 'projectName'},
          {label: '计划单号', prop: 'purchaseNumber', slot: true},
          {label: '库别', prop: 'goodsClassName'},
          {label: '供应商名称', prop: 'providerName'},
          {label: '签收时间', prop: 'signTimeStr'}
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_purchase_reconiliation_material_list',
          typeCode: 1
        },
        tablePerformance: 'tab_purchase_reconiliation_material_list',
        dataSearch: {},
        dataButAdd: [{text: '取消', key: 'cancel'}, {text: '确定', type: 'primary', key: 'ok'}],
        selection: [],
        selectionIds: []
      }
    },
    created () {
      this.getBeamField()
      this.getWarehouse()
    },
    methods: {
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      fliterSelectBeam (res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({label: item.projectName, value: item.id})
          })
        }
        return arrBeam
      },
      getBeamField () {
        this.ajaxPost(this.urlBeamField, (res) => {
          if (res.data.result) {
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(res.data.data)
              }
            })
          }
        })
      },
      fliterWarehouse (res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({label: item.frontName, value: item.id})
          })
        }
        return arrBeam
      },
      getWarehouse () {
        this.ajaxPost(this.urlWarehouse, (res) => {
          if (res.data.result) {
            this.searchData.map(item => {
              if (item.key === 'goodsClassId') {
                item.select = this.fliterWarehouse(res.data.data)
              }
            })
          }
        })
      },
      selectionChange (selection) {
        this.selection = selection
        this.selectionIds = this.selection.map(item => {
          return item.id
        })
      },
      toSalesDetails (res) {
        this.$router.push({name: 'detailsProcurement', params: {id: res.purchaseId}})
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
      downLoad () {
        location.href = this.$Api.contractGoods.downloadProcurementTemplate
      },
      searchDataClick (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
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
          this.$confirm('确定要删除吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.$Api.contractGoods.deletePurchaseReconiliationGoods,
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
          }).catch(() => {
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
          this.initTabData.show = false
          this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
        } else {
          this.$message.error(res.message)
        }
      }
    }
  }
</script>

<style scoped>
  .handle {
    font-size: 12px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }
</style>
