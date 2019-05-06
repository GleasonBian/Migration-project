<template>
  <div class="p_d_detail_lv_de">
    <div>供应验收单详情</div>
    <br>
    <div>
      <v-list :data="purchaseDeliverData" :data-list="dataDetails" :list-style="listStyle"></v-list>
      <h5>商品明细</h5>
      <table-list :data-header="dataHeader" :static=true :dataStatic="voList" v-show="!isEdit">
      </table-list>
      <table-list :data-header="dataHeaderEdit" :static=true :dataStatic="voList" v-show="isEdit">
        <template slot-scope="scope" slot="collectionQuantity">
          <el-input type="number"  :placeholder="scope.row.collectionQuantity" v-model="scope.row.collectionQuantity"
                    @change="collectionQuantityChange(scope.row.id, scope.row.collectionQuantity)"></el-input>
        </template>
      </table-list>
      <div class="mr_b10"></div>
      <div class="btn_box">
        <tab-but :data="btnData" @on-add="addCheck" @on-export="exportPurAndDeliver" @on-return="onReturn" v-show="!isShow"></tab-but>
        <tab-but :data="btnData1" @on-add="addCheck" @on-export="exportPurAndDeliver" @on-return="onReturn" @on-affirm="onAffirm" v-show="isShow"></tab-but>
      </div>
    </div>
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
    <el-dialog :visible.sync="dialogDataAddUser.show" width="20%"  title="确认验收" center>
       <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteOrder">取 消</el-button>
        <el-button type="primary" @click="confirmOrder">确 定</el-button>
      </span>
     </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isEdit: false,
        isShow: false,
        listStyle: {
          listwidth: '100px',
          class: 'purchase_list'
        },
        dataDetails: {},
        purchaseDeliverData: [
          {prop: 'applicaFormCode', label: '供应验收单号'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'applicaUserName', label: '创建人'},
          {prop: 'orderCode', label: '销售单号'},
          {prop: 'stateStr', label: '出库状态'},
          {prop: 'materialNumber', label: '物资数量'},
          {prop: 'applicaFormAmount', label: '金额'},
          {prop: 'warehouseName', label: '仓库名称'},
          {prop: 'warehouseAddress', label: '仓库地址'},
          {prop: 'listPurchaserName', label: '采购员'}
        ],
        purchaseDeliverList: {},
        dataHeader: [{
          type: 'index', label: '序号'
        }, {
          prop: 'applicaFormCode',
          label: '收货单号'
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'goodsId',
          label: '商品编号'
        }, {
          prop: 'model',
          label: '规格型号'
        }, {
          prop: 'brand',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'applicaNum',
          label: '出库数量'
        }, {
          prop: 'collectionQuantity',
          label: '实收数量'
        }, {
          prop: 'goodsUtilPrice',
          label: '价格'
        }, {
          prop: 'goodsTotalPrice',
          label: '金额'
        }, {
          prop: 'remark',
          label: '其他要求'
        }, {
          prop: 'supplierName',
          label: '供应商名称'
        }],
        dataHeaderEdit: [{
          type: 'index', label: '序号'
        }, {
          prop: 'applicaFormCode',
          label: '收货单号'
        }, {
          prop: 'goodsId',
          label: '商品编号'
        }, {
          prop: 'model',
          label: '规格型号'
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'brand',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'applicaNum',
          label: '出库数量'
        }, {
          prop: 'collectionQuantity',
          label: '实收数量',
          slot: true
        }, {
          prop: 'goodsUtilPrice',
          label: '价格'
        }, {
          prop: 'goodsTotalPrice',
          label: '金额'
        }, {
          prop: 'remark',
          label: '其他要求'
        }, {
          prop: 'supplierName',
          label: '供应商名称'
        }],
        dataTable: [],
        btnData: [{
          text: '返回',
          key: 'on-return'
        }, {
          text: '查看签收单据',
          key: 'add'
        }, {
          text: '导出',
          key: 'on-export'
        }],
        btnData1: [{
          text: '返回',
          key: 'on-return'
        }, {
          text: '查看签收单据',
          key: 'add'
        }, {
          text: '导出',
          key: 'on-export'
        }, {
          text: '确认验收',
          key: 'on-affirm'
        }],
        checkDialog: {
          show: false,
          title: '查看签收单据',
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
          url: this.$Api.leaveStorage.uploadImageFile,
          listType: 'text',
          showFileList: false,
          name: 'file',
          data: {},
          custom: true
        },
        customBeforeUpload: true,
        fileMd5: '',
        tablePurAndDeliveryFile: 'table_pur_and_delivery_file',
        tabFileUrl: this.$Api.leaveStorage.getVoucherList,
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
        voList: [],
        tbId: 0,
        dialogVisible: false,
        popoverImgPath: '',
        dialogDataAddUser: {
          show: false
        }
      }
    },
    created () {
      this.tbId = this.$route.params.id
      this.getData(this.tbId)
    },
    methods: {
      onAffirm () {
        let flag = false
        this.voList.map(item => {
          if (item.collectionQuantity === '' || item.collectionQuantity === null || item.collectionQuantity > item.applicaNum) {
            flag = true
          }
        })
        if (flag) {
          this.$message.error('请正确填写实收数量')
          return
        }
        this.dialogDataAddUser.show = true
      },
      confirmOrder () {
        this.$Ajax.post({
          url: this.$Api.order.confirmApplicaForm,
          data: {
            id: this.tbId
          },
          cb: res => {
            this.$message(res.data.message)
            if (res.data.result) {
              // this.$router.push({name: 'demandLibrary'})
              this.$router.push({name: 'libraryList'})
            }
          }
        })
      },
      deleteOrder () {
        this.dialogDataAddUser.show = false
      },
      collectionQuantityChange (id, price) {
        if (price <= 0) {
          this.$message('请正确填写实收数量')
          return false
        }
        this.$Ajax.get({
          url: this.$Api.order.updateApplicaFormGoodsCollectionQuantit,
          data: {
            params: {
              id: id,
              collectionQuantity: price
            }
          },
          cb: res => {
            if (res.data.result) {
              this.$message('保存成功')
              this.getData(this.tbId)
            }
          }
        })
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      getData (id) {
        this.$Ajax.post({
          url: this.$Api.demand.findApplicaForm,
          data: {
            applicaFormId: id
          },
          cb: res => {
            if (res.data.data) {
              this.dataDetails = res.data.data
              if (this.dataDetails.stateStr === '待验收') {
                this.isEdit = true
              }
//              this.dataDetails.applicaFormAmount = '￥' + this.dataDetails.applicaFormAmount
              this.voList = res.data.data.applicaFormGoodsVOList
              this.voList.map(item => {
                if (item.remark === null) {
                  item.remark = '-'
                }
//                item.goodsUtilPrice = '￥' + item.goodsUtilPrice
                if (res.data.data.stateCode === 0) {
                  this.isShow = true
                }
              })
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
        this.page.purchaseId = this.tbId
        this.uploadData.data.id = this.tbId
        this.deleteId = this.tbId
        this.pageUpdateTable([this.page], this.tablePurAndDeliveryFile, this)
        this.showHideDialog(this.checkDialog, true)
      },
      exportPurAndDeliver () {
        location.href = this.$Api.leaveStorage.exportApplicaFormDetail + '?applicaFormId=' + this.tbId
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
          url: this.$Api.leaveStorage.deleteVoucher,
          data: {
            ids: this.selectionDeleteData(this.selectionDelete)
          },
          cb: (res) => {
            this.pageUpdateTable([this.page], this.tablePurAndDeliveryFile, this)
          }
        })
      },
      onReturn () {
        this.$router.push({name: 'demandLibrary'})
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
  .uploadList{
    width: 300px;
  }
</style>
<style>
  .p_d_detail_lv_de .contract_title {display: inline-block;padding:10px 2px;border-bottom: 2px solid #1577fe; color: #1577fe;}
  .p_d_detail_lv_de .purchase_list > .v_list_li{width: 33% !important;float: left}
  .p_d_detail_lv_de .mr_b10 {margin-bottom:10px;}
  .p_d_detail_lv_de .btn_box{text-align: center; margin-bottom: 60px;}
  .p_d_detail_lv_de .btn_box .base_btn_group .el-button {padding: 10px 15px !important}
  .p_d_detail_lv_de .avatar-uploader .el-upload{border:none;}
  .p_d_detail_lv_de .el-dialog__body{padding-top: 10px;}
  .p_d_detail_lv_de .el-dialog__body .el-form-item{margin-bottom: 0;} 
  
</style>
