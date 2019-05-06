<template>
  <el-breadcrumb :separator-class="separator">
    <el-breadcrumb-item v-for="item in data" :to="{name: item.url}" :key="item.key">{{item.title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: 'v-breadcrumb',
    props: {
      data: Array,
      separator: {
        type: String,
        default: 'el-icon-arrow-right'
      }
    }
  }
</script>

<style scoped>

</style>
