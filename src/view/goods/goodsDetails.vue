<template>
  <div class="box_det">
    <v-list :data="dataType" :data-list="datalist">
      <template v-slot:picture="scope">
        <img :src="pictureUrl" v-show="pictureUrl === '' ? false : true" />
      </template>
      <template v-slot:mealGoodsClassifyVOList="scope">
        <table-list :data-header="dataHeader" :dataStatic="datalist.mealGoodsClassifyVOList" :static="true">
          <template v-slot:operation="scope">
            <tab-but :data="tabButTable" @on-del="tabTbDel(scope.row)" @on-edit="tabTbEdit(scope.row)"></tab-but>
          </template>
        </table-list>
        <div v-for="(item, index) in datalist.mealGoodsClassifyVOList" :key="index">
          <div class="base_btn_group">
            <div style="display: inline-block;margin-right: 100px">{{item.classifyName}}</div>
          </div>
          <table-list :data-header="ClassdataHeader" :dataStatic="item.mealGoodsVOList" :static="true">
            <template v-slot:goodsState="scope">
              <span>上架</span>
            </template>
          </table-list>
        </div>
      </template>
    </v-list>
    <div>
      <el-button type="primary" style="margin-left: 200px" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataType: [
          {prop: 'phaseName', label: '所属阶段'},
          {prop: 'name', label: '套餐名称'},
          {prop: 'picture', label: '套餐图片', slot: true},
          {prop: 'mealGoodsClassifyVOList', label: '物资分类', slot: true},
          {prop: 'describtion', label: '阶段说明'}
        ],
        ClassdataHeader: [
          {prop: 'goodsName', label: '商品名称', showOverflowTooltip: true},
          {prop: 'brandName', label: '品牌'},
          {prop: 'typeModel', label: '规格型号', showOverflowTooltip: true},
          {prop: 'goodsUnitPrice', label: '商品价格（元）'},
          {prop: 'recommendGoodsCount', label: '推荐数量'},
          {prop: 'stockNumber', label: '库存'},
          {prop: 'goodsState', label: '商品状态', slot: true}
        ],
        dataHeader: [{prop: 'classifyName', label: '类目'}, {prop: 'sort', label: '排序'}],
        datalist: {},
        pictureUrl: '',
        id: ''
      }
    },
    created () {
      this.getphases()
      this.id = this.$route.params.id
      this.getData(this.id)
    },
    methods: {
      getphases (phaseId) {
        this.$Ajax.get({
          url: this.$Api.customPackage.getAllPhaselist,
          data: {},
          cb: res => {
            if (res.status === 200) {
              res.data.map((item) => {
                if (item.id === phaseId) {
                  this.$set(this.datalist, 'phaseName', item.name)
                }
              })
            }
          }
        })
      },
      confirm () {
        this.$router.push({name: 'goodsList'})
      },
      getData (id) {
        this.$Ajax.get({
          url: this.$Api.customPackage.getSetMealById,
          data: {
            params: {
              id: id
            }
          },
          cb: res => {
            if (res.status === 200) {
              let resdata = res.data.data
              this.datalist = resdata
              this.pictureUrl = this.$ImgPath.imgApi.imgApi + '/' + resdata.picture
              this.getphases(resdata.phaseId)
            }
          }
        })
      }
    }
  }
</script>

<style>
  .box_det .v_list_li>span{ width: 150px !important; text-align: right !important; margin-right: 10px;}
  .box_det .v_list_li{margin-bottom: 15px !important;}
  .box_det img {width: 130px; height: 130px; margin: 0 10px 10px 0;}
</style>
