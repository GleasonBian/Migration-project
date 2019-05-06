<template>
  <div class="com_category">
    <el-select v-model="value1" filterable placeholder="请选择" @change="changeVal1">
      <el-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="value2" filterable placeholder="请选择" v-show="show2" @change="changeVal2">
      <el-option
        v-for="item in options2"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="value3" filterable placeholder="请选择" v-show="show3" @change="changeVal3">
      <el-option
        v-for="item in options3"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'VCategory',
    data () {
      return {
        options1: [],
        options2: [],
        options3: [],
        value1: '',
        value2: '',
        value3: '',
        show2: false,
        show3: false,
        dataUrl: '',
        goodsName: ''
      }
    },
    props: {
      data: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    created () {
      this.getData(this.data)
    },
    methods: {
      ajaxPost (params) {
        let options = []
        this.$Ajax.post({
          url: this.dataUrl,
          data: params,
          cb: res => {
            let row = res.data.rows
            if (row) {
              row.map(item => {
                let obj = {}
                obj.value = item.id
                obj.label = item.baseClassName
                options.push(obj)
              })
              return options
            }
          }
        })
        return options
      },
      getData (data) {
        this.dataUrl = data.url
        this.options1 = []
        this.value1 = ''
        this.options1 = this.ajaxPost(data.params)
      },
      changeVal1 () {
        if (this.value1) {
          this.show2 = true
          this.show3 = false
          let params = {parentId: this.value1}
          this.options2 = []
          this.value2 = ''
          this.value3 = ''
          this.options2 = this.ajaxPost(params)
        }
      },
      changeVal2 () {
        if (this.value2) {
          this.show3 = true
          let params = {parentId: this.value2}
          this.options3 = []
          this.value3 = ''
          this.options3 = this.ajaxPost(params)
        }
      },
      changeVal3 () {
        if (this.value3) {
          let id = this.value3
          let baseClassName = this.getName()
          this.$emit('select-name', id, baseClassName)
        }
      },
      getName () {
        let label = ''
        this.options3.map(item => {
          if (item.value === this.value3) {
            label = item.label
          }
        })
        return label
      }
    }
  }
</script>
<style>
  .com_category{  margin: 50px auto 80px;  text-align: center;}
  .com_category .el-select{ width: 265px;}
</style>
