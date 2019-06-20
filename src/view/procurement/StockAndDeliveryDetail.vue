<template>
  <div class="p_d_detail">
    <div class="contract_title">收货单详情</div>
    <v-list :data="purchaseDeliverData" :data-list="dataDetails" :list-style="listStyle"></v-list>
    <div class="contract_title mr_b10">商品明细</div>
    <table-list :data-header="dataHeader" :static="true" :dataStatic="dataTable"
                :refs="tableSalePurchaseAndDeliveryDetail" v-show="!isRead">
      <template v-slot:number="scope">
        {{scope.index + 1}}
      </template>
      <template v-slot:collectionQuantity="scope">
        <el-input type="number" v-model="scope.row.collectionQuantity" @wheel.native.prevent></el-input>
      </template>
    </table-list>
    <table-list :data-header="dataHeaderRead" :static="true" :dataStatic="dataTable"
                :refs="tableSalePurchaseAndDeliveryDetail" v-show="isRead">
      <template v-slot:number="scope">
        {{scope.index + 1}}
      </template>
    </table-list>
    <div class="contract_title mr_b10">签收明细</div>
    <div style="width:40%">
      <table-list :data-header="dataHeaderFile1" :url="tabFileUrl" :refs="tablePurAndDeliveryFile"
                  :params="page" @get-table-data="getTableData" @selection-change="selectionChange">
        <template v-slot:fileOldName="scope">
          <a :href="getShowImgPath(scope.row.filePath)"
             class="item_img" target="_blank">{{scope.row.fileOldName}}</a>
        </template>
      </table-list>
    </div>
    <div class="mr_b10"></div>
    <div class="btn_box">
      <el-button type="" @click="onback">返回</el-button>
      <el-button type="primary" @click="addCheck">上传/查看验收单据</el-button>
      <el-button type="primary" @click="exportPurAndDeliver"
                 v-show="$Utils.getPageElement($Consts.PERMISSION.exportReceipt.code)">导出
      </el-button>
      <el-button type="primary" @click="onAffirm" v-show="isShow" :disabled="disabledAffirm">确认验收</el-button>
    </div>
    <v-dialog :dialog="checkDialog">
      <form-group :data="checkForm" @on-cancel="checkCancel" :custom=true>
        <template v-slot:btnGruop="scope">
          <div class="clearfix">
            <div class="pull-left" style="margin-right:20px;">
              <v-upload :data="uploadData" :customBeforeUpload="customBeforeUpload" @on-success="uploadSuccess">
                <div>
                  <el-button size="small" type="primary" icon="el-icon-plus">上传</el-button>
                </div>
              </v-upload>
            </div>
            <div class="pull-left">
              <el-button size="small" type="primary" icon="el-icon-delete" @click="deleteFiles">删除选中项</el-button>
            </div>
          </div>
        </template>
        <template v-slot:tableBox="scope">
          <table-list :data-header="dataHeaderFile" :url="tabFileUrl" :refs="tablePurAndDeliveryFile"
                      :params="page" @get-table-data="getTableData" @selection-change="selectionChange">
            <template v-slot:fileOldName="scope">
              <a :href="getShowImgPath(scope.row.filePath)"
                 class="item_img" target="_blank">{{scope.row.fileOldName}}</a>
            </template>
          </table-list>
          <v-page :data="page"></v-page>
        </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    data () {
      return {
        disabledAffirm: false,
        isRead: false,
        isShow: false,
        listStyle: {
          listwidth: '100px',
          class: 'purchase_list'
        },
        dataDetails: {},
        tableSalePurchaseAndDeliveryDetail: 'table_sale_purchase_and_delivery_detail',
        purchaseDeliverData: [
          {prop: 'number', label: '收货单号'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'userName', label: '创建人'},
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
          prop: 'collectionQuantity',
          label: '实收数量',
          slot: true
        }, {
          prop: 'unitPrice',
          label: '价格'
        }, {
          prop: 'remark',
          label: '其他要求'
        }],
        dataHeaderRead: [{
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
          prop: 'collectionQuantity',
          label: '实收数量'
        }, {
          prop: 'unitPrice',
          label: '价格'
        }, {
          prop: 'remark',
          label: '其他要求'
        }],
        dataTable: [],
        btnData: [{
          text: '返回',
          key: 'on-back'
        }, {
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
        dataHeaderFile1: [],
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
        ImgDataList: [],
        id: 0
      }
    },
    created () {
      this.dataHeaderFile1 = this.dataHeaderFile.slice(1)
      this.id = this.$route.params.id
      this.getData(this.id)
    },
    methods: {
      onAffirm () {
        let json = {id: this.id}
        json.stockDeliverGoodsVOList = this.dataTable
        let flag = false
        this.dataTable.map(item => {
          console.log(item.collectionQuantity)
          if (item.collectionQuantity === '' || Number(item.collectionQuantity) <= 0 || item.collectionQuantity === null || !item.collectionQuantity) {
            flag = true
          }
        })
        if (flag) {
          this.$message.error('请正确填写实收数量')
        } else {
          this.disabledAffirm = true
          this.$confirm('确定要验收吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.$Api.sale.confirmStockDeliver,
              data: {
                json: JSON.stringify(json)
              },
              cb: res => {
                if (res.data.result) {
                  this.$message(res.data.message)
                  this.disabledAffirm = false
                  this.$router.push({name: 'receiptList'})
                }
              }
            })
          }).catch(() => {
            this.disabledAffirm.disabled = false
          })
        }
      },
      getShowImgPath (path) {
        return this.$ImgPath.imgApi.imgApi + '/' + path
      },
      onback () {
        this.$router.push({name: 'receiptList'})
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      getData (id) {
        this.$Ajax.post({
          url: this.$Api.sale.toStockDeliverDetail,
          data: {
            id: id
          },
          cb: res => {
            if (res.data.result) {
              this.dataDetails = res.data.data
              if (this.dataDetails.stateStr === '待验收') {
                this.isRead = false
              } else {
                this.isRead = true
              }
              this.dataDetails.orderCode = this.dataDetails.replenishStockVO.orderCode
              this.dataDetails.warehouseName = this.dataDetails.replenishStockVO.warehouseName
              this.dataDetails.warehouseNameAddress = this.dataDetails.replenishStockVO.warehouseNameAddress
              this.dataTable = this.dataDetails.stockDeliverGoodsVOList
              if (!this.isRead) {
                this.dataTable.map(item => {
                  item.collectionQuantity = item.collectionQuantity ? item.collectionQuantity : item.stockCount
                })
              }
              this.page.stockDeliverId = this.dataDetails.id
              this.pageUpdateTable([this.page], this.tablePurAndDeliveryFile, this)
              if (res.data.data.stateCode === 1) {
                this.isShow = true
              }
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
      showHideDialog (name, b) {
        name.show = b
      },
      formClear () {
        this.$bus.emit('form-clear')
      },
      addCheck () {
        this.showHideDialog(this.checkDialog, true)
        this.page.stockDeliverId = this.dataDetails.id
        this.uploadData.data.id = this.dataDetails.id
        this.deleteId = this.dataDetails.id
      },
      exportPurAndDeliver () {
        location.href = this.$Api.sale.exportStockDeliver + '?id=' + this.dataDetails.id
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
          }
        })
      }
    }
  }
</script>

<style>
  .contract_title {
    display: inline-block;
    padding: 10px 2px;
    border-bottom: 2px solid #1577fe;
    color: #1577fe;
  }

  .purchase_list > .v_list_li {
    width: 33% !important;
    float: left
  }

  .mr_b10 {
    margin-bottom: 10px;
  }

  .btn_box {
    text-align: center
  }

  .btn_box .base_btn_group .el-button {
    padding: 10px 15px !important
  }

  .p_d_detail .avatar-uploader .el-upload {
    border: none;
  }

  .p_d_detail .el-dialog__body {
    padding-top: 10px;
  }

  .p_d_detail .el-dialog__body .el-form-item {
    margin-bottom: 0;
  }

  .imgItemClass {
    display: block;
    margin-top: 5px;
  }

  table {
    width: 100%;
  }
</style>
