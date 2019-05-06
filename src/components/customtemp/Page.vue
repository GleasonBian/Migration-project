<template>
  <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="data.currentPage"
          :page-sizes="data.pageSizes"
          :page-size="data.pageSize"
          :layout="layout"
          :total="data.totalNum">
  </el-pagination>
</template>

<script>
  export default {
    name: 'v-page',
    data () {
      return {
        defaultPageSizes: [10, 20, 50, 100],
        defaultPageSize: 10
      }
    },
    props: {
      data: {
        type: Object,
        default: function () {
          return {}
        }
      },
      layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
      },
      dataArr: Array,
      custom: Boolean
    },
    created () {
      if (!this.data.pageSizes) {
        this.data.pageSizes = this.defaultPageSizes
      }
      if (!this.data.pageSize) {
        this.data.pageSize = this.defaultPageSize
      }
    },
    methods: {
      handleSizeChange (val) {
        this.data.currentPage = 1
        this.data.pageSize = val
        this._getUpdate()
      },
      handleCurrentChange (val) {
        this.data.currentPage = val
        this.data.offset = (val - 1) * (this.data.pageSize === undefined ? 10 : this.data.pageSize)
        this._getUpdate()
      },
      filterData (arr) {
        this.$Utils.pageUpdateTable(arr, this.data.refs, this)
      },
      _getUpdate () {
        if (this.custom) {
          this.$emit('change-page')
        } else {
          let arr = [this.data].concat(this.dataArr)
          this.filterData(arr)
        }
      }
    }
  }
</script>

<style scoped>

</style>
