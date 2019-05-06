<template>
  <div>
    <quill-editor :options="option" ref="editor" v-model="editorVal" :style="editorStyle" @change="change" @blur="blur" @focus="focus" @ready="ready"></quill-editor>
    <v-dialog :dialog="dialogData">
      <div :style="dialogStyle">
        <v-upload :data="editorData" @on-success="success" :clear=true></v-upload>
      </div>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'v-editor',
    data () {
      return {
        editorVal: '',
        option: {
          placeholder: '',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{'header': 1}, {'header': 2}],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],
                [{'indent': '-1'}, {'indent': '+1'}],
                [{'direction': 'rtl'}],
                [{'size': ['small', true, 'large', 'huge']}],
                [{'header': [1, 2, 3, 4, 5, 6, true]}],
                [{'color': []}, {'background': []}],
                [{'font': []}],
                [{'align': []}],
                ['link', 'image', 'video'],
                ['clean']],
              handlers: {
                'image': (value) => {
                  if (value) {
                    this.dialogData.show = true
                  } else {
                    this.quill.format('image', false)
                  }
                }
              }
            }
          }
        }
      }
    },
    props: {
      value: String,
      dialogData: {
        type: Object,
        default: function () {
          return {
            show: false,
            width: '600px'
          }
        }
      },
      editorData: {
        type: Object,
        default: function () {
          return {
            src: '',
            url: this.$Api.common.uploadImage,
            listType: 'picture-card'
          }
        }
      },
      dialogStyle: {
        type: Object,
        default: function () {
          return {
            minHeight: '300px'
          }
        }
      },
      editorStyle: {
        type: Object,
        default: function () {
          return {
            width: '100%',
            height: '600px'
          }
        }
      }
    },
    created () {
      this.updateVal(this.value)
    },
    methods: {
      success (res, file, fileList) {
        if (res.result === true) {
          let editorQquill = this.$refs.editor.quill
          // 获取光标所在位置
          let length = editorQquill.getSelection(true).index
          let imgPath = this.$ImgPath.imgApi.imgApi + res.data.filePath
          // 插入图片  res.info为服务器返回的图片地址
          editorQquill.insertEmbed(length, 'image', imgPath)
          // 调整光标到最后
          editorQquill.setSelection(length + 1)
          this.dialogData.show = false
        } else {
          this.$message.error('图片插入失败')
        }
      },
      change (editor, html, text) {
        this.$emit('on-change', editor, html, text, this.$refs.editor)
      },
      ready (editor) {
        this.$emit('on-ready', editor)
      },
      blur (editor) {
        this.$emit('on-blur', editor)
      },
      focus (editor) {
        this.$emit('on-focus', editor)
      },
      updateVal (val) {
        this.editorVal = val !== '' ? val : this.editorVal
      }
    },
    watch: {
      'value' (val, oldVal) {
        this.updateVal(val)
      }
    }
  }
</script>

<style scoped>
</style>
