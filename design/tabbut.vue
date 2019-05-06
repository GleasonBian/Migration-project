<template>
  <div>
    <tab-but :data="tabData"></tab-but>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tabData: [{
          text: 'ok',
          key: 'add'
        }, {
          text: 'ggg',
          key: 'ggg'
        }, {
          text: 'nnn',
          key: 'nnn'
        }]
      }
    },
    methods: {
      ggg () {
        console.log('gg')
      },
      nnn () {
        console.log('gg')
      },
      hh () {}
    }
  }
</script>

<style scoped>

</style>
