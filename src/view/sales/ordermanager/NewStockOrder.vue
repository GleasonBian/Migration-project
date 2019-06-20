<template>
  <div class="StockOrderBox">
    <div class="contract_title">申请进货订单</div>
    <div v-show="!isShow" style="margin-top: 50px">暂时没有供应商对此订单进行报价,无法进货,请先发起询价并确保有供应商报价!</div>
    <div v-show="isShow">
      <div>
        <el-button type="text" class="selectwarehouse" @click="selectwarehouse">{{butlabel}}</el-button>
      </div>
      <div v-for="quotationVO in dataTable1">
        <div style="margin:20px;text-align: center">{{quotationVO[0].quotationVO.companyName}}</div>
        <table-list :data-header="dataHeader" :dataStatic="quotationVO" :static="true">
          <template v-slot:operation="scope">
            <el-form :model="scope.row" refs="rulesForm" >
              <el-form-item prop="stockNum">
                <el-input type="number" v-model="scope.row.stockNum" size="small" :min="0" placeholder="0" style="width:150px" :class="{mInput: scope.row.classFlag}"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </table-list>
      </div>
      <el-row justify="center" type="flex" style="margin: 20px">
        <el-col :span="3">
          <el-button type="primary" @click="onBack">返回</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-col>
      </el-row>
      <select-warehouse-dialog :goodsDialog="goodsDialog" @on-select-result="onselectcall"></select-warehouse-dialog>
    </div>
  </div>
</template>

<script>
    import SelectWarehouseDialog from './SelectWarehouseDialog.vue'
    export default {
      data () {
        return {
          goodsDialog: {
            show: false,
            title: '选择仓库：',
            width: '60%'
          },
          goodsListTable: 'tab_newSO_list',
          tableUrl: this.$Api.orderManger.gotoReplenishStock,
          butlabel: '选择收货仓库',
          dataHeader: [
            {type: 'selection'},
            {prop: 'goodsName', label: '商品名称'},
            {prop: 'typeModel', label: '规格型号'},
            {prop: 'brandName', label: '品牌'},
            {prop: 'unit', label: '单位'},
            {prop: 'goodsCount', label: '采购数量'},
            {prop: 'remark', label: '其他要求'},
            {prop: 'unitPrice', label: '销售价格'},
            {prop: 'unitGoodsPrice', label: '进货价格'},
            {prop: 'replenishStockNum', label: '已进货总量'},
            {prop: 'operation', label: '进货数量', slot: true, width: '200px'}
          ],
          orderId: '',
          tabButTable: [{text: '删除', key: 'del'}, {text: '修改', key: 'edit'}],
          dataTable1: [],
          WarehouseData: {},
          isShow: false
        }
      },
      created () {
        this.orderId = this.$route.params.id
        this.getData(this.orderId)
      },
      components: {
        SelectWarehouseDialog
      },
      methods: {
        onBack () {
          this.$router.push({name: 'orderList'})
        },
        onselectcall (data) {
          this.WarehouseData = data
          this.butlabel = data.warehouseName
        },
        onSubmit () {
          if (JSON.stringify(this.WarehouseData) === '{}') {
            this.$message('请先选择仓库')
            return
          }
          let submitDatas = []
          let flag = true
          this.$bus.emit('selection-change', (data) => {
            let datalist = data()
            if (datalist.length === 0) {
              return
            }
            let submitDatao = {}
            submitDatao.orderId = this.orderId
            submitDatao.warehouseId = this.WarehouseData.id
            submitDatao.companyId = datalist[0].quotationVO.companyId
            submitDatao.companyName = datalist[0].quotationVO.companyName
            submitDatao.replenishStockGoodsVOList = []
            datalist.map((item) => {
              let count = item.goodsCount - item.replenishStockNum
              this.$set(item, 'classFlag', false)
              if (!item.stockNum || ((flag && item.stockNum > count) || item.stockNum <= 0)) {
                flag = false
                this.openAlert('进货数量要小于采购数量与已进货总量之差')
              }
              if (item.stockNum > count) {
                this.$set(item, 'classFlag', true)
              }
              let replenishStockGoodsVO = {}
              replenishStockGoodsVO.replenishStockNum = item.stockNum // 进货数量
              replenishStockGoodsVO.unitGoodsPrice = item.unitGoodsPrice // 进货价格
              replenishStockGoodsVO.quotationGoodsId = item.id // 报价商品id
              submitDatao.replenishStockGoodsVOList.push(replenishStockGoodsVO)
            })
            submitDatas.push(submitDatao)
          })
          if (submitDatas.length !== 0 && flag) {
            this.uploadData(JSON.stringify(submitDatas))
          } else if (flag) {
            this.$message('请选择物资')
          }
        },
        selectwarehouse () {
          this.goodsDialog.show = true
        },
        uploadData (submitDataoStr) {
          this.$Ajax.post({
            url: this.$Api.orderManger.saveReplenishStock,
            data: {
              json: submitDataoStr
            },
            cb: res => {
              if (res.status === 200) {
                this.$router.push({name: 'orderList'})
              }
            }
          })
        },
        getData (id) {
          this.$Ajax.post({
            url: this.$Api.orderManger.gotoReplenishStock,
            data: {
              orderId: id
            },
            cb: res => {
              if (res.status === 200) {
                this.dataTable1 = res.data.data
                if (JSON.stringify(res.data.data) === '{}') {
                  this.isShow = false
                } else {
                  this.isShow = true
                }
              }
            }
          })
        },
        tableRefresh () {
          this.$Utils.pageUpdateTable([this.params, this.page], this.goodsMealListTable, this)
        },
        getTableData (data) {
          this.page.totalNum = data.data.total
        },
        openAlert (msg) {
          this.$alert(msg, '温馨提示', {
            confirmButtonText: '确定'
          })
        }
      }
    }
</script>
<style>
  .StockOrderBox .mInput input{border-color: red; color: red}
</style>
<style scoped>
  .contract_title {display: inline-block;padding:10px 2px;border-bottom: 2px solid #1577fe; color: #1577fe;}
  .selectwarehouse{
    color: gray;
    margin: 20px;
  }
</style>
