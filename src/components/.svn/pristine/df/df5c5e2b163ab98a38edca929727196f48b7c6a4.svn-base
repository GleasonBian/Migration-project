<template>
  <div class="upload-box">
    <el-upload
            :name="data.name ? data.name : 'imageFile'"
            ref="data"
            :class="className"
            class="avatar-uploader"
            :action="data.url ? data.url : this.$Api.common.uploadImage"
            :headers="data.headers"
            :multiple="data.multiple"
            :data="data.data"
            :with-credentials="data.withCredentials"
            :show-file-list="data.showFileList"
            :drag="data.drag"
            :accept="data.accept"
            :list-type="data.listType"
            :auto-upload="data.autoUpload"
            :file-list="data.fileList"
            :disabled="data.disabled"
            :limit="data.limit"
            :on-preview="onPreview"
            :on-remove="onRemove"
            :on-success="onSuccess"
            :on-error="onError"
            :on-progress="onProgress"
            :on-change="onChange"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            :http-request="data.httpRequest"
            :on-exceed="onExceed">
      <i class="el-icon-plus" v-if="!data.header && !data.custom"></i>
      <template v-if="data.header">
        <img v-if="data.src" :src="data.src" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </template>
      <slot v-if="data.custom" :items="data"></slot>
    </el-upload>
    <v-dialog v-if="data.dialog" :dialog="dialogData">
      <img width="100%" :src="data.src" :alt="data.src">
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'v-upload',
    data () {
      return {
        dialog: {
          show: false
        }
      }
    },
    // dialog: true 有弹窗  头像替换 header： true 自定义内容custom：true
    props: {
      data: Object,
      dialogData: {
        type: Object,
        default: function () {
          return {
            show: false
          }
        }
      },
      clear: Boolean,
      className: 'v-upload',
      customBeforeUpload: Boolean,
      refs: String
    },
    methods: {
      onPreview (file) {
        if (this.data.dialog) {
          this.data.src = file.url
          this.dialogData.show = true
          this.$emit('on-preview-dialog', file)
        } else {
          this.$emit('on-preview', file)
        }
      },
      onRemove (file, fileList) {
        this.$emit('on-remove', file, fileList)
      },
      onSuccess (res, file, fileList) {
        if (this.data.header) {
          this.data.src = URL.createObjectURL(file.raw)
          this.$emit('on-success-header', res, file, fileList, this.data.src)
        } else {
          this.$emit('on-success', res, file, fileList)
          if (this.clear) {
            this.clearFiles()
          }
        }
      },
      onError (err, file, fileList) {
        this.$emit('on-error', err, file, fileList)
      },
      onProgress (event, file, fileList) {
        this.$emit('on-progress', event, file, fileList)
      },
      onChange (file, fileList) {
        this.$emit('on-change', file, fileList)
      },
      beforeUpload (file) {
        if (!this.customBeforeUpload) {
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png'
          const isLt2M = file.size / 1024 / 1024 < 2
          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
          }
          return isJPG && isLt2M
        } else {
          return this.$emit('before-upload', file)
        }
      },
      beforeRemove (file, fileList) {
        this.$emit('before-remove', file, fileList)
      },
      onExceed (files, fileList) {
        this.$emit('on-exceed', files, fileList)
      },
      clearFiles () {
        let _this = this
        this.$nextTick(function () {
          _this.$refs['data'].clearFiles()
        })
      },
      abort () {
        let _this = this
        this.$nextTick(function () {
          _this.$refs['data'].abort()
        })
      }
    },
    mounted () {
      this.$bus.on('clear-files', (res) => {
        if (!res) {
          this.clearFiles()
        } else {
          if (res === this.refs) {
            this.clearFiles()
          }
        }
      })
      this.$bus.on('abort-file', (res) => {
        if (!res) {
          this.abort()
        } else {
          if (res === this.refs) {
            this.abort()
          }
        }
      })
    },
    destroyed () {
      this.$bus.off('clear-files')
      this.$bus.off('abort-file')
    }
  }
</script>

<style>
  .formPage>div>.el-form{width: 40%;padding:20px}
  .el-form-item.dataBut{text-align:right}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 140px;
    text-align: center;
  }
  .avatar {
    display: block;
  }
  .avatar-uploader-icon, .avatar{
    width: 146px;
    height: 146px;
  }
</style>
