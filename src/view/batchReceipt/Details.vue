<template>
  <div class="p_d_detail">
    <div class="contract_title">验收单详情</div>
    <v-list :data="purchaseDeliverData" :data-list="dataDetails" :list-style="listStyle"></v-list>
    <div class="contract_title">商品明细</div>
    <table-list :data-header="dataHeader" :static="true" :dataStatic="dataTableGoods" :refs="tableBatchReceiptGoods"
                :params="pageGoods">
      <template slot-scope="scope" slot="number">
        {{scope.index + 1}}
      </template>
      <template slot-scope="scope" slot="signCount">
        <div v-if="dataDetails.stateCode === 10">
          <el-input v-model="scope.row.signCount" type="number" @wheel.native.prevent></el-input>
        </div>
        <div v-else>{{scope.row.signCount}}</div>
      </template>
    </table-list>
    <br/>
    <div>
      <div class="contract_title pull-left">
        <span>验收文件</span>
      </div>
      <div class="pull-left btn_upload">
        <v-upload :data="uploadData" :customBeforeUpload="customBeforeUpload" @on-success="uploadSuccess">
          <div>
            <el-button size="small" type="primary" icon="el-icon-plus">上传</el-button>
          </div>
        </v-upload>
      </div>
      <span style="clear: both"></span>
    </div>
    <table-list :data-header="dataHeaderFile" :url="tabFileUrl" :refs="tableBatchReceiptFile"
                :params="pageFile">
      <template slot-scope="scope" slot="fileOldName">
        <a :href="getShowImgPath(scope.row.filePath)"
           class="item_img" target="_blank">{{scope.row.fileOldName}}</a>
      </template>
      <template slot-scope="scope" slot="operation">
        <a class="handle" @click="toDeleteFile(scope.row.id)">删除</a>
      </template>
    </table-list>
    <div class="btn_box_center">
      <el-button type="default" @click="toExport">导出</el-button>
      <el-button type="primary" v-if="dataDetails.stateCode === 10" @click="submit">确认验收</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        listStyle: {
          listwidth: '100px',
          class: 'purchase_list'
        },
        dataDetails: {},
        purchaseDeliverData: [
          {prop: 'number', label: '验收单号'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'creator', label: '创建人'},
          {prop: 'stateStr', label: '验收状态'},
          {prop: 'goodsCount', label: '物资数量'}
        ],
        tableBatchReceiptGoods: 'table_batch_receipt_goods',
        urlGoods: this.$Api.sign.findListGoods,
        exportUrl: this.$Api.sign.exportDetail,
        pageGoods: {
          refs: 'table_batch_receipt_goods'
        },
        dataHeader: [
          {
            prop: 'number',
            label: '序号',
            width: '60',
            slot: true
          }, {
            prop: 'number',
            label: '采购单号'
          }, {
            prop: 'goodsName',
            label: '商品名称'
          }, {
            prop: 'typeModel',
            label: '规格型号'
          }, {
            prop: 'brandName',
            label: '品牌'
          }, {
            prop: 'unit',
            label: '单位'
          }, {
            prop: 'goodsCount',
            label: '数量'
          }, {
            prop: 'signCount',
            label: '实收数量',
            slot: true
          }, {
            prop: 'unitPrice',
            label: '售价'
          }, {
            prop: 'totalPrice',
            label: '金额'
          }, {
            prop: 'supplierName',
            label: '供应商名称'
          }
        ],
        dataTableGoods: [],
        dataHeaderFile: [
          {
            label: '文件名称',
            prop: 'fileOldName',
            slot: true
          }, {
            label: '大小',
            prop: 'fileSize'
          }, {
            label: '操作',
            prop: 'operation',
            slot: true
          }
        ],
        tabButFile: [
          {text: '上传验收文件', key: 'to-upload', icon: 'el-icon-plus'}
        ],
        tabFileUrl: this.$Api.sign.getVoucherList,
        tableBatchReceiptFile: 'table_batch_receipt_file',
        pageFile: {
          refs: 'table_batch_receipt_file',
          stockReceiptId: this.$route.params.id
        },
        uploadData: {
          url: this.$Api.sign.uploadFile,
          listType: 'text',
          showFileList: false,
          name: 'file',
          data: {},
          custom: true
        },
        customBeforeUpload: true,
        idCode: ''
      }
    },
    created () {
      let id = this.$route.params.id
      this.idCode = id
      this.uploadData.data.id = id
      this.getData(id)
      this.getGoodsData(id)
    },
    methods: {
      getData (id) {
        this.$Ajax.post({
          url: this.$Api.sign.detail,
          data: {
            id: id
          },
          cb: res => {
            if (res.data.result) {
              this.dataDetails = res.data.data
            }
          }
        })
      },
      getGoodsData (id) {
        this.$Ajax.post({
          url: this.urlGoods,
          data: {
            signReceiptId: id
          },
          cb: res => {
            if (res.data.result) {
              this.dataTableGoods = res.data.data
              this.dataTableGoods.map(item => {
                item.signCount = item.signCount ? item.signCount : item.goodsCount
              })
            }
          }
        })
      },
      getShowImgPath (path) {
        return this.$ImgPath.imgApi.imgApi + '/' + path
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      uploadSuccess (res) {
        if (res.result) {
          this.$message('上传文件成功')
          this.pageUpdateTable([this.pageFile], this.tableBatchReceiptFile, this)
        } else {
          this.$message.error(res.message)
        }
      },
      toDeleteFile (id) {
        this.$Ajax.post({
          url: this.$Api.sign.deletedFile,
          data: {
            id: id
          },
          cb: (res) => {
            if (res.data.result) {
              this.$message('删除文件成功')
              this.pageUpdateTable([this.pageFile], this.tableBatchReceiptFile, this)
            } else {
              this.$message.error(res.message)
            }
          }
        })
      },
      toExport () {
        location.href = this.exportUrl + '/' + this.idCode
      },
      submit () {
        let json = {id: this.idCode}
        let flag = false
        this.dataTableGoods.map(item => {
          if (item.signCount <= 0) {
            flag = true
          }
        })
        if (flag) {
          this.$message('请正确输入收货数量')
        } else {
          json.signReceiptGoodsVOList = this.dataTableGoods
          this.$confirm('确定要验收吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.$Api.sign.confirmSign,
              data: {
                json: JSON.stringify(json)
              },
              cb: res => {
                if (res.data.result) {
                  this.$message('验收成功')
                  this.pageUpdateTable([this.pageGoods], this.tableBatchReceiptGoods, this)
                  this.$router.push({name: 'batchReceiptList'})
                } else {
                  this.$message(res.data.message)
                }
              }
            })
          }).catch(() => {
          })
        }
      },
      changeCount (res) {
        if (res.signCount <= 0) {
          this.$message('请正确填写收货数量')
        } else {
          this.$Ajax.post({
            url: this.$Api.sign.updateSignReceiptGoodsSignCount,
            data: {
              goodsId: res.id,
              signCount: res.signCount
            },
            cb: res => {
              if (res.data.result) {
                this.$message('验收数量成功')
                this.pageUpdateTable([this.pageGoods], this.tableBatchReceiptGoods, this)
              }
            }
          })
        }
      }
    }
  }
</script>

<style>
  .btn_box_center {
    text-align: center;
    margin-top: 20px;
  }

  .handle {
    font-size: 12px;
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }

  .contract_title {
    margin-bottom: 10px;
    font-size: 18px;
    border-left: solid #008aff 4px;
    padding-left: 5px;
    margin-right: 20px;
  }

  .purchase_list > .v_list_li {
    width: 33% !important;
    float: left
  }

  .mr_b10 {
    margin-bottom: 10px;
  }

  .btn_box {
    text-align: center
  }

  .btn_box .base_btn_group .el-button {
    padding: 10px 15px !important
  }

  .p_d_detail .avatar-uploader .el-upload {
    border: none;
  }

  .p_d_detail .el-dialog__body {
    padding-top: 10px;
  }

  .p_d_detail .el-dialog__body .el-form-item {
    margin-bottom: 0;
  }

  .imgItemClass {
    display: block;
    margin-top: 5px;
  }

  .btn_upload .el-button {
    padding: 6px 15px !important;
  }
</style>
