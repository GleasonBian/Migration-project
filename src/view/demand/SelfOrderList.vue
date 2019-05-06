<template>
  <div>
    <v-search :data="SearchData" @on-click="searchDataClick"></v-search>
    <table-list :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsMealListTable"
                :params="params">
      <template slot-scope="scope" slot="name">
        <div class="mCen1">
          <el-button type="text" @click="onview(scope.row)">{{scope.row.orderNumber}}</el-button>
          <!--<div>订单编号:<el-button type="text" @click="onview(scope.row)">{{scope.row.orderNumber}}</el-button></div>-->
          <!--<div>{{scope.row.userName}}:{{scope.row.expressLinkManPhone}}</div>-->
        </div>
      </template>
      <template slot-scope="scope" slot="operation">
        <div class="mCen1">
          <TabBut  :data="upTabButData" @on-stock="onstock(scope.row)" @on-view="onview(scope.row)" v-show="scope.row.isOffTheStocks == 0"></TabBut>
          <TabBut  :data="upTabButData1" @on-view="onview(scope.row)" v-show="scope.row.isOffTheStocks !== 0"></TabBut>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[params]"></v-page>
    <v-dialog :dialog="checkDialog">
      <form-group :data="checkForm"  :custom=true>
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
        checkDialog: {
          show: false,
          title: '上传/查看验收单据',
          width: '700px'
        },
        tableUrl: this.$Api.demand.loadListData,
        goodsMealListTable: 'tab_orderManger_list',
        options: [],
        SearchData: [
          {
            label: '订单编号：',
            value: '',
            placeholder: '请输入',
            key: 'orderNumber'
          }, {
            label: '梁场名称',
            value: '',
            key: 'projectId',
            select: []
          }, {
            key: 'startTime',
            label: '创建时间',
            value: '',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            key: 'userName',
            label: '采购员：',
            value: '',
            placeholder: '请输入'
          }, {
            label: '创建人',
            value: '',
            placeholder: '请输入',
            key: 'createUserName'
          }, {
            key: 'orderStateDisplay',
            label: '状态',
            value: '',
            select: [{value: '', label: '全部'}, {value: '待收货', label: '待收货'}, {value: '待付款', label: '待付款'}, {value: '结算中', label: '结算中'}, {value: '已完成', label: '已完成'}]
          }
        ],
        tableHeader: [
          {type: 'index', label: '序号'},
          {label: '订单号', prop: 'name', slot: true, width: '300px'},
          {label: '订单金额', prop: 'orderAmount'},
          {label: '总货款', prop: 'goodsMoney'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '状态', prop: 'orderStateDisplay'},
          {label: '操作', slot: true, prop: 'operation', width: '150px'}
        ],
        params: {
          orderTypeCode: 2
        },
        upTabButData: [
          {
            text: '查看',
            key: 'on-view',
            type: 'text'
          }, {
            text: '出库',
            key: 'on-stock',
            type: 'text'
          }
        ],
        upTabButData1: [
          {
            text: '查看',
            key: 'on-view',
            type: 'text'
          }
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_orderManger_list'
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
          url: this.$Api.orderManger.uploadImageFile,
          listType: 'text',
          showFileList: false,
          name: 'file',
          data: {},
          custom: true
        },
        tabFileUrl: this.$Api.orderManger.getVoucherList,
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
        tablePurAndDeliveryFile: 'table_pur_dialog_file',
        pageFile: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_pur_dialog_file'
        },
        customBeforeUpload: true,
        fileMd5: '',
        deleteId: '',
        selectionDelete: [],
        idsFileDelete: []
      }
    },
    created () {
      this.getProjectList()
    },
    methods: {
      getProjectList () {
        this.$Ajax.post({
          url: this.$Api.demand.getProjectList,
          cb: res => {
            if (res.status === 200) {
              if (res.data.data) {
                let select = []
                res.data.data.map(x => {
                  select.push({
                    value: x.id,
                    label: x.projectName
                  })
                })
                this.SearchData[1].select = select
              }
            }
          }
        })
      },
      getShowImgPath (path) {
        return this.$ImgPath.imgApi.imgApi + '/' + path
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      getTableDataFile (data) {
        this.pageFile.totalNum = data.data.total
      },
      onlook (data) {
        this.showHideDialog(this.checkDialog, true)
        this.pageFile.purchaseId = data.id
        this.uploadData.data.id = data.id
        this.deleteId = data.id
        this.pageUpdateTable([this.purchaseId], this.tablePurAndDeliveryFile, this)
      },
      showHideDialog (name, b) {
        name.show = b
      },
      ondelivery (row) {
        location.href = this.$Api.orderManger.exportDeliveryOrder + '?orderId=' + row.id
      },
      onorder (row) {
        location.href = this.$Api.orderManger.exportOrderDetail + '?orderId=' + row.id
      },
      onview (row) {
        this.$router.push({name: 'selfOrderDetail', params: {id: row.id}})
      },
      onstock (row) {
        this.$router.push({name: 'selfOrderNew', params: {id: row.id, orderCode: row.orderNumber}})
      },
      ondel (row) {
        this.$Ajax.post({
          url: this.$Api.customPackage.deletedSetMealById,
          data: {
            id: row.id
          },
          cb: res => {
            if (res.status === 200) {
              this.$message('删除成功')
              this.tableRefresh()
            }
          }
        })
      },
      selectionChange (selection) {
        this.selectionDelete = selection
      },
      searchDataClick (res) {
        console.log(JSON.stringify(res))
        this.params = res
        this.params.orderTypeCode = 2
        this.tableRefresh()
      },
      tableRefresh () {
        this.$Utils.pageUpdateTable([this.params, this.page], this.goodsMealListTable, this)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      uploadSuccess (res) {
        if (res.result) {
          this.checkForm.from[0].value = res.data.imgUrl
          this.fileMd5 = res.data.fileMd5
          this.$message('上传文件成功')
          this.pageUpdateTable([this.purchaseId], this.tablePurAndDeliveryFile, this)
        } else {
          this.$message.error(res.message)
        }
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
            this.pageUpdateTable([this.purchaseId], this.tablePurAndDeliveryFile, this)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .mCen1 .base_btn_group .el-button {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .uploadBtn .avatar-uploader .el-upload {
    border: 0px;
  }
</style>
