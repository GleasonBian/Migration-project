<template>
  <div>
    <div class="clearfix">
      <!-- <el-button class="pull-left" type="primary" @click="toPageBoard">梁场概述</el-button> -->
      <el-button class="pull-left" type="primary" @click="toPageBoard1">梁场概述</el-button>
    </div>
    <el-row>
      <el-col :span="14">
        <div class="bg_map">
          <img src="../../static/img/map_bg_gray.png" width="100%" alt="">
          <div class="place place_1 clearfix" @click="jumpToBeamBoard('003')">
            <div class="place_text">靖边</div>
            <img class="place_img" src="../../static/img/icon_place1.png" width="29" alt="">
          </div>
          <div class="place place_2 clearfix" @click="jumpToBeamBoard('002')">
            <div class="place_text">延安</div>
            <img class="place_img" src="../../static/img/icon_place1.png" width="29" alt="">
          </div>
          <div class="place place_3 clearfix" @click="jumpToBeamBoard('006')">
            <img class="place_img fl_no" src="../../static/img/icon_place1.png" width="29" alt="">
            <div class="place_text fl_no" style="margin-top: -16px;">寿光</div>
          </div>
          <div class="place place_4 clearfix" @click="jumpToBeamBoard('004')">
            <img class="place_img" src="../../static/img/icon_place1.png" width="29" alt="">
            <div class="place_text">昌邑南</div>
          </div>
          <div class="place place_5 clearfix" @click="jumpToBeamBoard('008')">
            <img class="place_img" src="../../static/img/icon_place1.png" width="29" alt="">
            <div class="place_text">双鸭山</div>
          </div>
          <div class="place place_6 clearfix" @click="jumpToBeamBoard('007')">
            <img class="place_img" src="../../static/img/icon_place1.png" width="29" alt="">
            <div class="place_text">临海</div>
          </div>
          <div class="place place_7 clearfix" @click="jumpToBeamBoard('005')">
            <img class="place_img" src="../../static/img/icon_place1.png" width="29" alt="">
            <div class="place_text">宝坻</div>
          </div>
          <div class="place place_8 clearfix" @click="jumpToBeamBoard('009')">
            <img class="place_img fl_no" src="../../static/img/icon_place1.png" width="29" alt="">
            <div class="place_text fl_no" style="margin-top: -16px;">襄垣</div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div>今日待办</div><br>
        <el-row>
          <el-col :span="12" style="font-size: 14px;">现场-未收货物资</el-col>
          <el-col :span="12"><el-button type="text" style="font-size: 12px; float: right;" @click="toSceneMore">更多</el-button></el-col>
        </el-row>
        <table-list :data-header="sceneHeader" :refs="sceneRefs" :static="true" :dataStatic="sceneDataTable">
          <template v-slot:code="scope">
            <el-button type="text" @click="toDetScene(scope.row)">{{scope.row.code}}</el-button>
          </template>
        </table-list>
        <br><br>
        <el-row>
          <el-col :span="12" style="font-size: 14px;">采购部-未送货物资</el-col>
          <el-col :span="12"><el-button type="text" style="font-size: 12px; float: right;" @click="toTPurchaseMore">更多</el-button></el-col>
        </el-row>
        <table-list :data-header="tPurchaseHeader" :refs="tPurchaseRefs" :static="true" :dataStatic="tPurchaseDataTable">
          <template v-slot:number="scope">
            <el-button type="text" @click="toReplenish(scope.row)">{{scope.row.number}}</el-button>
          </template>
        </table-list>
      </el-col>
    </el-row>

    <br>
    <!--<div>待办事项</div><br>-->
    <!--<el-tabs v-model="activeName" type="card">-->
      <!--<el-tab-pane label="销售定价" name="tab_sell">-->
        <!--<v-search :data="searchData_sell" @on-click="search_sell"></v-search>-->
        <!--<table-list :data-header="sellHeader" :url="sellUrl" :params="sellPage" :refs="sellRefs" @get-table-data="sellGetTableData">-->
          <!--<template v-slot:handle="scope">-->
            <!--&lt;!&ndash; <router-link class="handle" :to="{name: 'salesDetail', params:{id: scope.row.id, approve: 0}}" tag="a" target="_blank">查看</router-link>&nbsp;&nbsp;&nbsp; &ndash;&gt;-->
            <!--<router-link class="handle" :to="{name: 'salesDetailBoard', params:{id: scope.row.id, approve: 1}}" tag="a" target="_blank">审批</router-link>-->
          <!--</template>-->
        <!--</table-list>-->
        <!--<v-page :data="sellPage" :dataArr="[sellDataSearch]"></v-page>-->
      <!--</el-tab-pane>-->

      <!--<el-tab-pane label="采购定价" name="tab_purchase">-->
        <!--<v-search :data="searchData_purchase" @on-click="search_purchase"></v-search>-->
        <!--<table-list :data-header="purchaseHeader" :url="purchaseUrl" :params="purchasePage" :refs="purchaseRefs" @get-table-data="purchaseGetTableData">-->
          <!--<template v-slot:handle="scope">-->
            <!--&lt;!&ndash; <router-link class="handle" :to="{name: 'detailsProcurement', params:{id: scope.row.id}}" tag="a" target="_blank">查看</router-link>&nbsp;&nbsp;&nbsp; &ndash;&gt;-->
            <!--<router-link class="handle" :to="{name: 'procurementSearch', params:{id: scope.row.id, approve: 1}}" tag="a" target="_blank">审批</router-link>-->
          <!--</template>-->
        <!--</table-list>-->
        <!--<v-page :data="purchasePage" :dataArr="[purchaseDataSearch]"></v-page>-->
      <!--</el-tab-pane>-->
    <!--</el-tabs>-->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        searchData_sell: [{
          key: 'number',
          label: '采购单号:',
          value: '',
          placeholder: '请输入采购单号'
        }],
        searchData_purchase: [{
          key: 'number',
          label: '采购单号:',
          value: '',
          placeholder: '请输入采购单号'
        }],
        activeName: 'tab_sell',
        sellHeader: [
          {prop: 'code', label: '采购单号'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'userName', label: '下单人'},
          {prop: 'listPurchaseGoodsCount', label: '物资数量'},
          {prop: 'goodsPriceTotle', label: '总金额'},
          {prop: 'stateStr', label: '审批状态'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        sellUrl: this.$Api.order.getForAuditListPurchaseList,
        sellPage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          state: 0,
          refs: 'table_board_list_1'},
        sellRefs: 'table_board_list_1',
        sellDataSearch: {},
        purchaseHeader: [
          {prop: 'number', label: '采购单号'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'creater', label: '下单人'},
          {prop: 'purchasePlanGoodsCount', label: '物资数量'},
          {prop: 'goodsPriceTotle', label: '总金额'},
          {prop: 'stateStr', label: '审批状态'},
          {prop: 'handle', label: '操作', slot: true}
        ],
        purchaseUrl: this.$Api.order.getForAuditPurchasePlanList,
        purchasePage: {
          totalNum: 0,
          currentPage: 1,
          offset: 0,
          state: 0,
          refs: 'table_board_list_2'
        },
        purchaseRefs: 'table_board_list_2',
        purchaseDataSearch: {},
        sceneHeader: [
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'noDeliveryGoodsCount', label: '未收货数量'},
          {prop: 'createTimeStr', label: '需求日期'},
          {prop: 'code', label: '采购单号', slot: true, width: '140'}
        ],
        sceneUrl: this.$Api.order.sceneNoDeliveryGoodsThird,
        sceneRefs: 'table_board_scene',
        tPurchaseHeader: [
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'goodsName', label: '商品名称'},
          {prop: 'noDeliveryGoodsCount', label: '未收货数量'},
          {prop: 'companyName', label: '供应商名称'},
          {prop: 'number', label: '采购单号', slot: true, width: '150'}
        ],
        tPurchaseUrl: this.$Api.order.purchaseNoDeliveryGoodsThird,
        tPurchaseRefs: 'table_board_tPurchase',
        sceneDataTable: [],
        tPurchaseDataTable: []
      }
    },
    created () {
      this.getSceneData()
      this.getPurchaseData()
    },
    methods: {
      toPageBoard () {
        let routeData = this.$router.resolve({
          name: 'wisdomBeamBoard'
        })
        window.open(routeData.href, '_blank')
      },
      toPageBoard1 () {
        let routeData = this.$router.resolve({
          name: 'HomeButton'
        })
        window.open(routeData.href, '_blank')
      },
      search_sell (res) {
        this.sellDataSearch = res
        if (JSON.stringify(this.sellDataSearch) === '{}') {
          this.sellPage.offset = 0
          this.sellPage.currentPage = 1
        }
        this.pageUpdateTable([this.sellDataSearch, this.sellPage], this.sellRefs, this)
      },
      search_purchase (res) {
        this.purchaseDataSearch = res
        if (JSON.stringify(this.purchaseDataSearch) === '{}') {
          this.purchasePage.offset = 0
          this.purchasePage.currentPage = 1
        }
        this.pageUpdateTable([this.purchaseDataSearch, this.purchasePage], this.purchaseRefs, this)
      },
      pageUpdateTable (dataArr, tableRefs, self) {
        this.$Utils.pageUpdateTable(dataArr, tableRefs, self)
      },
      toReplenish (row) {
//        this.$router.push({name: 'stockDetails', params: {id: row.replenishId}})
        this.$router.push({name: 'detailsProcurement', params: {id: row.purchasePlanId}})
      },
      toDetScene (row) {
        this.$router.push({name: 'salesDetail', params: {id: row.listPurchaseId, approve: 0}})
      },
      getSceneData () {
        this.$Ajax.post({
          url: this.sceneUrl,
          cb: res => {
            this.sceneDataTable = res.data
          }
        })
      },
      getPurchaseData () {
        this.$Ajax.post({
          url: this.tPurchaseUrl,
          cb: res => {
            this.tPurchaseDataTable = res.data
          }
        })
      },
      toSceneMore () {
        this.$router.push({name: 'moreScene'})
      },
      toTPurchaseMore () {
        this.$router.push({name: 'morePurchase'})
      },
      sellGetTableData (data) {
        this.sellPage.totalNum = data.data.total
      },
      purchaseGetTableData (data) {
        this.purchasePage.totalNum = data.data.total
      },
      jumpToBeamBoard (type) {
        let routeData = this.$router.resolve({
          name: 'beamBoard',
          params: {type: type}
        })
        window.open(routeData.href, '_blank')
//        this.$router.push({name: 'beamBoard', type: type})
      }
    }
  }
