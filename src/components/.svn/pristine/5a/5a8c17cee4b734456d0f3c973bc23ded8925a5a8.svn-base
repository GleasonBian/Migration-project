<template>
    <el-steps :active="data.stepsData" align-center>
        <el-step :title="item.title" :description="item.description" v-for="(item, index) in data.data" :key="index"></el-step>
    </el-steps>
</template>

<script>
  export default {
    name: 'v-step',
    data () {
      return {}
    },
    props: {
      data: {
        type: Object,
        default: function () {
          return {}
        }
      }
    }
  }
</script>