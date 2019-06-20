<template>
  <div class="box">
    <div class="contract_title">{{title}}</div>
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
    </table-list>
    <el-row justify="center" type="flex" style="margin: 20px">
      <el-col :span="3">
        <el-button  @click="onBack">返回</el-button>
      </el-col>
      <el-col v-if="datalist.processingStateCode === 2 && datalist.settlementComplete !== 1" :span="2">
        <el-button type="primary" @click="returnGoods">向供应商退货</el-button>
      </el-col>
      <template v-if="state !== 'detail'">
        <el-col v-if="datalist.processingStateCode === 2 && datalist.pushedOrder !== 1" :span="2">
          <el-button type="primary" @click="pushOrder">推送订单</el-button>
        </el-col>
      </template>
      <el-col :span="3" v-if="datalist.processingStateCode == 1">
        <el-button type="primary" @click="onAudit">审核</el-button>
      </el-col>
    </el-row>
    <v-dialog :dialog="NewClassDialog">
      <form-group :custom=true :data="NewClassDialogData" :dataBut="dataBut" @on-cancel="cancel" @on-ok="onNewClassSave"></form-group>
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
        dataBut: [{text: '取消', key: 'cancel'}, {text: '保存', key: 'ok', type: 'primary'}],
        NewClassDialogData: {
          from: [
            {
              prop: 'processingStateCode',
              label: '审核结果：',
              value: '',
              labelWidth: '150px',
              defaultVal: '2',
              radio: [
                {label: '2', text: '通过'},
                {label: '3', text: '不通过'}
              ]
            },
            {
              prop: 'auditRemarks',
              label: '审核备注：',
              value: '',
              labelWidth: '150px',
              type: 'textarea',
              rows: 3
            }
          ]
        },
        listStyle: {
          listwidth: '120px'
        },
        listData: [
          {
            title: '',
            dataType: [
              {prop: 'returnNumber', label: ''},
              {prop: 'orderNumber', label: '订单编号'},
              {prop: 'applicationTimeStr', label: '申请时间'},
              {prop: 'applicantName', label: '申请人'},
              {prop: 'phoneNumber', label: '联系方式'},
              {prop: 'goodsPriceAmount', label: '商品金额'},
              {prop: 'projectName', label: '梁场名称'}
            ]
          },
          {title: '',
            dataType: [
              {prop: 'returnReason', label: ''}
            ]
          },
          {title: '运单信息',
            dataType: [
              {prop: 'wayBillNumber', label: '运单号'},
              {prop: 'wayBillDateStr', label: '填写时间'},
              {prop: 'wayBillRemark', label: '运单备注'}
            ]
          }
        ],
        datalist: {},
        invoicelist: {},
        dataHeader: [
          {prop: 'goodsId', label: '商品编号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'goodsPrice', label: '商品价格（元）'},
          {prop: 'returnCount', label: '下单数量'},
          {prop: 'supplierName', label: '供应商名称'},
          {prop: 'goodsUnit', label: '单位'},
          {prop: 'goodsMoneyAmount', label: '小计'}
        ],
        goodsDetailList: [],
        returnFormId: '',
        state: '',
        title: '',
        routerName: {}
      }
    },
    computed: {
      isText () {
        return this.routerName.type === 1 ? '退货' : '换货'
      }
    },
    created () {
      this.returnFormId = this.$route.params.id
      this.routerName = this.$route.params
      this.state = this.$route.params.state
      this.dataTypeLabel(0, 0, '单号')
      this.dataTypeLabel(1, 0, '原因')
      this.dataTypeTitle(0, '信息')
      this.dataTypeTitle(1, '原因')
      this.title = this.isText + '单信息'
      this.NewClassDialog.title = this.isText + '申请审核：'
      this.getData(this.returnFormId)
    },
    methods: {
      dataTypeLabel (index, typeIndex, text) {
        this.listData[index].dataType[typeIndex].label = this.isText + text
      },
      dataTypeTitle (index, text) {
        this.listData[index].title = this.isText + text
      },
      onNewClassSave (res) {
        res.id = this.returnFormId
        this.$Ajax.post({
          url: this.$Api.returnForm.auditReturnForm,
          data: res,
          cb: res => {
            if (res.status === 200) {
              this.NewClassDialog.show = false
              this.$router.push({name: 'returnList'})
            }
          }
        })
      },
      cancel () {
        this.NewClassDialog.show = false
      },
      onAudit () {
        this.NewClassDialog.show = true
      },
      returnGoods () {
        let returnTypeCode = null
        if (this.state === 'detail') {
          returnTypeCode = 1
        } else {
          returnTypeCode = 2
        }
        this.$router.push({name: 'returnGoods', params: {orderId: this.datalist.orderId, returnTypeCode: returnTypeCode}})
      },
      onBack () {
        this.$router.push({name: 'returnList'})
      },
      pushOrder () {
        this.getReturnData(this.returnFormId)
      },
      getReturnData (id) {
        this.$Ajax.get({
          url: this.$Api.returnForm.pushOrder,
          data: {
            params: {
              returnFormId: id
            }
          },
          cb: res => {
            if (res.data.result) {
              this.$message('推送成功')
              this.getData(this.returnFormId)
            }
          }
        })
      },
      getData (id) {
        this.$Ajax.get({
          url: this.$Api.returnForm.toReturnFormDetail,
          data: {
            params: {
              returnFormId: id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.datalist = res.data.data
              this.goodsDetailList = res.data.data.returnFormGoodsVOList
              this.goodsDetailList.map((item) => {
                for (let key in item.dynamicAttr) {
                  this.dataHeader.splice(2, 0, {prop: key, label: key})
                  item[key] = item.dynamicAttr[key]
                }
              })
            }
          }
        })
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
