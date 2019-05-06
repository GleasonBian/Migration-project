<template>
  <div class="box_det">
    <v-list :data="dataType" :data-list="datalist">
      <template slot-scope="scope" slot="picture">
        <img :src="pictureUrl" v-show="pictureUrl === '' ? false : true" />
      </template>
      <template slot-scope="scope" slot="pictureSelect">
        <img :src="pictureSelectUrl" v-show="pictureSelectUrl === '' ? false : true" />
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
            {prop: 'name', label: '阶段名称'},
            {prop: 'picture', label: '阶段图片', slot: true},
            {prop: 'pictureSelect', label: '阶段图片(选中状态)', slot: true},
            {prop: 'describtion', label: '阶段说明'}
          ],
          datalist: {},
          pictureUrl: '',
          pictureSelectUrl: ''
        }
      },
      created () {
        this.getData(this.$route.params.id)
      },
      methods: {
        confirm () {
          this.$router.push({name: 'setmealmanager'})
        },
        getData (id) {
          this.$Ajax.get({
            url: this.$Api.customPackage.getPhaseById,
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
                this.pictureSelectUrl = this.$ImgPath.imgApi.imgApi + '/' + resdata.pictureSelect
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
