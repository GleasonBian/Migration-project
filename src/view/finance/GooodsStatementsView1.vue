<template>
  <div class="p_d_detail_gsv">
    <div>结算详情</div>
    <br>
    <v-list :data="listData" :data-list="listItem" :list-style="listStyle"></v-list>
    <v-list :data="remarksData" :data-list="remarks" :list-style="listStyleRemarks"></v-list>
    <br><br>
    <h5>发票信息</h5>
    <br>
    <table-list :data-header="invoiceHeader" :static="true" :dataStatic="invoiceData" :refs="invoiceResf"></table-list>
    <br>
    <table-list :data-header="invoiceHeaderLess" :static="true" :dataStatic="invoiceDataLess" :refs="invoiceResfLess"></table-list>
    <br><br>
    <h5>付货款记录</h5>
    <table-list :data-header="recordHeader" :static="true" :dataStatic="recordData" :refs="recordResf"></table-list>
    <br><br>
    <h5>订单明细</h5>
    <br>
    <el-collapse v-model="activeNames" v-for="(item, index) in settlementData" :key="index" class="box_collapse">
      <el-collapse-item :name="index">
        <template slot="title">
          <div class="row_title">
            <div>订单号:{{item.replenishStockCode}}</div>
            <div>期望收货时间:<span class="">{{item.expectTimeStr}}</span></div>
            <div>商品金额:<span class="tab_title_cel_price">{{item.sumGoodsPrice}}</span></div>
          </div>
        </template>
        <div class="tab_con" v-for="(list, indexList) in item.stockDeliverVOS" :key="indexList">
          <div class="tab_con_cen">
            <div :class="{'tab_title_con_1': index===0, 'tab_title_con': true}">
              <div>收货单号: {{list.number}}</div>
              <div>收货时间: {{list.deliveryTimeStr}}</div>
              <div>订单金额: <span class="tab_title_cel_price">{{list.stockDeliverAmount}}</span></div>
              <div>应付金额: <span class="tab_title_cel_price">{{list.stockDeliverAmount}}</span></div>
              <div class="txt_state">{{list.stateStr}}</div>
            </div>
            <div class="tab_shop_con" v-for="(obj, index2) in list.stockDeliverGoodsVOList" :key="index2">
              <div class="tab_shop_lef">
                <div class="tab_shop_lef_con">
                  <div>
                    <img :src="obj.goodsPicture" class="tab_shop_con_img"/>
                  </div>
                  <div>
                    <div>名称:{{obj.goodsName}}</div>
                    <div>商品分类:{{obj.goodsBaseClassName}}</div>
                    <div>规格型号:{{obj.typeModel}}</div>
                  </div>
                  <div>
                    <div>单位:{{obj.unit}}</div>
                    <div>数量:{{obj.stockCount}}</div>
                    <div>价格:{{obj.unitPrice}}</div>
                  </div>
                  <div>小计: <span class="tab_title_cel_price">{{obj.totalPrice}}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div :class="['handle', {'tab_shop_rig_1': index===0}, 'tab_shop_rig']">
            <el-button type="text" @click="toView(list.id)">查看详情</el-button>
            <p>共 <span>{{list.goodsCount}}</span> 种物资</p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <br><br>
    <div class="text_center">
      <el-button plain @click="returnList">返回</el-button>
      <el-button type="primary" plain @click="toEdit" v-show="isShow">编辑</el-button>
      <el-button type="primary" plain @click="onDerive">导出结算单</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        settlementId: 0,
        listStyle: {
          listwidth: '130px',
          class: 'purchase_list'
        },
        listStyleTb: {
          listwidth: '130px',
          class: 'purchase_list_tb'
        },
        listStyleRemarks: {listwidth: '130px'},
        listData: [
          {prop: 'settlementNumber', label: '结算单编号'},
          {prop: 'processingStateDisplay', label: '结算单状态'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'applicationMoney', label: '结算金额'},
          {prop: 'actualApplicationMoney', label: '实际结算金额'},
          {prop: 'applicantName', label: '创建人'},
          {prop: 'time', label: '结算周期'}
        ],
        listItem: {},
        remarksData: [{prop: 'auditRemarks', label: '备注'}],
        remarks: {},
        invoiceHeader: [
          {label: '发票类型', prop: 'purchasingBillInvoiceTypeDisplay'},
          {label: '单位名称', prop: 'purchasingBillInvoiceCompanyName'},
          {label: '纳税人识别号', prop: 'purchasingBillInvoiceTaxpayCode'},
          {label: '注册地址', prop: 'purchasingBillInvoiceReceiverAddress'},
          {label: '注册电话', prop: 'purchasingBillInvoiceRegistryPhone'},
          {label: '开户银行账户', prop: 'purchasingBillInvoiceOpenAccount'},
          {label: '收票人姓名', prop: 'purchasingBillInvoiceReceiverName'},
          {label: '收票人电话', prop: 'purchasingBillInvoiceReceiverPhone'}
        ],
        invoiceData: [],
        invoiceResf: 'tab_finance_view',
        TableDataHeader: [
          {label: '全选', prop: 'operation', slot: true}
        ],
        tabStyle: {showHeader: false},
        tablePerformance: 'tab_finance_detail',
        purchaseDeliverData: [
          {prop: 'number', label: '收货单号'},
          {prop: 'deliveryTimeStr', label: '收货时间'},
          {prop: 'stockDeliverAmount', label: '订单金额'},
          {prop: 'stockDeliverAmount', label: '应付金额'}
        ],
        tb_size: [
          {prop: 'goodsName', label: '名称'},
          {prop: 'goodsBaseClassName', label: '商品分类'},
          {prop: 'typeModel', label: '规格型号'}
        ],
        tb_unit: [
          {prop: 'unit', label: '单位'},
          {prop: 'stockCount', label: '数量'},
          {prop: 'unitPrice', label: '价格'}
        ],
        tb_subtotal: [
          {prop: 'totalPrice', label: '小计'}
        ],
        tabBut: [{text: '查看详情', key: 'add'}],
        page: {
          refs: 'tab_finance_detail',
          ids: 0
        },
        DataUrl: this.$Api.finance.loadApplyDetailOrder,
        dataTable: [],
        isShow: true,
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
        recordResf: 'tab_finance_view_rf',
        activeNames: [],
        settlementData: []
      }
    },
    created () {
      this.settlementId = this.$route.params.id
      this.page.ids = this.$route.params.id
      this.getData(this.settlementId)
      this.getInvoiceList(this.settlementId)
      this.findPayMoneyRecord(this.settlementId)
    },
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
      getInfoList (orderIds) {
        this.$Ajax.post({
          url: this.DataUrl,
          data: {ids: orderIds},
          cb: res => {
            if (res.data.rows) {
//              this.getList(res.data.rows)
//              this.dataTable = res.data.rows
              this.settlementData = res.data.rows
              this.settlementData.map((item, index) => {
                this.activeNames.push(index)
              })
            }
          }
        })
      },
      getTableData (data) {
        this.getList(data.data.rows)
      },
      getList (rows) {
        rows.map(item => {
//          item.stockDeliverAmount = '￥' + item.stockDeliverAmount
          if (item.stockDeliverGoodsVOList === null) {
            item.stockDeliverGoodsVOList = []
          }
          item.stockDeliverGoodsVOList.map(vo => {
            if (vo.goodsPicture !== null) {
              vo.goodsPicture = this.$ImgPath.imgApi.imgApi + '/' + vo.goodsPicture
            } else {
              vo.goodsPicture = ''
            }
            vo.size = {
              goodsName: vo.goodsName,
              goodsBaseClassName: vo.goodsBaseClassName,
              typeModel: vo.typeModel
            }
            vo.unit = {
              unit: vo.unit,
              stockCount: vo.stockCount,
              unitPrice: vo.unitPrice
            }
            vo.subtotal = {
              totalPrice: vo.totalPrice
            }
          })
          item.voList = item.stockDeliverGoodsVOList
        })
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
              this.getInfoList(res.data.data.orderIds)
              if (res.data.data.processingStateCode === 2 || res.data.data.processingStateCode === 1) {
                this.isShow = false
              }
            }
          }
        })
      },
      returnList () {
        this.$router.push({name: 'gooodsStatements'})
      },
      onDerive () {
        location.href = this.$Api.finance.exportSettlement + '/' + this.settlementId
      },
      toView (item) {
        this.$router.push({name: 'purchaseAndDeliveryDetail', params: {id: item}})
      },
      toEdit () {
        this.$router.push({name: 'gooodsStatementsEdit', params: {id: this.settlementId}})
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
  .p_d_detail_gsv .el-dialog__body .el-form-item{margin-bottom: 0;}
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

