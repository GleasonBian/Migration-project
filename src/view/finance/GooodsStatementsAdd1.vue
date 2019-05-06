<template>
  <div class="p_d_detail_lv">
    <div class="text_center">
      <el-button plain @click="returnList">返回</el-button>
      <el-button type="primary" plain @click="toSave">保存</el-button>
      <el-button type="primary" plain @click="toSubmit">提交</el-button>
    </div>
    <v-dialog :dialog="dialogCycle">
      <v-search :data="searchDataPur" @on-click="searchPur">
        <template slot-scope="scope" slot="settlementType">
          <el-radio-group v-model="radioType">
            <el-radio :label="2">现结付款</el-radio>
            <el-radio :label="1">账期付款</el-radio>
          </el-radio-group>
        </template>
      </v-search>
      <br>
      <table-list :data-header="pDataHeader" :url="pTabUrl" :params="pagePur" @get-table-data="getTableDataPur"
                  :refs="refsPur">
        <template slot-scope="scope" slot="handle">
          <a class="add_item" @click="addPurchaseItem(scope.row)">选择</a>
        </template>
      </table-list>
      <v-page :data="pagePur" :dataArr="[dataSearchPur]"></v-page>
      <br>
      <div class="text_center">
        <el-button @click="toReturn">取消</el-button>
        <el-button type="primary" @click="addApplyOrder">下一步</el-button>
      </div>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        countTotal: 0,
        priceTotal: 0,
        radioType: 2,

        Searchdata: [
          {label: '采购单号', value: '', key: 'number'},
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          },
          {
            label: '创建日期',
            value: '',
            key: 'beginTime',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }
        ],
        page: {
          refs: 'tab_finance_add',
          settlementId: -1
        },
        tablePerformance: 'tab_finance_add',
        dataSearch: {},
        purchaseDeliverData: [
          {prop: 'number', label: '单号'},
          {prop: 'deliveryTimeStr', label: '收货时间'},
          {prop: 'supplierName', label: '供应商'},
          {prop: 'stockDeliverAmount', label: '应付金额'}
        ],
        listStyle: {
          listwidth: '100px',
          class: 'purchase_list'
        },
        dataHeader: [
          {prop: 'goodsPicture', label: '图片', slot: true},
          {prop: 'size', label: '规格', slot: true},
          {prop: 'unit', label: '单位', slot: true},
          {prop: 'subtotal', label: '小计', slot: true},
          {prop: 'view', label: '查看', slot: true}
        ],
        tabBut: [{text: '查看详情', key: 'add'}],
        tb_size: [
          {prop: 'goodsName', label: '名称'},
          {prop: 'typeModel', label: '规格型号'}
        ],
        tb_unit: [
          {prop: 'unit', label: '单位'},
          {prop: 'stockCount', label: '数量'},
          {prop: 'unitPrice', label: '价格'}
        ],
        tb_subtotal: [
          {prop: 'totalPrice', label: '小计'}
        ],
        selection: [],
        startTime: '',
        endTime: '',
        searchDataPur: [
          {
            key: 'settlementType',
            prop: 'settlementType',
            label: '结算类型',
            value: '',
            custom: true
          },
          {
            key: 'enterpriseName',
            label: '企业名称',
            value: ''
          }
        ],
        pDataHeader: [
          {prop: 'enterpriseId', label: '序号'},
          {prop: 'enterpriseName', label: '企业名称'},
          {prop: 'enterpriseArea', label: '企业地址'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        pTabUrl: this.$Api.order.loadEnterpriseData,
        pagePur: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'goods_add_table'
        },
        refsPur: 'goods_add_table',
        dataSearchPur: {},
        checked: false,
        activeNames: [],
        settlementData: []
      }
    },
    created () {
      this.addApplyOrder()
    },
    watch: {
      checked (val) {
        this.settlementData.map((item) => {
          item.stockDeliverVOS.map(tmp => {
            tmp.isCheck = val
          })
        })
      }
    },
    methods: {
      toReturn () {
        this.$router.push({name: 'gooodsStatements'})
      },
      addApplyOrder () {
        console.log(this.radioType)
//        let params = param ? Object.assign(param) : {}
//        params.settlementId = this.page.settlementId
//        this.$Ajax.post({
//          url: this.DataUrl,
//          data: params,
//          cb: res => {
//            if (res.data.rows) {
//              res.data.rows.map((item) => {
//                item.stockDeliverVOS.map(tmp => {
//                  tmp.isCheck = false
//                })
//              })
//              this.settlementData = res.data.rows
//              this.settlementData.map((item, index) => {
//                this.activeNames.push(index)
//              })
//            }
//          }
//        })
      },
      addPurchaseItem (row) {
        this.searchDataPur[1].value = row.enterpriseName
      },
      getTableDataPur (data) {
        this.pagePur.totalNum = data.data.total
      },
      searchPur (res) {
        if (res.endTime) {
          res.deliverEndTime = res.endTime
          this.endTime = res.deliverEndTime
        } else {
          this.endTime = ''
        }
        if (res.deliverStartTime) {
          this.startTime = res.deliverStartTime
        } else {
          this.startTime = ''
        }
        this.dataSearchPur = res
        if (JSON.stringify(this.dataSearchPur) === '{}') {
          this.pagePur.offset = 0
          this.pagePur.currentPage = 1
        }
        this.$Utils.pageUpdateTable([this.dataSearchPur, this.pagePur], this.refsPur, this)
      },
      saveCycleDialog (res) {
        if (res.deliverStartTime !== undefined) {
          this.Searchdata[2].value = [new Date(res.deliverStartTime), new Date(res.endTime)]
          this.cancelCycleDialog()
        }
      },
      cancelCycleDialog () {
        this.dialogCycle.show = false
        this.$bus.emit('form-clear')
      },
      toSave () {
        this.toAjax(3)
      },
      toSubmit () {
        this.toAjax(1)
      },
      getTime (time) {
        let d = new Date(time)
        let datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        return datetime
      },
      toAjax (code) {
        if (this.Searchdata[2].value.length === 0) {
          this.$message('请选择结算周期！')
          this.dialogCycle.show = true
          return
        }
        this.Searchdata[2].value.map((item, index) => {
          if (index === 0) {
            this.startTime = this.getTime(item)
          } else {
            this.endTime = this.getTime(item)
          }
        })
        let ids = []
        this.settlementData.map((item) => {
          item.stockDeliverVOS.map(tmp => {
            if (tmp.isCheck) {
              ids.push(tmp.id)
            }
          })
        })
        if (ids.length === 0) {
          this.$message('请选择订单')
          return false
        }
        let idsString = ''
        idsString = ids.join(',')
        let data = {
          ids: idsString,
          settlementStateCode: code,
          settlementCycleStartTimeStr: this.startTime,
          settlementCycleEndTimeStr: this.endTime,
          settlementId: this.page.settlementId
        }
        let msg = ''
        if (code === 3) {
          msg = '保存'
        } else {
          msg = '提交'
        }
        this.$Ajax.post({
          url: this.$Api.finance.toAddSettlement,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message(msg + '成功！')
              this.returnList()
            }
          }
        })
      },
      returnList () {
        this.$router.push({name: 'gooodsStatements'})
      },
      toView (item) {
        this.$router.push({name: 'gooodsStatementsViewDdetails', params: {id: item}})
      },

      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      selectionChange (selection) {
        this.selection = selection
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
        this.getList(data.data.rows)
      },
      getList (rows) {
        rows.map(item => {
//          item.stockDeliverAmount = '￥' + item.stockDeliverAmount
          if (item.stockDeliverGoodsVOList === null) {
            item.stockDeliverGoodsVOList = []
          }
          item.stockDeliverGoodsVOList.map(vo => {
            if (vo.goodsPicture !== null) {
              vo.goodsPicture = this.$ImgPath.imgApi.imgApi + '/' + vo.goodsPicture
            } else {
              vo.goodsPicture = ''
            }
            vo.size = {
              goodsName: vo.goodsName,
              typeModel: vo.typeModel
            }
            vo.unit = {
              unit: vo.unit,
              stockCount: vo.stockCount,
              unitPrice: vo.unitPrice
            }
            vo.subtotal = {
              totalPrice: vo.totalPrice
            }
          })
          item.voList = item.stockDeliverGoodsVOList
          return item
        })
      }
    }
  }
