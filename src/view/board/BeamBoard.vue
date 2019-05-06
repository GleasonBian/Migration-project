<template>
  <div>
    <div class="bg_beam_board" :style="{minHeight: (screenHeight-40) + 'px'}">
      <div class="box_beam_board clearfix">
        <div class="box_beam_board_left">
          <div class="bg_beam_map">
            <img src="../../static/img/beamBoard/map_bg.png" width="809" alt="">
            <div class="place clearfix" v-for="(item, index) in placeList" :key="index"
                 :style="{marginLeft: item.left, marginTop: item.top}">
              <img v-if="item.type === data.code" class="place_img" src="../../static/img/beamBoard/icon_place_g.gif"
                   width="26" alt="">
              <img v-else class="place_img" src="../../static/img/beamBoard/icon_place.png" width="26" alt="">
              <div class="place_text">{{item.name}}</div>
            </div>
          </div>
          <div class="bg_beam_info">
            <div class="info_title">梁场介绍</div>
            <div class="info_content">
              {{data.remark}}
            </div>
          </div>
        </div>
        <div class="box_beam_board_right">
          <!--订单看板-->
          <div class="bg_beam_order">
            <div class="order_title">{{data.projectName}}-订单看板</div>
            <div class="order_content">
              <div class="title">梁场订单</div>
              <div class="box_circle">
                <div class="circle_box">
                  <div class="bg_circle bg_circle1">{{dataListPurchase.waitQuotationCount}}单</div>
                  <div>待报价</div>
                </div>
                <div class="circle_box">
                  <div class="bg_circle bg_circle2">{{dataListPurchase.approvalCount}}单</div>
                  <div>审批中</div>
                </div>
                <div class="circle_box">
                  <div class="bg_circle bg_circle3">{{dataListPurchase.rejectCount}}单</div>
                  <div>已驳回</div>
                </div>
              </div>
              <img src="../../static/img/beamBoard/icon_line.png" height="1" alt="">
              <div class="title">销售定价</div>
              <div class="clearfix box_sale">
                <div class="pull-left">供应链部</div>
                <div class="pull-right">{{dataListPurchase.providerCount}}单</div>
              </div>
              <div class="clearfix box_sale">
                <div class="pull-left">产品数据部</div>
                <div class="pull-right">{{dataListPurchase.dataCount}}单</div>
              </div>
              <div class="clearfix box_sale">
                <div class="pull-left">财务部</div>
                <div class="pull-right">{{dataListPurchase.financeCount}}单</div>
              </div>
            </div>
          </div>
          <!--采购看板-->
          <div class="bg_beam_order">
            <div class="order_title">{{data.projectName}}-采购看板</div>
            <div class="order_content">
              <div class="title">梁场采购单</div>
              <div class="box_circle">
                <div class="circle_box">
                  <div class="bg_circle bg_circle1">{{dataListPlan.waitQuotationCount}}单</div>
                  <div>报价中</div>
                </div>
                <div class="circle_box">
                  <div class="bg_circle bg_circle2">{{dataListPlan.approvalCount}}单</div>
                  <div>审批中</div>
                </div>
                <div class="circle_box">
                  <div class="bg_circle bg_circle3">{{dataListPlan.rejectCount}}单</div>
                  <div>已驳回</div>
                </div>
              </div>
              <img src="../../static/img/beamBoard/icon_line.png" height="1" alt="">
              <div class="title">采购定价</div>
              <div class="clearfix box_sale">
                <div class="pull-left">采购部</div>
                <div class="pull-right">{{dataListPlan.providerCount}}单</div>
              </div>
              <div class="clearfix box_sale">
                <div class="pull-left">供应商部</div>
                <div class="pull-right">{{dataListPlan.dataCount}}单</div>
              </div>
              <div class="clearfix box_sale">
                <div class="pull-left">财务部</div>
                <div class="pull-right">{{dataListPlan.financeCount}}单</div>
              </div>
            </div>
          </div>
          <!--经营看板-->
          <div class="bg_beam_order">
            <div class="order_title">{{data.projectName}}-经营看板</div>
            <div class="order_content">
              <div class="title">梁场结算</div>
              <div class="clearfix box_sale">
                <div class="pull-left">已收发票</div>
                <div class="pull-right">{{dataManage.projectInvoiceMoney}}万</div>
              </div>
              <div class="clearfix box_sale">
                <div class="pull-left">已回款</div>
                <div class="pull-right">{{dataManage.projectPayed}}万</div>
              </div>
              <div class="clearfix box_sale mb_20">
                <div class="pull-left">未回款</div>
                <div class="pull-right">{{dataManage.projectNotPayed}}万</div>
              </div>
              <img src="../../static/img/beamBoard/icon_line.png" height="1" alt="">
              <div class="title">供应商付款</div>
              <div class="clearfix box_sale">
                <div class="pull-left">已开发票</div>
                <div class="pull-right">{{dataManage.supplierInvoiceMoney}}万</div>
              </div>
              <div class="clearfix box_sale">
                <div class="pull-left">已付货款</div>
                <div class="pull-right">{{dataManage.supplierPayed}}万</div>
              </div>
              <div class="clearfix box_sale">
                <div class="pull-left">未付货款</div>
                <div class="pull-right">{{dataManage.supplierNotPayed}}万</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        data: {},
        dataManage: {},
        dataListPurchase: {},
        dataListPlan: {},
        screenHeight: document.documentElement.clientHeight,
        type: 0,
        urlData: this.$Api.board.getProjectByNo,
        urlManageBoard: this.$Api.board.manageBoard,
        urlListPurchase: this.$Api.board.listPurchase,
        urlListPlan: this.$Api.board.purchasePlan,
        placeList: [{
          name: '延安',
          left: '44px',
          top: '10px',
          type: '002'
        }, {
          name: '靖边',
          left: '31px',
          top: '-10px',
          type: '003'
        }, {
          name: '昌邑南',
          left: '168px',
          top: '20px',
          type: '004'
        }, {
          name: '宝坻',
          left: '142px',
          top: '-48px',
          type: '005'
        }, {
          name: '寿光',
          left: '147px',
          top: '8px',
          type: '006'
        }, {
          name: '临海',
          left: '184px',
          top: '121px',
          type: '007'
        }, {
          name: '双鸭山',
          left: '308px',
          top: '-161px',
          type: '008'
        }, {
          name: '襄垣',
          left: '90px',
          top: '8px',
          type: '009'
        }]
      }
    },
    created () {
      this.type = this.$route.params.type
      this.getData(this.type)
      this.setScreenH()
    },
    methods: {
      setScreenH () {
        this.screenHeight = document.documentElement.clientHeight
        window.addEventListener('resize', this.setScreenH, false)
      },
      // 根据code值获取梁场
      getData (type) {
        this.$Ajax.get({
          url: this.urlData,
          data: {
            params: {
              projectNo: type
            }
          },
          cb: res => {
            if (res.data.result) {
              this.data = res.data.data
              this.getManageData(this.data.id)
              this.getListPurchase(this.data.id)
              this.getPurchasePlan(this.data.id)
            }
          }
        })
      },
      // 获取采购订单数据
      getListPurchase (id) {
        this.$Ajax.get({
          url: this.urlListPurchase,
          data: {
            params: {
              projectId: id
            }
          },
          cb: res => {
            if (res.data.result) {
              this.dataListPurchase = res.data.data
            }
          }
        })
      },
      // 获取采购计划数据
      getPurchasePlan (id) {
        this.$Ajax.get({
          url: this.urlListPlan,
          data: {
            params: {
              projectId: id
            }
          },
          cb: res => {
            if (res.data.result) {
              this.dataListPlan = res.data.data
              this.dataManage.projectInvoiceMoney = this.dataManage.projectInvoiceMoney ? this.dataManage.projectInvoiceMoney : 0
              this.dataManage.projectPayed = this.dataManage.projectPayed ? this.dataManage.projectPayed : 0
              this.dataManage.projectNotPayed = this.dataManage.projectNotPayed ? this.dataManage.projectNotPayed : 0
              this.dataManage.supplierInvoiceMoney = this.dataManage.supplierInvoiceMoney ? this.dataManage.supplierInvoiceMoney : 0
              this.dataManage.supplierPayed = this.dataManage.supplierPayed ? this.dataManage.supplierPayed : 0
              this.dataManage.supplierNotPayed = this.dataManage.supplierNotPayed ? this.dataManage.supplierNotPayed : 0
            }
          }
        })
      },
      // 获取经营看板数据
      getManageData (id) {
        this.$Ajax.post({
          url: this.urlManageBoard + '/' + id,
          cb: res => {
            if (res.data.result) {
              this.dataManage = res.data.data
            }
          }
        })
      }
    },
    watch: {
      screenHeight: function () {
        this.setScreenH()
      }
    }
  }
