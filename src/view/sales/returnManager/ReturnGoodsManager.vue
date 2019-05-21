<template>
  <div>
    <v-search :data="SearchData" @on-click="searchDataClick" style="margin-bottom: 20px">
      <template slot="projectId" slot-scope="scope">
        <el-select v-model="scope.rows.value"  placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.projectName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </v-search>
    <table-list :data-header="goodsDataHeader" @get-table-data="getTableData" :url="tableUrl" :refs="goodsListTable"
                :params="params">
      <template slot-scope="scope" slot="operation">
        <div class="mCen1">
          <TabBut  v-if="scope.row.processingStateCode === 1  && type !== 2" :data="upTabButData"  @on-audit="onaudit(scope.row)"></TabBut>
          <TabBut  v-else :data="upTabButData1"  @on-view="onview(scope.row)" ></TabBut>
        </div>
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[params]"></v-page>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableUrl: this.$Api.returnForm.returnFormList,
        SearchData: [
          {
            key: 'applicationStartTimeStr',
            label: '申请时间：',
            value: '',
            date: {
              type: 'daterange',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          }, {
            label: '处理状态：',
            value: '',
            key: 'processingStateCode',
            select: [{value: '', label: '全部'}, {value: '1', label: '审核中'}, {value: '2', label: '已通过'}, {value: '3', label: '未通过'}]
          }, {
            label: '申请人：',
            value: '',
            key: 'applicantName'
          }, {
            label: '梁场名称：',
            value: '',
            placeholder: '请输入',
            custom: true,
            key: 'projectId',
            prop: 'projectId'
          }, {
            key: 'materialName',
            label: '物资名称:',
            value: '',
            placeholder: '请输入物资名称'
          }
        ],
        goodsListTable: 'tab_goodsTable_list',
        params: {returnTypeCode: 1},
        returnTypeCode: 1,
        goodsDataHeader: [
          {prop: 'returnNumber', label: '退换货单编号'},
          {prop: 'orderNumber', label: '用户订单编号'},
          {prop: 'applicationTimeStr', label: '申请时间'},
          {prop: 'applicantName', label: '申请人'},
          {prop: 'phoneNumber', label: '手机号码'},
          {prop: 'processingStateStr', label: '处理状态'},
          {label: '操作', slot: true, prop: 'operation', width: '150px'}
        ],
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'tab_goodsTable_list'
        },
        upTabButData: [
          {
            text: '审核',
            key: 'on-audit',
            type: 'text'
          }
        ],
        upTabButData1: [
          {
            text: '查看',
            key: 'on-view',
            type: 'text'
          }
        ],
        options: []
      }
    },
    created () {
      this.params.dataSourceCode = this.dataSourceCode
      this.getphases()
    },
    props: {
      selectClassItem: {
        type: Object
      },
      type: Number,
      dataSourceCode: Number
    },
    methods: {
      routerName () {
        let routerName = null
        if (this.dataSourceCode === 1) {
          routerName = 'returnDetails'
        } else if (this.dataSourceCode === 2) {
          routerName = 'returnGoodDetails'
        }
        return routerName
      },
      onview (row) {
        let routeData = this.$router.resolve({
          name: this.routerName(),
          params: {state: 'detail', id: row.id, type: this.type}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: this.routerName(), params: {state: 'detail', id: row.id, type: this.type}})
      },
      onaudit (row) {
        let routeData = this.$router.resolve({
          name: this.routerName(),
          params: {state: 'audit', id: row.id, type: this.type}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: this.routerName(), params: {state: 'audit', id: row.id, type: this.type}})
      },
      getphases () {
        this.$Ajax.post({
          url: this.$Api.orderManger.getProjectList,
          data: {},
          cb: res => {
            if (res.status === 200) {
              this.options = res.data.data
              this.options.unshift({id: '', projectName: '全部'})
            }
          }
        })
      },
      searchDataClick (res) {
        res.returnTypeCode = this.returnTypeCode
        res.dataSourceCode = this.dataSourceCode
        this.params = res
        if (res.endTime) {
          res.applicationEndTimeStr = res.endTime
        }
        this.tableRefresh()
      },
      tableRefresh () {
        this.$Utils.pageUpdateTable([this.params, this.page], this.goodsListTable, this)
      },
      getTableData (data) {
        this.page.totalNum = data.data.total
      }
    }
  }
</script>