</script>

<style scoped>
  .handle{
    font-size: 12px;
    color: #008aff;
    cursor:pointer;
    text-decoration: none;
  }
  .handle:hover{
    text-decoration: underline;
  }
  .bg_map{padding:10px 30px;position: relative;text-align:center;max-width: 650px;margin: 0 auto;}
　.clearfix:after{content:"";height:0;line-height:0;display:block;visibility:hidden;clear:both}
  .clearfix{zoom:1}
  .bg_map .place{position: absolute;left:50%;top:50%;cursor: pointer;}
  .bg_map .place.place_1{margin-left: 2%;margin-top: -4%;}
  .bg_map .place.place_2{margin-left:3%;margin-top: -1%;}
  .bg_map .place.place_3{margin-left: 17%;margin-top: -1%;}
  .bg_map .place.place_4{margin-left: 20%;margin-top: -1%;}
  .bg_map .place.place_5{margin-left: 35%;margin-top: -20%;}
  .bg_map .place.place_6{margin-left: 22%;margin-top:12%;}
  .bg_map .place.place_7{margin-left: 16%;margin-top: -6%;}
  .bg_map .place.place_8{margin-left: 10%;margin-top: -1%;}
  .bg_map .place_img{float: left;}
  .bg_map .place_text{float: left;line-height: 30px;font-size: 12px;color: #31a0ff;margin: 0 -4px;}
  .fl_no{float: none !important;}
</style>
