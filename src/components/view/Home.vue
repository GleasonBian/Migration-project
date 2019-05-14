<template>
    <div class="wecome"></div>
</template>

<script>
import base from 'base'
  export default {
    data(){
        return {

        }
    },
    created() {
        console.log(base)
    },
  }
</script>

<style scoped>
    .wecome {
        background: url('../static/img/wecome.png') no-repeat center center;
        height: 100%;
        padding: 0 !important;
    }
</style>