<template>
  <div>
    <v-search :data="SearchData" @on-click="searchDataClick">
      <template slot="orderStateDisplay" slot-scope="scope">
        <el-select v-model="scope.rows.value" placeholder="请选择">
          <el-option
            v-for="item in stateOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="projectId" slot-scope="scope">
        <el-select v-model="scope.rows.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.projectName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </v-search>
    <table-list :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsMealListTable"
                :params="params">
      <template v-slot:name="scope">
        <div class="mCen1">
          <div>订单编号:
            <el-button type="text" @click="onview(scope.row)">{{scope.row.orderNumber}}</el-button>
          </div>
          <div>{{scope.row.userName}}:{{scope.row.userPhone}}</div>
        </div>
      </template>
      <template v-slot:operation="scope">
        <div class="mCen1">
          <select-but :data="getSelectBtn(scope.row)" :ref="'select' + scope.row.id" :row="scope.row"
                      @change="selectChange"></select-but>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[params]"></v-page>
    <v-dialog :dialog="checkDialog">
      <form-group :data="checkForm" :custom=true>
        <template v-slot:btnGruop="scope">
          <div class="clearfix">
            <div class="pull-left" style="margin-right:20px;">
              <v-upload :data="uploadData" :customBeforeUpload=true @on-success="uploadSuccess">
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
                      :params="pageFile" @get-table-data="getTableDataFile" @selection-change="selectionChange">
            <template v-slot:fileOldName="scope">
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
        selectBtn: [{
          value: '',
          options: [
            {
              value: 'details',
              label: '查看',
              prop: 'onview'
            },
            {
              value: 'order',
              label: '导出订单',
              prop: 'onorder'
            },
            {
              value: 'Delivery',
              label: '导出发货单',
              prop: 'ondelivery'
            },
            {
              value: 'look',
              label: '出库',
              prop: 'onCreate'
            }
          ]
        }],
        selectBtnElse: [{
          value: '',
          options: [
            {
              value: 'details',
              label: '查看',
              prop: 'onview'
            },
            {
              value: 'order',
              label: '导出订单',
              prop: 'onorder'
            },
            {
              value: 'Delivery',
              label: '导出发货单',
              prop: 'ondelivery'
            }
          ]
        }],
        checkDialog: {
          show: false,
          title: '上传/查看验收单据',
          width: '700px'
        },
        tableUrl: this.$Api.orderManger.loadListData,
        goodsMealListTable: 'tab_orderManger_list',
        options: [],
        stateOptions: [{id: '', name: '全部'}, {id: '待收货', name: '待收货'}, {id: '待付款', name: '待付款'}, {
          id: '结算中',
          name: '结算中'
        }, {id: '已完成', name: '已完成'}],
        SearchData: [
          {
            label: '订单编号：',
            value: '',
            placeholder: '请输入',
            key: 'orderNumber'
          }, {
            label: '会员名称：',
            value: '',
            placeholder: '请输入',
            key: 'userName'
          }, {
            label: '订单状态：',
            value: '',
            placeholder: '请输入',
            custom: true,
            key: 'orderStateDisplay',
            prop: 'orderStateDisplay'
          }, {
            label: '梁场名称：',
            value: '',
            placeholder: '请输入',
            custom: true,
            key: 'projectId',
            prop: 'projectId'
          }, {
            key: 'materialName',
            label: '物资名称',
            value: '',
            type: 'text'
          }
        ],
        tableHeader: [
          {type: 'index', label: '序号'},
          {label: '会员名', prop: 'name', slot: true, width: '300px'},
          {label: '梁场名称', prop: 'projectName'},
          {label: '订单金额', prop: 'orderAmount'},
          {label: '总货款', prop: 'goodsMoney'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '状态', prop: 'orderStateDisplay'},
          {label: '操作', slot: true, prop: 'operation'}
        ],
        params: {},
        operationOptions: [
          {
            value: 'details',
            label: '查看'
          },
          {
            value: 'stock',
            label: '进货'
          },
          {
            value: 'order',
            label: '导出订单'
          },
          {
            value: 'Delivery',
            label: '导出发货单'
          },
          {
            value: 'creat',
            label: '出库'
          }
        ],
        operationOptionsElse: [
          {
            value: 'details',
            label: '查看'
          },
          {
            value: 'stock',
            label: '进货'
          },
          {
            value: 'order',
            label: '导出订单'
          },
          {
            value: 'Delivery',
            label: '导出发货单'
          }
        ],
        upTabButData: [
          {
            text: '查看',
            key: 'on-view',
            type: 'text'
          }, {
            text: '进货',
            key: 'on-stock',
            type: 'text'
          }, {
            text: '导出订单',
            key: 'on-order',
            type: 'text'
          }, {
            text: '导出发货单',
            key: 'on-Delivery',
            type: 'text'
          }
        ],
        upTabButData0: [
          {
            text: '查看',
            key: 'on-view',
            type: 'text'
          }, {
            text: '进货',
            key: 'on-stock',
            type: 'text'
          }, {
            text: '导出订单',
            key: 'on-order',
            type: 'text'
          }, {
            text: '导出发货单',
            key: 'on-Delivery',
            type: 'text'
          }, {
            text: '出库',
            key: 'on-create',
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
      this.getphases()
    },
    methods: {
      selectChange (row, val, item, data) {
        this.$refs['select' + row.id].createChange(row, val, item, data, this)
      },
      getSelectBtn (res) {
        if (res.isOffTheStocks === 0) {
          return this.selectBtn
        } else {
          return this.selectBtnElse
        }
      },
      onCreate (row) {
        let routeData = this.$router.resolve({
          name: 'libraryAdd',
          params: {id: row.id, orderCode: row.orderNumber}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'libraryAdd', params: {id: row.id, orderCode: row.orderNumber}})
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
        let routeData = this.$router.resolve({
          name: 'orderManangerDetail',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'orderManangerDetail', params: {id: row.id}})
      },
      onstock (row) {
        let routeData = this.$router.resolve({
          name: 'newStockOrder',
          params: {id: row.id}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'newStockOrder', params: {id: row.id}})
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
      getphases () {
        this.$Ajax.post({
          url: this.$Api.orderManger.getProjectList,
          data: {},
          cb: res => {
            if (res.status === 200) {
              this.options = res.data.data
              this.options.unshift({id: '', projectName: '全部'})
            }
          }
        })
      },
      selectionChange (selection) {
        this.selectionDelete = selection
      },
      searchDataClick (res) {
        this.params = res
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
