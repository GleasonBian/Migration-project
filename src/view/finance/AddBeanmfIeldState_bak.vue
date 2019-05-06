<template>
  <div>
    <v-search :data="searchData" @on-click="search">
      <template slot="projectId" slot-scope="scope">
        <el-select v-model="scope.rows.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.projectName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </v-search>
    <div class="tab_text_select">
      <div class="tab_text_select_lef">
        <el-checkbox v-model="checked"></el-checkbox>
      </div>
      <div class="tab_text_select_rig">
        <div style="display: flex;padding-left: 15px;flex: 1;align-items: center">全选</div>
      </div>
    </div>
    <el-collapse v-model="activeNames" v-for="(item, index) in settlementData" :key="index" class="box_collapse">
      <el-collapse-item :name="index">
        <template slot="title">
          <div class="row_title">
            <div>订单号:{{item.orderNumber}}</div>
            <div>订单金额:<span class="tab_title_cel_price">{{item.orderAmount}}</span></div>
            <div>实际结算金额:<span class="tab_title_cel_price">{{item.orderAmount}}</span></div>
          </div>
        </template>
        <div class="tab_con" v-for="(list, indexList) in item.applicaFormVOList" :key="indexList">
        <div :class="['tab_con_lef', {'tab_shop_rig_1': index===0}]">
          <el-checkbox v-model="list.isCheck"></el-checkbox>
        </div>
        <div class="tab_con_cen">
            <div :class="{'tab_title_con_1': index===0, 'tab_title_con': true}">
              <div>出库单号: {{list.applicaFormCode}}</div>
              <div>下单时间: {{list.createTimeStr}}</div>
              <div>订单金额: <span class="tab_title_cel_price">{{list.applicaFormAmount}}</span></div>
              <div>应付金额: <span class="tab_title_cel_price">{{list.applicaFormAmount}}</span></div>
              <div class="txt_state">{{list.stateStr}}</div>
            </div>
            <div class="tab_shop_con" v-for="(obj, index2) in list.applicaFormGoodsVOList" :key="index2">
              <div class="tab_shop_lef">
                <div class="tab_shop_lef_con">
                  <div>
                    <img :src="obj.goodsImg" class="tab_shop_con_img"/>
                  </div>
                  <div>{{obj.goodsName}}</div>
                  <div>
                    <div>单位:{{obj.unit}}</div>
                    <div>数量:{{obj.applicaNum}}</div>
                    <div>价格:{{obj.goodsUtilPrice}}</div>
                  </div>
                  <div>小计: <span class="tab_title_cel_price">{{obj.goodsTotalPrice}}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div :class="['handle', {'tab_shop_rig_1': index===0}, 'tab_shop_rig']" @click="jumpDetail(list.id)">查看详情</div>
      </div>
      </el-collapse-item>
    </el-collapse>
    <div class="but">
      <tab-but :data="tabBut" @on-add="tabAdd" @cancel="cancel"></tab-but>
    </div>
    <v-dialog :dialog="dialogCycle">
      <form-group :data="cycleDialogData" :dataBut="cycleDialogBut" :custom=true :clear=true @on-ok="saveCycleDialog" @on-cancel="cancelCycleDialog">
        <template slot="projectId" slot-scope="scope">
          <el-select v-model="scope.rows.value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeNames: [],
        dialogCycle: {show: true, title: '', width: '600px'},
        cycleDialogBut: [{text: '取消', key: 'cancel'}, {text: '下一步', type: 'primary', key: 'ok'}],
        cycleDialogData: {
          from: [
            {
              prop: 'projectId',
              label: '梁场名称：',
              value: '',
              labelWidth: '120px',
              custom: true,
              placeholder: '请选择',
              required: true,
              rules: [{required: true, message: '请选择梁场名称', trigger: 'blur,change'}]
            }, {
              prop: 'deliverStartTime',
              label: '结算周期：',
              value: '',
              labelWidth: '120px',
              date: {
                type: 'daterange',
                rangeSeparator: '至',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
              },
              required: true,
              rules: [{required: true, message: '请选择结算周期', trigger: 'blur,change'}]
            }
          ]
        },
        searchData: [{
          key: 'applicaFormCode',
          label: '配送出库单号',
          value: '',
          type: 'text'
        }, {
          label: '梁场名称：',
          value: '',
          placeholder: '请输入',
          custom: true,
          key: 'projectId',
          prop: 'projectId'
        }, {
          key: 'receiveStartTime',
          label: '结算周期',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }, {
          key: 'applicaUserName',
          label: '创建人',
          value: '',
          type: 'text'
        }],
        checked: false,
        settlementId: '',
        options: [],
        settlementData: [],
        tabBut: [{
          text: '返回',
          key: 'cancel'
        }, {
          text: '确认',
          key: 'add'
        }],
        selData: {},
        settlementVO: {}
      }
    },
    computed: {},
    created () {
      this.settlementId = this.$route.params.id
      this.getphases()
      if (parseInt(this.settlementId) === -1) {
        this.addApplyOrder()
      } else {
        this.addOrEditList()
      }
    },
    mounted () {
    },
    components: {},
    filters: {},
    watch: {
      checked (val) {
        this.settlementData.map((item) => {
          item.applicaFormVOList.map(tmp => {
            tmp.isCheck = val
          })
        })
      }
    },
    methods: {
      saveCycleDialog (res) {
        if (res.deliverStartTime !== undefined) {
          this.selData.receiveStartTime = res.deliverStartTime
          this.selData.receiveEndTime = res.endTime
          this.searchData[2].value = [new Date(res.deliverStartTime), new Date(res.endTime)]
          this.searchData[1].value = res.projectId
          this.cancelCycleDialog()
        }
      },
      cancelCycleDialog () {
        this.dialogCycle.show = false
        this.$bus.emit('form-clear')
      },
      jumpDetail (id) {
        this.$router.push({name: 'demandLibraryView', params: {id: id}})
      },
      tabAdd () {
        let ids = []
        this.settlementData.map((item) => {
          item.applicaFormVOList.map(tmp => {
            if (tmp.isCheck) {
              ids.push(tmp.id)
            }
          })
        })
        if (ids.length === 0) {
          this.$message('请选择订单')
          return false
        }
        if (!this.selData.receiveStartTime) {
          this.$message('请选择周期')
          this.dialogCycle.show = true
          return false
        }
        let data = {ids}
        data.settlementCycleStartTime = this.selData.receiveStartTime
        data.settlementCycleEndTime = this.selData.receiveEndTime
        data.settlementId = this.settlementId
        if (this.settlementVO && this.settlementVO.invoice) {
          data.invoice = this.settlementVO.invoice
        }
        this.$router.push({name: 'addBeanmfIeldStateSec', params: {data}})
      },
      cancel () {
        this.$router.back()
      },
      search (res) {
        console.log(res, 'rrrrr')
        this.checked = false
        if (res.endTime) {
          res.receiveEndTime = res.endTime
        }
        if (this.settlementVO && this.settlementVO.orderIds) {
          res.ids = this.settlementVO.orderIds
        }
        this.selData = res
        this.cycleDialogData.from[0].value = res.projectId
        this.cycleDialogData.from[1].value = [new Date(res.receiveStartTime), new Date(res.endTime)]
        this.addApplyOrder(res)
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
      addOrEditList () {
        this.$Ajax.post({
          url: this.$Api.finance.addOrEditList,
          data: {settlementId: this.settlementId},
          cb: res => {
            if (res.data.result) {
              this.settlementVO = res.data.data.settlementVO
              this.searchData[1].value = this.settlementVO.projectId
              this.searchData[2].value = [this.settlementVO.settlementCycleStartTimeStr, this.settlementVO.settlementCycleEndTimeStr]
              this.selData.receiveStartTime = this.settlementVO.settlementCycleStartTimeStr
              this.selData.receiveEndTime = this.settlementVO.settlementCycleEndTimeStr
              let params = {}
              params.projectId = this.settlementVO.projectId
              params.receiveStartTime = this.settlementVO.settlementCycleStartTimeStr
              params.receiveEndTime = this.settlementVO.settlementCycleEndTimeStr
              params.ids = this.settlementVO.orderIds
              this.addApplyOrder(params)
            }
          }
        })
      },
      addApplyOrder (param) {
        let params = param ? Object.assign(param) : {}
        params.settlementId = this.settlementId
        this.$Ajax.post({
          url: this.$Api.finance.addApplyOrder,
          data: params,
          cb: res => {
            if (res.status === 200) {
              res.data.rows.map((item) => {
                item.applicaFormVOList.map(tmp => {
                  if (parseInt(this.settlementId) === -1) {
                    tmp.isCheck = false
                  } else {
                    if (tmp.stateCode === 2) {
                      tmp.isCheck = true
                    } else {
                      tmp.isCheck = false
                    }
                  }
                })
              })
              this.settlementData = res.data.rows
              this.settlementData.map((item, index) => {
                this.activeNames.push(index)
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .txt_state{color: #fff;font-size: 13px; background: #D8190F; padding: 2px 16px;}
  .row_title{ display: flex;justify-content: space-between;}
  .row_title div{ width: 30%; padding-left: 1%;}
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
    color: #008aff;
    cursor: pointer;
    text-decoration: none;
  }

  .handle:hover {
    text-decoration: underline;
  }

  .but {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
</style>
<style>
  .box_collapse .el-collapse-item__header{ border-bottom-color: gainsboro !important;border-right: solid 1px gainsboro !important;  border-left: solid 1px gainsboro !important;}
  .box_collapse .el-collapse-item__content { padding-bottom: 0;}
</style>