</script>

<style scoped>
  .add_item {
    color: #008aff;
    cursor: pointer;
    font-size: 12px;
  }

  .add_item:hover {
    text-decoration: underline;
  }

  .txt_state {
    color: #fff;
    font-size: 13px;
    background: #D8190F;
    padding: 2px 16px;
  }

  .row_title {
    display: flex;
    justify-content: space-between;
  }

  .row_title div {
    width: 30%;
    padding-left: 1%;
  }

  .tab_text_select {
    display: flex;
    margin-bottom: 20px;
    height: 40px;
  }

  .tab_text_select_lef {
    width: 2%;
    border-left: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    border-top: solid 1px gainsboro;
    align-self: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tab_text_select_rig {
    flex: 1;
    font-size: 14px;
    display: flex;
    border: solid 1px gainsboro;
  }

  .tab_shop_con {
    display: flex;
  }

  .tab_shop_lef {
    flex: 1;
  }

  .tab_shop_lef_con {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 20px;
    border-left: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    border-right: solid 1px gainsboro;
  }

  .tab_shop_rig {
    width: 8%;
    text-align: center;
    border-right: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    padding-top: 20px;
  }

  .tab_shop_rig_1 {
    border-top: solid 1px gainsboro;
  }

  .tab_title_cel_price {
    color: red;
  }

  .tab_shop_con_img {
    width: 80px;
    height: 90px;
  }

  .tab_con {
    display: flex;
    font-size: 14px;
  }

  .tab_con_lef {
    width: 2%;
    align-self: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: solid 1px gainsboro;
    border-left: solid 1px gainsboro;
  }

  .tab_con_cen {
    flex: 1;
  }

  .tab_shop_rig {
    width: 8%;
    text-align: center;
    border-right: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    padding-top: 20px;
  }

  .tab_title_con_1 {
    border: solid 1px gainsboro;
  }

  .tab_title_con {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px 10px 20px;
    border-left: solid 1px gainsboro;
    border-bottom: solid 1px gainsboro;
    border-right: solid 1px gainsboro;
  }

  .handle {
    font-size: 14px;
    text-decoration: none;
  }

  .but {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
</style>
<style>
  .p_d_detail_lv .contract_title {
    display: inline-block;
    padding: 10px 2px;
    border-bottom: 2px solid #1577fe;
    color: #1577fe;
  }

  .p_d_detail_lv .purchase_list > .v_list_li {
    width: 25% !important;
    float: left
  }

  .p_d_detail_lv .mr_b10 {
    margin-bottom: 10px;
  }

  .p_d_detail_lv .btn_box {
    text-align: center;
    margin-bottom: 60px;
  }

  .p_d_detail_lv .btn_box .base_btn_group .el-button {
    padding: 10px 15px !important
  }

  .p_d_detail_lv .avatar-uploader .el-upload {
    border: none;
  }

  .p_d_detail_lv .el-dialog__body {
    padding-top: 10px;
  }

  .p_d_detail_lv .el-dialog__body .el-form-item {
    margin-bottom: 0;
  }

  .p_d_detail_lv .el-table__row img {
    width: 93px;
    height: 93px;
  }

  .tb_border {
    border: 1px solid #e6ebf5;
    padding: 8px;
  }

  .tb_border .el-row .el-col {
    min-height: 96px;
  }

  .text_center {
    text-align: center;
  }

  .p_d_detail_lv .btn_view {
    text-align: right;
    margin-top: -33px;
    position: relative;
  }

  .box_collapse .el-collapse-item__header {
    border-bottom-color: gainsboro !important;
    border-right: solid 1px gainsboro !important;
    border-left: solid 1px gainsboro !important;
  }

  .box_collapse .el-collapse-item__content {
    padding-bottom: 0;
  }
</style>

