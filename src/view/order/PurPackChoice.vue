<template>
  <div>
    <div class="title">整包选择报价</div>
    <div>
      <v-list :data="data" :data-list="dataList" :list-style="listStyle"></v-list>
    </div>
    <div>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="onSave">批量中标</el-button>
      </div>
      <br>
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in dataList.quotationVOList" :key="index">
          <template slot="title">
            <div class="collapse_title">
              <div class="collapse_title_item_r">
                <el-radio v-model="radio" :label="index" disabled v-if="item.quotationStateCode == 0 || item.quotationStateCode == 2">中标</el-radio>
                <el-radio v-else v-model="radio" :label="index">中标</el-radio>
              </div>
              <div class="collapse_title_item" v-if="item.supplierManagerProviderVO">{{item.supplierManagerProviderVO.enterpriseName}}</div>
              <div class="collapse_title_item" v-if="item.supplierManagerProviderVO">{{item.supplierManagerProviderVO.contactName}}&nbsp; &nbsp;{{item.supplierManagerProviderVO.contactPhone}}</div>
              <div class="collapse_title_item">报价总额:{{item.totalGoodsPrice}}</div>
            </div>
          </template>
          <table-list :data-header="dataHeader" :data-static="item.quotationGoodsVOList"  :static="tableStatic">
            <template slot-scope="scope" slot="unitGoodsPrice">
              <el-input v-model.lazy="scope.row.unitGoodsPrice" type="number" @blur="savePrice(scope.row)"></el-input>
            </template>
            <template slot-scope="scope" slot="reason">
              <el-input v-model="scope.row.reason" :disabled="scope.row.quotationStateCode == 0"></el-input>
            </template>
          </table-list>
          <!--<el-button type="primary" @click="onDetail(item.id)" style="margin-top: 10px;">查看更多</el-button>-->

          <div style="text-align: right;">
            <el-button type="primary" @click="onExport(item.id)" style="margin-top: 10px;">导出物资</el-button>
            <el-button type="primary" @click="onImport(item.id)">导入报价</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>

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
          { prop: 'projectName', label: '下单梁场' },
          { prop: 'stateStr', label: '状态' },
          { prop: 'code', label: '采购单号' },
          { prop: 'userName', label: '下单人' },
          { prop: 'phoneNum', label: '联系方式' },
          { prop: 'createTimeStr', label: '创建时间' },
          { prop: 'expectedTime', label: '期望到货时间' }
        ],
        dataList: {},
        listStyle: {
          class: ['pannel']
        },
        tableStatic: true,
        dataHeader: [
          {type: 'selection'},
          { prop: 'goodsName', label: '商品名称' },
          { prop: 'typeModel', label: '规格型号' },
          { prop: 'brandName', label: '品牌' },
          { prop: 'unit', label: '计量单位' },
          { prop: 'goodsCount', label: '采购数量' },
          { prop: 'supplierBrandName', label: '报价品牌' },
          { prop: 'unitGoodsPrice', label: '单价', slot: true },
          { prop: 'taxPoint', label: '税点' },
          { prop: 'totalGoodsPrice', label: '合计' },
          { prop: 'supplierExpectedArrivalTime', label: '预计到货时间' },
          { prop: 'supplierRemark', label: '说明' },
          { prop: 'quotationStateStr', label: '状态' },
          { prop: 'reason', label: '中标理由', slot: true }
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
        dialogEditFooter: [{text: '取消', key: 'cancel'}]
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.getTableData()
    },
    created () {
//      this.id = this.$route.params.id
//      this.getTableData()
    },
    methods: {
      initWareouseCancel () {
        this.initTabData.show = false
        this.$bus.emit('clear-files')
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
          url: this.$Api.order.newBidQuotationByCompanyList,
          data: {
            params: {
              listPurchaseId: this.id
            }
          },
          cb: res => {
            if (res.status === 200) {
              this.dataList = res.data.data
            }
          }
        })
      },
      onDetail (id) {
        this.$router.push({ name: 'purPackChoiceMore', params: { id: id } })
      },
      onSave () {
        let ls = []
        this.dataList.quotationVOList[this.radio].quotationGoodsVOList.map(x => {
          ls.push({
            quotationGoodsId: x.id,
            reason: x.reason ? x.reason : ''
          })
        })
        this.$Ajax.post({
          url: this.$Api.order.saveBidQuotationByCompany,
          data: {
            quotationId: this.dataList.quotationVOList[this.radio].id,
            bidQuotationInfos: JSON.stringify(ls)
          },
          cb: res => {
            if (res.status === 200) {
              if (res.data.result) {
                this.$message('保存成功')
                this.$router.back()
              } else {
                this.$message(res.data.message)
              }
            }
          }
        })
      }
    },
    filters: {}
  }
</script>
<style scoped>
  .title{
    padding-bottom: 10px;
    font-size: 18px;
    border-bottom: 1px solid #e5e5e5;
  }
  .collapse_title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .collapse_title_item_r{
    display: flex;
    width: 100px;
    justify-content: center;
    align-items: center;
  }
  .collapse_title_item{
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
</style>
<style>
  .pannel .v_list_li{
    float: left;
    width: 33% !important;
  }
</style>
