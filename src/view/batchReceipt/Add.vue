<template>
  <div>
    <div class="color_red">提示：梁场名称必选</div>
    <br/>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeader" :data-static="dataStatic"
                :refs="tablePerformance" :static="tableStatic"
                @select="select" @select-all="selectall">
    </table-list>
    <div class="btn_box_center" v-if="dataStatic && dataStatic.length > 0">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        arrBeamData: [],
        tabUrl: this.$Api.sign.findStockDeliverGoodsToSign,
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlSave: this.$Api.sign.saveSign,
        page: {
          refs: 'add_sign_table'
        },
        dataSearch: {},
        tableStatic: true,
        dataStatic: [],
        dataHeader: [
          {type: 'selection'},
          {prop: 'number', label: '收货单号'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeModel', label: '规格型号'},
          {prop: 'brandName', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'collectionQuantity', label: '采购数量'}
        ],
        tablePerformance: 'add_sign_table',
        searchData: [
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          }, {
            key: 'number',
            label: '收货单号',
            value: '',
            type: 'text'
          }, {
            key: 'goodsName',
            label: '物资名称',
            value: '',
            type: 'text'
          }, {
            key: 'supplierName',
            label: '供应商',
            value: '',
            type: 'text'
          }, {
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
        selectionData: []
      }
    },
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
        this.ajaxPost(this.urlBeamField, (res) => {
          if (res.data.result) {
            this.arrBeamData = res.data.data
            this.searchData.map(item => {
              if (item.key === 'projectId') {
                item.select = this.fliterSelectBeam(this.arrBeamData)
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
      getTableData () {
        let params = this.dataSearch
        params.refs = 'add_sign_table'
        this.$Ajax.post({
          url: this.tabUrl,
          data: params,
          cb: res => {
            if (res.data.result) {
              this.dataStatic = res.data.data
            } else {
              this.$message(res.data.message)
            }
          }
        })
      },
      search (res) {
        this.dataSearch = res
        this.getTableData()
      },
      select (selection, obj) {
        this.selectionData = selection
      },
      selectall (selection) {
        this.selectionData = selection
      },
      submit () {
        let idArr = []
        if (this.selectionData && this.selectionData.length > 0) {
          this.selectionData.map(item => {
            idArr.push(item.id)
          })
          let json = {
            projectId: this.dataSearch.projectId,
            ids: idArr.join(',')
          }
          this.$Ajax.post({
            url: this.urlSave,
            data: json,
            cb: res => {
              if (res.data.result) {
                this.$message('提交成功')
                this.$router.push({name: 'batchReceiptList'})
              }
            }
          })
        } else {
          this.$message('请选择商品')
        }
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

  .txtRed {
    color: red;
  }

  .btn_box_center {
    text-align: center;
    margin-top: 20px;
  }
</style>
