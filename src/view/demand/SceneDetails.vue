<template>
  <div class="">
    <v-list :data="demandDetaildData" :data-list="demandDetailList" :list-style="listStyle"></v-list>
    <v-list :data="demandRemarkData" :data-list="demandDetailList" :list-style="listStyleRemark">
      <template slot-scope="scope" slot="enclosure">
        <table-list :data-header="dataHeaderEnclosure" :static="true" :dataStatic="dataTableEnclosure" :refs="tableDemandEnclosure">
          <template slot-scope="scope" slot="downFile">
            <a :href="getHrefFile(scope.row.filePath)">下载</a>
          </template>
        </table-list>
      </template>
    </v-list>
    <div style="margin: 10px 0">商品明细</div>
    <table-list :data-header="dataHeaderGoods" :tabStyle="TabStyle" :static=true :dataStatic="dataTableGoodsAll" :refs="tableDemandGoodsDetail">
      <template slot-scope="scope" slot="expand">
        <table-list :data-header="dataHeaderGoods1" :tabStyle="TabStyle1" :static=true :dataStatic="getDataGoodsRelation(scope.row)" :refs="tableDemandGoodsDetail">\
        </table-list>
      </template>
      <template slot-scope="scope" slot="goodsCode">
        <div v-if="scope.row.type === 1">{{scope.row.goodsId}}</div>
        <div v-else>
          <div v-if="scope.row.goodsProviderVO">
            <el-button type="text">已关联商品</el-button>
          </div>
          <el-button v-else type="text" class="el-table__expand-column" ref="aaa">未关联商品</el-button>
        </div>
      </template>
      <template slot-scope="scope" slot="totalGoodsPrice">
        <div v-if="scope.row.type === 1">{{scope.row.unitPrice * scope.row.goodsCount}}</div>
        <div v-else>-</div>
      </template>
    </table-list>
    <div style="margin: 10px 0">审批意见</div>
    <table-list :data-header="dataHeaderOpinion" :static=true :dataStatic="dataTableOpinion" :refs="tableDemandOpinion"></table-list>
    <div style="margin: 10px 0"><el-button @click="returnList">返回列表</el-button></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        TabStyle: {
          cellClassName: function ({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 0 && row.type === 1) {
              return 'ColumnHidden'
            } else if (columnIndex === 0 && !row.goodsProviderVO) {
              return 'ColumnHidden'
            }
          }
        },
        TabStyle1: {
          cellClassName: function ({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 0) {
              return 'ColumnHidden'
            }
          },
          showHeader: false
        },
        listStyle: {
          listwidth: '120px',
          class: 'purchase_list'
        },
        listStyleRemark: {
          listwidth: '120px'
        },
        demandDetailList: {},
        dataTableEnclosure: [],
        demandDetaildData: [
          {prop: 'createTimeStr', label: '创建时间'},
          {prop: 'creater', label: '创建人'},
          {prop: 'typeStr', label: '采购类型'},
          {prop: 'expectedDeliveryTime', label: '期望到货时间'},
          {prop: 'stateStr', label: '需求状态'},
          {prop: 'buyUserName', label: '采购员'},
          {prop: 'buyLinkManPhone', label: '联系方式'},
          {prop: 'projectName', label: '梁场名称'},
          {prop: 'expressLinkMan', label: '收货人'},
          {prop: 'expressLinkManPhone', label: '收货人联系方式'},
          {prop: 'expressAddress', label: '收货地址'}
        ],
        demandRemarkData: [
          {prop: 'remark', label: '备注'},
          {prop: 'enclosure', label: '附件', slot: true}
        ],
        urlDemandDetail: this.$Api.demand.getPurchaseRequestById,
        dataHeaderEnclosure: [{
          prop: 'fileOldName',
          label: '文件名称'
        }, {
          prop: 'downFile',
          label: '下载',
          slot: true
        }],
        tableDemandEnclosure: 'table_demand_enclosure',
        tableDemandGoodsDetail: 'table_demand_goods_detail',
        tableDemandOpinion: 'table_demand_opinion',
        dataHeaderGoods: [{
          type: 'expand',
          prop: 'expand',
          slot: true
        }, {
          prop: 'goodsCode',
          label: '商品编号',
          slot: true
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
          prop: 'unitPrice',
          label: '单价'
        }, {
          prop: 'goodsCount',
          label: '数量'
        }, {
          prop: 'remark',
          label: '其他要求'
        }],
        dataHeaderGoods1: [{
          type: 'expand',
          prop: 'expand',
          slot: true
        }, {
          prop: 'goodsCode',
          label: '商品编号'
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
          prop: 'price',
          label: '单价'
        }, {
          prop: 'goodsCount',
          label: '数量'
        }, {
          prop: 'remark',
          label: '其他要求'
        }],
        dataTableGoodsAll: [],
        dataHeaderOpinion: [
          {
            prop: 'createTimeStr',
            label: '时间'
          },
          {
            prop: 'userName',
            label: '姓名'
          },
          {
            prop: 'phone',
            label: '联系方式'
          },
          {
            prop: 'result',
            label: '接单结果'
          },
          {
            prop: 'remark',
            label: '接单意见'
          }
        ],
        dataTableOpinion: []
      }
    },
    created () {
      let id = this.$route.params.id
      this.getDemantData(id)
    },
    methods: {
      getDataGoodsRelation (res) {
        let arrRelation = []
        if (res.goodsProviderVO) {
          res.goodsProviderVO.goodsCount = res.goodsCount
          res.goodsProviderVO.totalGoodsPrice = res.totalGoodsPrice
          arrRelation.push(res.goodsProviderVO)
          return arrRelation
        }
      },
      ajaxPost (url, data, cb) {
        this.$Ajax.post({
          url: url,
          data: data,
          cb: cb
        })
      },
      getHrefFile (path) {
        return this.$ImgPath.imgApi.imgApi + '/' + path
      },
      getDemantData (id) {
        this.ajaxPost(this.urlDemandDetail, {id: id}, (res) => {
          if (res.data.result) {
            this.demandDetailList = res.data.data
            this.demandDetailList.expressAddress = this.demandDetailList.areaName + this.demandDetailList.expressAddress
            this.dataTableEnclosure = this.demandDetailList.relatedFileVOList
            this.dataTableGoodsAll = this.demandDetailList.purchaseRequestGoodsVOList
            this.dataTableOpinion = this.demandDetailList.purchaseRequestAuditVOList
          }
        })
      },
      jumpPage (nameR) {
        this.$router.push({
          name: nameR
        })
      },
      returnList () {
        this.jumpPage('demandScene')
      }
    }
  }
</script>

<style>
  .ColumnHidden {visibility: hidden}
  .purchase_list > .v_list_li{width: 33% !important;float: left}
  .v_list_cont{width: 100%}
</style>
