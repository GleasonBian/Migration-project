<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import base from 'base'
  export default {
    name: 'app',
    data () {
      return {
        cssData: ['static/css/base.css']
      }
    },
    created () {
      this.getLink(base.assetsPublicPath)
    },
    methods: {
      getLink (path) {
        this.cssData.map(item => {
          this.createLink(path, item)
        })
      },
      createLink (path, item) {
        let head = document.getElementsByTagName('head')[0]
        let link = document.createElement('link')
        link.href = path + item
        link.rel = 'stylesheet'
        head.appendChild(link)
      }
    }
  }
</script>

<style>
  #app {
    height: 100%;
  }

  html, body {
    width: 100%;
  }
</style>