</script>

<style scoped>
  .mb_20 {
    margin-bottom: 20px;
  }

  .bg_beam_board {
    width: 100%;
    background: url('../../static/img/beamBoard/bg_map.png');
    padding-top: 40px;
  }

  .box_beam_board {
    width: 1270px;
    margin: 0 auto;
  }

  .box_beam_board_left {
    float: left;
  }

  .box_beam_board_right {
    float: right;
    margin-top: 5px;
  }

  .bg_beam_map {
    width: 931px;
    height: 766px;
    text-align: center;
    background: url('../../static/img/beamBoard/bg_beam_map.png');
    position: relative;
  }

  .bg_beam_map > img {
    margin-top: 80px;
  }

  .bg_beam_order {
    width: 319px;
    height: 372px;
    background: url('../../static/img/beamBoard/bg_beam_order.png');
    margin-bottom: 18px;
  }

  .order_title {
    width: 100%;
    height: 32px;
    font-size: 14px;
    color: #02d9ff;
    font-weight: bold;
    text-align: center;
    line-height: 32px;
  }

  .order_content {
    padding: 10px 16px;
  }

  .order_content .title {
    font-size: 14px;
    color: #fff;
    line-height: 52px;
  }

  .box_circle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .box_circle .circle_box {
    font-size: 12px;
    color: #fff;
    text-align: center;
  }

  .box_circle .bg_circle {
    width: 68px;
    height: 68px;
    margin-bottom: 6px;
    line-height: 68px;
    background: url(../../static/img/beamBoard/icon_circle1.png);
  }

  .box_circle .bg_circle.bg_circle2 {
    background-image: url(../../static/img/beamBoard/icon_circle2.png);
  }

  .box_circle .bg_circle.bg_circle3 {
    background-image: url(../../static/img/beamBoard/icon_circle3.png);
  }

  .box_sale {
    font-size: 12px;
    color: #b2b8be;
    height: 24px;
    line-height: 24px;
  }

  .bg_beam_info {
    width: 931px;
    height: 357px;
    background: url('../../static/img/beamBoard/bg_info.png');
    margin-top: 34px;
    padding: 30px;
    box-sizing: border-box;
  }

  .info_title {
    font-size: 30px;
    color: #fff;
    line-height: 40px;
  }

  .info_content {
    margin-top: 20px;
    font-size: 16px;
    color: #babec4;
    line-height: 30px;
  }

  .place {
    position: absolute;
    left: 50%;
    top: 50%;
    cursor: pointer;
  }

  .place .place_img {
    float: left;
  }

  .place .place_text {
    float: left;
    line-height: 26px;
    font-size: 12px;
    color: #31a0ff;
    margin: 0 -2px;
  }
</style>
