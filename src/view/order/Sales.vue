<template>
  <div>
    <v-search :data="searchData" @on-click="search"></v-search>
    <div style="margin-bottom: 20px;display: flex;">
      <el-button type="primary" size="mini" v-if="$Utils.getPageElement($Consts.PERMISSION.repairOrder.code)" @click="repairOrderAllocated">补单配货</el-button>
    </div>
    <!--<tab-but :data="tabBut" @add-inside="addInside" @add-external="addExternal"></tab-but>-->
    <table-list :data-header="dataHeader" :url="tabUrl" :params="page" @get-table-data="getTableData"  @selection-change="selectionChange"
                :refs="tablePerformance">
      <template slot-scope="scope" slot="stateStr">
        <span :class="[scope.row.state === 0 ? 'txtRed' : '']">{{scope.row.stateStr}}</span>
      </template>
      <template slot-scope="scope"   slot="handle">
          <el-select v-model="scope.row.value" placeholder="请选择" @change="changeSelectOperation(scope.row)">
          <el-option key="btn1" label="查看" value="btn1"></el-option>
          <el-option key="btn2" label="配货" value="btn2"></el-option>
          <el-option-group v-if="scope.row.state == '10'">
            <el-option key="btn3" label="删除" value="btn3" v-show="$Utils.getPageElement($Consts.PERMISSION.detPurchaseList.code)" ></el-option>
          </el-option-group>
          <el-option-group v-else>
            <el-option key="btn4" label="导出" value="btn4" ></el-option>
            <el-option key="btn5" label="生成订单" value="btn5" v-show="(scope.row.state === 10 || scope.row.state === 4) && scope.row.hasOrder === 0"></el-option>
            <el-option key="btn6" label="生成订单" value="btn6" v-show="scope.row.state === 1 && scope.row.hasOrder === 0"></el-option>
          </el-option-group>
        </el-select>
        <!-- <router-link class="handle" :to="{name: 'salesDetail', params:{id: scope.row.id, approve: 0}}" tag="a" target="_blank">查看</router-link>
        <router-link class="handle" :to="{name: 'salesRemark', params:{id: scope.row.id}}" tag="a" target="_blank">配货</router-link> -->
        <!-- <div v-if="scope.row.state == '10'">
             <span class="handle" style="margin-left: 10px;" v-show="$Utils.getPageElement($Consts.PERMISSION.detPurchaseList.code)" @click="toDelete(scope.row.id)">删除</span>
        </div> -->
        <!-- <div v-else>
         <a class="handle" style="margin-left: 10px;" :href="exportQuotation + scope.row.id">导出</a>
         <a class="handle" style="margin-left: 10px;" v-show="scope.row.state === 10 && scope.row.hasOrder === 0" @click="toCreateOrder(scope.row.id)">生成订单</a>
         <a class="handle" style="margin-left: 10px;" v-show="scope.row.state === 4 && scope.row.hasOrder === 0" @click="toCreateOrder(scope.row.id)">生成订单</a>
        <a class="handle" style="margin-left: 10px;" v-show="scope.row.state === 1 && scope.row.hasOrder === 0" @click="toCreateOrder2(scope.row.id)">生成订单</a></div> -->
      </template>
    </table-list>
    <v-page :data="page" :dataArr="[dataSearch]"></v-page>
    <!--删除原因-->
    <v-dialog :dialog="dialogDataDel" @on-cancel="viewCancelDel">
      <form-group :data="dataFormDel" @on-cancel="cancelDialog" :custom="true" @on-ok="okReject" :data-but="dataBut">
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tabBut: [
          {text: '创建内审单', key: 'add-inside'},
          {text: '创建外审单', key: 'add-external'}
        ],
        arrBeamData: [],
        exportQuotation: this.$Api.order.exportQuotation,
        tabUrl: this.$Api.order.priceList,
        urlBeamField: this.$Api.orderManger.getProjectList,
        page: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          refs: 'price_table'
        },
        dataSearch: {},
        dataHeader: [
          {type: 'selection'},
          {prop: 'code', label: '采购单编码'},
          {prop: 'orderNumber', label: '关联订单号'},
          {prop: 'lubanPlanCode', label: '鲁班计划'},
          {prop: 'planSourceDisplay', label: '计划来源'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'userName', label: '创建人'},
          {prop: 'phoneNum', label: '手机号码'},
          {prop: 'goodsCountPassedAndAll', label: '物资数量', width: '120px', renderHeader: this.renderHeaderGoods},
          {prop: 'stateStr', label: '状态', slot: true},
          {prop: 'handle', label: '操作', slot: true}
        ],
        tablePerformance: 'price_table',
        searchData: [{
          key: 'projectId',
          label: '梁场名称：',
          value: '',
          select: []
        }, {
          label: '计划来源：',
          value: '',
          key: 'planSourceCode',
          select: []
        }, {
          key: 'startTime',
          label: '创建时间：',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }, {
          key: 'code',
          label: '采购单号：',
          value: '',
          type: 'text'
        }, {
          key: 'state',
          label: '计划状态：',
          value: '',
          select: [
            {label: '全部', value: ''},
            {label: '待配货', value: '10'},
            {label: '审批中', value: '20'},
            {label: '已通过', value: '30'},
            {label: '推送中', value: '50'},
            {label: '推送成功', value: '60'}
          ]
        }, {
          key: 'materialName',
          label: '物资名称：',
          value: '',
          type: 'text'
        }, {
          key: 'userName',
          label: '创建人：',
          value: '',
          type: 'text'
        }, {
          key: 'lubanPlanCode',
          label: '鲁班计划:',
          value: '',
          placeholder: '请输入鲁班计划'
        }],
        dialogDataDel: {show: false, title: '删除原因', width: '500px'},
        dataFormDel: {
          from: [{
            prop: 'deletedReason',
            label: '删除原因',
            value: '',
            labelWidth: '100px',
            required: true,
            placeholder: '请输入删除原因',
            rules: [{required: true, message: '请输入删除原因', trigger: 'blur,change'}]
          }]
        },
        dataBut: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          type: 'primary',
          key: 'ok'
        }],
        idDel: 0,
        selection: [],
        selectionIds: []
      }
    },
    created () {
      this.getBeamField()
      this.getSourceState()
    },
    methods: {
      selectionChange (selection) {
        this.selection = selection
        this.selectionIds = this.selection.map(item => {
          return item.id
        })
      },
      repairOrderAllocated () {
        this.$confirm('确定要补单配货吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$Ajax.post({
            url: this.$Api.order.repairOrderAllocated,
            data: {ids: this.selectionIds},
            cb: res => {
              if (res.data.result) {
                this.$message('补单配货成功')
                this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
              } else {
                this.$message('补单配货失败')
              }
            }
          })
        }).catch(() => {
        })
      },
      getSourceState () {
        this.ajaxPost(this.$Api.sale.getPlanSourceState, (res) => {
          if (res.data.result) {
            this.searchData.map(item => {
              if (item.key === 'planSourceCode') {
                item.select = res.data.data
              }
            })
          }
        })
      },
      renderHeaderGoods (h) {
        return (
          <div>
          <span> 物资数量 </span>
          <span title='内审通过数量/总数量' style='cursor:pointer'>...</span>
          </div>
        )
      },
      addInside () {
        this.$router.push({name: 'addInside'})
      },
      addExternal () {
        this.$router.push({name: 'addExternal'})
      },
      toCreateOrder (id) {
        this.$Ajax.get({
          url: this.$Api.order.createOrder,
          data: {
            params: {
              listPurchaseId: id
            }
          },
          cb: res => {
            this.$message(res.data.data)
            if (res.data.result) {
              this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      toCreateOrder2 (id) {
        this.$Ajax.get({
          url: this.$Api.order.createFormalOrder,
          data: {
            params: {
              listPurchaseId: id
            }
          },
          cb: res => {
            this.$message(res.data.data)
            if (res.data.result) {
              this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
      },
      changeSelectOperation (row) {
        let routeData = {}
        // console.log(row.state)
        switch (row.value) {
          case 'btn1':
            routeData = this.$router.resolve({
              name: 'salesDetail',
              params: {id: row.id, approve: 0}
            })
            window.open(routeData.href, '_blank')
            break
          case 'btn2':
            routeData = this.$router.resolve({
              name: 'salesRemark',
              params: {id: row.id, approve: 0}
            })
            window.open(routeData.href, '_blank')
            break
          case 'btn3':
            this.toDelete(row.id)
            break
          case 'btn4':
            window.location = this.exportQuotation + row.id
            break
          case 'btn5':
            this.toCreateOrder(row.id)
            break
          case 'btn6':
            this.toCreateOrder2(row.id)
            break
        }
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
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
      getTableData (data) {
        this.page.totalNum = data.data.total
      },
      search (res) {
        this.dataSearch = res
        if (JSON.stringify(this.dataSearch) === '{}') {
          this.page.offset = 0
          this.page.currentPage = 1
        }
        this.page.offset = 0
        this.page.currentPage = 1
        this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
      },
      writePriceMark (id) {
        this.$router.push({name: 'salesRemark', params: {id: id}})
      },
      viewDetail (id) {
        this.$router.push({name: 'salesDetail', params: {id: id}})
      },
      toDelete (id) {
        this.idDel = id
        this.dialogDataDel.show = true
      },
      viewCancelDel () {
        this.dialogDataDel.show = false
      },
      cancelDialog () {
        this.dialogDataDel.show = false
        this.$bus.emit('form-clear')
      },
      okReject (res) {
        let json = res
        json.ids = [this.idDel]
        this.$Ajax.post({
          url: this.$Api.order.deleteListPurchaseList,
          data: {
            json: JSON.stringify(json)
          },
          cb: res => {
            if (res.data.result) {
              this.cancelDialog()
              this.$Utils.pageUpdateTable([this.dataSearch, this.page], this.tablePerformance, this)
            }
          }
        })
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
</style>
