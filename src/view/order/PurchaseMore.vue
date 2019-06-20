<template>
  <div>
    <div class="title">采购单详情</div>
    <div class=""><v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list></div>
    <div class="header_title">
      <div class="header_title_item">{{quotationVO.companyName}}</div>
      <div class="header_title_item">{{quotationVO.operatorName}}</div>
      <div class="header_title_item">报价总额:{{quotationVO  | totalPrice}}</div>
      <div class="header_title_item">
        <el-button type="primary" @click="showImportDialog()">导入报价</el-button>
      </div>
    </div>
    <table-list :data-header="dataHeader" :data-static="quotationVO.quotationGoodsVOList"  :static="tableStatic">
      <template v-slot:unitGoodsPrice="scope">
        <el-input type="number" v-model="scope.row.unitGoodsPrice"></el-input>
      </template>
      <template v-slot:totalGoodsPrice="scope">
        <span>{{scope.row | itemTotal}}</span>
      </template>
    </table-list>
    <!-----------------------------保存---------------------------------->
    <div style="margin-top: 20px;display: flex;justify-content: center">
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button type="primary" @click="onSaveAdd">保存并添加</el-button>
    </div>

    <!-----------------------------新增供应商弹框---------------------------------->
    <v-dialog :dialog="purchaseDialog">
      <v-search :data="searchData" @on-click="search"></v-search>
      <table-list :data-header="pDataHeader" :url="pTabUrl" :params="page" @get-table-data="getTableData"
                  :refs="tablePerformance">
        <template v-slot:handle="scope">
          <a class="add_item" @click="addPurchaseItem(scope.row.id)">添加</a>
        </template>
      </table-list>
      <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    </v-dialog>
    <!-----------------------------导入报价弹框---------------------------------->
    <v-dialog :dialog="importDialog" :dialogFooter="importFooterDialog" @on-ok="importOkDialog">
      <div>说明：请先下载模板,并按照模板格式填写内容,然后选择上传图片或表格;<a style="color: #3a8ee6" :href="downLoadUrl">下载模板</a></div>
      <div style="display: flex; margin-top: 20px">
        <div style="margin-top: 8px; margin-right: 20px">选择文件</div>
        <div class="uploadBtn">
          <v-upload :data="uploadData" :customBeforeUpload="customBeforeUpload" @on-success="uploadSuccess">
            <div>
              <el-button size="small" type="primary">点击上传</el-button>
            </div>
          </v-upload>
        </div>
      </div>
    </v-dialog>
  </div>
</template>


