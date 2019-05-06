<template>
  <div>
    <v-upload :data="uploadData"></v-upload>
    <v-upload :data="uploadData1"></v-upload>
    <v-upload :data="uploadData2"><el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div></v-upload>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        uploadData: {
          src: '',
          url: this.$Api.common.uploadImage,
          listType: 'picture-card',
          dialog: true
        },
        uploadData1: {
          src: '',
          url: this.$Api.common.uploadImage,
          showFileList: false,
          header: true
        },
        uploadData2: {
          src: '',
          url: this.$Api.common.uploadImage,
          custom: true
        }
      }
    }
  }
</script>

<style>
  .tabTreeNode {
    padding-left: 10px;
  }
</style>
