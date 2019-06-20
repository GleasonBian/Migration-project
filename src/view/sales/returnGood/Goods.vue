<template>
  <div class="box">
    <div class="contract_title">{{idCargoState}}申请</div>
    <table border="1">
      <tbody>
      <tr v-for="item in listData">
        <td width="10%" style="background:#f5f5f5;text-align:center">{{item.title}}</td>
        <td width="90%" style="padding: 8px">
          <div class="tables_span">
            <span>1.已收货的订单商品可申请{{idCargoState}}。</span>
            <span>2.世界高铁网会有专人跟进您的申请，可能会跟您了解确认情况，请保持电话通畅。</span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="noInfo" v-if="noVoList">
      暂无信息
    </div>
    <div v-else>
      <template v-for="(vo, j) in voList">
        <div class="voList">
          <div class="contract_title">{{vo.supplierName}}</div>
          <table-list :index="j" :data-header="dataHeader" :dataStatic="vo.stockDeliverGoodsVOList" :static="true"
                      @selection-change="tableSelection">
            <template v-slot:afterNumber="scope">
              <el-input type="number" @keyup.native="voInputs(scope.row, scope.index)" placeholder="售后数量" v-model="scope.row.inputs"
                        clearable></el-input>
            </template>
          </table-list>
          <div class="returnReason">{{idCargoState}}原因</div>
          <el-input type="textarea" :rows="4" :placeholder="elPlaceholder" v-model="vo.returnReason"
                    @keyup.native="voTextarea(vo.returnReason, j)"></el-input>
        </div>
      </template>
    </div>
    <el-button type="primary" @click="saveSupplier">提交</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        routeParams: {},
        voList: [],
        voIsempty: [],
        returnReasonAndVOList: [],
        listStyle: {
          listwidth: '600px'
        },
        listData: [
          {
            title: '温馨提示'
          }
        ],
        dataHeader: [
          {prop: 'goodsId', label: '商品编号', type: 'selection'},
          {prop: 'goodsId', label: '商品编号'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'unitPrice', label: '商品价格'},
          {prop: 'stockCount', label: '下单数量'},
          {prop: 'afterNumber', label: '售后数量', slot: true},
          {prop: 'unit', label: '单位'},
          {prop: 'totalPrice', label: '小计'}
        ],
        elPlaceholder: ''
      }
    },
    computed: {
      noVoList () {
        return !this.voList || (this.voList && this.voList.length <= 0)
      },
      idCargoState () {
        return this.routeParams.returnTypeCode === 1 ? '退货' : '换货'
      }
    },
    created () {
      this.routeParams = this.$route.params
      this.elPlaceholder = `请输入${this.idCargoState}原因（200个字以内）`
      this.getData(this.routeParams)
    },
    methods: {
      getData (data) {
        this.$Ajax.post({
          url: this.$Api.returnForm.getStockDeliverByOrderId,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.voList = res.data.data.stockDeliverVOList
            }
          }
        })
      },
      getSupplier (data) {
        this.$Ajax.post({
          url: this.$Api.returnForm.saveSupplierReturnForm,
          data: {
            json: JSON.stringify(data)
          },
          cb: res => {
            if (res.data.result) {
              this.$message({
                showClose: true,
                message: '提交成功',
                type: 'success'
              })
              this.$router.push({name: 'saveSupplier'})
            }
          }
        })
      },
      voInputs (row, index) {
        let inputs = row.inputs
        let afterSale = row.preQuantityAfterSale
        if ((inputs < 1 || Number(inputs) < 1) || (inputs > afterSale || Number(inputs) > afterSale)) {
          this.voList = this.voList.map(item => {
            item.stockDeliverGoodsVOList.map((ntem, j) => {
              if (j === index) {
                ntem.inputs = ''
              }
              return ntem
            })
            return item
          })
          this.$message.error('售后数量不能小于1、不能大于未退换数量和只能输入数字')
        }
      },
      voTextarea (res, j) {
        if (res.length > 200) {
          this.voList.map((item, i) => {
            if (j === i) {
              item.returnReason = res.substring(0, 200)
            }
          })
          this.$message.error('请输入退货原因（200个字以内）')
        }
      },
      tableSelection (res, index) {
        this.voList.forEach((item, j) => {
          if (j === index) {
            item.filterVOList = res
          }
        })
      },
      saveSupplier () {
        this.addIsReason()
      },
      addIsReason () {
        let inputsArr = []
        let returnReasonArr = []
        let voListEmpty = []
        let listArr = []

        this.voList = this.voList.map((item, g) => {
          if (item.filterVOList !== undefined) {
            if (item.filterVOList.length > 0) {
              item.inputsList = []
              item.filterVOList.map((ntem, k) => {
                if (!ntem.inputs) {
                  item.inputsList.push(g + k)
                } else {
                  let _index = item.inputsList.indexOf(g + k)
                  if (_index !== -1) {
                    item.inputsList.splice(_index, 1)
                  }
                }
                return ntem
              })
              if (item.inputsList.length > 0) {
                inputsArr.push(g)
              }
              if (!item.returnReason) {
                returnReasonArr.push(g)
              } else {
                let _index = returnReasonArr.indexOf(g)
                if (_index !== -1) {
                  returnReasonArr.splice(_index, 1)
                }
              }
              listArr.push(g)
              voListEmpty.push(g)
            } else {
              let _index = returnReasonArr.indexOf(g)
              if (_index !== -1) {
                returnReasonArr.splice(_index, 1)
                voListEmpty.push(_index, 1)
              }
            }
          }
          return item
        })
        if (voListEmpty.length <= 0) {
          this.$message.error('退货不能为空')
        } else {
          if (inputsArr.length === 0 && returnReasonArr.length === 0) {
            this.getSupplier(this.supplierDataFn())
          } else {
            this.$message.error('退货原因和商品数量不能为空')
          }
        }
      },
      supplierDataFn () {
        let returnTypeCode = this.routeParams.returnTypeCode
        let supplierData = []

        this.voList.map(item => {
          let data = {
            returnTypeCode: returnTypeCode,
            orderId: item.id,
            returnReason: item.returnReason ? item.returnReason : '',
            returnFormGoodsVOList: []
          }
          if (item.filterVOList !== undefined) {
            item.filterVOList.map(ntem => {
              data.returnFormGoodsVOList.push({
                businessGoodsId: ntem.id,
                returnCount: ntem.inputs ? ntem.inputs : 0
              })
            })
            supplierData.push(data)
          }
        })
        return supplierData
      }
    }
  }
</script>

<style scoped>
  .noInfo {
    font-size: 14px;
    color: #000000;
    text-align: center;
    padding-top: 100px;
  }

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

  .tables_span > span {
    float: left;
    margin: 8px;
    width: 100%;
    font-size: 14px;
  }

  .voList {
    margin-top: 30px;
  }

  .returnReason {
    margin: 10px 0;
    font-size: 14px;
  }
</style>
