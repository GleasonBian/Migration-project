<template>
    <div class="content">
      <v-upload :data="uploadData2" @on-success="onUploadSuccess" class="cell_upload">
        <el-button size="mini" icon="el-icon-upload">上传</el-button>
        <el-button size="mini" v-on:click.stop="delRecord" icon="el-icon-delete">删除</el-button>
      </v-upload>
      <el-checkbox-group v-model="checkList" class="my_checkbox-group" size="mini" @change="handleCheckedCitiesChange">
        <el-checkbox :label="item.fileOldName" v-for="(item, index) in dataList1" :key="index" class="my_checkbox">
          <el-tooltip class="item" effect="dark" :content="item.fileOldName" placement="top">
            <div class="item_img" @click.prevent.self="itemLable(item.filePath)">{{item.fileOldName}}</div>
          </el-tooltip>
          <!--<div class="item_img" @click.prevent.self="itemLable(item.filePath)">{{item.fileOldName}}</div>-->
        </el-checkbox>
      </el-checkbox-group>
    </div>
</template>

<script>
  export default {
    props: {
      goodsId: Number,
      dataList1: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        uploadData2: {
          name: 'file',
          src: '',
          showFileList: false,
          url: this.$Api.order.uploadImage2,
          custom: true
        },
        dataList: ['item1', 'item2', 'item3'],
        checkList: [],
        selectIds: []
      }
    },
    created () {
      this.uploadData2.url = this.uploadData2.url + '/' + this.goodsId
    },
    methods: {
      onUploadSuccess () {
        this.$emit('on-success')
      },
      delRecord () {
        if (this.selectIds.length <= 0) {
          this.$message('没有可删除的图片')
          return
        }
        this.$Ajax.post({
          url: this.$Api.order.deleteVoucher2,
          data: {
            ids: this.selectIds
          },
          cb: res => {
            if (res.status === 200) {
              this.$message('删除成功')
              this.$emit('on-success')
            }
          }
        })
      },
      itemLable (item) {
        this.$emit('on-show', item)
      },
      handleCheckedCitiesChange (value) {
        let _this = this
        value.map(x => {
          _this.dataList1.map(y => {
            if (x === y.fileOldName) {
              _this.selectIds.push(y.id)
            }
          })
        })
      }
    }
  }
</script>
<style scoped>
  .cell_upload{
    min-width: 120px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .my_checkbox-group{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .my_checkbox{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    display: block;
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
  }
  .item_img{
    font-size: 12px;
    color: #008aff;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item_img:hover{
    text-decoration: underline;
    cursor: pointer;
  }
</style>
<style>
  .cell_upload .el-button{
    padding: 0px 0px !important;
    display: inline-block;
    border: none;
    color: #008aff;
  }
  .cell_upload .avatar-uploader .el-upload {
    border: none;
    border-radius: 0px;
  }
  .my_checkbox-group .el-checkbox{
    display: block;
  }
  .my_checkbox-group .el-checkbox__label{
    font-size: 12px;
    width: 100px;
  }
  .my_checkbox-group .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }
</style>
