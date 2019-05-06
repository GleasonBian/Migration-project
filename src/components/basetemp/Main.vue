<template>
  <!--<div>-->
  <!--<v-header></v-header>-->
  <!--<div>-->
  <!--<v-menu></v-menu>-->
  <!--<div>-->
  <!--<v-content></v-content>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <el-container>
    <el-header class="el-header_no_padding">
      <v-header></v-header>
    </el-header>
    <el-container>
      <el-aside :style="{'width': widthAside}">
        <v-menu @getCollapse="getCollapse"></v-menu>
      </el-aside>
      <el-main class="el-main_no_padding">
        <v-content></v-content>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data () {
      return {
        widthAside: ''
      }
    },
    methods: {
      getCollapse (res) {
        if (res) {
          this.widthAside = '45px'
        } else {
          this.widthAside = '220px'
        }
      }
    }
  }
</script>
