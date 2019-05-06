<template>
  <div>
    <div>新增供应验收单</div>
    <br>
    <el-button type="primary" plain @click="toSelect">{{txt_warehouse}}</el-button>
    <br><br>
    <table-list :data-header="TableDataHeader" :url="DataUrl"
                @get-table-data="getTableData"
                :params="page"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="outgoingNum">
        <el-input v-model="scope.row.outgoingNum" type="number" min="0"></el-input>
      </template>
    </table-list>
    <br>
    <div class="text_center">
      <el-button plain @click="returnList">返回列表</el-button>
      <el-button type="primary" plain @click="toSubmit">提交</el-button>
    </div>

    <v-dialog :dialog="addAreaDialog">
      <form-group :data="addAreaDialogData" :custom=true :clear=true>
        <template slot-scope="scope" slot="searchData">
          <v-search :data="searchAddAreaData" @on-click="searchAddAreaClick"></v-search>
        </template>
        <template slot-scope="scope" slot="selectedAddArea">
          <table-list :data-header="addAreaHeader" :url="addAreaTableUrl" :params="addAreaPage" @get-table-data="getTableAddAreaData" :refs="tableRefsAddArea">
            <template slot-scope="scope" slot="operation">
              <tab-but :data="addAreaAddBut" @add-push="addAreaAddData(scope.row)"></tab-but>
            </template>
          </table-list>
          <v-page :data="addAreaPage" :dataArr="[addAreaDataSearch]"></v-page>
        </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        txt_warehouse: '选择出货仓库',
        orderCode: 0,
        warehouseId: -1,
        TableDataHeader: [
          {label: '商品名称', prop: 'goodsName'},
          {label: '商品编码', prop: 'good_code'},
          {label: '规格型号', prop: 'typeModel'},
          {label: '品牌', prop: 'brandName'},
          {label: '单位', prop: 'unit'},
          {label: '采购数量', prop: 'goodsCount'},
          // {label: '其他要求', prop: 'remark'},
          {label: '销售价格', prop: 'unitPrice'},
          {label: '金额', prop: 'price'},
          {label: '已出库数量', prop: 'alreadyStockNum'},
          {label: '出库数量', prop: 'outgoingNum', slot: true, width: '200px'}
        ],
        DataUrl: this.$Api.leaveStorage.createApplicaFormData,
        page: {},
        tablePerformance: 'tab_library_add',
        addAreaDialog: {show: false, title: '从商品库配货'},
        addAreaDialogData: {from: [{prop: 'searchData', custom: true}, {prop: 'selectedAddArea', custom: true}]},
        searchAddAreaData: [
          {key: 'name', label: '仓库名称：', value: '', type: 'text'},
          {
            key: 'type',
            label: '仓库类型：',
            value: '',
            select: [
              {value: 1, label: '前置'},
              {value: 2, label: '区域'}
            ]
          }
        ],
        addAreaHeader: [{prop: 'warehouseName', label: '名称'}, {prop: 'warehouseType', label: '类型'}, {prop: 'warehouseAddress', label: '地址'}, {prop: 'operation', label: '操作', slot: true}],
        addAreaTableUrl: this.$Api.leaveStorage.findWarehouseListByVO,
        addAreaPage: {totalNum: 0, currentPage: 1, offset: 0, refs: 'tab_dialog_list'},
        tableRefsAddArea: 'tab_dialog_list',
        addAreaDataSearch: {},
        addAreaAddBut: [{text: '选择', key: 'add-push', type: 'text'}],
        tbData: []
      }
    },
    created () {
      this.page.orderId = this.$route.params.id
      this.orderCode = this.$route.params.orderCode
      this.sign = this.$route.params.sign
    },
    methods: {
      toSelect () {
        this.pageUpdateTable([this.addAreaDataSearch, this.addAreaPage], this.tableRefsAddArea, this)
        this.$bus.emit('form-clear')
        this.searchAddAreaData.map(item => {
          item.value = ''
        })
        this.addAreaDialog.show = true
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
        data.data.rows.map(item => {
          if (item.remark === null) {
            item.remark = '-'
          }
        })
        this.tbData = data.data.rows
      },
      returnList () {
        if (this.sign === '1') {
          this.$router.push({name: 'saleOrder'})
        } else {
          this.$router.push({name: 'orderNewDetail'})
        }
      },
      toSubmit () {
        let flag = false
        let num = 0
        let length = this.tbData.length
        this.tbData.map(item => {
          if (item.outgoingNum <= 0) {
            num++
          }
          let saveValue = item.goodsCount - item.alreadyStockNum
          if (Number(item.outgoingNum) > saveValue.toFixed(2)) {
            this.openAlert('本次出库的数量不能大于剩余出库数量,剩余出库数量的计算规则是：剩余出库数量=采购数量-已出库数量')
            flag = true
          }
        })
        if (num >= length) {
          this.openAlert('本次出库的物资数量不能全部为0！')
          flag = true
        }
        if (this.warehouseId === -1) {
          this.openAlert('请选择出库仓库！')
          flag = true
        }
        if (flag) {
          return
        }
        let arr = []
        this.tbData.map(item => {
          if (item.outgoingNum > 0) {
            arr.push({orderFromGoodsId: item.id, applicaNum: item.outgoingNum})
          }
        })
        let data = {
          orderId: this.page.orderId,
          warehouseId: this.warehouseId,
          orderCode: this.orderCode,
          applicaFormGoodsStr: JSON.stringify(arr)
        }
        this.$Ajax.post({
          url: this.$Api.leaveStorage.addApplicaForm,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message('创建成功！')
              this.$router.push({name: 'libraryView', params: {id: this.page.orderId}})
            }
          }
        })
      },
      openAlert (msg) {
        this.$alert(msg, '温馨提示', {
          confirmButtonText: '确定'
        })
      },
      addAreaAddData (val) {
        this.txt_warehouse = val.warehouseName
        this.warehouseId = val.id
        this.addAreaDialog.show = false
      },
      searchAddAreaClick (res) {
        this.addAreaDataSearch = res
        if (JSON.stringify(this.addAreaDataSearch) === '{}') {
          this.addAreaPage.offset = 0
          this.addAreaPage.currentPage = 1
        }
        this.pageUpdateTable([this.addAreaDataSearch, this.addAreaPage], this.tableRefsAddArea, this)
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      getTableAddAreaData (data) {
        this.addAreaPage.totalNum = data.data.total
      }
    }
  }
</script>

<style scoped>
  .text_center{ text-align: center;}
</style>
