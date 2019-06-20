<template>
  <div class="box">
    <div class="contract_title">订单详情</div>
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
      <template v-slot:replenishStockNum="scope">
        <div>{{scope.row.goodsCount - scope.row.alreadyStockNum}}</div>
      </template>
    </table-list>
    <div style="margin-top: 20px;display: flex;justify-content: center;">
      <el-button type="primary" plain @click="back">返回列表</el-button>
      <el-button type="primary" @click="onDetail">供应明细</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        listStyle: {
          listwidth: '120px'
        },
        listData: [
          {title: '订单信息',
            dataType: [
              {prop: 'orderNumber', label: '订单编号'},
              {prop: 'createTimeStr', label: '下单时间'},
              {prop: 'orderAmount', label: '订单金额'},
              {prop: 'orderAmount', label: '退货金额'},
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
          },
          {title: '创建人',
            dataType: [
              {prop: 'userName', label: '采购员'},
              {prop: 'userPhone', label: '联系方式'},
              {prop: 'createUserName', label: '创建人'},
              {prop: 'createUserPhone', label: '联系方式'}
            ]
          }
        ],
        datalist: {},
        invoicelist: {},
        dataHeader: [
          {type: 'index', label: '序号'},
          {prop: 'id', label: '商品编号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'alreadyStockNum', label: '已出库数量'},
          {prop: 'replenishStockNum', label: '剩余数量', slot: true}
        ],
        goodsDetailList: [],
        orderId: ''
      }
    },
    created () {
      this.orderId = this.$route.params.id
      this.getData(this.orderId)
    },
    methods: {
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
      },
      back () {
        this.$router.back()
      },
      onDetail () {
        this.$router.push({name: 'selfOrderOutDetail', params: {id: this.orderId}})
      }
    }
  }
</script>

<style scoped>
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
