<template>
  <div>
    <v-search :data="Searchdata"></v-search>

    <TabBut  :data="TabButData"></TabBut>
    <table-list :dataHeader="TableDataHeader"  :url="DataUrl"  @selection-change="selectionChange">
      <template v-slot:view="scope">
        <TabBut :data="ViewTabButData"></TabBut>
      </template>
    </table-list>
    <v-page :totalNum="page.totalNum" :pageSizes="page.pageSizes" @handleSizeChange="handleSizeChange"></v-page>
    <v-dialog :dialog="goodsOffDialog" :dialogFooter="goodsOffFooterDialog" @on-ok="goodsOffOk">
      <span>确认要下架所选中商品吗？</span>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        DataUrl: this.$Api.goods.listData,
        selection: [],
        goodsOffDialog: {
          width: '30%',
          show: false,
          title: '提示'
        },
        goodsOffFooterDialog: [
          {text: '确定', key: 'ok', type: 'primary'},
          {text: '取消', key: 'cancel'}
        ],
        ViewTabButData: [
          {
            text: '预览',
            other: () => {
              this.$router.push({name: 'publishList'})
            }
          }
        ],
        Searchdata: [
          {label: '商品名称', value: '', placeholder: '请输入'},
          {label: '品牌', value: '', placeholder: '请输入'},
          {label: '类目', value: '', placeholder: '请输入'},
          {label: '商品编号', value: '', placeholder: '请输入'},
          {label: '创建时间',
            value: '',
            placeholder: '请输入',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }}
        ],
        TabButData: [
          {
            text: '下架',
            other: () => {
              if (this.selection.length === 0) {
                this.$message({message: '请先选择商品'})
              } else {
                this.goodsOffDialog.show = true
              }
            }
          },
          {
            text: '删除',
            key: 'del',
            filterkey: 'id',
            filterName: 'ids',
            url: '',
            selection: true
          }
        ],
        page: {
          totalNum: 0,
          offsetNum: 0,
          pagesize: 10
        },
        TableDataHeader: [
          {type: 'selection'},
          {label: '序号', type: 'index'},
          {label: '商品条形码', prop: 'barCode'},
          {label: '商品编号', prop: 'goodsCode'},
          {label: '商品名称', prop: 'goodsStatus'},
          {label: '类目', prop: 'className'},
          {label: '品牌', prop: 'brandName'},
          {label: '世界高铁网价', prop: 'sjgtwPrice'},
          {label: '鲁班价', prop: 'lubanPrice'},
          {label: '状态', prop: 'goodsStatusStr'},
          {label: '创建时间', prop: 'createTimeStr'},
          {label: '操作', prop: 'view', slot: true}
        ]
      }
    },
    methods: {
      goodsOffOk () {
        let ids = []
        this.selection.map(function (sele) {
          ids.push(sele.id)
        })
        let params = {ids: ids, type: 0}
        this.httpGoodsOff(params)
      },
      selectionChange (selection) {
        this.selection = selection
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      handleSizeChange (data, obj) {
        this.$bus.emit('get-table-data', obj)
        this.page.offsetNum = data.offset
        this.page.pagesize = data.limit
      },
      httpGoodsOff (params) {
        let self = this
        this.$Ajax.post({
          url: this.$Api.goods.putawayOrSoldOut,
          data: params,
          cb: res => {
            if (res.status === 200) {
              self.$message({message: '商品下架成功', duration: 1000})
              this.goodsOffDialog.show = false
              this.$bus.emit('get-table-data', {})
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
