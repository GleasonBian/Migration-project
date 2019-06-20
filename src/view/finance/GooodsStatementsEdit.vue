<template>
  <div class="p_d_detail_gsv">
    <div>结算详情</div>
    <br>
    <v-list :data="listData" :data-list="listItem" :list-style="listStyle"></v-list>
    <br><br>
    <h5>发票信息</h5>
    <br>
    <table-list :data-header="invoiceHeader" :static="true" :dataStatic="invoiceData" :refs="invoiceResf"></table-list>
    <br>
    <table-list :data-header="invoiceHeaderLess" :static="true" :dataStatic="invoiceDataLess" :refs="invoiceResfLess"></table-list>
    <br><br>
    <h5>付货款记录</h5>
    <table-list :data-header="recordHeader" :static="true" :dataStatic="recordData" :refs="recordResf"></table-list>
    <div class="box_all">
      <div class="pull-left">商品明细</div>
      <tab-but class="pull-left" style="margin-left: 20px;" :data="tabButGoods" @on-add="tabAddGoods" @on-del="tabDelGoods"></tab-but>
      <div class="pull-right">已选中<span class="color_red">{{countTotal}}</span>类物资，合计金额<span class="color_red">{{priceTotal}}</span>元
      </div>
    </div>
    <table-list :data-header="dataHeaderGoods" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance" @selection-change="tbSelectionChange">
      <template v-slot:indexCode="scope">
        {{scope.index + 1}}
      </template>
      <template v-slot:number="scope">
        <el-button type="text" @click="toDetails(scope.row)">{{scope.row.purchasePlanNumber}}</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[]"></v-page>
    <br><br>
    <div class="text_center" v-if="listItem.processingStateCode !== 2">
      <!--<el-button type="primary" plain @click="toInvoice">记录发票</el-button>-->
      <!--<el-button type="primary" plain @click="toPayment">记录付货款</el-button>-->
      <el-button type="primary" v-if="$Utils.getPageElement($Consts.PERMISSION.supplierSettlementSubmit.code)" @click="toSubmit">提交</el-button>
      <!--<el-button type="primary" @click="toFinish">完成结算单</el-button>-->
      <!--<el-button type="primary" plain @click="onDerive">导出结算单</el-button>-->
    </div>
    <v-dialog :dialog="dialogDataInvoice">
      <form-group :data="dialogFormInvoice" @on-ok="dialogOkInvoice" :custom=true :clear=true
                  :data-but="dialogBut">
        <template v-slot:invoiceMoney="scope">
          <el-input type="number" v-model="invoiceMoney"  @wheel.native.prevent  size="small" :min="0" placeholder="请输入发票金额"
                    @change="getTotalPrice"></el-input>
        </template>
        <template v-slot:rate="scope">
          <el-input type="number" v-model="rate" @wheel.native.prevent  size="small" :min="0" placeholder="请输入税额"
                    @change="getTotalPrice"></el-input>
        </template>
        <template v-slot:totalPrice="scope">
          <el-input type="number" v-model="totalPrice" @wheel.native.prevent  size="small" :min="0" placeholder="发票金额+税额" disabled></el-input>
        </template>
      </form-group>
    </v-dialog>
    <v-dialog :dialog="dialogDataPayment">
      <form-group :data="dialogFormPayment" @on-ok="dialogOkPayment" :custom=true :clear=true :data-but="dialogBut">
        <template v-slot:payMoney="scope">
          <el-input type="number" v-model="payMoney"  @wheel.native.prevent size="small" :min="0" placeholder="请填写付款金额"></el-input>
        </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        invoiceMoney: null,
        rate: null,
        payMoney: null,
        totalPrice: null,
        settlementId: 0,
        projectId: 0,
        settlementType: 0,
        winSupplierId: 0,
        listData: [
          {prop: 'settlementNumber', label: '结算单编号'},
          {prop: 'processingStateDisplay', label: '结算单状态'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'applicationMoney', label: '结算金额'},
          {prop: 'actualApplicationMoney', label: '实际结算金额'},
          {prop: 'applicantName', label: '创建人'}
        ],
        listItem: {},
        listStyle: {
          listwidth: '130px',
          class: 'purchase_list'
        },
        invoiceHeader: [{
          prop: 'purchasingBillInvoiceTypeDisplay',
          label: '发票类型'
        }, {
          prop: 'purchasingBillInvoiceCompanyName',
          label: '单位名称'
        }, {
          prop: 'purchasingBillInvoiceTaxpayCode',
          label: '纳税人识别号'
        }, {
          prop: 'purchasingBillInvoiceRegistryAddress',
          label: '注册地址'
        }, {
          prop: 'purchasingBillInvoiceRegistryPhone',
          label: '注册电话'
        }, {
          prop: 'purchasingBillInvoiceAccountNumber',
          label: '开户银行账户'
        }, {
          prop: 'purchasingBillInvoiceReceiverName',
          label: '收票人姓名'
        }, {
          prop: 'purchasingBillInvoiceReceiverPhone',
          label: '收票人手机'
        }, {
          prop: 'purchasingBillInvoiceReceiverAddress',
          label: '收票地址'
        }],
        invoiceData: [],
        invoiceResf: 'tab_finance_view_supplier',
        invoiceHeaderLess: [
          {label: '开票日期', prop: 'getInvoiceTime'},
          {label: '发票编号', prop: 'invoiceNumber'},
          {label: '发票金额', prop: 'invoiceMoney'},
          {label: '税额', prop: 'rate'},
          {label: '价税合计', prop: 'totalPrice'},
          {label: '记录人', prop: 'userName'},
          {label: '记录时间', prop: 'createTimeStr'}
        ],
        invoiceDataLess: [],
        invoiceResfLess: 'tab_finance_view_less_supplier',
        recordHeader: [
          {label: '时间', prop: 'createTimeStr'},
          {label: '记录人', prop: 'userName'},
          {label: '付款金额', prop: 'payMoney'},
          {label: '付款比例', prop: 'payMoneyProportion'},
          {label: '备注', prop: 'remark'}
        ],
        recordData: [],
        recordResf: 'tab_finance_view_rf_supplier',
        selection: [],
        selectionGoodsIds: [],
        countTotal: 0,
        priceTotal: 0,
        tabButGoods: [{
          text: '添加物资',
          key: 'on-add'
        }, {
          text: '移除物资',
          key: 'on-del'
        }],
        dataHeaderGoods: [
          {type: 'selection'},
          {prop: 'indexCode', label: '序号', width: '60', slot: true},
          {prop: 'number', label: '采购单号', slot: true},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '实收数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'totalGoodsPrice', label: '金额'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'remark', label: '其他要求'}
        ],
        tabUrl: this.$Api.finance.loadSettlementGoodsSupplier,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [10, 50, 100, 500, 1000, 2000],
          refs: 'finance_beam_add_goods_table_s'
        },
        tablePerformance: 'finance_beam_add_goods_table_s',
        dialogDataInvoice: {show: false, title: '记录发票信息', width: '30%'},
        dialogFormInvoice: {
          from: [{
            prop: 'invoiceNumber',
            label: '发票编号：',
            value: '',
            labelWidth: '130px',
            required: true,
            placeholder: '请填写发票编号',
            rules: [{required: true, message: '请填写发票编号', trigger: 'blur,change'}]
          }, {
            prop: 'invoiceMoney',
            label: '发票金额：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true,
            placeholder: '请填写发票金额'
          }, {
            prop: 'rate',
            label: '税额：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true,
            placeholder: '请填写税额'
          }, {
            prop: 'totalPrice',
            label: '价税合计：',
            value: '',
            type: 'number',
            labelWidth: '130px',
            custom: true,
            placeholder: '发票金额+税额'
          }, {
            prop: 'getInvoiceTime',
            label: '开票日期',
            date: true,
            value: '',
            required: true,
            rules: [{required: true, message: '请选择期望到货时间', trigger: 'blur,change'}],
            labelWidth: '130px'
          }]
        },
        dialogBut: [{text: '提交', type: 'primary', key: 'ok'}],
        dialogDataPayment: {show: false, title: '记录付款信息', width: '30%'},
        dialogFormPayment: {
          from: [{
            prop: 'payMoney',
            label: '付款金额：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true,
            placeholder: '请填写付款金额',
            rules: [{ trigger: 'blur,change' }]
          }, {
            prop: 'remark',
            label: '备注：',
            value: '',
            type: 'text',
            labelWidth: '130px',
            placeholder: '请填写备注'
          }]
        }
      }
    },
    created () {
      this.settlementId = this.$route.params.id
      this.page.settlementId = this.settlementId
      this.getData(this.settlementId)
      this.getInvoiceList(this.settlementId)
      this.findPayMoneyRecord(this.settlementId)
      this.getCheck()
    },
    computed: {
      getCheckNum () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('金额不能为空'))
          } else {
            let RegStr = /^\d+(\.\d{1,4})?$/.test(value)
            if (RegStr) {
              callback()
            } else {
              callback(new Error('金额只保存到小数点后四位！'))
            }
          }
        }
      }
    },
    methods: {
      toReturn () {
        this.$router.push({name: 'gooodsStatements'})
      },
      tbSelectionChange (res) {
        this.selection = res
        this.selectionGoodsIds = this.selection.map(item => item.id)
        let price = 0
        if (this.selection && this.selection.length > 0) {
          this.countTotal = this.selection.length
          this.selection.map(res => {
            price = price + res.totalGoodsPrice
          })
          this.priceTotal = price.toFixed(4)
        } else {
          this.countTotal = 0
          this.priceTotal = 0
        }
      },
      dialogOkInvoice (res) {
        if (!this.invoiceMoney) {
          this.$message.error('发票金额不能为空！')
        } else if (!this.rate) {
          this.$message.error('税额不能为空！')
        } else if (Number(this.invoiceMoney) <= 0) {
          this.$message.error('发票金额不能小于等于0！')
        } else if (Number(this.rate) <= 0) {
          this.$message.error('税额不能小于等于0！')
        } else {
          let data = {
            settlementId: this.settlementId,
            invoiceNumber: res.invoiceNumber,
            invoiceMoney: this.invoiceMoney,
            rate: this.rate,
            totalPrice: this.totalPrice,
            getInvoiceTime: res.getInvoiceTime
          }
          this.$Ajax.post({
            url: this.$Api.finance.saveSettlementInvoiceRecord,
            data: data,
            cb: res => {
              if (res.data.result) {
                this.$message('提交成功！')
                this.dialogDataInvoice.show = false
                this.invoiceMoney = null
                this.rate = null
                this.totalPrice = null
                this.getInvoiceList(this.settlementId)
              }
            }
          })
        }
      },
      getTotalPrice () {
        if (this.invoiceMoney && this.rate) {
          this.invoiceMoney = this.invoiceMoney ? this.invoiceMoney : null
          this.rate = this.rate ? this.rate : null
          this.totalPrice = Number(this.invoiceMoney) + Number(this.rate)
          this.dialogFormInvoice.from.map(item => {
            if (item.prop === 'invoiceMoney') {
              item.value = this.invoiceMoney ? this.invoiceMoney : null
            }
            if (item.prop === 'rate') {
              item.value = this.rate ? this.rate : null
            }
          })
        } else {
          this.totalPrice = null
        }
      },
      toDetails (res) {
        let routeData = this.$router.resolve({
          name: 'detailsProcurement',
          params: {id: res.purchasePlanId}
        })
        window.open(routeData.href, '_blank')
      },
      toInvoice () {
        this.dialogFormInvoice.from.map(item => {
          item.value = ''
        })
        this.$bus.emit('form-clear')
        this.dialogDataInvoice.show = true
      },
      toPayment () {
        this.dialogFormPayment.from.map(item => {
          item.value = ''
        })
        this.$bus.emit('form-clear')
        this.dialogDataPayment.show = true
      },
      toSubmit () {
        if (this.page.totalNum && this.page.totalNum > 0) {
          this.$Ajax.post({
            url: this.$Api.finance.updateSettlementStateToFinish,
            data: {settlementId: this.settlementId, processingState: 1},
            cb: res => {
              if (res.data.result) {
                this.$message('提交成功！')
                this.toReturn()
              }
            }
          })
        } else {
          this.$message.error('请选择物资再提交！')
        }
      },
      toFinish () {
        if (this.page.totalNum && this.page.totalNum > 0) {
          this.$Ajax.post({
            url: this.$Api.finance.updateSettlementStateToFinish,
            data: {settlementId: this.settlementId, processingState: 2},
            cb: res => {
              if (res.data.result) {
                this.$message('完成结算单！')
                this.toReturn()
              }
            }
          })
        } else {
          this.$message.error('请选择物资再提交！')
        }
      },
      dialogOkPayment (res) {
        if (res.payMoney <= 0) {
          this.$message.error('付款金额不能小于等于0！')
          return
        }
        if (!res.remark) {
          res.remark = ''
        }
        let data = {
          settlementId: this.settlementId,
          payMoney: this.payMoney,
          remark: res.remark
        }
        this.$Ajax.post({
          url: this.$Api.finance.savePayMoneyRecord,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message('提交成功！')
              this.dialogDataPayment.show = false
              this.getData(this.settlementId)
              this.findPayMoneyRecord(this.settlementId)
            }
          }
        })
      },
      checkFn (formName, i, n, checkRule) {
        formName.from[i].rules[0].validator = checkRule
      },
      getCheck () {
//        this.checkFn(this.dialogFormPayment, 0, 0, this.getCheckNum)
      },
      getData (id) {
        this.$Ajax.post({
          url: this.$Api.finance.toNewSettlementDetail,
          data: {settlementId: id},
          cb: res => {
            if (res.data.result) {
              this.listItem = res.data.data
              this.remarks = res.data.data
              if (this.remarks.auditRemarks === 'undefined' || this.remarks.auditRemarks === undefined) {
                this.remarks.auditRemarks = '无'
              }
              this.listItem.time = this.listItem.settlementCycleStartTimeStr + '——' + this.listItem.settlementCycleEndTimeStr
              this.invoiceData.push(res.data.data.invoiceUseInfo)
              this.projectId = res.data.data.projectId
              this.settlementId = res.data.data.id
              this.winSupplierId = res.data.data.supplierId
              this.settlementType = res.data.data.settlementType
            }
          }
        })
      },
      getInvoiceList (id) {
        this.$Ajax.post({
          url: this.$Api.finance.findSettlementInvoiceRecordBySettlementId,
          data: {settlementId: id},
          cb: res => {
            if (res.data.data) {
              this.invoiceDataLess = res.data.data
            }
          }
        })
      },
      findPayMoneyRecord (id) {
        this.$Ajax.post({
          url: this.$Api.finance.findPayMoneyRecordBySettlementId,
          data: {settlementId: id},
          cb: res => {
            if (res.data.data) {
              this.recordData = res.data.data
              this.recordData.map(item => {
                if (item.payMoneyProportion === 0) {
                  item.payMoneyProportion = '-'
                } else {
                  item.payMoneyProportion = item.payMoneyProportion + '%'
                }
              })
            }
          }
        })
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      tabAddGoods () {
        let routeData = this.$router.resolve({
          name: 'addGoodsSupplierSettlement',
          params: {
            projectId: this.projectId,
            settlementId: this.settlementId,
            winSupplierId: this.winSupplierId,
            settlementType: this.settlementType
          }
        })
        window.open(routeData.href, '_blank')
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      tabDelGoods () {
        if (this.selectionGoodsIds && this.selectionGoodsIds.length > 0) {
          this.$confirm('确定要移除物资吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let paramsList = {}
            paramsList.settlementType = this.settlementType
            paramsList.signReceiptGoodsIds = this.selectionGoodsIds
            paramsList.id = this.settlementId
            this.$Ajax.post({
              url: this.$Api.finance.deletedSettlementGoods,
              data: {
                json: JSON.stringify(paramsList)
              },
              cb: res => {
                if (res.data.result) {
                  this.$message('移除成功')
                  this.getData(this.settlementId)
                  this.pageUpdateTable([this.page], this.tablePerformance, this)
                } else {
                  this.$message(res.data.message)
                }
              }
            })
          }).catch(() => {
          })
        } else {
          this.$message('请选择物资')
        }
      }
    }
  }
