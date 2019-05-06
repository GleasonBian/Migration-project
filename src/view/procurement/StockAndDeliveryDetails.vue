<template>
  <div class="p_d_detail">
    <div v-if="dataDetails.length > 0">
      <div v-for="(item, index) in dataDetails">
        <div class="contract_title">收货单详情</div>
        <v-list :data="purchaseDeliverData" :data-list="item" :list-style="listStyle"></v-list>
        <div class="contract_title mr_b10">商品明细</div>
        <table-list :data-header="dataHeader" :static="true" :dataStatic="item.dataTable" :refs="item.refName">
          <template slot-scope="scope" slot="number">
            {{scope.index+1}}
          </template>
        </table-list>
        <div class="mr_b10"></div>
        <div class="btn_box">
          <tab-but :data="btnData1" @on-add="addCheck(item.id)" @on-export="exportPurAndDeliver(item.id)"></tab-but>
        </div>
      </div>
    </div>
    <div v-else>暂无收货单</div>
    <v-dialog :dialog="checkDialog">
      <form-group :data="checkForm" @on-cancel="checkCancel" :custom=true>
        <template slot-scope="scope" slot="btnGruop">
          <div class="clearfix">
            <div class="pull-left" style="margin-right:20px;">
              <v-upload :data="uploadData" :customBeforeUpload="customBeforeUpload" @on-success="uploadSuccess">
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
                      :params="page" @get-table-data="getTableData" @selection-change="selectionChange">
            <template slot-scope="scope" slot="fileOldName">
              <div class="item_img" @click="getShowImgPath(scope.row.filePath)">{{scope.row.fileOldName}}</div>
            </template>
          </table-list>
          <v-page :data="page"></v-page>
        </template>
      </form-group>
    </v-dialog>
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <img width="100%" :src="popoverImgPath"/>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        listStyle: {
          listwidth: '100px',
          class: 'purchase_list'
        },
        dataDetails: [],
        purchaseDeliverData: [
          {prop: 'number', label: '进货发货单'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'userName', label: '创建人'},
          {prop: 'orderCode', label: '销售单号'},
          {prop: 'stateStr', label: '订单状态'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'warehouseName', label: '仓库名称'},
          {prop: 'warehouseNameAddress', label: '仓库地址'},
          {prop: 'expectedArrivalTime', label: '预计到货时间'},
          {prop: 'otherExpenses', label: '其他费用'},
          {prop: 'stockDeliverAmount', label: '发货总金额'},
          {prop: 'otherExpensesRemark', label: '其他费用说明'}
        ],
        purchaseDeliverList: {},
        dataHeader: [{
          prop: 'number',
          label: '序号',
          width: '60',
          slot: true
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'typeModel',
          label: '规格型号'
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'stockCount',
          label: '发货数量'
        }, {
          prop: 'unitPrice',
          label: '价格'
        }, {
          prop: 'remark',
          label: '其他要求'
        }],
        dataTable: [],
        btnData: [{
          text: '上传/查看验收单',
          key: 'add'
        }, {
          text: '申请退货',
          key: 'on-return'
        }, {
          text: '申请换货',
          key: 'on-exchange'
        }, {
          text: '导出',
          key: 'on-export'
        }],
        btnData1: [{
          text: '上传/查看验收单',
          key: 'add'
        }, {
          text: '导出',
          key: 'on-export'
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
        customBeforeUpload: true,
        fileMd5: '',
        tablePurAndDeliveryFile: 'table_pur_and_delivery_file',
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
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_pur_and_delivery_file'
        },
        deleteId: '',
        selectionDelete: [],
        idsFileDelete: [],
        dialogVisible: false,
        popoverImgPath: ''
      }
    },
    created () {
      let id = this.$route.params.id
      this.idData = id
      this.getData(this.idData)
    },
    methods: {
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      getData (id) {
        this.$Ajax.post({
          url: this.$Api.sale.toStockDeliverDetails,
          data: {
            id: id
          },
          cb: res => {
            if (res.data.result) {
              this.dataDetails = this.dataDetailsFn(res.data.data)
              if (!this.$Utils.getPageElement(this.$Consts.PERMISSION.replenishStockMoney.code)) {
                let _purchaseData = []
                this.purchaseDeliverData.forEach((item, index) => {
                  if (item.prop !== 'stockDeliverAmount') {
                    _purchaseData.push(item)
                  }
                })
                this.purchaseDeliverData = _purchaseData

                let _dataHeader = []
                this.dataHeader.forEach((item, index) => {
                  if (item.prop !== 'unitPrice') {
                    _dataHeader.push(item)
                  }
                })
                this.dataHeader = _dataHeader
              }
            }
          }
        })
      },
      dataDetailsFn (data) {
        return data.map(item => {
          item.orderCode = item.replenishStockVO.orderCode
          item.warehouseName = item.replenishStockVO.warehouseName
          item.warehouseNameAddress = item.replenishStockVO.warehouseNameAddress
          item.refName = 'table_sales_purchase_deliver_details_' + item.id
          item.dataTable = item.stockDeliverGoodsVOList
          return item
        })
      },
      showHideDialog (name, b) {
        name.show = b
      },
      formClear () {
        this.$bus.emit('form-clear')
      },
      addCheck (data) {
        this.page.stockDeliverId = data
        this.uploadData.data.id = data
        this.deleteId = data
        this.pageUpdateTable([this.page], this.tablePurAndDeliveryFile, this)
        this.showHideDialog(this.checkDialog, true)
      },
      exportPurAndDeliver (data) {
        location.href = this.$Api.sale.exportStockDeliver + '?id=' + data
      },
      checkCancel () {
        this.showHideDialog(this.checkDialog, false)
        this.formClear()
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      uploadSuccess (res) {
        if (res.result) {
          this.checkForm.from[0].value = res.data.imgUrl
          this.fileMd5 = res.data.fileMd5
          this.$message('上传文件成功')
          this.pageUpdateTable([this.page], this.tablePurAndDeliveryFile, this)
          this.getData(this.idData)
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
            this.pageUpdateTable([this.page], this.tablePurAndDeliveryFile, this)
            this.getData(this.idData)
          }
        })
      },
      handleClose () {
        this.dialogVisible = false
      },
      getShowImgPath (item) {
        this.popoverImgPath = this.$ImgPath.imgApi.imgApi + '/' + item
        this.dialogVisible = true
      }
    }
  }
</script>

<style scoped>
  .item_img{
    font-size: 14px;
    color: #008aff;
  }
  .item_img:hover{
    text-decoration: underline;
    cursor: pointer;
  }
</style>

<style>
  .contract_title {display: inline-block;padding:10px 2px;border-bottom: 2px solid #1577fe; color: #1577fe;}
  .purchase_list > .v_list_li{width: 33% !important;float: left}
  .mr_b10 {margin-bottom:10px;}
  .btn_box{text-align: center}
  .btn_box .base_btn_group .el-button {padding: 10px 15px !important}
  .p_d_detail .avatar-uploader .el-upload{border:none;}
  .p_d_detail .el-dialog__body{padding-top: 10px;}
  .p_d_detail .el-dialog__body .el-form-item{margin-bottom: 0;}
</style>
