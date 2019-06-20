<template>
  <div class="box">
    <div class="contract_title">订单详情</div>
    <div class="box">
      <v-list :data="data" :data-list="datalist"></v-list>
    </div>
    <div style="margin-top: 20px;font-size: 14px;">
      选择仓库:
      <el-select v-model="wareHouse" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="contract_title">商品明细</div>
    <table-list :data-header="dataHeader" :dataStatic="goodsDetailList" :static="true" @selection-change="selectionChange">
      <template v-slot:outgoingNum="scope">
        <el-input v-model="scope.row.outgoingNum" type="number"></el-input>
        <!--<input type="number" v-model="scope.row.outgoingNum"  min="0.0" max="5" step="0.1">-->
      </template>
    </table-list>
    <div style="margin-top: 20px;display: flex;justify-content: center;">
      <el-button type="primary" @click="onSave">提交</el-button>
      <el-button type="primary" plain @click="onCancle">取消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        minlength: 1,
        wareHouse: '',
        data: [
          { prop: 'userName', label: '采购员' },
          { prop: 'userPhone', label: '联系方式' },
          { prop: 'expressLinkMan', label: '收货人' },
          { prop: 'expressLinkManPhone', label: '联系方式' },
          { prop: 'areaName', label: '收货区域' },
          { prop: 'expressAddress', label: '详细地址' }
        ],
        options: [],
        value: '',
        datalist: {},
        dataHeader: [
          {type: 'selection'},
          {type: 'index', label: '序号'},
          {prop: 'id', label: '商品编号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '出库数量'},
          {prop: 'unitPrice', label: '价格'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'alreadyStockNum', label: '已出库数量'},
          {prop: 'outgoingNum', label: '出库数量', slot: true}
        ],
        selection: [],
        goodsDetailList: [],
        orderId: '',
        orderCode: ''
      }
    },
    created () {
      this.orderId = this.$route.params.id
      this.orderCode = this.$route.params.orderCode
      this.loadWarehouseList()
      this.getData(this.orderId)
    },
    methods: {
      loadWarehouseList () {
        this.$Ajax.post({
          url: this.$Api.demand.loadWarehouseList,
          cb: res => {
            if (res.status === 200) {
              if (res.data.data) {
                let select = []
                res.data.data.map(x => {
                  select.push({
                    value: x.id,
                    label: x.warehouseName
                  })
                })
                this.options = select
              }
            }
          }
        })
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
              this.datalist = res.data.data
              this.goodsDetailList = res.data.data.orderFromGoodsList
            }
          }
        })
      },
      selectionChange (selection) {
        this.selection = selection
      },
      onChange (val) {
        if ((val.goodsCount - val.alreadyStockNum).toFixed(2) < val.outgoingNum) {
          this.$message('已经超出')
          val.outgoingNum = (val.goodsCount - val.alreadyStockNum).toFixed(2)
          return val
        }
      },
      onSave () {
        if (this.selection.length <= 0) {
          this.$message('请先选择商品')
          return
        }
        if (!this.wareHouse) {
          this.$message('请选择仓库')
          return
        }
        let flag = true
        this.selection.map(item => {
          if (item.outgoingNum <= 0) {
            this.$message('本次出库的物资数量不能全部为0！')
            flag = false
          }
          if ((item.goodsCount - item.alreadyStockNum).toFixed(2) < Number(item.outgoingNum)) {
            this.$message('本次出库的数量不能大于剩余出库数量,剩余出库数量的计算规则是：剩余出库数量=采购数量-已出库数量')
            flag = false
          }
        })
        if (!flag) {
          return
        }
        let arr = []
        this.selection.map(item => {
          arr.push({orderFromGoodsId: item.id, applicaNum: item.outgoingNum})
        })
        let data = {
          orderId: this.orderId,
          warehouseId: this.wareHouse,
          applicaFormGoodsStr: JSON.stringify(arr)
        }
        this.$Ajax.post({
          url: this.$Api.demand.addApplicaForm,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message('创建成功！')
              this.$router.push({name: 'selfOrderOutDetail', params: {id: this.orderId}})
            }
          }
        })
      },
      onCancle () {
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  .box{
    padding: 0px 5px;
    border: solid #e5e5e5 1px;
  }
  .contract_title {display: inline-block;padding:10px 2px;border-bottom: 2px solid #1577fe; color: #1577fe;}
  .mr_b10 {margin-bottom:10px;}
</style>
