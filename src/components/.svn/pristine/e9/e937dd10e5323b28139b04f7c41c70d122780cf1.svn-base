<template>
  <el-dialog
    :visible.sync="dialog.show"
    :title="dialog.title"
    :width="dialog.width"
    :fullscreen="dialog.fullscreen"
    :top="dialog.top"
    :modal="dialog.modal"
    :modal-append-to-body="dialog.modalAppendToBody"
    :append-to-body="dialog.appendToBody"
    :lock-scroll="dialog.lockScroll"
    :custom-class="dialog.customClass"
    :close-on-click-modal="dialog.closeOnClickModal"
    :close-on-press-escape="dialog.closeOnPressEscape"
    :show-close="dialog.showClose"
    :center="dialog.center"
    :before-close="beforeClose">
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button v-for="item in dialogFooter" :key="item.text" :type="item.type" @click="buttonEvent(item)">{{item.text}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'v-dialog',
    props: {
      show: Boolean,
      dialog: {
        type: Object,
        default: function () {
          return {}
        }
      },
      dialogFooter: Array
    },
    methods: {
      beforeClose (done) {
        this.$emit('before-close')
        done()
      },
      buttonEvent (item) {
        switch (item.key) {
          case 'ok':
            this.ok(item)
            break
          case 'cancel':
            this.cancel(item)
            break
          case 'reset':
            this.reset(item)
            break
          default:
            this.footerBut(item)
        }
      },
      ok (item) {
        this.$emit('on-ok', item)
      },
      cancel (item) {
        this.dialog.show = false
        this.$emit('on-cancel', item)
      },
      reset (item) {
        this.dialog.show = false
        this.$emit('on-cancel', item)
      },
      footerBut (item) {
        this.$emit('on-footer', item)
      }
    }
  }
</script>

<style scoped>

</style>
