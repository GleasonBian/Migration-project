<template>
  <div>
    <table-list :data-header="dataHeader" :data-static="dataLs" :static="tableStatic">
      <!--<template v-slot:singleChoice="scope">-->
      <!--<el-radio v-model="radio" :label="scope.index" disabled v-if="scope.row.quotationStateCode == 0 || scope.row.quotationStateCode == 2"><span></span></el-radio>-->
      <!--<el-radio v-else v-model="radio" :label="scope.index"><span></span></el-radio>-->
      <!--</template>-->
      <template v-slot:operation="scope">
        <!--<el-input v-model="scope.row.reason" @change="singleChange(scope.index, scope.row)" :disabled="scope.row.quotationStateCode == 0 || scope.row.quotationStateCode == 2"></el-input>-->
        <el-button type="text" @click="toShortlisted(scope.row)" v-show="scope.row.approveState !== '已中标'">入围
        </el-button>
        <!-- <el-button type="text" disabled v-show="scope.row.approveState === '已中标' && scope.row.quotationStateCode !== 1">入围</el-button> -->
        <el-button type="text"
                   v-if="scope.row.approveState === '已中标' && (scope.row.stateCode !== 50 && scope.row.stateCode !== 70 && scope.row.stateCode !== 80 && scope.row.stateCode !== 90 && scope.row.stateCode !== 110 && scope.row.stateCode !== 120 && scope.row.stateCode !== 130)"
                   @click="toCancel(scope.row)">取消入围
        </el-button>
        <el-button type="text"
                   v-if="scope.row.approveState === '已中标' && (scope.row.stateCode === 50 || scope.row.stateCode === 70 || scope.row.stateCode === 80 || scope.row.stateCode === 90 || scope.row.stateCode === 110 || scope.row.stateCode === 120 || scope.row.stateCode === 130)"
                   disabled>取消入围
        </el-button>
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
          {prop: 'companyName', label: '供应商名称'},
          {prop: 'supplierBrandName', label: '报价品牌'},
          {prop: 'unitGoodsPrice', label: '单价'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'totalGoodsPrice', label: '合计'},
          {prop: 'supplierExpectedArrivalTime', label: '预计到货时间'},
          {prop: 'remark', label: '说明'},
          {prop: 'approveState', label: '是否中标'},
//          {prop: 'quotationStateStr', label: '状态'},
          {prop: 'operation', label: '操作', slot: true}
        ],
        dataStatic: []
      }
    },
    created () {
    },
    methods: {
      toCancel (row) {
        this.$confirm('确定要取消该入围商家？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$Ajax.post({
            url: this.$Api.order.cancel,
            data: {
              quotationGoodsId: row.id
            },
            cb: res => {
              if (res.status === 200) {
                if (res.data.result) {
                  this.$message('取消成功！')
                  this.$emit('refresh-data')
                } else {
                  this.$message(res.data.message)
                }
              }
            }
          })
        }).catch(() => {
        })
      },
      toShortlisted (row) {
        if (row.unitGoodsPrice <= 0) {
          this.$message.error('不能入围！')
        } else {
          this.$confirm('确定要入围？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.$Api.order.winTheBidGoods,
              data: {
                quotationGoodsId: row.id
              },
              cb: res => {
                if (res.status === 200) {
                  if (res.data.result) {
                    this.$message('设置成功！')
                    this.$emit('refresh-data')
                  } else {
                    this.$message(res.data.message)
                  }
                }
              }
            })
          }).catch(() => {
          })
        }
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
//      radio: function () {
//        let obj = {}
//        obj.quotationGoodsId = this.dataLs[this.radio].id
//        obj.reason = this.dataLs[this.radio].reason
//        this.$emit('on-item-select', this.id, obj)
//      }
    }
  }
</script>
<style scoped>
</style>
