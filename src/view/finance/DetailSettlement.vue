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
    <table-list :data-header="invoiceHeaderLess" :static="true" :dataStatic="invoiceDataLess" :refs="invoiceResfLess"></table-list>
    <br><br>
    <div>付货款记录</div>
    <table-list :data-header="recordHeader" :static="true" :dataStatic="recordData" :refs="recordResf"></table-list>
    <br><br>
    <div class="pad">
      <el-row>
        <el-col :span="24">
          <div>订单明细</div>
        </el-col>
      </el-row>
    </div>
    <el-collapse v-model="activeNames" v-for="(item, index) in settlementData" :key="index" class="box_collapse">
      <el-collapse-item :name="index">
        <template slot="title">
          <div class="row_title">
            <div>订单号:{{item.orderNumber}}</div>
            <div>订单金额:<span class="tab_title_cel_price">{{item.orderAmount}}</span></div>
            <div>实际结算金额:<span class="tab_title_cel_price">{{item.orderAmount}}</span></div>
          </div>
        </template>
        <div class="tab_con" v-for="(list, indexList) in item.applicaFormVOList" :key="indexList">
        <div class="tab_con_cen">
          <div :class="{'tab_title_con_1': index===0, 'tab_title_con': true}">
            <div>供应验收单号: {{list.applicaFormCode}}</div>
            <div>下单时间: {{list.createTimeStr}}</div>
            <div>订单金额: <span class="tab_title_cel_price">{{list.applicaFormAmount}}</span></div>
            <div>应付金额: <span class="tab_title_cel_price">{{list.applicaFormAmount}}</span></div>
            <div class="txt_state">{{list.stateStr}}</div>
          </div>
          <div class="tab_shop_con" v-for="(obj, index2) in list.applicaFormGoodsVOList" :key="index2">
            <div class="tab_shop_lef">
              <div class="tab_shop_lef_con">
                <div>
                  <img :src="obj.goodsImg" class="tab_shop_con_img"/>
                </div>
                <div>{{obj.goodsName}}</div>
                <div>
                  <div>单位:{{obj.unit}}</div>
                  <div>数量:{{obj.applicaNum}}</div>
                  <div>价格:{{obj.goodsUtilPrice}}</div>
                </div>
                <div>小计: <span class="tab_title_cel_price">{{obj.goodsTotalPrice}}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div :class="['handle', {'tab_shop_rig_1': index===0}, 'tab_shop_rig']" @click="jumpDetail(list.orderId)">查看详情</div>
      </div>
      </el-collapse-item>
    </el-collapse>
    <div class="but">
      <tab-but :data="tabBut" @on-add="tabAdd" @wx-export="cancel"></tab-but>
    </div>
    <v-dialog :dialog="dialogDataAdd">
      <form-group :data="dataFormAdd" @on-cancel="cancelAdd" @on-ok="okAdd" :custom=true
                  :data-but="databut"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeNames: [],
        dialogDataAdd: {show: false, title: '结算设置', width: '30%'},
        data: [
          {prop: 'settlementNumber', label: '结算单编号'},
          {prop: 'processingStateDisplay', label: '结算状态'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'applicationMoney', label: '结算金额'},
          {prop: 'actualApplicationMoney', label: '实际结算金额'},
          {prop: 'applicantName', label: '申请人姓名'},
          {prop: 'cycletime', label: '结算周期'},
          {prop: 'auditRemarks', label: '结算备注'}
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
        tabBut: [{
          text: '导出结算单',
          key: 'wx-export'
        }],
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
          {label: '收票时间', prop: 'createTimeStr'},
          {label: '发票编号', prop: 'invoiceNumber'},
          {label: '发票金额', prop: 'invoiceMoney'},
          {label: '记录人', prop: 'userName'}
        ],
        invoiceDataLess: [],
        invoiceResfLess: 'tab_finance_view_less',
        recordHeader: [
          {label: '时间', prop: 'createTimeStr'},
          {label: '付款金额', prop: 'payMoney'},
          {label: '付款比例', prop: 'payMoneyProportion'},
          {label: '记录人', prop: 'userName'}
        ],
        recordData: [],
        recordResf: 'tab_finance_view_rf'
      }
    },
    computed: {},
    created () {
      this.settlementId = this.$route.params.settlementId
      this.loadSettlementDetail()
      this.loadDetailOrder()
      this.getInvoiceList(this.settlementId)
      this.findPayMoneyRecord(this.settlementId)
    },
    mounted () {
    },
    components: {},
    filters: {},
    watch: {},
    methods: {
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
      tabAdd () {
        this.dataFormAdd.from[0].value = this.dataList.applicationMoney
        this.dialogDataAdd.show = true
      },
      cancel () {
        location.href = this.$Api.finance.newExportSettlement + '/' + this.settlementId
      },
      loadDetailOrder () {
        this.$Ajax.post({
          url: this.$Api.finance.loadDetailOrder,
          data: {},
          cb: res => {
            if (res.status === 200) {
              this.settlementData = res.data.rows
              this.settlementData.map((item, index) => {
                this.activeNames.push(index)
              })
            }
          }
        })
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
              if (this.dataList.processingStateDisplay !== '已完成') {
                let obj = {text: '确认已收款', key: 'add'}
                this.tabBut.unshift(obj)
              }
            }
          }
        })
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
  .box_collapse .el-collapse-item__header{ border-bottom-color: gainsboro !important;border-right: solid 1px gainsboro !important;  border-left: solid 1px gainsboro !important;}
  .box_collapse .el-collapse-item__content { padding-bottom: 0;}
</style>