<script>
  export default {
    components: {},
    data () {
      return {
        id: '',
        listPurchaseId: '',
        quotationGoodsVOList: [],
        data: [
          { prop: 'projectName', label: '下单梁场' },
          { prop: 'code', label: '采购单号' },
          { prop: 'userName', label: '下单人' },
          { prop: 'phoneNum', label: '联系方式' },
          { prop: 'createTimeStr', label: '创建时间' },
          { prop: 'expectedTime', label: '期望到货时间' }
        ],
        dataList: {
        },
        quotationVO: {},
        listStyle: {
          class: ['pannel']
        },
        dataHeader: [
          { prop: 'quotationId', label: '序号' },
          { prop: 'goodsName', label: '商品名称' },
          { prop: 'typeModel', label: '规格型号' },
          { prop: 'brandName', label: '品牌' },
          { prop: 'unit', label: '计量单位' },
          { prop: 'goodsCount', label: '采购数量' },
          { prop: 'unitGoodsPrice', label: '报价', slot: true },
          { prop: 'totalGoodsPrice', label: '金额', slot: true },
          { prop: 'remark', label: '备注' },
          { prop: 'quotationStateStr', label: '报价状态' }
        ],
        dataStaticLs: [],
        tableStatic: true,
        purchaseDialog: {
          width: '800px',
          show: false,
          title: '选择供应商'
        },
        searchData: [{
          key: 'enterpriseName',
          label: '企业名称',
          value: ''
        }],
        dataSearch: {},
        tablePerformance: 'purchase_dialog_table',
        pTabUrl: this.$Api.order.loadEnterpriseData,
        pDataHeader: [
          { prop: 'enterpriseId', label: '序号' },
          { prop: 'enterpriseName', label: '企业名称' },
          { prop: 'enterpriseArea', label: '企业地址' },
          { prop: 'handle', label: '操作', slot: true }
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'purchase_dialog_table'
        },
        importDialog: {
          width: '30%',
          show: false,
          title: '模板导入'
        },
        importFooterDialog: [
          {text: '取消', key: 'cancel'},
          {text: '确定', key: 'ok', type: 'primary'}
        ],
        downLoadUrl: this.$Api.order.downloadTemplate,
        customBeforeUpload: true,
        uploadData: {
          url: this.$Api.order.importExcelOnePurchase,
          name: 'file',
          showFileList: false,
          listType: 'text',
          custom: true
        }
      }
    },
    created () {
      this.id = this.$route.params.id
      this.downLoadUrl = this.downLoadUrl + '/' + this.id
      this.uploadData.url = this.uploadData.url + '/' + this.id
      this.getDetail()
    },
    methods: {
      getDetail () {
        this.$Ajax.get({
          url: this.$Api.order.newQuotationDetail,
          data: {
            params: {
              quotationId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.dataList = res.data.data.listPurchaseVO
              this.quotationVO = res.data.data.quotationVO
              this.listPurchaseId = this.quotationVO.listPurchaseId
            }
          }
        })
      },
      showPurchaseDialog () {
        this.purchaseDialog.show = true
      },
      closePurchaseDialog () {
        this.purchaseDialog.show = false
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      addPurchaseItem (id) {
        this.$Ajax.get({
          url: this.$Api.order.appointCompanyQuotation,
          data: {
            params: {
              listPurchaseId: this.listPurchaseId,
              companyId: id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.closePurchaseDialog()
              this.$router.back()
            }
          }
        })
      },
      showImportDialog (id) {
        this.importDialog.show = true
      },
      hideImportDialog () {
        this.importDialog.show = false
      },
      uploadSuccess (res, file, fileList) {
        let _this = this
        if (res.result) {
          this.showAlert('上传成功', () => {
            _this.getDetail()
            _this.importOkDialog()
          })
        } else {
          this.showAlert(res.message, () => {})
        }
      },
      showAlert (msg, myCallback) {
        this.$alert(msg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            myCallback()
          }
        })
      },
      importOkDialog () {
        this.importDialog.show = false
      },
      onSave () {
        let flag = true
        let ls = []
        let item = {}
        let goodsLs = []
        item.quotationId = this.quotationVO.id
        for (let i in this.quotationVO.quotationGoodsVOList) {
          let obj = this.quotationVO.quotationGoodsVOList[i]
          if (obj.unitGoodsPrice <= 0) {
            flag = false
            break
          }
          goodsLs.push({
            quotationGoodsId: obj.id,
            unitGoodsPrice: obj.unitGoodsPrice
          })
        }
        if (!flag) {
          this.showAlert('报价商品中有未报价商品，请先填写再次保存', () => {})
        } else {
          item.quotationGoodsInfos = goodsLs
          ls.push(item)
          this.$Ajax.post({
            url: this.$Api.order.updateQuotation,
            data: {
              quotationInfos: JSON.stringify(ls)
            },
            cb: res => {
              if (res.status === 200) {
                this.getDetail()
                this.$router.back()
              }
            }
          })
        }
      },
      onSaveAdd () {
        let flag = true
        let ls = []
        let item = {}
        let goodsLs = []
        item.quotationId = this.quotationVO.id
        for (let i in this.quotationVO.quotationGoodsVOList) {
          let obj = this.quotationVO.quotationGoodsVOList[i]
          if (obj.unitGoodsPrice <= 0) {
            flag = false
            break
          }
          goodsLs.push({
            quotationGoodsId: obj.id,
            unitGoodsPrice: obj.unitGoodsPrice
          })
        }
        if (!flag) {
          this.showAlert('报价商品中有未报价商品，请先填写再次保存', () => {})
        } else {
          item.quotationGoodsInfos = goodsLs
          ls.push(item)
          this.$Ajax.post({
            url: this.$Api.order.updateQuotation,
            data: {
              quotationInfos: JSON.stringify(ls)
            },
            cb: res => {
              if (res.status === 200) {
                this.getDetail()
                this.showPurchaseDialog()
              }
            }
          })
        }
      }
    },
    filters: {
      totalPrice: function (val) {
        let total = 0
        if (val.quotationGoodsVOList) {
          val.quotationGoodsVOList.map(x => {
            total += x.totalGoodsPrice
          })
        }
        val.totalGoodsPrice = total
        return val.totalGoodsPrice
      },
      itemTotal: function (val) {
        val.totalGoodsPrice = (val.goodsCount) * (val.unitGoodsPrice)
        return val.totalGoodsPrice
      }
    }
  }
</script>
<style scoped>
  .title{
    margin-bottom: 10px;
    font-size: 18px;
    padding-left: 5px;
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 10px;
  }
  .header_title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #333;
    height: 60px;
    background-color: #e5e5e5;
    margin-left: 0px;
    margin-top: 10px;
  }
  .item_btn{
    flex: 1;
    width: 100px;
  }
  .header_title_item{
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
  .add_item{
    color: #008aff;
    cursor: pointer;
    font-size: 12px;
  }
  .add_item:hover{
    text-decoration: underline;
  }
</style>
<style>
  .pannel .v_list_li{
    float: left;
    width: 33% !important;
  }
</style>

