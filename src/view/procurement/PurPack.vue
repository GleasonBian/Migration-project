<template>
  <div>
    <div class="title">按供应商查看</div>
    <div>
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <div>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="onSave">批量入围</el-button>
      </div>
      <br>
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in dataList.quotationVOList" :key="index">
          <template slot="title">
            <div class="collapse_title">
              <!--<div class="collapse_title_item_r">-->
              <!--<el-radio v-model="radio" :label="index" disabled-->
              <!--v-if="item.quotationStateCode == 0 || item.quotationStateCode == 2">中标-->
              <!--</el-radio>-->
              <!--<el-radio v-else v-model="radio" :label="index">中标</el-radio>-->
              <!--</div>-->
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
            <template slot-scope="scope" slot="unitGoodsPrice">
              <el-input
                v-if="scope.row.stateCode === 10 || scope.row.stateCode === 20 || scope.row.stateCode === 60"
                v-model.lazy="scope.row.unitGoodsPrice" type="number" @blur="savePrice(scope.row)"></el-input>
              <span v-else>{{scope.row.unitGoodsPrice}}</span>
            </template>
            <template slot-scope="scope" slot="taxPoint">
              <el-input
                v-if="scope.row.stateCode === 10 || scope.row.stateCode === 20 || scope.row.stateCode === 60"
                v-model.lazy="scope.row.taxPoint" type="number" @blur="saveTaxPoint(scope.row)"></el-input>
              <!--<span-->
                <!--v-if="scope.row.approveState !== '已中标' && (scope.row.stateCode === 50 || scope.row.stateCode === 70 || scope.row.stateCode === 80 || scope.row.stateCode === 90 || scope.row.stateCode === 110 || scope.row.stateCode === 120 || scope.row.stateCode === 130)"-->
              <!--&gt;{{scope.row.taxPoint}}</span>-->
              <span v-else>{{scope.row.taxPoint}}</span>
            </template>
            <template slot-scope="scope" slot="reason">
              <el-input v-if="scope.row.stateCode === 10 || scope.row.stateCode === 20 || scope.row.stateCode === 60"
                        v-model="scope.row.reason" :disabled="scope.row.quotationStateCode == 0"
                        @blur="saveReason(scope.row)"></el-input>
              <span v-else>{{scope.row.reason}}</span>
            </template>
            <template slot-scope="scope" slot="stateDisplay">
              <span :class="[scope.row.stateCode === 60 ? 'color_red' : '']">{{scope.row.stateDisplay}}</span>
            </template>
            <template slot-scope="scope" slot="operation">
              <el-button
                v-if="((scope.row.stateCode === 10 || scope.row.stateCode === 20) && scope.row.approveState !== '已中标') || (scope.row.approveState === '已中标' && scope.row.stateCode === 60)"
                type="text"
                @click="toShortlisted(scope.row)">入围
              </el-button>
              <el-button
                v-if="(scope.row.stateCode !== 10 && scope.row.stateCode !== 20) && scope.row.approveState === '未中标'"
                type="text" disabled>入围
              </el-button>
              <el-button type="text"
                         v-if="(scope.row.approveState === '已中标' && (scope.row.stateCode !== 60 && scope.row.stateCode !== 50 && scope.row.stateCode !== 70 && scope.row.stateCode !== 80 && scope.row.stateCode !== 90 && scope.row.stateCode !== 100 && scope.row.stateCode !== 110 && scope.row.stateCode !== 120 && scope.row.stateCode !== 130))"
                         @click="toCancel(scope.row)">取消入围
              </el-button>
              <el-button type="text"
                         v-if="scope.row.approveState === '已中标' && (scope.row.stateCode === 50 || scope.row.stateCode === 70 || scope.row.stateCode === 80 || scope.row.stateCode === 90 ||  scope.row.stateCode === 100 || scope.row.stateCode === 110 || scope.row.stateCode === 120 || scope.row.stateCode === 130)"
                         disabled>取消入围
              </el-button>
            </template>
          </table-list>
          <!--<el-button type="primary" @click="onDetail(item.id)" style="margin-top: 10px;">查看更多</el-button>-->

          <div style="text-align: right;">
            <el-button type="primary" @click="onExport(item.id)" style="margin-top: 10px;">导出物资</el-button>
            <el-button type="primary" @click="onImport(item.id)">导入报价</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div style="margin-top: 20px;display: flex;justify-content: center">
        <el-button type="primary" @click="onsubmit" style="margin-left: 50px;">提交审批</el-button>
      </div>
      <v-dialog :dialog="initTabData" :dialog-footer="dialogEditFooter" @on-cancel="initWareouseCancel">
        <div style="margin-top: 20px; width: 100%">
          <el-row>
            <el-col :span="12">
              <div style="margin-top: 8px; margin-right: 20px">选择文件</div>
              <div>
                <v-upload :data="uploadData" :customBeforeUpload=true @on-success="uploadSuccess">
                  <div>
                    <el-button size="small" type="primary">点击上传</el-button>
                  </div>
                </v-upload>
              </div>
            </el-col>
          </el-row>
        </div>
      </v-dialog>
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
          {type: 'selection'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '计量单位'},
          {prop: 'goodsCount', label: '采购数量'},
          {prop: 'supplierBrandName', label: '报价品牌'},
          {prop: 'unitGoodsPrice', label: '单价', slot: true},
          {prop: 'taxPoint', label: '税点', slot: true},
          {prop: 'totalGoodsPrice', label: '合计'},
          {prop: 'supplierExpectedArrivalTime', label: '预计到货时间'},
          {prop: 'supplierRemark', label: '说明'},
          {prop: 'remark', label: '其他要求'},
          {prop: 'approveState', label: '是否中标'},
          {prop: 'stateDisplay', label: '状态', slot: true},
          {prop: 'reason', label: '中标理由', slot: true},
          {prop: 'operation', label: '操作', slot: true}
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
        if (!row.taxPoint) {
          this.$message.error('税点不能为空！')
        } else {
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
        }
      },
      onsubmit () {
        this.$Ajax.post({
          url: this.$Api.procurement.submitInnerAudit,
          data: {
            purchasePlanId: this.id
          },
          cb: res => {
            this.$message(res.data.message)
            if (res.data.result) {
              this.$router.push({name: 'procurementList'})
            }
          }
        })
      },
      initWareouseCancel () {
        this.initTabData.show = false
        this.$bus.emit('clear-files')
      },
      saveTaxPoint (row) {
        if (row.taxPoint < 0 || !row.taxPoint) {
          this.$message.error('税点输入有误！')
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
      onImport (id) {
        this.uploadData.data.quotationId = id
        this.initTabData.show = true
      },
      uploadSuccess (res) {
        if (res.result) {
          this.$message('上传文件成功')
          this.getTableData()
        } else {
          this.$message.error(res.message)
        }
      },
      onExport (id) {
        location.href = this.$Api.order.downloadQuotationTemplate + '?quotationId=' + id
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
        let rwCode = null
        let errCode = null
        let taxPointCode = false
        this.goodsSelection.map(item => {
          if (!item.taxPoint) {
            taxPointCode = true
          } else {
            if (item.unitGoodsPrice <= 0) {
              okCode = true
              errCode = 2
            } else {
              if (item.stateCode === 30 && item.approveState === '未中标') {
                okCode = true
              } else if (item.stateCode === 30 && item.approveState === '已中标') {
                okCode = true
              } else if ((((item.stateCode === 10 || item.stateCode === 20) && item.approveState !== '已中标') || (item.approveState === '已中标' && item.stateCode === 60)) === false) {
                okCode = true
                rwCode = 2
              } else {
                quotationGoodsIds.push(item.id)
              }
            }
          }
        })
        if (taxPointCode) {
          this.$message.error('税点不能为空或者输入错误')
        } else {
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
            } else if (rwCode === 2) {
              this.$message.error('有不符合入围的物资，不能入围！')
            } else {
              this.$message.error('同一个采购计划的每种物资只能有一个供应商入围，请勿重复提交！')
            }
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
