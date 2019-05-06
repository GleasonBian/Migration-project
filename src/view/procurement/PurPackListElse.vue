<template>
  <div>
    <div class="title">按供应商查看</div>
    <div>
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <div>
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in dataList.quotationVOList" :key="index">
          <template slot="title">
            <div class="collapse_title">
              <div class="collapse_title_item" v-if="item.supplierManagerProviderVO">
                {{item.supplierManagerProviderVO.enterpriseName}}
              </div>
              <div class="collapse_title_item" v-if="item.supplierManagerProviderVO">
                {{item.supplierManagerProviderVO.contactName}}&nbsp; &nbsp;{{item.supplierManagerProviderVO.contactPhone}}
              </div>
              <div class="collapse_title_item">报价总额:{{item.totalGoodsPrice}}</div>
              <div class="collapse_title_item">报价情况:{{item.quotationGoodsComplete}}/{{item.quotationGoodsCount}}</div>
            </div>
          </template>
          <table-list :data-header="dataHeader" :data-static="item.quotationGoodsVOList" :static="tableStatic"
                      @selection-change="selectionChange">
          </table-list>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>


<script>
  export default {
    data () {
      return {
        radio: 0,
        id: '',
        data: [
          {prop: 'projectName', label: '下单梁场'},
          {prop: 'stateStr', label: '状态'},
          {prop: 'number', label: '采购计划单号'},
          {prop: 'buyUserName', label: '下单人'},
          {prop: 'buyLinkManPhone', label: '联系方式'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'expectedDeliveryTime', label: '期望到货时间'}
        ],
        dataList: {},
        listStyle: {
          class: ['pannel']
        },
        tableStatic: true,
        dataHeader: [
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '计量单位'},
          {prop: 'goodsCount', label: '采购数量'},
          {prop: 'supplierBrandName', label: '报价品牌'},
          {prop: 'unitGoodsPrice', label: '单价'},
          {prop: 'taxPoint', label: '税点'},
          {prop: 'totalGoodsPrice', label: '合计'},
          {prop: 'supplierExpectedArrivalTime', label: '预计到货时间'},
          {prop: 'supplierRemark', label: '说明'},
          {prop: 'approveState', label: '是否中标'},
          {prop: 'stateDisplay', label: '状态'},
          {prop: 'reason', label: '中标理由'}
        ],
        dataLs: [],
        uploadData: {
          url: this.$Api.order.imporQuotationTemplate,
          listType: 'text',
          showFileList: false,
          name: 'file',
          data: {},
          custom: true
        },
        initTabData: {width: '600px', show: false},
        dialogEditFooter: [{text: '取消', key: 'cancel'}],
        purchasePlanGoodsVOList: [],
        goodsSelection: []
      }
    },
    mounted () {
//      this.id = this.$route.params.id
//      this.getTableData()
    },
    created () {
      this.id = this.$route.params.id
      this.getTableData()
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
                  this.getTableData()
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
                    this.getTableData()
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
      initWareouseCancel () {
        this.initTabData.show = false
        this.$bus.emit('clear-files')
      },
      saveTaxPoint (row) {
        if (row.taxPoint < 0) {
          this.$message.error('税点不能小于等于零！')
          return
        }
        this.$Ajax.post({
          url: this.$Api.order.updateQuotationGoodsTxaPoint,
          data: {
            quotationGoodsId: row.id,
            taxPoint: row.taxPoint
          },
          cb: res => {
            if (res.data.result) {
              this.$message('更新税点成功！')
              this.getTableData()
            } else {
              this.$message(res.data.message)
            }
          }
        })
      },
      saveReason (row) {
        let reason = ''
        reason = reason !== null ? row.reason : ''
        this.$Ajax.post({
          url: this.$Api.order.updateQuotationReason,
          data: {
            quotationGoodsId: row.id,
            reason: reason
          },
          cb: res => {
            if (res.data.result) {
              this.$message('已更新！')
              this.getTableData()
            } else {
              this.$message(res.data.message)
            }
          }
        })
      },
      savePrice (row) {
        if (row.unitGoodsPrice <= 0) {
          this.$message.error('单价不能小于等于零！')
          return
        }
        this.$Ajax.post({
          url: this.$Api.order.updateQuotationGoodsPrice,
          data: {
            quotationGoodsId: row.id,
            price: row.unitGoodsPrice
          },
          cb: res => {
            if (res.data.result) {
              this.$message('更新报价成功！')
              this.getTableData()
            } else {
              this.$message(res.data.message)
            }
          }
        })
      },
      uploadSuccess (res) {
        if (res.result) {
          this.$message('上传文件成功')
          this.getTableData()
        } else {
          this.$message.error(res.message)
        }
      },
      getTableData () {
        this.$Ajax.get({
          url: this.$Api.procurement.purchasePlanNewBidQuotationByCompanyList,
          data: {
            params: {
              purchasePlanId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              let json = {}
              this.dataList = res.data.data
              this.purchasePlanGoodsVOList = this.dataList.purchasePlanGoodsVOList
              this.purchasePlanGoodsVOList.map(ntem => {
                json[ntem.id] = ntem
              })
              this.dataList.quotationVOList = this.dataList.quotationVOList.map(item => {
                item.quotationGoodsVOList.map = item.quotationGoodsVOList.map(quo => {
                  quo.stateCode = json[quo.listPurchaseGoodsId].stateCode
                  quo.stateDisplay = json[quo.listPurchaseGoodsId].stateDisplay
                  if (quo.approveState === 1) {
                    quo.approveState = '已中标'
                  } else {
                    quo.approveState = '未中标'
                  }
                  return quo
                })
                return item
              })
            }
          }
        })
      },
      onDetail (id) {
        this.$router.push({name: 'purPackChoiceMore', params: {id: id}})
      },
      selectionChange (res) {
        this.goodsSelection = res
      },
      onSave () {
        let quotationGoodsIds = []
        let okCode = false
        let errCode = null
        this.goodsSelection.map(item => {
          if (item.unitGoodsPrice <= 0) {
            okCode = true
            errCode = 2
          } else {
            if (item.stateCode === 30 && item.approveState === '未中标') {
              okCode = true
            } else if (item.stateCode === 30 && item.approveState === '已中标') {
              okCode = true
            } else {
              quotationGoodsIds.push(item.id)
            }
          }
        })
        if (!okCode) {
          if (quotationGoodsIds.length) {
            this.$Ajax.post({
              url: this.$Api.procurement.winTheBidGoodsBatch,
              data: {
                quotationGoodsIds: quotationGoodsIds
              },
              cb: res => {
                if (res.data.result) {
                  this.$message('入围成功')
                  this.getTableData()
                  this.goodsSelection = []
                }
              }
            })
          } else {
            this.$message.error('请选择入围商品')
          }
        } else {
          if (errCode === 2) {
            this.$message.error('有未报价物资，不能入围！')
          } else {
            this.$message.error('同一个采购计划的每种物资只能有一个供应商入围，请勿重复提交！')
          }
        }
      }
    },
    filters: {}
  }
</script>
<style scoped>
  .title {
    padding-bottom: 10px;
    font-size: 18px;
    border-bottom: 1px solid #e5e5e5;
  }

  .collapse_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .collapse_title_item_r {
    display: flex;
    width: 100px;
    justify-content: center;
    align-items: center;
  }

  .collapse_title_item {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
</style>
<style>
  .pannel .v_list_li {
    float: left;
    width: 33% !important;
  }
</style>
