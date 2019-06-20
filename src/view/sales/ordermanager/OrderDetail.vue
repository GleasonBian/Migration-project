<template>
  <div class="box">
    <div class="contract_title">订单详情</div>
    <div class="base_btn_group">
      <el-button type="primary" size="mini" @click="onexport" style="float: right">导出发货单</el-button>
      <el-button type="primary" size="mini" @click="onlook" style="float: right; margin-right: 20px;">查看凭证</el-button>
    </div>
    <table border="1">
      <tbody>
        <tr v-for="item in listData">
          <td width="10%" style="background:#f5f5f5;text-align:center">{{item.title}}</td>
          <td width="90%" style="padding: 8px">
            <div>
              <v-list :data="item.dataType" :data-list="item.flag ? invoicelist:datalist" :listStyle="listStyle"></v-list>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="contract_title">商品明细</div>
    <table-list :data-header="dataHeader" :dataStatic="goodsDetailList" :static="true">
      <template v-slot:picturePath="scope">
        <img :src="scope.row.picturePath" style="max-height:40px;"/>
      </template>
    </table-list>

    <div class="contract_title">供应验收单列表</div>
    <table-list :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsMealListTable" :params="page">
      <template v-slot:operation="scope">
        <div>
          <router-link class="handle" :to="{name: 'demandLibraryView', params:{id: scope.row.id}}" tag="a" target="_blank">查看</router-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>

    <v-dialog :dialog="checkDialog">
      <form-group :data="checkForm"  :custom=true>
        <template v-slot:btnGruop="scope">
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
          goodsMealListTable: 'tab_sales_list',
          tableHeader: [
            {label: '供应验收单号', prop: 'applicaFormCode'},
            {label: '仓库名称', prop: 'warehouseName'},
            {label: '梁场名称', prop: 'projectName'},
            {label: '采购员', prop: 'listPurchaserName'},
            {label: '供应验收状态', prop: 'stateStr'},
            {label: '创建人', prop: 'applicaUserName'},
            {label: '创建时间', prop: 'createTimeStr'},
            {label: '操作', slot: true, prop: 'operation', width: '200px'}
          ],
          dataSearch: {},
          page: {
            totalNum: 0,
            currentPage: 1,
            offset: 0,
            refs: 'tab_sales_list'
          },
          tableUrl: this.$Api.demand.loadApplicaFormListByPager,
          listStyle: {
            listwidth: '120px'
          },
          listData: [
            {title: '订单信息',
              dataType: [
                {prop: 'orderNumber', label: '订单编号'},
                {prop: 'createTimeStr', label: '下单时间'},
                {prop: 'orderAmount', label: '订单金额'},
                {prop: 'orderAmount', label: '应付金额'}
              ]
            },
            {title: '收货信息',
              dataType: [
                {prop: 'expressLinkMan', label: '收货人'},
                {prop: 'expressLinkManPhone', label: '收货人手机号'},
                {prop: 'expressAddress', label: '收货地址'}
              ]
            },
            {title: '发票信息',
              dataType: [
                {prop: 'purchasingBillInvoiceTypeDisplay', label: '发票类型'},
                {prop: 'purchasingBillInvoiceCompanyName', label: '单位名称'},
                {prop: 'purchasingBillInvoiceTaxpayCode', label: '纳税人识别号'},
                {prop: 'purchasingBillInvoiceRegistryAddress', label: '注册地址'},
                {prop: 'purchasingBillInvoiceRegistryPhone', label: '注册电话'},
                {prop: 'purchasingBillInvoiceOpenAccount', label: '开户银行账户'},
                {prop: 'purchasingBillInvoiceReceiverName', label: '收票人姓名'},
                {prop: 'purchasingBillInvoiceReceiverPhone', label: '收票人手机'},
                {prop: 'purchasingBillInvoiceReceiverAddress', label: '收票地址'}
              ],
              flag: true
            },
            {title: '其他',
              dataType: [
                {prop: 'remark', label: '订单备注'}
              ]
            }
          ],
          datalist: {},
          invoicelist: {},
          dataHeader: [
            {prop: 'goodsName', label: '商品名称'},
            {prop: 'picturePath', label: '商品图片', slot: true},
            {prop: 'typeModel', label: '规格型号'},
            {prop: 'brandName', label: '品牌'},
            {prop: 'unit', label: '单位'},
            {prop: 'goodsCount', label: '数量'},
            {prop: 'unitPrice', label: '价格'},
            {prop: 'subtotal', label: '采购金额'},
            {prop: 'goodsBaseClassName', label: '商品分类'},
            {prop: 'stateStr', label: '状态'}
          ],
          goodsDetailList: [],
          orderId: '',
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
            url: this.$Api.orderManger.uploadImageFile,
            listType: 'text',
            showFileList: false,
            name: 'file',
            data: {},
            custom: true
          },
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
          tabFileUrl: this.$Api.orderManger.getVoucherList,
          tablePurAndDeliveryFile: 'table_pur_dialog_file',
          pageFile: {
            totalNum: 0,
            currentPage: 1,
            offset: 0,
            refs: 'table_pur_dialog_file'
          },
          deleteId: '',
          fileMd5: '',
          selectionDelete: [],
          idsFileDelete: []
        }
      },
      created () {
        this.orderId = this.$route.params.id
        this.getData(this.orderId)
        this.page.orderId = this.orderId
      },
      methods: {
        getTableData (data) {
          this.page.totalNum = data.data.total
        },
        getShowImgPath (path) {
          return this.$ImgPath.imgApi.imgApi + '/' + path
        },
        selectionChange (selection) {
          this.selectionDelete = selection
        },
        getTableDataFile (data) {
          this.pageFile.totalNum = data.data.total
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
        },
        selectionDeleteData (data) {
          data.map(item => {
            this.idsFileDelete.push(item.id)
          })
          return this.idsFileDelete
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
        onlook () {
          this.showHideDialog(this.checkDialog, true)
          this.pageFile.purchaseId = this.orderId
          this.uploadData.data.id = this.orderId
          this.deleteId = this.orderId
          this.pageUpdateTable([this.purchaseId], this.tablePurAndDeliveryFile, this)
        },
        pageUpdateTable (dataArr, tableRefs, self) {
          this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
        },
        showHideDialog (name, b) {
          name.show = b
        },
        onexport () {
          location.href = this.$Api.orderManger.exportDeliveryOrder + '?orderId=' + this.orderId
        },
        getData (id) {
          this.$Ajax.get({
            url: this.$Api.orderManger.orderAllInfo,
            data: {
              params: {
                orderId: id,
                role: 3
              }
            },
            cb: res => {
              if (res.status === 200) {
                this.datalist = res.data.data
                this.invoicelist = res.data.data.invoiceUseInfo
                this.goodsDetailList = res.data.data.orderFromGoodsList
              }
            }
          })
        }
      }
    }
</script>

<style scoped>
  .handle{
    font-size: 12px;
    color: #008aff;
    cursor:pointer;
    text-decoration: none;
    margin-left: 5px;
  }
  .handle:hover{
    text-decoration: none;
  }
  .box table{
    width: 100%;
    border-collapse: collapse;
    table-layout:fixed;
    border:1px solid #ddd;
    border-spacing:0
  }
  .contract_title {display: inline-block;padding:10px 2px;border-bottom: 2px solid #1577fe; color: #1577fe;}
  .mr_b10 {margin-bottom:10px;}
</style>
