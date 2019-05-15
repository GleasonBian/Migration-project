<template>
    <div>
      <div class="title">采购单详情</div>
      <div class="box"><v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list></div>

      <br><br><br>
      <div style="overflow: hidden;">
        <tab-but :data="tabButTable" @onPush="onPush" style="float: left;"></tab-but>
        <tab-but :data="tabButTableOffer" @purPackChoice="purPackChoice" @purGoodsChoice="purGoodsChoice" style="float: right;"></tab-but>
      </div>
      <table-list :data-header="dataGoodsHeader" :url="goodsTableUrl" :params="pageGoods" @get-table-data="goodsTableData" :refs="refGoods" @select ="select" @select-all="selectall" >
      </table-list>
      <v-page :data="pageGoods"></v-page>
      <br>

      <!-----------------------------供应商列表---------------------------------->
      <!--<el-button type="primary" style="margin: 10px 0px;" @click="showPurchaseDialog">新增供应商</el-button>-->
      <!--<div class="purchase_item">-->
        <!--<el-collapse accordion>-->
          <!--<el-collapse-item v-for="(item, index) in dataStaticLs" :key="index">-->
            <!--<template slot="title">-->
              <!--<div class="header_title">-->
                <!--<div class="header_title_item">{{item.companyName}}</div>-->
                <!--<div class="header_title_item">{{item.operatorName}}</div>-->
                <!--<div class="header_title_item">报价总额:{{item | totalPrice}}</div>-->
              <!--</div>-->
            <!--</template>-->
            <!--<div>-->
              <!--<table-list :data-header="dataHeader" :data-static="item.quotationGoodsVOList"  :static="tableStatic">-->
                <!--<template slot-scope="scope" slot="unitGoodsPrice">-->
                  <!--<el-input type="number" v-model="scope.row.unitGoodsPrice"></el-input>-->
                <!--</template>-->
                <!--<template slot-scope="scope" slot="totalGoodsPrice">-->
                  <!--<span>{{scope.row | itemTotal($Utils)}}</span>-->
                <!--</template>-->
              <!--</table-list>-->
            <!--</div>-->
            <!--<div style="margin: 10px 0px;">-->
              <!--<el-button type="primary" @click="showImportDialog(item.id)">导入报价</el-button>-->
              <!--<el-button type="primary" @click="viewMore(item.id)">查看更多</el-button>-->
            <!--</div>-->
          <!--</el-collapse-item>-->
        <!--</el-collapse>-->
      <!--</div>-->
      <!-----------------------------保存---------------------------------->
      <!--<div style="margin-top: 20px;display: flex;justify-content: center">-->
        <!--<el-button type="primary" @click="onSave">保存</el-button>-->
      <!--</div>-->

      <!-----------------------------新增供应商弹框---------------------------------->
      <v-dialog :dialog="purchaseDialog">
        <v-search :data="searchData" @on-click="search"></v-search>
        <table-list :data-header="pDataHeader" :url="pTabUrl" :params="page" @get-table-data="getTableData"
                    :refs="tablePerformance">
          <template slot-scope="scope" slot="handle">
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

      <div class="title" style="margin-top: 10px;">其他资料</div>
      <table-list :data-header="dataImgHeader" :url="imgTableUrl" :params="pageInfo" @get-table-data="getImgTableData" :refs="tablePerformanceImg">
        <template slot-scope="scope" slot="fileOldName">
          <div>{{scope.row.fileOldName}}</div>
        </template>
        <template slot-scope="scope" slot="btnDownLoad">
          <el-button size="mini" type="text" @click="getShowImgPath(scope.row)">下载</el-button>
        </template>
      </table-list>
      <v-page :data="pageInfo"></v-page>

      <div style="margin-top: 20px;display: flex;justify-content: center">
        <el-button type="primary" @click="toClose">关闭询价</el-button>
      </div>

    </div>
</template>


