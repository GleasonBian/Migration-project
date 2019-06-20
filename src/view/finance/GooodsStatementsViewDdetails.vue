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
    <table-list :data-header="invoiceHeaderLess" :static="true" :dataStatic="invoiceDataLess" :refs="invoiceResfLess">
      <template v-slot:operation="scope">
        <a class="handle" @click="toEditInvoice(scope.row)">编辑</a>
        <a class="handle" @click="deleteInvoice(scope.row)">删除</a>
      </template>
    </table-list>
    <br><br>
    <h5>付货款记录</h5>
    <table-list :data-header="recordHeader" :static="true" :dataStatic="recordData" :refs="recordResf">
      <template v-slot:operation="scope">
        <a class="handle" @click="toEditRecord(scope.row)">编辑</a>
        <a class="handle" @click="deleteRecord(scope.row)">删除</a>
      </template>
    </table-list>
    <h5>商品明细</h5>
    <table-list :data-header="dataHeaderGoods" :url="tabUrl" :params="page" @get-table-data="getTableData"
                :refs="tablePerformance">
      <template v-slot:indexCode="scope">
        {{scope.index + 1}}
      </template>
      <template v-slot:number="scope">
        <el-button type="text" @click="toDetails(scope.row)">{{scope.row.purchasePlanNumber}}</el-button>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[]"></v-page>
    <br><br>
    <div class="text_center" v-if="listItem.processingStateCode === 1">
      <el-button type="primary" plain @click="toInvoice">记录发票</el-button>
      <el-button type="primary" plain @click="toPayment">记录付货款</el-button>
      <el-button type="primary" @click="toFinish">完成结算单</el-button>
      <!--<el-button type="primary" plain @click="onDerive">导出结算单</el-button>-->
    </div>
    <!--新增发票模态框-->
    <v-dialog :dialog="dialogDataInvoice">
      <form-group :data="dialogFormInvoice" @on-ok="dialogOkInvoice" :custom=true :clear=true
                  :data-but="dialogBut">
        <template v-slot:invoiceMoney="scope">
          <el-input type="number" v-model="invoiceMoney"  @wheel.native.prevent size="small" :min="0" placeholder="发票金额" disabled></el-input>
        </template>
        <template v-slot:rate="scope">
          <el-input type="number" v-model="rate"  @wheel.native.prevent size="small" :min="0" placeholder="税额" disabled></el-input>
        </template>
        <template v-slot:totalPrice="scope">
          <el-input type="number" v-model="totalPrice"  @wheel.native.prevent size="small" :min="0" placeholder="请输入价税合计"
                    @change="getRateAndMoney"></el-input>
        </template>
        <template v-slot:taxPoint="scope">
          <el-select v-model="taxPoint" placeholder="请选择税率" @change="getRateAndMoney">
            <el-option
              v-for="item in optionsTaxPoint"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </form-group>
    </v-dialog>
    <!--编辑发票模态框-->
    <v-dialog :dialog="dialogDataInvoiceEdit">
      <form-group :data="dialogFormInvoiceEdit" @on-ok="dialogOkInvoiceEdit" :custom=true
                  :data-but="dialogButEdit">
        <template v-slot:invoiceMoney="scope">
          <el-input type="number" v-model="invoiceMoney"  @wheel.native.prevent size="small" :min="0" placeholder="发票金额" disabled></el-input>
        </template>
        <template v-slot:rate="scope">
          <el-input type="number" v-model="rate"  @wheel.native.prevent size="small" :min="0" placeholder="税额" disabled></el-input>
        </template>
        <template v-slot:totalPrice="scope">
          <el-input type="number" v-model="totalPrice"  @wheel.native.prevent size="small" :min="0" placeholder="请输入价税合计"
                    @change="getRateAndMoney"></el-input>
        </template>
        <template v-slot:taxPoint="scope">
          <el-select v-model="taxPoint" placeholder="请选择税率" @change="getRateAndMoney">
            <el-option
              v-for="item in optionsTaxPointEdit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </form-group>
    </v-dialog>
    <!--新增付货款记录-->
    <v-dialog :dialog="dialogDataPayment">
      <form-group :data="dialogFormPayment" @on-ok="dialogOkPayment" :custom=true :clear=true :data-but="dialogBut">
        <template v-slot:payMoney="scope">
          <el-input type="number" v-model="payMoney"  @wheel.native.prevent size="small" :min="0" placeholder="请填写付款金额"></el-input>
        </template>
      </form-group>
    </v-dialog>
    <!--编辑付货款记录-->
    <v-dialog :dialog="dialogDataPaymentEdit">
      <form-group :data="dialogFormPaymentEdit" @on-ok="dialogOkPaymentEdit" :custom=true
                  :data-but="dialogButEdit">
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
        taxPoint: null,
        settlementId: 0,
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
          {label: '税率', prop: 'taxPointStr'},
          {label: '税额', prop: 'rate'},
          {label: '价税合计', prop: 'totalPrice'},
          {label: '记录人', prop: 'userName'},
          {label: '记录时间', prop: 'createTimeStr'},
          {label: '操作', prop: 'operation', slot: true}
        ],
        invoiceDataLess: [],
        invoiceResfLess: 'tab_finance_view_less_supplier',
        recordHeader: [
          {label: '时间', prop: 'createTimeStr'},
          {label: '记录人', prop: 'userName'},
          {label: '付款金额', prop: 'payMoney'},
          {label: '付款比例', prop: 'payMoneyProportion'},
          {label: '备注', prop: 'remark'},
          {label: '下次付款时间', prop: 'nextTime'},
          {label: '操作', prop: 'operation', slot: true}
        ],
        recordData: [],
        recordResf: 'tab_finance_view_rf_supplier',
        dataHeaderGoods: [
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
            prop: 'totalPrice',
            label: '价税合计：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true,
            placeholder: '请填写价税合计'
          }, {
            prop: 'taxPoint',
            label: '税率：',
            value: [],
            labelWidth: '130px',
            placeholder: '请选择税率',
            custom: true
          }, {
            prop: 'invoiceMoney',
            label: '发票金额：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true
          }, {
            prop: 'rate',
            label: '税额：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true
          }, {
            prop: 'getInvoiceTime',
            label: '开票日期：',
            date: true,
            value: '',
            required: true,
            rules: [{required: true, message: '请选择期望到货时间', trigger: 'blur,change'}],
            labelWidth: '130px'
          }]
        },
        dialogBut: [{text: '提交', type: 'primary', key: 'ok'}],
        idInvoice: null,
        dialogDataInvoiceEdit: {show: false, title: '编辑发票信息', width: '800px'},
        optionsTaxPoint: [{
          label: '0%',
          value: '0'
        }, {
          label: '3%',
          value: '0.03'
        }, {
          label: '6%',
          value: '0.06'
        }, {
          label: '10%',
          value: '0.1'
        }, {
          label: '13%',
          value: '0.13'
        }, {
          label: '16%',
          value: '0.16'
        }],
        optionsTaxPointEdit: [{
          label: '0%',
          value: '0'
        }, {
          label: '3%',
          value: '0.03'
        }, {
          label: '6%',
          value: '0.06'
        }, {
          label: '10%',
          value: '0.1'
        }, {
          label: '13%',
          value: '0.13'
        }, {
          label: '16%',
          value: '0.16'
        }],
        dialogFormInvoiceEdit: {
          from: [{
            prop: 'invoiceNumber',
            label: '发票编号：',
            value: '',
            labelWidth: '130px',
            required: true,
            placeholder: '请填写发票编号',
            rules: [{required: true, message: '请填写发票编号', trigger: 'blur,change'}]
          }, {
            prop: 'totalPrice',
            label: '价税合计：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true,
            placeholder: '请填写价税合计'
          }, {
            prop: 'taxPoint',
            label: '税率：',
            value: [],
            labelWidth: '130px',
            placeholder: '请选择税率',
            custom: true
          }, {
            prop: 'invoiceMoney',
            label: '发票金额：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true
          }, {
            prop: 'rate',
            label: '税额：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true
          }, {
            prop: 'getInvoiceTime',
            label: '开票日期：',
            date: true,
            value: '',
            required: true,
            rules: [{required: true, message: '请选择期望到货时间', trigger: 'blur,change'}],
            labelWidth: '130px'
          }]
        },
        dialogButEdit: [{text: '提交', type: 'primary', key: 'ok'}],
        dialogDataPayment: {show: false, title: '记录付款信息', width: '500px'},
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
          }, {
            prop: 'nextTime',
            label: '下次付款日期：',
            date: true,
            value: '',
            labelWidth: '130px'
          }]
        },
        idRecord: null,
        dialogDataPaymentEdit: {show: false, title: '编辑付款信息', width: '800px'},
        dialogFormPaymentEdit: {
          from: [{
            prop: 'payMoney',
            label: '付款金额：',
            value: '',
            type: 'number',
            min: 0,
            labelWidth: '130px',
            custom: true,
            placeholder: '请填写付款金额'
          }, {
            prop: 'remark',
            label: '备注：',
            value: '',
            type: 'text',
            labelWidth: '130px',
            placeholder: '请填写备注'
          }, {
            prop: 'nextTime',
            label: '下次付款日期：',
            date: true,
            value: '',
            labelWidth: '130px'
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
      // 新增发票
      dialogOkInvoice (res) {
        if (!this.totalPrice) {
          this.$message.error('价税合计不能为空！')
        } else if (!this.taxPoint) {
          this.$message.error('税率不能为空！')
        } else if (Number(this.totalPrice) <= 0) {
          this.$message.error('价税合计不能小于等于0！')
        } else {
          let data = {
            settlementId: this.settlementId,
            invoiceNumber: res.invoiceNumber,
            invoiceMoney: this.invoiceMoney,
            rate: this.rate,
            totalPrice: this.totalPrice,
            taxPoint: this.taxPoint,
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
                this.taxPoint = null
                this.getInvoiceList(this.settlementId)
              }
            }
          })
        }
      },
      // 编辑发票模态框
      toEditInvoice (row) {
        this.idInvoice = row.id
        this.dialogFormInvoiceEdit.from.map(item => {
          item.value = row[item.prop]
          this.invoiceMoney = row.invoiceMoney
          this.rate = row.rate
          this.totalPrice = row.totalPrice
          this.taxPoint = row.taxPointStr
        })
        this.dialogDataInvoiceEdit.show = true
      },
      // 编辑发票
      dialogOkInvoiceEdit (res) {
        if (!this.totalPrice) {
          this.$message.error('价税合计不能为空！')
        } else if (!this.taxPoint) {
          this.$message.error('税率不能为空！')
        } else if (Number(this.totalPrice) <= 0) {
          this.$message.error('价税合计不能小于等于0！')
        } else {
          switch (this.taxPoint) {
            case '0%':
              this.taxPoint = 0
              break
            case '3%':
              this.taxPoint = 0.03
              break
            case '10%':
              this.taxPoint = 0.1
              break
            case '13%':
              this.taxPoint = 0.13
              break
            case '16%':
              this.taxPoint = 0.16
              break
          }
          let data = {
            settlementId: this.settlementId,
            invoiceNumber: res.invoiceNumber,
            invoiceMoney: this.invoiceMoney,
            rate: this.rate,
            totalPrice: this.totalPrice,
            taxPoint: this.taxPoint,
            getInvoiceTime: res.getInvoiceTime,
            id: this.idInvoice
          }
          this.$Ajax.post({
            url: this.$Api.finance.updateInvoiceInformation,
            data: data,
            cb: res => {
              if (res.data.result) {
                this.dialogDataInvoiceEdit.show = false
                this.$message('提交成功！')
                this.getInvoiceList(this.settlementId)
                this.invoiceMoney = null
                this.rate = null
                this.totalPrice = null
                this.taxPoint = null
              }
            }
          })
        }
      },
      // 删除发票信息
      deleteInvoice (row) {
        this.$confirm('确定要删除吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$Ajax.post({
            url: this.$Api.finance.deletedInvoiceInformation,
            data: {
              id: row.id
            },
            cb: res => {
              if (res.data.result) {
                this.$message('删除成功')
                this.getInvoiceList(this.settlementId)
              }
            }
          })
        }).catch(() => {
        })
      },
      getRateAndMoney () {
        if (this.totalPrice && this.taxPoint) {
          let taxPointNum = null
          this.totalPrice = this.totalPrice ? this.totalPrice : null
          this.taxPoint = this.taxPoint ? this.taxPoint : null
          switch (this.taxPoint) {
            case '0':
              taxPointNum = 0
              break
            case '0.03':
              taxPointNum = 0.03
              break
            case '0.06':
              taxPointNum = 0.06
              break
            case '0.1':
              taxPointNum = 0.1
              break
            case '0.13':
              taxPointNum = 0.13
              break
            case '0.16':
              taxPointNum = 0.16
              break
            case '0%':
              taxPointNum = 0
              break
            case '3%':
              taxPointNum = 0.03
              break
            case '6%':
              taxPointNum = 0.06
              break
            case '10%':
              taxPointNum = 0.1
              break
            case '13%':
              taxPointNum = 0.13
              break
            case '16%':
              taxPointNum = 0.16
              break
          }
          this.invoiceMoney = (Number(this.totalPrice) / (1 + Number(taxPointNum))).toFixed(4)
          this.rate = (Number(this.totalPrice) - Number(this.invoiceMoney)).toFixed(4)
          this.dialogFormInvoice.from.map(item => {
            if (item.prop === 'invoiceMoney') {
              item.value = this.invoiceMoney ? this.invoiceMoney : null
            }
            if (item.prop === 'rate') {
              item.value = this.rate ? this.rate : null
            }
            if (item.prop === 'totalPrice') {
              item.value = this.totalPrice ? this.totalPrice : null
            }
            if (item.prop === 'taxPoint') {
              item.value = this.taxPoint ? this.taxPoint : null
            }
          })
        } else {
          this.rate = null
          this.invoiceMoney = null
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
        this.invoiceMoney = null
        this.rate = null
        this.totalPrice = null
        this.taxPoint = null
        this.dialogDataInvoice.show = true
      },
      toPayment () {
        this.dialogFormPayment.from.map(item => {
          item.value = ''
        })
        this.payMoney = ''
        this.$bus.emit('form-clear')
        this.dialogDataPayment.show = true
      },
      toFinish () {
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
      },
      // 新增付款记录
      dialogOkPayment (res) {
        if (this.payMoney) {
          if (this.payMoney <= 0) {
            this.$message.error('付款金额不能小于等于0！')
            return
          }
          if (!res.remark) {
            res.remark = ''
          }
          if (!res.nextTime) {
            res.nextTime = ''
          }
          let data = {
            settlementId: this.settlementId,
            payMoney: this.payMoney,
            remark: res.remark,
            nextTime: res.nextTime
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
        } else {
          this.$message('付款金额不能为空')
        }
      },
      // 编辑付款记录模态框
      toEditRecord (row) {
        this.idRecord = row.id
        this.dialogFormPaymentEdit.from.map(item => {
          item.value = row[item.prop]
          this.payMoney = row.payMoney
        })
        this.dialogDataPaymentEdit.show = true
      },
      // 编辑付款记录
      dialogOkPaymentEdit (res) {
        if (this.payMoney) {
          if (this.payMoney <= 0) {
            this.$message.error('付款金额不能小于等于0！')
            return
          }
          if (!res.remark) {
            res.remark = ''
          }
          if (!res.nextTime) {
            res.nextTime = ''
          }
          let data = {
            settlementId: this.settlementId,
            payMoney: this.payMoney,
            remark: res.remark,
            id: this.idRecord,
            nextTime: res.nextTime
          }
          this.$Ajax.post({
            url: this.$Api.finance.updatePayMoneyRecord,
            data: data,
            cb: res => {
              if (res.data.result) {
                this.$message('提交成功！')
                this.dialogDataPaymentEdit.show = false
                this.getData(this.settlementId)
                this.findPayMoneyRecord(this.settlementId)
              }
            }
          })
        } else {
          this.$message('付款金额不能为空')
        }
      },
      // 删除付款记录
      deleteRecord (row) {
        this.$confirm('确定要删除吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$Ajax.post({
            url: this.$Api.finance.deletedPayMoneyRecord,
            data: {
              id: row.id
            },
            cb: res => {
              if (res.data.result) {
                this.$message('删除成功')
                this.findPayMoneyRecord(this.settlementId)
              }
            }
          })
        }).catch(() => {
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
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin-right: 15px;
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
</style>

