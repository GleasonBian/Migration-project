<template>
  <div class="box">
    <div class="contract_title">退货单详情</div>
    <table border="1">
      <tbody>
      <tr v-for="item in listData">
        <td width="10%" style="background:#f5f5f5;text-align:center">{{item.title}}</td>
        <td width="90%" style="padding: 8px">
          <div>
            <v-list :data="item.dataType" :data-list="datalist" :listStyle="listStyle"></v-list>
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
    <el-row justify="center" type="flex" style="margin: 20px" v-if="!datalist.waybillNumber">
      <el-col :span="3">
        <el-button type="primary" @click="waybill(1)">填写运单号</el-button>
      </el-col>
    </el-row>
    <el-row justify="center" type="flex" style="margin: 20px" v-else>
      <el-col :span="3">
        <el-button type="primary" @click="waybill(2)">编辑运单号</el-button>
      </el-col>
    </el-row>
    <v-dialog :dialog="waybillDialog">
      <form-group :custom=true :data="waybillData" @keyup="wayBillRemarkKeyup" :data-but="wayBillBut" @on-cancel="cancel" @close-dialog="closeDialog" @on-ok="saveway"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataBut: [{text: '取消', key: 'cancel'}, {text: '保存', key: 'ok', type: 'primary'}],
        listStyle: {
          listwidth: '120px'
        },
        listData: [
          {
            title: '退货信息',
            dataType: [
              {prop: 'code', label: '退货单编号'},
              {prop: 'replenishStockCode', label: '进货单编号'},
              {prop: 'createTimeStr', label: '申请时间'},
              {prop: 'userName', label: '申请人'},
              {prop: 'supplierName', label: '供应商名称'},
              {prop: 'totalGoodsPrice', label: '商品金额'}
            ]
          },
          {
            title: '退货原因',
            dataType: [
              {prop: 'reason', label: '退货原因'}
            ]
          },
          {
            title: '运单信息',
            dataType: [
              {prop: 'waybillNumber', label: '运单号'},
              {prop: 'waybillTimeStr', label: '填写时间'},
              {prop: 'waybillRemark', label: '运单备注'}
            ]
          }
        ],
        datalist: {},
        invoicelist: {},
        dataHeader: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'totalGoodsPrice', label: '小计'}
        ],
        goodsDetailList: [],
        returnFormId: '',
        state: '',
        routerParams: {},
        waybillDialog: {
          show: false,
          title: '填写运单号',
          width: '600px'
        },
        waybillData: {
          labelWidth: '120px',
          from: [
            {
              prop: 'companyName',
              label: '供应商名称：',
              text: {
                value: ''
              }
            },
            {
              prop: 'returnNumber',
              label: '退货单号：',
              text: {
                value: ''
              }
            },
            {
              prop: 'waybillNumber',
              label: '运单号：',
              value: '',
              rules: [{
                required: true,
                message: '请输入正确的运单号',
                trigger: 'blur, change'
              }]
            },
            {
              prop: 'waybillRemark',
              label: '备注：',
              value: '',
              type: 'textarea',
              placeholder: '请填写备注（200个字以内）'
            }
          ]
        },
        wayBillBut: [{
          type: 'text',
          text: '取消',
          key: 'cancel'
        }, {
          type: 'primary',
          text: '确定',
          key: 'ok'
        }]
      }
    },
    computed: {
    },
    created () {
      this.routerParams = this.$route.params
      this.returnFormId = this.routerParams.id
      this.getData(this.returnFormId)
    },
    methods: {
      getData (id) {
        this.$Ajax.get({
          url: this.$Api.procurement.getById,
          data: {
            params: {
              id: id
            }
          },
          cb: res => {
            if (res.data.result) {
              this.datalist = res.data.data
              this.goodsDetailList = res.data.data.returnChangeGoodsVOS
              if (!this.$Utils.getPageElement(this.$Consts.PERMISSION.replenishStockMoney.code)) {
                let _dataHeader = []
                this.dataHeader.forEach((item, index) => {
                  if (item.prop !== 'unitPrice' && item.prop !== 'totalGoodsPrice') {
                    _dataHeader.push(item)
                  }
                })
                this.dataHeader = _dataHeader
              }
            }
          }
        })
      },
      waybill (type) {
        if (type === 1) {
          this.$bus.emit('form-clear')
        }
        if (type === 2) {
          this.waybillData.from[2].value = this.datalist.waybillNumber
          this.waybillData.from[3].value = this.datalist.waybillRemark
        }
        this.textValue(0, this.datalist.supplierName)
        this.textValue(1, this.datalist.code)
        this.waybillDialog.show = true
      },
      textValue (index, res) {
        this.waybillData.from[index].text.value = res
      },
      wayBillRemarkKeyup (res) {
        if (res.value.length > 200) {
          this.waybillData.from[3].value = res.value.substring(0, 200)
          this.$message.error('请输入200个字以内')
        }
      },
      saveway (res) {
        res.id = this.datalist.id
        this.$Ajax.post({
          url: this.$Api.procurement.waybill,
          data: res,
          cb: res => {
            if (res.data.result) {
              this.closeDialog()
              this.$message({
                showClose: true,
                message: '运单提交成功',
                type: 'success'
              })
              this.getData(this.returnFormId)
            }
          }
        })
      },
      closeDialog () {
        this.waybillDialog.show = false
      },
      cancel () {
        this.closeDialog()
      }
    }
  }
</script>

<style scoped>
  .box table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    border: 1px solid #ddd;
    border-spacing: 0
  }

  .contract_title {
    display: inline-block;
    padding: 10px 2px;
    border-bottom: 2px solid #1577fe;
    color: #1577fe;
  }

  .mr_b10 {
    margin-bottom: 10px;
  }
</style>
