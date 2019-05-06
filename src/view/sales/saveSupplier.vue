<template>
  <div class="isOkWrap">
      <div class="isOk">
        <img src="../../static/img/isOk.png" height="263" width="274" alt="">
        <el-button type="primary" @click="saveSupplier">还回列表</el-button>
      </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      saveSupplier () {
        this.$router.push({name: 'returnList'})
      }
    }
  }
</script>

<style scoped>
  .isOkWrap {
    position: relative;
    left: 0;
    top: 0;
    height: 80%;
    padding: 0 !impotant;;
    margin: 0;
  }
  .isOk {
    position: absolute;
    width: 274px;
    height: 388px;
    left: 50%;
    top: 50%;
    margin-top: -194px;
    margin-left: -131.5px;
    text-align: center;
  }
  .isOk > button {
    margin-top: 85px;
  }
</style>
