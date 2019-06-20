<template>
  <div class="">
    <v-list :data="demandDetaildData" :data-list="demandDetailList" :list-style="listStyle">
      <template v-slot:pushState="scope">
        <span v-show="!demandDetailList.pushState">失败</span>
        <span v-show="demandDetailList.pushState === 1">成功</span>
        <span v-show="demandDetailList.pushState === 2">推送中</span>
      </template>
    </v-list>
    <table-list :data-header="dataHeader" :dataStatic="goodsDetailList" :static="true" @selection-change="selectionChange">
      <!--<template v-slot:operation="scope">-->
        <!--<span class="handle" @click="editGoods(scope.row)">编辑</span>-->
      <!--</template>-->
    </table-list>
    <div style="text-align: center;margin-top: 20px;">
      <el-button  v-show="demandDetailList.pushState == '1'" type="primary" @click="toOrderDetails">查看订单</el-button>
      <el-button type="primary" @click="pushGoods">推送商品</el-button>
    </div>
    <!--编辑物资弹出框-->
    <v-dialog :dialog="editDialog">
      <form-group :custom=true :data="editData" :data-but="editBut"
                  @on-cancel="cancel" @on-ok="saveEdit"></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    components: {},
    data () {
      return {
        listStyle: {
          listwidth: '120px',
          class: 'purchase_list'
        },
        demandDetailList: {},
        demandDetaildData: [
          {prop: 'orderNumber', label: '订单编号'},
          {prop: 'lubanOrderNo', label: '鲁班订单'},
          {prop: 'pushState', label: '推送状态', slot: true},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'orderAmount', label: '订单金额'},
          {prop: 'createUserName', label: '下单人名称'},
          {prop: 'lubanOrganization', label: '所属组织'},
          {prop: 'userPhone', label: '下单账号'},
          {prop: 'lubanNumber', label: '鲁班账号'},
          {prop: 'userName', label: '推送人'},
          {prop: 'createTimeStr', label: '推送时间'}
        ],
        dataHeader: [],
        dataHeader1: [
          {type: 'selection'},
          {
            prop: 'code',
            label: '采购单号'
          }, {
            prop: 'projectName',
            label: '梁场名称'
          }, {
            prop: 'goodsCode',
            label: '商品编号'
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
            prop: 'goodsCount',
            label: '采购数量'
          }, {
            prop: 'unitPrice',
            label: '价格'
          }, {
            prop: 'subtotal',
            label: '金额'
          }
        ],
        dataHeader2: [
          {type: 'selection'},
          {
            prop: 'code',
            label: '采购单号'
          }, {
            prop: 'projectName',
            label: '梁场名称'
          }, {
            prop: 'goodsCode',
            label: '商品编号'
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
            prop: 'goodsCount',
            label: '采购数量'
          }, {
            prop: 'unitPrice',
            label: '价格'
          }, {
            prop: 'subtotal',
            label: '金额'
          }
//          , {
//            prop: 'operation',
//            label: '操作',
//            slot: false
//          }
        ],
        goodsDetailList: [],
        orderId: '',
        editDialog: {
          show: false,
          title: '填写运单号',
          width: '600px'
        },
        editData: {
          from: [{
            prop: 'goodsName',
            label: '商品名称：',
            value: '',
            labelWidth: '120px'
          }, {
            prop: 'model',
            label: '规格型号：',
            value: '',
            placeholder: '',
            labelWidth: '120px'
          }, {
            prop: 'brand',
            label: '品牌：',
            value: '',
            placeholder: '',
            labelWidth: '120px'
          }, {
            prop: 'unit',
            label: '单位：',
            value: '',
            placeholder: '',
            labelWidth: '120px'
          }, {
            prop: 'count',
            label: '采购数量：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写采购数量'
          }, {
            prop: 'recommendGoodsPrice',
            label: '价格：',
            type: 'number',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写价格'
          }, {
            prop: 'updateReason',
            label: '修改原因：',
            value: '',
            labelWidth: '120px',
            placeholder: '请填写修改原因',
            required: true,
            rules: [{required: true, message: '请填写修改原因', trigger: 'blur,change'}]
          }, {
            prop: 'id',
            label: 'id：',
            value: '',
            display: 'none',
            placeholder: '',
            labelWidth: '120px'
          }]
        },
        editBut: [{
          type: 'text',
          text: '取消',
          key: 'cancel'
        }, {
          type: 'primary',
          text: '确定',
          key: 'ok'
        }],
        ids: '',
        listPurchaseGoodsId: '',
        selection: [],
        selectionIds: []
      }
    },
    created () {
      this.orderId = this.$route.params.id
      this.getData(this.orderId)
      if (this.$Utils.getPageElement(this.$Consts.PERMISSION.editGoodsPlanned.code)) {
        this.dataHeader = this.dataHeader2
      } else {
        this.dataHeader = this.dataHeader1
      }
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
            if (res.data.result) {
              this.demandDetailList = res.data.data
              this.goodsDetailList = res.data.data.orderFromGoodsList
            }
          }
        })
      },
      toOrderDetails () {
        let routeData = this.$router.resolve({
          name: 'orderNewDetail',
          params: {id: this.orderId}
        })
        window.open(routeData.href, '_blank')
      },
      selectionChange (selection) {
        this.selection = selection
        this.selectionIds = this.selection.map(item => {
          return item.listPurchaseGoodsId
        })
      },
      pushGoods () {
        if (this.selectionIds && this.selectionIds.length > 0) {
          this.$confirm('确定要推送商品吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let params = {}
            params.listPurchaseIds = this.selectionIds
            this.$Ajax.post({
              url: this.$Api.sale.pushSelectGoods,
              data: {
                json: JSON.stringify(params)
              },
              cb: (res) => {
                if (res.data.result) {
                  this.$message('推送商品成功')
                  this.getData(this.orderId)
                }
              }
            })
          }).catch(() => {
          })
        } else {
          this.$message('请选择商品')
        }
      },
      editGoods (row) {
        this.editData.from[0].value = row.goodsName
        this.editData.from[1].value = row.typeModel
        this.editData.from[2].value = row.brandName
        this.editData.from[3].value = row.unit
        this.editData.from[4].value = row.goodsCount
        this.editData.from[5].value = row.unitPrice
        this.editDialog.show = true
        this.ids = row.id
        this.listPurchaseGoodsId = row.listPurchaseGoodsId
      },
      closeDialog () {
        this.editDialog.show = false
      },
      cancel () {
        this.closeDialog()
      },
      saveEdit (params) {
        params.id = this.listPurchaseGoodsId
        params.orderGoodsId = this.ids
        params.isPrepare = 1
        this.$Ajax.post({
          url: this.$Api.order.updatePurchaseGoodsById,
          data: params,
          cb: res => {
            this.$message(res.data.data)
            this.closeDialog()
            this.getData(this.orderId)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .handle {
    font-size: 12px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin-right: 15px;
  }

  .handle:hover {
    text-decoration: underline;
  }

  .handle.text_red {
    color: #ff0000
  }
</style>
<style>
  .ColumnHidden {
    visibility: hidden
  }

  .purchase_list > .v_list_li {
    width: 33% !important;
    float: left
  }

  .v_list_cont {
    width: 100%
  }
</style>
