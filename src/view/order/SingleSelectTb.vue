<template>
    <div>
      <table-list :data-header="dataHeader" :data-static="dataLs"  :static="tableStatic">
        <!--<template slot-scope="scope" slot="singleChoice">-->
          <!--<el-radio v-model="radio" :label="scope.index" disabled v-if="scope.row.quotationStateCode == 0 || scope.row.quotationStateCode == 2"><span></span></el-radio>-->
          <!--<el-radio v-else v-model="radio" :label="scope.index"><span></span></el-radio>-->
        <!--</template>-->
        <template slot-scope="scope" slot="operation">
          <!--<el-input v-model="scope.row.reason" @change="singleChange(scope.index, scope.row)" :disabled="scope.row.quotationStateCode == 0 || scope.row.quotationStateCode == 2"></el-input>-->
          <el-button type="text" @click="toShortlisted(scope.row)">入围</el-button>
        </template>
      </table-list>
    </div>
</template>


<script>
  export default {
    props: {
      id: {
        type: Number,
        default: ''
      },
      dataLs: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        radio: '',
        tableStatic: true,
        dataHeader: [
          { prop: 'companyName', label: '供应商名称' },
          { prop: 'supplierBrandName', label: '报价品牌' },
          { prop: 'unitGoodsPrice', label: '单价' },
          { prop: 'taxPoint', label: '税点' },
          { prop: 'totalGoodsPrice', label: '合计' },
          { prop: 'supplierExpectedArrivalTime', label: '预计到货时间' },
          { prop: 'supplierRemark', label: '说明' },
          { prop: 'quotationStateStr', label: '状态' },
          { prop: 'operation', label: '操作', slot: true }
        ],
        dataStatic: []
      }
    },
    created () {
      this.radio = 0
    },
    methods: {
      toShortlisted (row) {
        if (row.unitGoodsPrice <= 0) {
          this.$message('不能入围！')
          return
        }
        this.$Ajax.post({
          url: this.$Api.order.winTheBidGoods,
          data: {
            quotationGoodsId: row.id
          },
          cb: res => {
            if (res.status === 200) {
              if (res.data.result) {
                this.$message('设置成功！')
              } else {
                this.$message(res.data.message)
              }
            }
          }
        })
      },
      singleChange (index, row) {
        if (index === this.radio) {
          let obj = {}
          obj.quotationGoodsId = row.id
          obj.reason = row.reason
          this.$emit('on-item-select', this.id, obj)
        }
      }
    },
    watch: {
      radio: function () {
        let obj = {}
        obj.quotationGoodsId = this.dataLs[this.radio].id
        obj.reason = this.dataLs[this.radio].reason
        this.$emit('on-item-select', this.id, obj)
      }
    }
  }
</script>
<style scoped>
</style>
