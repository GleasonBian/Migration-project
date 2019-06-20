<template>
  <div class="p_d_detail_lv">
    <div v-if="dataDetails.length > 0">
      <div>申请供应验收单</div>
      <br>
      <div v-for="(item, index) in dataDetails">
        <v-list :data="purchaseDeliverData" :data-list="item" :list-style="listStyle"></v-list>
        <table-list :data-header="dataHeader" :static=true :dataStatic="item.applicaFormGoodsVOList" :refs="item.refName"></table-list>
        <div class="mr_b10"></div>
        <div class="btn_box">
          <tab-but :data="btnData" @on-add="addCheck(item.id)" @on-export="exportPurAndDeliver(item.id)"></tab-but>
        </div>
      </div>
    </div>
    <div v-else>暂无数据</div>
    <v-dialog :dialog="checkDialog">
      <form-group :data="checkForm" @on-cancel="checkCancel" :custom=true>
        <template v-slot:btnGruop="scope">
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
        <template v-slot:tableBox="scope">
          <table-list :data-header="dataHeaderFile" :url="tabFileUrl" :refs="tablePurAndDeliveryFile"
                      :params="page" @get-table-data="getTableData" @selection-change="selectionChange">
            <template v-slot:fileOldName="scope">
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
          {prop: 'applicaFormCode', label: '出库单号'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'applicaUserName', label: '创建人'},
          {prop: 'orderCode', label: '销售单号'},
          {prop: 'stateStr', label: '出库状态'},
          {prop: 'applicaFormAmount', label: '金额'},
          {prop: 'warehouseName', label: '仓库名称'},
          {prop: 'warehouseAddress', label: '仓库地址'},
          {prop: 'listPurchaserName', label: '采购员'}
        ],
        purchaseDeliverList: {},
        dataHeader: [{
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'goodsBaseClassName',
          label: '商品分类'
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
          prop: 'goodsUtilPrice',
          label: '价格'
        }, {
          prop: 'remark',
          label: '其他要求'
        }],
        dataTable: [],
        btnData: [{
          text: '查看验收凭证',
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
        dialogVisible: false,
        popoverImgPath: ''
      }
    },
    created () {
      let id = this.$route.params.id
      this.getData(id)
    },
    methods: {
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      getData (id) {
        this.$Ajax.post({
          url: this.$Api.leaveStorage.loadApplicaForm,
          data: {
            orderId: id
          },
          cb: res => {
            if (res.data.result) {
              this.dataDetails = res.data.data
              this.dataDetails.map((item, index) => {
                item.refName = 'index_' + item.id
                item.applicaFormGoodsVOList.map(list => {
                  if (list.remark === null) {
                    list.remark = '-'
                  }
                })
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
      addCheck (data) {
        this.page.purchaseId = data
        this.uploadData.data.id = data
        this.deleteId = data
        this.pageUpdateTable([this.page], this.tablePurAndDeliveryFile, this)
        this.showHideDialog(this.checkDialog, true)
      },
      exportPurAndDeliver (data) {
        location.href = this.$Api.leaveStorage.exportApplicaFormDetail + '?applicaFormId=' + data
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
  .p_d_detail_lv .contract_title {display: inline-block;padding:10px 2px;border-bottom: 2px solid #1577fe; color: #1577fe;}
  .p_d_detail_lv .purchase_list > .v_list_li{width: 33% !important;float: left}
  .p_d_detail_lv .mr_b10 {margin-bottom:10px;}
  .p_d_detail_lv .btn_box{text-align: center; margin-bottom: 60px;}
  .p_d_detail_lv .btn_box .base_btn_group .el-button {padding: 10px 15px !important}
  .p_d_detail_lv .avatar-uploader .el-upload{border:none;}
  .p_d_detail_lv .el-dialog__body{padding-top: 10px;}
  .p_d_detail_lv .el-dialog__body .el-form-item{margin-bottom: 0;}
</style>