</script>


<style scoped>
  .txt_state{color: #fff;font-size: 13px; background: #D8190F; padding: 2px 16px;}
  .row_title{ display: flex;justify-content: space-between;}
  .row_title div{ width: 30%; padding-left: 1%;}

  .pad {
    margin-top: 30px;
  }

  .tab_text_select {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .tab_text_select_lef {
    width: 2%;
  }

  .tab_text_select_rig {
    flex: 1;
    font-size: 14px;
    display: flex;
  }

  .tab_shop_con {
    display: flex;
  }

  .tab_shop_lef {
    flex: 1;
  }

  .tab_shop_lef_con {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 20px;
    border-left: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    border-right: solid 1px gainsboro;
  }

  .tab_shop_rig {
    width: 8%;
    text-align: center;
    border-right: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    padding-top: 20px;
  }

  .tab_shop_rig_1 {
    border-top: solid 1px gainsboro;
  }

  .tab_title_cel_price {
    color: red;
  }

  .tab_shop_con_img {
    width: 80px;
    height: 90px;
  }

  .tab_con {
    display: flex;
    font-size: 14px;
  }

  .tab_con_lef {
    width: 2%;
    align-self: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: solid 1px gainsboro;
    border-left: solid 1px gainsboro;
  }

  .tab_con_cen {
    flex: 1;
  }

  .tab_shop_rig {
    width: 8%;
    text-align: center;
    border-right: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    padding-top: 20px;
  }

  .tab_title_con_1 {
    border: solid 1px gainsboro;
  }

  .tab_title_con {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 20px;
    border-left: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    border-right: solid 1px gainsboro;
  }

  .handle {
    font-size: 14px;
    text-decoration: none;
  }

  .but {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
</style>
<style>
  .p_d_detail_gsv .purchase_list > .v_list_li{width: 33% !important;float: left}
  .p_d_detail_gsv .purchase_list_tb > .v_list_li{width: 25% !important;float: left}
  .p_d_detail_gsv .text_center{ text-align: center;}

  .p_d_detail_gsv .contract_title {display: inline-block;padding:10px 2px;border-bottom: 2px solid #1577fe; color: #1577fe;}
  .p_d_detail_gsv .purchase_list > .v_list_li{width: 25% !important;float: left}
  .p_d_detail_gsv .mr_b10 {margin-bottom:10px;}
  .p_d_detail_gsv .btn_box{text-align: center; margin-bottom: 60px;}
  .p_d_detail_gsv .btn_box .base_btn_group .el-button {padding: 10px 15px !important}
  .p_d_detail_gsv .avatar-uploader .el-upload{border:none;}
  .p_d_detail_gsv .el-dialog__body{padding-top: 10px;}
  .p_d_detail_gsv .el-table__row img{ width: 93px; height: 93px;}

  .p_d_detail_gsv .tb_border{ border: 1px solid #e6ebf5;  padding: 8px;}
  .p_d_detail_gsv .tb_border .el-row .el-col{ min-height: 96px;}
  .p_d_detail_gsv .text_center{ text-align: center;}
  .p_d_detail_gsv .v_list_cont{ word-break: break-all;}
  .p_d_detail_gsv .btn_view{ text-align: right; margin-top: -33px; position: relative;}
  .pannel .v_list_li {
    float: left;
    width: 50% !important;
  }
  .box_collapse .el-collapse-item__header{ border-bottom-color: gainsboro !important;border-right: solid 1px gainsboro !important;  border-left: solid 1px gainsboro !important;}
  .box_collapse .el-collapse-item__content { padding-bottom: 0;}
  .box_all {
    height: 50px;
    background: #eee;
    font-size: 14px;
    line-height: 50px;
    padding: 0 20px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
</style>

