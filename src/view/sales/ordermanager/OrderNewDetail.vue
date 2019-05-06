<template>
  <div>
    <div class="title">销售详情</div>
    <div class="box">
      <v-list :data="orderData" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <div class="orderTitle"   @click="show"><span :class="orderShow ?'tranlateTitle':''"></span>收货信息</div>
    <div class="box">
      <v-list v-show="orderShow" :data="goodsData" :data-list="dataList" :list-style="listStyle">
      </v-list>
    </div>
    <div class="orderTitle" @click="show1"><span :class="orderShow1 ?'tranlateTitle':''"></span >发票信息</div>
    <div class="box">
      <v-list v-show="orderShow1" :data="InvoiceData" :data-list="invoicelist" :list-style="listStyle"></v-list>
    </div>
    <div class="contract_title">商品明细
      <span>共{{goodsDetailList.length}}类物资，合计金额:￥{{priceAll}}</span>
    </div>
    <table-list   :data-header="TableDataHeader"  :dataStatic="goodsDetailList" :static="true" >
        <template slot-scope="scope" slot="unitPrice" @get-table-data="goodsMealListTable" >
            <td rowspan="1"  v-if="scope.row.unitPric" colspan="1" ><div class="cell">{{scope.row.unitPrice}}</div></td>
            <el-input type="number" v-else  v-model="scope.row.unitPrice"></el-input>
        </template>

    </table-list>
    <div class="base_btn_group">
      <el-button type="primary"  @click="onCreate">发货</el-button>
      <el-button type="primary" >确认价格</el-button>
    </div>
    <div class="contract_title">供应验收单列表</div>
    <table-list  :dataHeader="tableHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsMealListTable" :params="page">
      <template slot-scope="scope" slot="operation">
        <div>
          <router-link class="handle" :to="{name: 'demandLibraryView', params:{id: scope.row.id}}" tag="a" target="_blank">查看</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <v-dialog :dialog="NewClassDialog">
      <span>请先确认价格</span>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        NewClassDialog: {
          show: false,
          title: '',
          width: '40%'
        },
        orderData: [
          {label: '订单编号', prop: 'orderNumber'},
          {label: '鲁班订单', prop: 'lubanOrderNo'},
          {label: '采购单号', prop: 'code'},
          {label: '梁场名称', prop: 'projectName'},
          {label: '订单来源', prop: 'orderTypeStr'},
          {label: '订单状态', prop: 'orderStateDisplay'},
          {label: '所属组织', prop: 'organisation'},
          {label: '下单人名称', prop: 'createUserName'},
          {label: '下单账号', prop: 'orderAccount'},
          {label: '下单时间', prop: 'createTimeStr'},
          {label: '订单金额', prop: 'orderAmount'},
          {label: '支付方式', prop: 'purchasingBillPayKindStr'},
          {label: '支付时间', prop: 'paymentTime'},
          {label: '支付金额', prop: 'orderAmount'},
          {label: '订单备注', prop: 'remark'}
        ],
        goodsData: [
          {label: '收货人', prop: 'expressLinkMan'},
          {label: '联系电话', prop: 'expressLinkManPhone'},
          {label: '收货地址', prop: 'expressAddress'}
        ],
        InvoiceData: [
          {label: '发票类型', prop: 'purchasingBillInvoiceTypeDisplay'},
          {label: '纳税人识别号', prop: 'purchasingBillInvoiceTaxpayCode'},
          {label: '单位名称', prop: 'purchasingBillInvoiceCompanyName'},
          {label: '开户银行账户', prop: 'purchasingBillInvoiceOpenAccount'},
          {label: '开户银行', prop: 'purchasingBillInvoiceOpenAccount'},
          {label: '注册电话', prop: 'purchasingBillInvoiceRegistryPhone'},
          {label: '注册地址', prop: 'purchasingBillInvoiceRegistryAddress'},
          {label: '收票人姓名', prop: 'purchasingBillInvoiceReceiverName'},
          {label: '收票人手机', prop: 'purchasingBillInvoiceReceiverPhone'},
          {label: '收票人地址', prop: 'purchasingBillInvoiceReceiverAddress'}
        ],
        orderShow: false,
        orderShow1: false,
        // tabUrl: this.$Api.procurement.getPagePurchasePlanList,
        tableUrl: this.$Api.demand.loadApplicaFormListByPager,
        // url: this.$Api.sale.pushOrderList,
        dataList: {},
        invoicelist: {},
        listStyle: {
          class: ['pannel']
        },
        TableDataHeader: [
          {type: 'selection'},
          {label: '商品名称', prop: 'goodsName'},
          {label: '商品编码', prop: 'goodsCode'},
          {label: '规格型号', prop: 'typeModel'},
          {label: '品牌', prop: 'brandName'},
          {label: '计量单位', prop: 'unit'},
          {label: '数量', prop: 'goodsCount'},
          {label: '价格', prop: 'unitPrice', slot: true},
          {label: '金额', prop: 'subtotal'}
        ],
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
        goodsMealListTable: 'tab_sales_list',
        dataSearch: {},
        goodsDetailList: [],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_sales_list'
        }
        // confirmPrice: false
      }
    },
    computed: {
      priceAll () {
        let price = 0
        this.goodsDetailList.map(item => {
          price += item.subtotal
        })
        return this.toMoney(price)
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
      show () {
        this.orderShow = !this.orderShow
      },
      show1 () {
        this.orderShow1 = !this.orderShow1
      },
      toMoney (num) {
        num = num.toFixed(2)
        num = parseFloat(num)
        num = num.toLocaleString()
        if (num.indexOf('.') === -1) {
          num = num + '.00'
        }
        return num
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
              this.dataList = res.data.data

              this.invoicelist = res.data.data.invoiceUseInfo
              this.goodsDetailList = res.data.data.orderFromGoodsList
            }
          }
        })
      },
      onCreate () {
        let orderCode = this.dataList.orderNumber
        let routeData = this.$router.resolve({
          name: 'libraryAdd',
          params: {id: this.orderId, orderCode: orderCode, sign: 2}
        })
        window.open(routeData.href, '_blank')
      }
    }
  }
</script>
<style scoped>
.box{
    padding: 0px 5px;
    border: solid #e5e5e5 1px;
 }
  .title{
    font-size: 18px;
  }
  .title, .contract_title{
    margin-bottom: 10px;
    font-size: 18px;
    border-left: solid #008aff 4px;
    padding-left: 5px;
  }
  .contract_title{
    margin-top: 20px;
  }
  .orderTitle{
    height: 48px;
    background: rgba(250, 250, 250, 1);
    border: 1px solid rgba(233, 233, 233, 1);
    border-radius: 2px;
    line-height: 48px;
    position: relative;
    text-indent: 45px;
    margin-top:10px;
  }
  .orderTitle span{
    position: absolute;
    left: 25px;
    top:18px;
    width: 0;
    height:0;
    border:6px solid transparent;
    border-left-color:rgba(0, 0, 0, 0.647058823529412);
    transition:all 0.3s linear;
  }
  .tranlateTitle{
    transform: rotate(90deg);
    transition:all 0.3s linear;
  }
  .contract_title span{
    color:#000000;
    float: right;
    margin-right: 50px;
  }
  .base_btn_group{
      display: flex;
      justify-content: center;
      margin-top:20px;

  }
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
  .el-dialog__body span{
    margin:auto;
  }
</style>
<style>
.pannel .v_list_li{
    float: left;
    width: 33% !important;
  }
</style>
