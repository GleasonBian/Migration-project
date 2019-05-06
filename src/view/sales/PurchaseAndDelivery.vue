<template>
  <div class="box_purchase">
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData" :refs="tableSalesPurchaseAndDelivery">
      <template slot-scope="scope" slot="numberIndex">
        {{scope.index+1}}
      </template>
      <template slot-scope="scope" slot="operation">
        <tab-but :data="operationBtn"
                 @on-detail="toPurchaseDetails(scope.row)"
                 @on-look="toUploadAdd(scope.row.id)"
                 @on-export="exportDeliver(scope.row)"
        ></tab-but>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <v-dialog :dialog="checkDialog">
      <form-group :data="checkForm" @on-cancel="checkCancel" :custom=true>
        <template slot-scope="scope" slot="btnGruop">
          <div class="clearfix">
            <div class="pull-left" style="margin-right:20px;">
              <v-upload :data="uploadData" :customBeforeUpload=true @on-success="uploadSuccess">
                <div><el-button size="small" type="primary" icon="el-icon-plus">上传</el-button></div>
              </v-upload>
            </div>
            <div class="pull-left">
              <el-button size="small" type="primary" icon="el-icon-delete" @click="deleteFiles">删除选中项</el-button>
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="tableBox">
          <table-list :data-header="dataHeaderFile" :url="tabFileUrl" :refs="tablePurAndDeliveryFile"
                      :params="pageFile" @get-table-data="getTableDataFile" @selection-change="selectionChange">
            <template slot-scope="scope" slot="fileOldName">
              <a :href="getShowImgPath(scope.row.filePath)"
                 class="item_img" target="_blank">{{scope.row.fileOldName}}</a>
            </template>
          </table-list>
          <v-page :data="pageFile"></v-page>
        </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [{
          key: 'number',
          label: '收货单号:',
          value: '',
          placeholder: '请输入'
        }, {
          key: 'supplierName',
          label: '供应商:',
          value: '',
          placeholder: '请输入'
        }, {
          key: 'startTime',
          label: '申请时间：',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }, {
          key: 'orderNumber',
          label: '销售订单:',
          value: '',
          placeholder: '请输入'
        }, {
          label: '订单状态：',
          value: '',
          key: 'stateCode',
          select: []
        }],
        dataSearch: {},
        btnData: [{
          text: '新增进货单',
          key: 'add'
        }],
        dataHeader: [{
          prop: 'numberIndex',
          label: '序号',
          width: '60px',
          slot: true
        }, {
          prop: 'number',
          label: '收货单号'
        }, {
          prop: 'orderNumber',
          label: '销售订单'
        }, {
          prop: 'supplierName',
          label: '供应商名称'
        }, {
          prop: 'stockDeliverAmount',
          label: '订单金额'
        }, {
          prop: 'stateStr',
          label: '状态'
        }, {
          prop: 'createTimeStr',
          label: '创建时间'
        }, {
          prop: 'userName',
          label: '创建人'
        }, {
          label: '操作',
          prop: 'operation',
          width: '280px',
          slot: true
        }],
        tabUrl: this.$Api.sale.loadStockDeliverPager,
        tableSalesPurchaseAndDelivery: 'table_sales_purchase_and_delivery',
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_sales_purchase_and_delivery'
        },
        operationBtn: [{
          text: '查看',
          key: 'on-detail',
          type: 'text'
        }, {
          text: '导出',
          key: 'on-export',
          type: 'text'
        }, {
          text: '上传/查看验收单据',
          key: 'on-look',
          type: 'text'
        }],
        checkDialog: {
          show: false,
          title: '上传/查看验收单据',
          width: '700px'
        },
        checkForm: {
          from: [{
            prop: 'btnGruop',
            label: '',
            value: '',
            labelWidth: '0',
            custom: true
          }, {
            prop: 'tableBox',
            label: '',
            value: '',
            labelWidth: '0',
            custom: true
          }]
        },
        uploadData: {
          url: this.$Api.sale.uploadImageFile,
          listType: 'text',
          showFileList: false,
          name: 'file',
          data: {},
          custom: true
        },
        tabFileUrl: this.$Api.sale.getVoucherList,
        dataHeaderFile: [{
          type: 'selection'
        }, {
          label: '文件名称',
          prop: 'fileOldName',
          slot: true
        }, {
          label: '大小',
          prop: 'fileSize'
        }],
        tablePurAndDeliveryFile: 'table_pur_and_delivery_file',
        pageFile: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_pur_and_delivery_file'
        },
        customBeforeUpload: true,
        fileMd5: '',
        deleteId: '',
        selectionDelete: [],
        idsFileDelete: []
      }
    },
    created () {
      this.getStateData()
    },
    methods: {
      getShowImgPath (path) {
        return this.$ImgPath.imgApi.imgApi + '/' + path
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      jumpPageParams (nameR, params) {
        this.$router.push({
          name: nameR,
          params: params
        })
      },
      getStateData () {
        this.$Ajax.post({
          url: this.$Api.sale.toStockDeliverList,
          cb: res => {
            if (res.data.result) {
              this.searchData[4].select = res.data.data
            }
          }
        })
      },
      search (res) {
        if (res.state) {
          res.state = parseInt(res.state)
        }
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearch, this.page], this.tableSalesPurchaseAndDelivery, this)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      getTableDataFile (data) {
        this.pageFile.totalNum = data.data.total
      },
      showHideDialog (name, b) {
        name.show = b
      },
      formClear () {
        this.$bus.emit('form-clear')
      },
      toUploadAdd (data) {
        this.showHideDialog(this.checkDialog, true)
        this.pageFile.stockDeliverId = data
        this.uploadData.data.id = data
        this.deleteId = data
        this.pageUpdateTable([this.pageFile], this.tablePurAndDeliveryFile, this)
      },
      toPurchaseDetails (row) {
        this.jumpPageParams('purchaseAndDeliveryDetail', {id: row.id})
      },
      exportDeliver (row) {
        location.href = this.$Api.sale.exportStockDeliver + '?id=' + row.id
      },
      checkCancel () {
        this.showHideDialog(this.checkDialog, false)
        this.formClear()
      },
      uploadSuccess (res) {
        if (res.result) {
          this.checkForm.from[0].value = res.data.imgUrl
          this.$message('上传文件成功')
          this.pageUpdateTable([this.pageFile], this.tablePurAndDeliveryFile, this)
        } else {
          this.$message.error(res.message)
        }
      },
      selectionChange (selection) {
        this.selectionDelete = selection
      },
      selectionDeleteData (data) {
        data.map(item => {
          this.idsFileDelete.push(item.id)
        })
        return this.idsFileDelete
      },
      deleteFiles () {
        this.$Ajax.post({
          url: this.$Api.sale.deleteVoucher,
          data: {
            ids: this.selectionDeleteData(this.selectionDelete)
          },
          cb: (res) => {
            this.pageUpdateTable([this.pageFile], this.tablePurAndDeliveryFile, this)
          }
        })
      }
    }
  }
</script>

<style>
  .box_purchase .el-table td.is-center:last-child{
    text-align: left;
  }
  .item_img{
    font-size: 14px;
    color: #008aff;
  }
  .item_img:hover{
    text-decoration: underline;
    cursor: pointer;
  }
</style>
