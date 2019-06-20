<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div>结算详情</div>
      </el-col>
    </el-row>
    <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    <div class="pad">
      <el-row>
        <el-col :span="24">
          <div>发票信息</div>
        </el-col>
      </el-row>
    </div>
    <table-list :data-header="dataHeader" :data-static="dataStatic" :static="tableStatic"></table-list>
    <br>
    <table-list :data-header="invoiceHeaderLess" :static="true" :dataStatic="invoiceDataLess"
                :refs="invoiceResfLess"></table-list>
    <br><br>
    <div>付货款记录</div>
    <table-list :data-header="recordHeader" :static="true" :dataStatic="recordData" :refs="recordResf"></table-list>
    <br><br>
    <div class="pad">
      <el-row>
        <el-col :span="24">
          <div class="box_all">
            <div class="pull-left">商品明细</div>
            <tab-but class="pull-left" style="margin-left: 20px;" :data="tabButGoods" @on-add="tabAddGoods" @on-del="tabDelGoods"></tab-but>
            <div class="pull-right">已选中<span class="color_red">{{countTotal}}</span>类物资，合计金额<span class="color_red">{{priceTotal}}</span>元
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <table-list :data-header="dataHeaderGoods" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance"  @selection-change="tbSelectionChange">
      <template v-slot:indexCode="scope">
        {{scope.index + 1}}
      </template>
      <template v-slot:number="scope">
        <el-button type="text" @click="toDetails(scope.row)">{{scope.row.number}}</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[]"></v-page>
    <div class="but" v-if="dataList.processingStateCode !== 2">
      <tab-but :data="tabBut"  v-if="$Utils.getPageElement($Consts.PERMISSION.beamSettlementSubmit.code)" @on-add="tabAdd" @wx-export="cancel" @toInvoice="toInvoice" @toPayment="toPayment"
               @toFinish="toFinish"></tab-but>
    </div>
    <v-dialog :dialog="dialogDataAdd">
      <form-group :data="dataFormAdd" @on-cancel="cancelAdd" @on-ok="okAdd" :custom=true
                  :data-but="databut"></form-group>
    </v-dialog>
    <v-dialog :dialog="dialogDataInvoice">
      <form-group :data="dialogFormInvoice" @on-ok="dialogOkInvoice" :custom=true :clear=true
                  :data-but="dialogBut">
        <template v-slot:invoiceMoney="scope">
          <el-input type="number" v-model="invoiceMoney"  @wheel.native.prevent size="small" :min="0" placeholder="请输入发票金额"
                    @change="getTotalPrice"></el-input>
        </template>
        <template v-slot:rate="scope">
          <el-input type="number" v-model="rate"  @wheel.native.prevent size="small" :min="0" placeholder="请输入税额"
                    @change="getTotalPrice"></el-input>
        </template>
        <template v-slot:totalPrice="scope">
          <el-input type="number" v-model="totalPrice"  @wheel.native.prevent size="small" :min="0" placeholder="发票金额+税额" disabled></el-input>
        </template>
      </form-group>
    </v-dialog>
    <v-dialog :dialog="dialogDataPayment">
      <form-group :data="dialogFormPayment" @on-ok="dialogOkPayment" :custom=true :clear=true
                  :data-but="dialogBut">
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
        payMoney: null,
        invoiceMoney: null,
        rate: null,
        totalPrice: null,
        // 物资列表
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
          {prop: 'signCount', label: '实收数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'totalPrice', label: '金额'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'remark', label: '其他要求'}
        ],
        tabUrl: this.$Api.finance.loadSettlementGoods,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          pageSizes: [10, 50, 100, 500, 1000, 2000],
          refs: 'finance_beam_add_goods_table'
        },
        tablePerformance: 'finance_beam_add_goods_table',

        dialogDataAdd: {show: false, title: '结算设置', width: '900px'},
        data: [
          {prop: 'settlementNumber', label: '结算单编号'},
          {prop: 'processingStateDisplay', label: '结算状态'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'applicationMoney', label: '结算金额'},
          {prop: 'actualApplicationMoney', label: '实际结算金额'},
          {prop: 'applicantName', label: '创建人姓名'}
        ],
        dataList: {},
        listStyle: {
          class: ['pannel']
        },
        settlementId: '',
        dataHeader: [{
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
        dataStatic: [],
        tableStatic: true,
        settlementData: [],
        dataFormAdd: {
          from: [{
            prop: 'actualApplicationMoney',
            label: '实际结算金额：',
            value: '',
            labelWidth: '120px',
            required: true,
            placeholder: '请输入结算金额',
            rules: [{required: true, message: '请输入结算金额', trigger: 'blur,change'}]
          }, {
            prop: 'auditRemarks',
            label: '审核备注：',
            value: '',
            type: 'textarea',
            rows: 3,
            labelWidth: '120px',
            placeholder: '请填写描述'
          }]
        },
        databut: [{text: '取消', key: 'cancel'}, {text: '确认', type: 'primary', key: 'ok'}],
        sureMoneyFlag: true,
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
        invoiceResfLess: 'tab_finance_view_less',
        recordHeader: [
          {label: '时间', prop: 'createTimeStr'},
          {label: '记录人', prop: 'userName'},
          {label: '付款金额', prop: 'payMoney'},
          {label: '付款比例', prop: 'payMoneyProportion'},
          {label: '备注', prop: 'remark'}
        ],
        recordData: [],
        recordResf: 'tab_finance_view_rf',
        dialogDataInvoice: {show: false, title: '记录发票信息', width: '800px'},
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
        dialogDataPayment: {show: false, title: '记录付款信息', width: '800px'},
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
            rules: [{trigger: 'blur,change'}]
          }, {
            prop: 'remark',
            label: '备注：',
            value: '',
            type: 'text',
            labelWidth: '130px',
            placeholder: '请填写备注'
          }]
        },
        tabBut: [{
          text: '提交',
          key: 'toFinish'
        }],
        projectId: '',
        invoiceId: ''
      }
    },
    created () {
      this.settlementId = this.$route.params.id
      this.projectId = this.$route.params.projectId
      this.page.settlementId = this.settlementId
      this.loadSettlementDetail()
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
      tbSelectionChange (res) {
        this.selection = res
        this.selectionGoodsIds = this.selection.map(item => item.id)
        let price = 0
        if (this.selection && this.selection.length > 0) {
          this.countTotal = this.selection.length
          this.selection.map(res => {
            price = price + res.totalPrice
          })
          this.priceTotal = price.toFixed(4)
        } else {
          this.countTotal = 0
          this.priceTotal = 0
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
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      tabAddGoods () {
        let routeData = this.$router.resolve({
          name: 'addGoodsProjectSettlement',
          params: {
            projectId: this.projectId,
            settlementId: this.settlementId,
            invoiceId: this.invoiceId
          }
        })
        window.open(routeData.href, '_blank')
      },
      tabDelGoods () {
        if (this.selectionGoodsIds && this.selectionGoodsIds.length > 0) {
          this.$confirm('确定要移除物资吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let paramsList = {}
            paramsList.dataSource = 1
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
                  this.loadSettlementDetail()
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
      },
      checkFn (formName, i, n, checkRule) {
        formName.from[i].rules[0].validator = checkRule
      },
      getCheck () {
//        this.checkFn(this.dialogFormPayment, 0, 0, this.getCheckNum)
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
      okAdd (res) {
        res.id = this.settlementId
        this.$Ajax.post({
          url: this.$Api.finance.newtoExamine,
          data: res,
          cb: res => {
            if (res.status === 200) {
              this.$router.back()
            }
          }
        })
      },
      cancelAdd () {
        this.dialogDataAdd.show = false
        this.$bus.emit('form-clear')
      },
      jumpDetail (id) {
        this.$router.push({name: 'libraryView', params: {id}})
      },
      toDetails (res) {
        let routeData = this.$router.resolve({
          name: 'salesDetail',
          params: {id: res.listPurchaseId, approve: 0}
        })
        window.open(routeData.href, '_blank')
      },
      tabAdd () {
        this.dataFormAdd.from[0].value = this.dataList.applicationMoney
        this.dialogDataAdd.show = true
      },
      cancel () {
        location.href = this.$Api.finance.newExportSettlement + '/' + this.settlementId
      },
      loadSettlementDetail () {
        this.$Ajax.post({
          url: this.$Api.finance.loadSettlementDetail,
          data: {settlementId: this.settlementId},
          cb: res => {
            if (res.data.result) {
              res.data.data.cycletime = res.data.data.settlementCycleStartTimeStr + '--' + res.data.data.settlementCycleEndTimeStr
              this.dataList = res.data.data
              this.dataStatic = [res.data.data.invoiceUseInfo]
              this.invoiceId = this.dataList.invoiceId
//              if (this.dataList.processingStateDisplay !== '已完成') {
//                let obj = {text: '确认已收款', key: 'add'}
//                this.tabBut.unshift(obj)
//              }
            }
          }
        })
      },
      toInvoice () {
        this.dialogFormInvoice.from.map(item => {
          item.value = ''
        })
        this.$bus.emit('form-clear')
        this.invoiceMoney = null
        this.rate = null
        this.totalPrice = null
        this.dialogDataInvoice.show = true
      },
      toPayment () {
        this.dialogFormPayment.from.map(item => {
          item.value = ''
        })
        this.$bus.emit('form-clear')
        this.dialogDataPayment.show = true
      },
      toFinish () {
        if (this.page.totalNum && this.page.totalNum > 0) {
          this.$Ajax.post({
            url: this.$Api.finance.updateSettlementStateToFinish,
            data: {settlementId: this.settlementId, processingState: 1},
            cb: res => {
              if (res.data.result) {
                this.$message('已提交！')
                this.$router.push({name: 'beamFieldStatements'})
              }
            }
          })
        } else {
          this.$message.error('请选择物资再提交！')
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
              this.loadSettlementDetail()
              this.findPayMoneyRecord(this.settlementId)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .txt_state {
    color: #fff;
    font-size: 13px;
    background: #D8190F;
    padding: 2px 16px;
  }

  .row_title {
    display: flex;
    justify-content: space-between;
  }

  .row_title div {
    width: 30%;
    padding-left: 1%;
  }

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
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }

  .but {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
</style>
<style>
  .pannel .v_list_li {
    float: left;
    width: 50% !important;
  }

  .box_collapse .el-collapse-item__header {
    border-bottom-color: gainsboro !important;
    border-right: solid 1px gainsboro !important;
    border-left: solid 1px gainsboro !important;
  }

  .box_collapse .el-collapse-item__content {
    padding-bottom: 0;
  }
  .box_all {
    height: 50px;
    background: #eee;
    font-size: 14px;
    line-height: 50px;
    padding: 0 20px;
    margin-bottom: 20px;
  }
</style>
