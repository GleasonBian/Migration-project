<template>
  <div>
    <div>审批看板</div><br>
    <div>
      <!--<div class="board_title">-->
        <!--<div style="width: 15px;"></div>-->
        <!--<div>节点</div>-->
        <!--<div>数量</div>-->
      <!--</div>-->
      <el-collapse v-model="activeNames" v-for="(item, index) in listItem" :key="index" class="board_collapse">
        <el-collapse-item :name="index">
          <template slot="title">
            <div class="board_title">
              <div style="width: 15px;">{{index + 1}}</div>
              <div>节点：{{item.nodeCN}}</div>
              <div>数量：{{item.value}}</div>
            </div>
          </template>
          <table-list :data-header="dataHeader" :static="true" :dataStatic="item.listPurchaseStatisticVOS" :refs="refs" class="moreTableList" :tabStyle="tabStyle">
          </table-list>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeNames: [],
        listItem: [],
        dataHeader: [
          {prop: 'projectName', label: ''},
          {prop: 'listPurchaseCount', label: ''}
        ],
        refs: 'table_list',
        tabStyle: {showHeader: false}
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        this.$Ajax.post({
          url: this.$Api.board.buyerReport,
          cb: res => {
            if (res.data.result) {
              this.listItem = res.data.data
            }
          }
        })
      }
    }
  }
</script>

<style>
  .box_board .tr_right{ width: 100%;display: flex;justify-content: space-between;height: 26px}
  .box_board .tr_right .tr_list{width: 130px;display: flex;align-items: center;}
  .box_board .tr_list_2{display: flex;justify-content: center}
  .board_title{width:100%; display: flex;justify-content: flex-start;}
  .board_title div{ width: 30%; padding-left: 1%; font-size: 14px; padding: 6px 12px;}
  .board_collapse .el-collapse-item__content{ padding-bottom: 0;}
</style>
