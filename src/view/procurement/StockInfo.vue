<template>
  <div>
    <form-group :data="dataForm" :custom=true>
      <template v-slot:boxInfo="scope">
        <div class="contract_title">进货单详情</div>
        <v-list :data="purchaseData" :data-list="purchaseList" :list-style="listStyle"></v-list>
        <div class="contract_title mr_b10">进货单商品</div>
        <table-list :data-header="dataHeader" :static="true" :dataStatic="dataTable" @selection-change="selectionChange"
                    :refs="tableSalesPurchaseDelivery">
          <template v-slot:number="scope">
            {{scope?scope.index + 1:"" }}
          </template>
          <template v-slot:stockGoodsCount="scope">
            <input v-if="scope.row.deliveryNum < scope.row.replenishStockNum" v-model="scope.row.stockGoodsCount" type="number" min=0  @wheel.native.prevent/>
            <span v-else>{{scope.row.stockGoodsCount}}</span>
          </template>
        </table-list>
      </template>
      <form-group :data="otherdataForm" slot="other" style="width: 30%" :custom=true @on-ok="okForm"
                  :data-but="dataBut"></form-group>
    </form-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        aaa: 0,
        dataForm: {
          from: [{
            prop: 'boxInfo',
            label: '',
            value: '',
            labelWidth: '0',
            custom: true
          }, {
            prop: 'other',
            label: '',
            value: '',
            labelWidth: '0',
            custom: true
          }]
        },
        otherdataForm: {
          from: [
            {
              prop: 'expectedArrivalTime',
              label: '期望到货时间',
              date: true,
              value: '',
              labelWidth: '120px'
            }, {
              prop: 'otherExpenses',
              label: '其他费用',
              value: '',
              labelWidth: '120px'
            }, {
              prop: 'otherExpensesRemark',
              label: '其他费用说明',
              value: '',
              type: 'textarea',
              labelWidth: '120px'
            }
          ]
        },
        dataBut: [{
          text: '保存',
          type: 'primary',
          key: 'ok',
          disabled: false
        }],
        listStyle: {
          listwidth: '100px',
          class: 'purchase_list'
        },
        purchaseData: [
          {prop: 'replenishStockCode', label: '进货单编码'},
          {prop: 'orderCode', label: '销售单编码'},
          {prop: 'stateStr', label: '状态'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'creater', label: '创建人'},
          {prop: 'sumGoodsPrice', label: '进货单总金额'}
        ],
        purchaseList: {},
        tableSalesPurchaseDelivery: 'table_sales_purchase_delivery',
        dataHeader: [{
          type: 'selection'
        }, {
          prop: 'number',
          label: '序号',
          width: '60',
          slot: true
        }, {
          prop: 'goodsName',
          label: '商品名称'
        }, {
          prop: 'typeModel',
          label: '规格型号'
        }, {
          prop: 'brandName',
          label: '品牌'
        }, {
          prop: 'unit',
          label: '单位'
        }, {
          prop: 'unitGoodsPrice',
          label: '进货单价'
        }, {
          prop: 'replenishStockNum',
          label: '进货数量'
        }, {
          prop: 'deliveryNum',
          label: '已发货数量'
        }, {
          prop: 'stockGoodsCount',
          label: '进货数量',
          slot: true
        }],
        dataTable: [],
        selection: [],
        idStock: ''
      }
    },
    created () {
      let id = this.$route.params.id
      this.idStock = id
      this.getData(id)
    },
    methods: {
      changeAAA(inputVal,index){
        this.dataTable[index].replenishStockNum =inputVal
      },
      selectionChange (selection) {
        this.selection = selection
      },
      getData (id) {
        this.$Ajax.post({
          url: this.$Api.sale.toApplyStockDeliver,
          data: {
            stockId: id
          },
          cb: res => {
            if (res.data.result) {
              this.purchaseList = res.data.data
              let goodsData = res.data.data.replenishStockGoodsVOList
              goodsData.map(item => {
                item.stockGoodsCount = item.stockGoodsCount ? item.stockGoodsCount : item.replenishStockNum
                item.goodsName = item.quotationGoodsVO.goodsName
                item.typeModel = item.quotationGoodsVO.typeModel
                item.brandName = item.quotationGoodsVO.brandName
                item.unit = item.quotationGoodsVO.unit
              })
              this.dataTable = goodsData
              if (!this.$Utils.getPageElement(this.$Consts.PERMISSION.replenishStockMoney.code)) {
                let _purchaseData = []
                this.purchaseData.forEach((item, index) => {
                  if (item.prop !== 'sumGoodsPrice') {
                    _purchaseData.push(item)
                  }
                })
                this.purchaseData = _purchaseData

                let _dataHeader = []
                this.dataHeader.forEach((item, index) => {
                  if (item.prop !== 'unitGoodsPrice') {
                    _dataHeader.push(item)
                  }
                })
                this.dataHeader = _dataHeader
              }
            }
          }
        })
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      stockGoodsJsonDataFn (data) {
        let stockGoodsJsonData = []
        data.map(item => {
          if (item.stockGoodsCount) {
            stockGoodsJsonData.push({stockGoodsId: item.id, stockGoodsCount: item.stockGoodsCount})
          }
        })
        return JSON.stringify(stockGoodsJsonData)
      },
      okForm (res) {
        res.dataSource = 3
        if (this.selection.length) {
          this.$confirm('确定要保存吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.dataBut[0].disabled = true
            res.stockId = this.idStock
            res.stockGoodsJson = this.stockGoodsJsonDataFn(this.selection)
            this.$Ajax.post({
              url: this.$Api.sale.createStockDeliver,
              data: res,
              cb: res => {
                this.dataBut[0].disabled = false
                this.jumpPage('procurementStockList')
              }
            })
          }).catch(() => {
            this.dataBut[0].disabled = false
          })
        } else {
          this.dataBut[0].disabled = false
          this.$message('请选择商品')
        }
      }
    }
  }
</script>
<style>
  .contract_title {
    display: inline-block;
    padding: 10px 2px;
    border-bottom: 2px solid #1577fe;
    color: #1577fe;
  }

  .purchase_list > .v_list_li {
    width: 33% !important;
    float: left
  }

  .mr_b10 {
    margin-bottom: 10px;
  }

  .dataBut {
    margin-left: 100px;
    margin-top: 50px
  }

  table {
    width: 100%;
  }
</style>
