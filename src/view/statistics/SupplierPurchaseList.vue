<template>
  <div>
    <div>
      <v-search :data="searchData" @on-click="search"></v-search>
      <tab-but :data="tabButData" @on-export="onExport"></tab-but>
      <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"
                  :refs="tableRef">
      </table-list>
      <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData: [
          {
            label: '供应商名称：',
            value: '',
            placeholder: '请输入供应商名称',
            key: 'winSupplierName'
          },
          {
            label: '商品名称：',
            value: '',
            placeholder: '请输入商品名称',
            key: 'goodsName'
          },
          {
            label: '规格型号：',
            value: '',
            placeholder: '请输入规格型号',
            key: 'typeModel'
          },
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          },
          {
            label: '创建时间',
            value: '',
            key: 'startTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }
        ],
        dataSearch: {},
        tabButData: [{
          text: '导出',
          key: 'on-export'
        }],
        dataHeader: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'goodsCount', label: '数量'},
          {prop: 'unitPrice', label: '采购价', sortable: true},
          {prop: 'totalGoodsPrice', label: '采购金额'},
          {prop: 'purchasePlanNumber', label: '采购单号'},
          {prop: 'projectName', label: '所属梁场'},
          {prop: 'createTimeStr', label: '采购时间'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'winSupplierName', label: '中标供应商'},
          {prop: 'contactName', label: '联系人'},
          {prop: 'contactPhone', label: '电话'}

        ],
        tableRef: 'table_ref_supplier_purchase',
        tabUrl: this.$Api.statistics.listSupplierPurchase,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'table_ref_supplier_purchase'
        }
      }
    },
    computed: {},
    created () {
      this.getBeamField()
    },
    methods: {
      ajaxPost (url, cb) {
        this.$Ajax.post({
          url: url,
          data: {},
          cb: cb
        })
      },
      getBeamField () {
        this.ajaxPost(this.$Api.orderManger.getProjectList, (res) => {
          if (res.data.result) {
            let arrBeamData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(arrBeamData)
              }
            })
          }
        })
      },
      fliterSelectBeam (res) {
        let arrBeam = []
        if (res.length) {
          res.map(item => {
            arrBeam.push({label: item.projectName, value: item.id})
          })
        }
        return arrBeam
      },
      pageUpdateTable (data, ref) {
        this.$Utils.pageUpdateTable(data, ref, this)
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.pageUpdateTable([this.dataSearch, this.page], this.tableRef)
      },
      onExport () {
        let params = {}
        let str = ''
        this.searchData.map(item => {
          if (item.key === 'winSupplierName') {
            if (item.value) {
              params.winSupplierName = item.value
            }
          }
          if (item.key === 'goodsName') {
            if (item.value) {
              params.goodsName = item.value
            }
          }
          if (item.key === 'typeModel') {
            if (item.value) {
              params.typeModel = item.value
            }
          }
          if (item.key === 'projectId') {
            if (item.value) {
              params.projectId = item.value
            }
          }
          if (item.key === 'startTime') {
            if (item.value) {
              params.startTime = item.value
            }
          }
        })
        if (params.winSupplierName) {
          str += '?winSupplierName=' + params.winSupplierName
        } else {
          str += '?winSupplierName='
        }
        if (params.goodsName) {
          str += '&goodsName=' + params.goodsName
        } else {
          str += '&goodsName='
        }
        if (params.typeModel) {
          str += '&typeModel=' + params.typeModel
        } else {
          str += '&typeModel='
        }
        if (params.projectId) {
          str += '&projectId=' + params.projectId
        } else {
          str += '&projectId='
        }
        if (params.startTime) {
          str += '&startTime=' + this.dataSearch.startTime + '&endTime=' + this.dataSearch.endTime
        } else {
          str += '&startTime=&endTime='
        }
        location.href = this.$Api.statistics.gtPurchasePlanGoodsRemarkList + str
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
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
  }

  .handle:hover {
    text-decoration: underline;
  }

  .handle.text_red {
    color: #ff0000
  }
</style>
