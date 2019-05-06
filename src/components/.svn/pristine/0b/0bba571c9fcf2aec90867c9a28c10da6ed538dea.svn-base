<template>
    <div :class="className" class="centerTemp" :style="{height: height + 'px'}">
        <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'center-temp',
    data () {
      return {
        height: 0
      }
    },
    props: {
      className: String
    },
    created () {
      this.MenuStyle()
    },
    methods: {
      isIE () {
        if (!!window.ActiveXObject || 'ActiveXObject' in window || window.navigator.userAgent.indexOf('MSIE') >= 1) {
          return true
        } else {
          return false
        }
      },
      MenuStyle () {
        if (this.isIE()) {
          this.height = parseInt(document.documentElement.clientHeight + 'px') - 72
        } else {
          this.height = parseInt(document.documentElement.clientHeight + 'px') - (this.$store.state.heightH === '0' ? 72 : parseInt(this.$store.state.heightH))
        }
      },
      setMenuH () {
        this.MenuStyle()
        window.addEventListener('resize', this.setMenuH, false)
      }
    },
    watch: {
      height: function () {
        this.setMenuH()
      }
    }
  }
</script>

<style scoped>
    .centerTemp {
        mix-height: 400px;
        overflow-y: auto;
    }
</style>
