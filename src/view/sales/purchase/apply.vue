<template>
  <div class="box">
    <div class="noInfo" v-if="noVoList">
      暂无信息
    </div>
    <div v-else>
      <template>
        <div class="voList">
          <div class="contract_title">{{voList.supplierName}}</div>
          <table-list :data-header="dataHeader" :dataStatic="voList.stockDeliverGoodsVOList" :static="true"
                      @selection-change="tableSelection">
            <template v-slot:afterNumber="scope">
              <el-input type="number" @keyup.native="voInputs(scope.row, scope.index)" placeholder="售后数量" v-model="scope.row.inputs"
                        clearable></el-input>
            </template>
          </table-list>
          <div class="returnReason">{{idCargoState}}原因</div>
          <el-input type="textarea" :rows="4" :placeholder="elPlaceholder" v-model="voList.returnReason"
                    @keyup.native="voTextarea(voList)"></el-input>
        </div>
      </template>
    </div>
    <el-button type="primary" @click="saveSupplier" v-if="!noVoList">提交</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        routerParams: {},
        voList: [],
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
        selectionaArr: [],
        elPlaceholder: ''
      }
    },
    computed: {
      noVoList () {
        return !this.voList || (this.voList && this.voList.length <= 0)
      },
      idCargoState () {
        return this.routerParams.code === 1 ? '退货' : '换货'
      }
    },
    created () {
      this.routerParams = this.$route.params
      this.elPlaceholder = `请输入${this.idCargoState}原因（200个字以内）`
      this.getData()
    },
    methods: {
      getData (data) {
        this.$Ajax.post({
          url: this.$Api.sale.toStockDeliverDetail,
          data: {
            id: this.routerParams.id
          },
          cb: res => {
            if (res.data.result) {
              this.voList = res.data.data
            }
          }
        })
      },
      getSupplier () {
        let vo = this.voList

        let data = {
          returnTypeCode: this.routerParams.code,
          orderId: vo.id,
          returnReason: vo.returnReason ? vo.returnReason : '',
          returnFormGoodsVOList: []
        }
        if (vo.stockDeliverGoodsVOList.length > 0) {
          vo.stockDeliverGoodsVOList.map(ntem => {
            data.returnFormGoodsVOList.push({
              businessGoodsId: ntem.id,
              returnCount: ntem.inputs ? ntem.inputs : 0
            })
          })
        }
        this.$Ajax.post({
          url: this.$Api.returnForm.saveSupplierReturnForm,
          data: {
            json: JSON.stringify([data])
          },
          cb: res => {
            let result = res.data.data
            if (res.data.result) {
              this.$message({
                showClose: true,
                message: '提交成功',
                type: 'success'
              })
              this.$router.push({name: 'returnGoodDetails', params: {state: 'detail', id: result.id, type: this.routerParams.code}})
            }
          }
        })
      },
      voInputs (row, index) {
        let inputs = row.inputs
        let afterSale = row.preQuantityAfterSale
        if ((inputs < 1 || Number(inputs) < 1) || (inputs > afterSale || Number(inputs) > afterSale)) {
          this.voList.stockDeliverGoodsVOList = this.voList.stockDeliverGoodsVOList.map((item, j) => {
            if (j === index) {
              item.inputs = ''
            }
            return item
          })
          this.$message.error('售后数量不能小于1、不能大于未退换数量和只能输入数字')
        }
      },
      voTextarea (res, j) {
        if (res.returnReason.length > 200) {
          this.voList.returnReason = res.returnReason.substring(0, 200)
          this.$message.error('请输入退货原因（200个字以内）')
        }
      },
      saveSupplier () {
        this.addIsReason()
      },
      tableSelection (res) {
        this.selectionaArr = res
      },
      addIsReason () {
        let inputs = []
        if (this.selectionaArr.length > 0) {
          this.selectionaArr.map((item, k) => {
            if (!item.inputs) {
              inputs.push(k)
            }
          })
          if (this.voList.returnReason && inputs.length === 0) {
            this.getSupplier()
          } else {
            this.$message.error('退货原因和商品数量不能为空')
          }
        } else {
          this.$message.error('退货不能为空')
        }
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