<script>
  export default {
    components: {},
    data () {
      return {
        id: '',
        data: [
          { prop: 'code', label: '采购单编码' },
          { prop: 'typeStr', label: '采购类型' },
          { prop: 'stateStr', label: '状态' },
          { prop: 'createTimeStr', label: '创建时间' },
          { prop: 'userName', label: '创建人' },
          { prop: 'phoneNum', label: '创建人手机号码' },
          { prop: 'projectName', label: '梁场名称' },
          { prop: 'expectedTime', label: '期望到货时间' }
        ],
        dataList: {
        },
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
        },
        dataImgHeader: [
          { prop: 'fileOldName', label: '文件名称', slot: true },
          { prop: 'fileSize', label: '文件大小' },
          { prop: 'btnDownLoad', label: '操作', slot: true }
        ],
        imgTableUrl: this.$Api.order.getVoucherList,
        pageInfo: {
          purchaseId: 0,
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_purchase_search'
        },
        tablePerformanceImg: 'table_purchase_search',
        tabButTable: [{text: '推送给供应商', key: 'onPush'}],
        tabButTableOffer: [{text: '按供应商查看', key: 'purPackChoice'}, {text: '分物资查看', key: 'purGoodsChoice'}],
        dataGoodsHeader: [
          {type: 'selection'},
          { prop: 'goodsName', label: '商品名称' },
          { prop: 'model', label: '规格型号' },
          { prop: 'brand', label: '品牌' },
          { prop: 'unit', label: '计量单位' },
          { prop: 'count', label: '采购数量' },
          { prop: 'remark', label: '备注' },
          { prop: 'pushedSupplierNames', label: '已推送供应商' },
          { prop: 'winSupplierName', label: '中标供应商' }
        ],
        goodsTableUrl: this.$Api.order.listPurchaseByPager,
        pageGoods: {
          listPurchaseId: 0,
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_goods_list'
        },
        refGoods: 'table_goods_list',
        idsArray: []
      }
    },
    created () {
      this.id = this.$route.params.id
      this.pageInfo.purchaseId = this.id
      this.pageGoods.listPurchaseId = this.id
      this.getDetail()
    },
    methods: {
      toClose () {
        this.$Ajax.post({
          url: this.$Api.order.closeQuotation,
          data: {
            listPurchaseId: this.id
          },
          cb: res => {
            if (res.status === 200) {
              this.$message('关闭询价成功！')
            }
          }
        })
      },
      selectall (selection) {
        let set = new Set(this.idsArray)
        selection.map((item) => {
          set.add(item.id)
        })
        this.idsArray = Array.from(set)
        this.$Utils.setSessionStorage('idsArray', this.idsArray.join(','))
      },
      select (selection, obj) {
        let id = obj.id
        if (selection.includes(obj)) {
          this.idsArray.push(id)
        } else {
          this.idsArray.splice(this.idsArray.indexOf(id), 1)
        }
        this.$Utils.setSessionStorage('idsArray', this.idsArray.join(','))
      },
      goodsTableData (data) {
        this.pageGoods.totalNum = data.data.total
        let list = []
        let arr = this.$Utils.getSessionStorage('idsArray')
        arr = arr.split(',')
        data.data.rows.map(item => {
          arr.map(row => {
            row = parseFloat(row)
            if (item.id === row) {
              list.push(item)
            }
          })
        })
        this.$nextTick(() => {
          this.$bus.emit('set-tab-default-data', list, this.refGoods)
        })
      },
      purGoodsChoice () {
        this.$router.push({ name: 'purGoodsChoice', params: { id: this.id } })
      },
      purPackChoice () {
        this.$router.push({ name: 'purPackChoice', params: { id: this.id } })
      },
      onPush () {
        if (this.idsArray.length === 0) {
          this.$message.error('请先选择商品！')
          return
        }
        this.purchaseDialog.show = true
      },
      getShowImgPath (item) {
        location.href = this.$Api.order.downloadrelatedFile + '/' + item.id
      },
      getImgTableData (data) {
        this.pageInfo.totalNum = data.data.total
      },
      getDetail () {
        this.$Ajax.get({
          url: this.$Api.order.listPurchase,
          data: {
            params: {
              listPurchaseId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.dataList = res.data.data
//              this.dataStaticLs = res.data.data.quotationVOList ? res.data.data.quotationVOList : []
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
        let ids = this.idsArray
        this.$Ajax.post({
          url: this.$Api.order.pushSuppliers,
          data: {
            supplierId: id,
            listPurchaseId: this.id,
            listPurchaseGoodsIds: ids,
            typeCode: 1
          },
          cb: res => {
            if (res.status === 200) {
              this.getDetail()
              this.closePurchaseDialog()
              this.$message('推送成功！')
              this.$Utils.setSessionStorage('idsArray', '')
              this.$Utils.pageUpdateTable([this.pageGoods], this.refGoods, this)
            }
          }
        })
      },
      showImportDialog (id) {
        this.downLoadUrl = this.downLoadUrl + '/' + id
        this.uploadData.url = this.$Api.order.importExcelOnePurchase + '/' + id
        this.importDialog.show = true
      },
      viewMore (id) {
        this.$router.push({ name: 'purchaseMore', params: { id: id } })
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
      importOkDialog () {
        this.importDialog.show = false
      },
      showAlert (msg, myCallback) {
        this.$alert(msg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            myCallback()
          }
        })
      },
      onSave () {
        let flag = true
        let ls = []
        for (let j in this.dataStaticLs) {
          let data = this.dataStaticLs[j]
          let item = {}
          let goodsLs = []
          item.quotationId = data.id
          for (let i in data.quotationGoodsVOList) {
            let obj = data.quotationGoodsVOList[i]
            if (obj.unitGoodsPrice === null) {
              obj.unitGoodsPrice = 0
            }
            if (obj.unitGoodsPrice < 0) {
              flag = false
              break
            }
            goodsLs.push({
              quotationGoodsId: obj.id,
              unitGoodsPrice: obj.unitGoodsPrice
            })
          }
          item.quotationGoodsInfos = goodsLs
          ls.push(item)
        }
        if (!flag) {
          this.showAlert('报价商品中有未报价商品，请先填写再次保存', () => {})
        } else {
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
      }
    },
    filters: {
      totalPrice: function (val) {
        let total = 0
        val.quotationGoodsVOList.map(x => {
          total += parseFloat(x.totalGoodsPrice)
        })
        val.totalGoodsPrice = total.toFixed(2)
        return val.totalGoodsPrice
      },
      itemTotal: function (val, util) {
        // val.totalGoodsPrice = parseFloat((val.goodsCount) * (val.unitGoodsPrice)).toFixed(2)
        val.totalGoodsPrice = util.multiplyTwo(val.goodsCount, val.unitGoodsPrice)
        return val.totalGoodsPrice
      }
    }
  }
</script>
<style scoped>
  .title{
    margin-bottom: 10px;
    font-size: 18px;
    border-left: solid #008aff 4px;
    padding-left: 5px;
  }
  .box{
    padding: 0px 5px;
    border: solid #e5e5e5 1px;
  }
  .header_title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #333;
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

