<template>
</template>

<script>
  export default {
    methods: {
      hh () {
        this.$nextTick(() => {
          this.$bus.emit('set-tab-default-data', list, this.tablePerformance)
        })
      }
    }
  }
</script>

<style scoped>

</style>
