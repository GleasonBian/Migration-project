<template>
  <div>
    <div>
      <form-group :data="dataForm" :data-but="dataBut" @on-ok="saveAll" @return-page="returnListPage" :custom=true>
        <template slot-scope="scope" slot="enterpriseName">
          <span ref="prise">{{enterpriseName ? enterpriseName : ''}}</span>
          <el-button type="text" @click="choiceCompany"><i class="el-icon-plus"></i>选择企业</el-button>
        </template>
        <template slot-scope="scope" slot="warehouseName">
          <span ref="house">{{warehouseName ? warehouseName : ''}}</span>
          <el-button type="text" @click="choiceWarehouse"><i class="el-icon-plus"></i>选择仓库</el-button>
        </template>
        <template slot-scope="scope" slot="boxTable">
          <tab-but :data="btnAddGoodsData" @on-add="addGoods"></tab-but>
          <table-list :data-header="dataHeaderGoodsAll" :static=true :dataStatic="dataTableGoodsAll" :refs="tableSalesGoodsAll">
            <template slot-scope="scope" slot="unitGoodsPrice">
              <el-input v-model="scope.row.unitGoodsPrice" type="number" size="small" placeholder="0"
                        min="0" style="width:150px"></el-input>
            </template>
            <template slot-scope="scope" slot="replenishStockNum">
              <el-input v-model="scope.row.replenishStockNum" type="number" size="small" placeholder="0"
                        min="0" style="width:150px"></el-input>
            </template>
            <template slot-scope="scope" slot="subtotal"><div>{{scope.row | getSubtotal($Utils)}}</div></template>
            <template slot-scope="scope" slot="deleteBtn">
              <el-button type="text" @click="deleteGood(scope.index, scope.row)">删除</el-button>
            </template>
          </table-list>
        </template>
      </form-group>
      <v-dialog :dialog="dialogCompany">
        <form-group :data="companyDialogData" :dataBut="dataCompanyBut" :custom=true
                    @on-ok="saveCompanyData" @on-cancel="cancelCompany" @close-dialog="closeDialogCompany">
          <template slot-scope="scope" slot="searchData">
            <v-search :data="searchCompanyData" @on-click="searchCompany"></v-search>
          </template>
          <template slot-scope="scope" slot="selectedCompany">
            <table-list :data-header="dataHeaderCompany" :url="tabCompanyUrl" :params="pageCompany"
                        @get-table-data="getTableCompanyData" :refs="tableContractCompany">
              <template slot-scope="scope" slot="radioSelect">
                <el-radio v-model="radioChoose" :label="scope.row">&nbsp;</el-radio>
              </template>
            </table-list>
            <v-page :data="pageCompany" :dataArr="[dataSearchCompany]"></v-page>
          </template>
        </form-group>
      </v-dialog>
      <v-dialog :dialog="dialogWarehouse">
        <form-group :data="warehouseDialogData" :dataBut="dataWarehouseBut" :custom=true
                    @on-ok="saveWarehouseData" @on-cancel="cancelWarehouse" @close-dialog="closeDialogWarehouse">
          <template slot-scope="scope" slot="searchWarehouseData">
            <v-search :data="searchWarehouseData" @on-click="searchWarehouse"></v-search>
          </template>
          <template slot-scope="scope" slot="selectedWarehouse">
            <table-list :data-header="dataHeaderWarehouse" :url="tabWarehouseUrl" :params="pageWarehouse"
                        @get-table-data="getTableWarehouseData" :refs="tableContractWarehouse">
              <template slot-scope="scope" slot="radioSelect">
                <el-radio v-model="radioChooseWarehouse" :label="scope.row">&nbsp;</el-radio>
              </template>
            </table-list>
            <v-page :data="pageWarehouse" :dataArr="[dataSearchWarehouse]"></v-page>
          </template>
        </form-group>
      </v-dialog>
      <v-dialog :dialog="dialogGoods">
        <form-group :data="goodsDialogData" :dataBut="dataGoodsBut" :custom=true
                    @on-ok="saveGoodsData" @on-cancel="cancelGoods" @close-dialog="closeDialogGoods">
          <template slot-scope="scope" slot="searchGoodsData">
            <v-search :data="searchGoodsData" @on-click="searchGoods"></v-search>
          </template>
          <template slot-scope="scope" slot="selectedGoods">
            <table-list :data-header="dataHeaderGoods" :url="tabGoodsUrl" :params="pageGoods"
                        @selection-change="selectionChange" @get-table-data="getTableGoodsData" :refs="tableContractGoods">
            </table-list>
            <v-page :data="pageGoods" :dataArr="[dataSearchGoods]"></v-page>
          </template>
        </form-group>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          from: [{
            label: '选择供应商：',
            prop: 'enterpriseName',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ required: true, message: '请选择供应商', trigger: 'click' }],
            custom: true
          }, {
            prop: 'expectTimeStr',
            label: '期望到货时间：',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ required: true, message: '请选择期望到货时间', trigger: 'blur,change' }],
            date: {
              type: 'date'
            }
          }, {
            label: '选择仓库：',
            prop: 'warehouseName',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ required: true, message: '请选择仓库', trigger: 'blur,change' }],
            custom: true
          }, {
            label: '所在区域：',
            prop: 'areaName',
            labelWidth: '150px',
            value: '',
            disabled: true
          }, {
            label: '详细地址：',
            prop: 'stockAddress',
            labelWidth: '150px',
            value: '',
            disabled: true
          }, {
            label: '收货人：',
            prop: 'receiver',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ required: true, message: '请输入收货人', trigger: 'blur,change' }]
          }, {
            label: '联系电话：',
            prop: 'receiverPhone',
            labelWidth: '150px',
            value: '',
            required: true,
            rules: [{ trigger: 'blur,change' }]
          }, {
            label: '备注：',
            prop: 'remark',
            labelWidth: '150px',
            value: '',
            type: 'textarea',
            rows: 3
          }, {
            label: '',
            prop: 'boxTable',
            labelWidth: '0',
            value: '',
            custom: true
          }],
          class: 'form_purchase'
        },
        dataBut: [{
          text: '返回列表',
          key: 'return-page'
        }, {
          text: '确定',
          key: 'ok',
          type: 'primary'
        }],
        dialogCompany: {
          show: false,
          title: '选择供应商列表',
          width: '900px'
        },
        dialogWarehouse: {
          show: false,
          title: '选择仓库',
          width: '900px'
        },
        dialogGoods: {
          show: false,
          title: '选择商品',
          width: '900px'
        },
        companyDialogData: {
          from: [
            {
              prop: 'searchData',
              custom: true
            }, {
              prop: 'selectedCompany',
              custom: true
            }
          ]
        },
        warehouseDialogData: {
          from: [
            {
              prop: 'searchWarehouseData',
              custom: true
            }, {
              prop: 'selectedWarehouse',
              custom: true
            }
          ]
        },
        goodsDialogData: {
          from: [
            {
              prop: 'searchGoodsData',
              custom: true
            }, {
              prop: 'selectedGoods',
              custom: true
            }
          ]
        },
        dataCompanyBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
        dataWarehouseBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
        dataGoodsBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
        tableContractCompany: 'table_contract_company',
        tableContractWarehouse: 'table_contract_warehouse',
        tableContractGoods: 'table_contract_goods',
        searchCompanyData: [{
          key: 'enterpriseName',
          label: '供应商名称：',
          value: '',
          type: 'text'
        }],
        searchWarehouseData: [{
          key: 'name',
          label: '仓库名称：',
          value: '',
          type: 'text'
        }],
        searchGoodsData: [{
          key: 'keyword',
          label: '商品名称：',
          value: '',
          type: 'text'
        }, {
          key: 'brandName',
          label: '品牌：',
          value: '',
          type: 'text'
        }],
        dataHeaderCompany: [{
          label: '',
          slot: true,
          prop: 'radioSelect',
          width: 50
        }, {
          prop: 'enterpriseName',
          label: '企业名称'
        }, {
          prop: 'enterpriseAddress',
          label: '联系地址'
        }, {
          prop: 'contactName',
          label: '联系人'
        }, {
          prop: 'contactPhone',
          label: '联系方式'
        }],
        dataHeaderWarehouse: [{
          label: '',
          slot: true,
          prop: 'radioSelect',
          width: 50
        }, {
          prop: 'warehouseName',
          label: '仓库名称'
        }, {
          prop: 'warehouseAddress',
          label: '仓库地址'
        }],
        dataHeaderGoods: [{
          type: 'selection'
        }, {
          prop: 'goodsCode',
          label: '商品编号'
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'className',
          label: '三级类目'
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }],
        tabCompanyUrl: this.$Api.sale.loadEnterpriseData,
        tabWarehouseUrl: this.$Api.sale.findWarehouseListByVO,
        tabGoodsUrl: this.$Api.sale.loadGoodsListData,
        pageCompany: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_contract_company'
        },
        pageWarehouse: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_contract_warehouse'
        },
        pageGoods: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_contract_goods'
        },
        dataSearchCompany: [],
        radioChoose: {},
        enterpriseName: '',
        enterpriseId: '',
        dataSearchWarehouse: [],
        radioChooseWarehouse: {},
        warehouseName: '',
        warehouseId: '',
        dataSearchGoods: [],
        btnAddGoodsData: [{
          text: '新增商品',
          key: 'add'
        }],
        selection: [],
        dataFormEnterprise: {},
        tableSalesGoodsAll: 'table_contract_goods_all',
        dataTableGoodsAll: [],
        goodsArr: [],
        dataHeaderGoodsAll: [{
          prop: 'goodsCode',
          label: '商品编号'
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'className',
          label: '三级类目'
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'unitGoodsPrice',
          label: '进货价',
          slot: true
        }, {
          prop: 'replenishStockNum',
          label: '数量',
          slot: true
        }, {
          prop: 'subtotal',
          label: '小计金额（元）',
          slot: true
        }, {
          prop: 'deleteBtn',
          label: '操作',
          slot: true
        }],
        selectionDataMiddle: []
      }
    },
    filters: {
      getSubtotal: function (res, $Utils) {
        res.mtotal = $Utils.multiplyTwo(Number(res.unitGoodsPrice), Number(res.replenishStockNum))
        if (!res.unitGoodsPrice || !res.replenishStockNum) {
          res.mtotal = ''
        }
        return res.mtotal
      }
    },
    created () {
      this.getCheck()
    },
    computed: {
      getCheckPhone () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('手机号不能为空'))
          } else {
            if (!this.$Validate.mobilephone(value)) {
              callback(new Error('请输入正确的手机号'))
            } else {
              callback()
            }
          }
        }
      }
    },
    methods: {
      checkFn (formName, i, n, checkRule) {
        formName.from[i].rules[n].validator = checkRule
      },
      getCheck () {
        this.checkFn(this.dataForm, 6, 0, this.getCheckPhone)
      },
      showHideDialog (name, b) {
        name.show = b
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      getTableCompanyData (data) {
        this.pageCompany.totalNum = data.data.total
      },
      getTableWarehouseData (data) {
        this.pageWarehouse.totalNum = data.data.total
      },
      getTableGoodsData (data) {
        this.pageGoods.totalNum = data.data.total
      },
      choiceCompany () {
        this.dataSearchCompany = []
        this.pageUpdateTable([this.dataSearchCompany, this.pageCompany], this.tableContractCompany, this)
        this.showHideDialog(this.dialogCompany, true)
      },
      choiceWarehouse () {
        this.searchWarehouseData = []
        this.pageUpdateTable([this.dataSearchWarehouse, this.pageWarehouse], this.tableContractWarehouse, this)
        this.showHideDialog(this.dialogWarehouse, true)
      },
      addGoods () {
        this.dataSearchGoods = []
        this.pageUpdateTable([this.dataSearchGoods, this.pageGoods], this.tableContractGoods, this)
        this.showHideDialog(this.dialogGoods, true)
      },
      cancelCompany () {
        this.showHideDialog(this.dialogCompany, false)
      },
      cancelWarehouse () {
        this.showHideDialog(this.dialogWarehouse, false)
      },
      cancelGoods () {
        this.showHideDialog(this.dialogGoods, false)
      },
      closeDialogCompany () {
        this.showHideDialog(this.dialogCompany, false)
      },
      closeDialogWarehouse () {
        this.showHideDialog(this.dialogWarehouse, false)
      },
      closeDialogGoods () {
        this.showHideDialog(this.dialogGoods, false)
      },
      searchCompany (res) {
        this.dataSearchCompany = res
        if (JSON.stringify(this.dataSearchCompany) === '{}') {
          this.pageCompany.offset = 0
          this.pageCompany.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchCompany, this.pageCompany], this.tableContractCompany, this)
      },
      saveCompanyData (res) {
        this.enterpriseId = this.radioChoose.id
        if (JSON.stringify(this.radioChoose) === '{}') {
          this.$message('请选择企业')
        } else {
          this.enterpriseName = this.radioChoose.enterpriseName
          this.dataForm.from[0].value = this.enterpriseName
          this.showHideDialog(this.dialogCompany, false)
        }
      },
      searchWarehouse (res) {
        this.dataSearchWarehouse = res
        if (JSON.stringify(this.dataSearchWarehouse) === '{}') {
          this.pageWarehouse.offset = 0
          this.pageWarehouse.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchWarehouse, this.pageWarehouse], this.tableContractWarehouse, this)
      },
      dataFormData (res) {
        this.dataForm.from.map(item => {
          if (item.prop === 'areaName') {
            item.value = res.areaName
          }
          if (item.prop === 'stockAddress') {
            item.value = res.areaName + res.warehouseAddress
          }
        })
      },
      saveWarehouseData (res) {
        this.warehouseId = this.radioChooseWarehouse.id
        if (JSON.stringify(this.radioChooseWarehouse) === '{}') {
          this.$message('请选择仓库')
        } else {
          this.warehouseName = this.radioChooseWarehouse.warehouseName
          this.dataForm.from[2].value = this.enterpriseName
          this.dataFormData(this.radioChooseWarehouse)
          this.showHideDialog(this.dialogWarehouse, false)
        }
      },
      searchGoods (res) {
        this.dataSearchGoods = res
        if (JSON.stringify(this.dataSearchGoods) === '{}') {
          this.pageGoods.offset = 0
          this.pageGoods.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearchGoods, this.pageGoods], this.tableContractGoods, this)
      },
      selectionChange (selection) {
        this.selectionDataMiddle = selection
      },
      filterGoods (val) {
        let okCode = true
        for (let item in this.selection) {
          if (this.selection[item].id === val.id) {
            okCode = false
          }
        }
        if (okCode) {
          this.selection.push(val)
        }
      },
      saveGoodsData (res) {
        if (!this.selectionDataMiddle.length) {
          this.$message('请选择商品')
        } else {
          this.selectionDataMiddle.map(item => {
            if (!this.selection.length) {
              this.selection = this.selectionDataMiddle
            } else {
              this.filterGoods(item)
            }
          })
          this.dataTableGoodsAll = this.selection
          this.pageUpdateTable([], this.tableSalesGoodsAll, this)
          this.pageUpdateTable([this.searchGoodsData, this.pageGoods], this.tableContractGoods, this)
          this.showHideDialog(this.dialogGoods, false)
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
      dataAllFn (res) {
        res.companyName = this.enterpriseName
        res.companyId = this.enterpriseId
        res.warehouseId = this.warehouseId
        res.warehouseName = this.warehouseName
        this.goodsArr = []
        this.dataTableGoodsAll.map(item => {
          this.goodsArr.push({
            goodsId: item.id,
            unitGoodsPrice: item.unitGoodsPrice,
            replenishStockNum: item.replenishStockNum
          })
        })
        let flag = true
        this.goodsArr.map(item => {
          if (!item.unitGoodsPrice || !item.replenishStockNum) {
            flag = false
            this.showAlert('请正确填写进货价或者数量', () => {})
          } else if (parseInt(item.unitGoodsPrice) <= 0 || parseInt(item.replenishStockNum) <= 0) {
            flag = false
            this.showAlert('请正确填写进货价或者数量', () => {})
          }
        })
        if (flag) {
          res.replenishStockGoodsVOList = this.goodsArr
          this.dataFormEnterprise = res
          if (!res.replenishStockGoodsVOList.length) {
            this.$message('请选择商品')
          } else {
            this.ajaxDataAll()
          }
        }
      },
      saveAll (res) {
        if (!this.enterpriseName) {
          this.$message('请选择供应商')
        } else if (!this.warehouseName) {
          this.$message('请选择仓库')
        } else {
          this.dataAllFn(res)
        }
      },
      returnListPage () {
        this.jumpPage('purchaseList')
      },
      ajaxDataAll () {
        this.$Ajax.post({
          url: this.$Api.sale.submitReplenishStock,
          data: {
            json: JSON.stringify(this.dataFormEnterprise)
          },
          cb: res => {
            if (res.data.result) {
              this.jumpPage('purchaseList')
            }
          }
        })
      },
      deleteGood (index) {
        this.dataTableGoodsAll.splice(index, 1)
        this.pageUpdateTable([], this.tableSalesGoodsAll, this)
      }
    },
    watch: {
      'enterpriseName': function (val, oldVal) {
        if (val) {
          this.$refs.prise.parentNode.lastChild.innerHTML = ''
        }
      },
      'warehouseName': function (val, oldVal) {
        if (val) {
          this.$refs.house.parentNode.lastChild.innerHTML = ''
        }
      }
    }
  }
</script>

<style>
  .form_purchase .el-form-item .el-input__inner,
  .form_purchase .el-form-item .el-textarea{
    width:400px !important;
  }
  .form_purchase .el-form-item .el-table__body .el-input__inner,
  .form_purchase .el-form-item .el-table__body .el-textarea{
    width:100% !important;
  }

</style>
