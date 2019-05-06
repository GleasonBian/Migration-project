<template>
  <div>
    <div class="color_red">提示：梁场名称与采购类型必选</div>
    <br/>
    <v-search :data="searchData" @on-click="search"></v-search>
    <table-list :data-header="dataHeader" :data-static="dataStatic"
                :refs="tablePerformance" :static="tableStatic"
                @select="select" @select-all="selectall">
      <template slot-scope="scope" slot="dismissal">
        <a class="handle" style="margin-left: 10px;" @click="toDismissal(scope.row)">审批记录</a>
      </template>
    </table-list>
    <div class="btn_box_center">
      <el-button type="primary" @click="submit">提交外审单</el-button>
    </div>
    <!-- <v-dialog :dialog="dialogDataView" @on-cancel="viewCancel">
      <table-list :data-header="dataHeaderView" :url="tabUrlView" :params="pageView" @get-table-data="getTableDataView"
                  :refs="tablePerformanceView"></table-list>
      <v-page :data="pageView" :dataArr="[]"></v-page>
    </v-dialog> -->
    <!--审批记录-->
    <examine-dialog :dialogDataView="dialogDataView" :pageView="pageView" :goodsName="goodsName"
                    :tablePerformanceView="tablePerformanceView"></examine-dialog>
  </div>
</template>

<script>
  import examineDialog from '../examine/examineDialog.vue'
  export default {
    components: {examineDialog},
    data () {
      return {
        arrBeamData: [],
        tabUrl: this.$Api.sale.findMaterialList,
        urlBeamField: this.$Api.orderManger.getProjectList,
        urlSave: this.$Api.sale.saveExternalAudit,
        tabUrlView: this.$Api.sale.queryGoodsRejectRecordPage,
        page: {
          materialState: 2,
          refs: 'add_external_table'
        },
        pageView: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'reject_external_table'
        },
        dataSearch: {},
        tableStatic: true,
        dataStatic: [],
        dataHeader: [
          {type: 'selection'},
          {prop: 'code', label: '采购单编码'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'typeStr', label: '采购类型'},
          {prop: 'model', label: '规格型号'},
          {prop: 'brand', label: '品牌'},
          {prop: 'unit', label: '单位'},
          {prop: 'count', label: '采购数量'},
          {prop: 'modifyTimeStr', label: '更新时间'},
          {prop: 'dismissal', label: '审批记录', slot: true}
        ],
        dataHeaderView: [
          {prop: 'createrId', label: '驳回人'},
          {prop: 'createTimeStr', label: '驳回时间'},
          {prop: 'remark', label: '驳回原因'}
        ],
        tablePerformance: 'add_external_table',
        tablePerformanceView: 'reject_external_table',
        searchData: [
          {
            key: 'projectId',
            label: '梁场名称：',
            value: '',
            select: []
          }, {
            key: 'state',
            label: '采购类型：',
            value: '',
            select: [{
              label: '物资采购',
              value: '0'
            }, {
              label: '设备采购',
              value: '1'
            }]
          }, {
            key: 'code',
            label: '采购单编码',
            value: '',
            type: 'text'
          }, {
            key: 'startTime',
            label: '创建时间',
            value: '',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }
        ],
        selectionData: [],
        dialogDataView: {show: false, title: '审批记录', width: '700px'},
        goodsName: ''
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
        params.materialState = 2
        params.refs = 'add_external_table'
        this.$Ajax.post({
          url: this.tabUrl,
          data: params,
          cb: res => {
            if (res.data.result) {
              this.dataStatic = res.data.data
            }
          }
        })
      },
      toDismissal (res) {
        this.goodsName = res.goodsName
        this.pageView.currentPage = 1
        this.pageView.offset = 0
        this.dialogDataView.show = true
        this.pageView.goodsId = res.id
        this.pageView.typeCode = 2
        this.$Utils.pageUpdateTable([[], this.pageView], this.tablePerformanceView, this)
      },
      getTableDataView (data) {
        this.pageView.totalNum = data.data.total
      },
      viewCancel () {
        this.dialogDataView.show = false
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
            type: this.dataSearch.state,
            projectId: this.dataSearch.projectId,
            goodsIds: idArr
          }
          this.$confirm('提交外审单将进入到销售定价外审流程，确定要提交吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$Ajax.post({
              url: this.urlSave,
              data: {
                json: JSON.stringify(json)
              },
              cb: res => {
                if (res.data.result) {
                  this.$message('提交成功')
                  this.$router.push({name: 'saleExternal'})
                }
              }
            })
          }).catch(() => {
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
