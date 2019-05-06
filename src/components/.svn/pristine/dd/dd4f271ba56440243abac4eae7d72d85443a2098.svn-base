<template>
  <div class="select-but">
    <el-select v-for="(select, index) in data" :key="index" v-model="row.value"
               :placeholder="select.placeholder ? select.placeholder : '请选择'"
               :clearable="select.clearable"
               :disabled="select.disabled"
               :popper-class="select.popperClass"
               :style="{'display': isDisplay(select)}"
               @change="change"
               @visible-change="visibleChange"
               @remove-tag="removeTag"
               @clear="clear"
               @blur="blur"
               @focus="focus">
      <el-option v-for="item in select[defaultProps.options]"
                 :key="item[defaultProps.value]"
                 :label="item[defaultProps.label]"
                 :value="item[defaultProps.value]"
                 :style="{'display': isDisplay(item)}"></el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: 'SelectBut',
    props: {
      /**
       * row 页面数据值
       * value 的 v-model
       * defaultProps 默认参数名，可在调用的页面传递
       * data select数据
       */
      data: Array,
      defaultProps: {
        type: Object,
        default: function () {
          return {
            options: 'options',
            label: 'label',
            value: 'value',
            prop: 'prop'
          }
        }
      },
      row: Object
    },
    methods: {
      change (val) {
        this.$emit('change', this.row, val, this.filterCurrentData(val, this.$props.data), this.$props.data)
      },
      visibleChange (val) {
        this.$emit('visible-change', this.row, val, this.filterCurrentData(val, this.$props.data), this.$props.data)
      },
      removeTag (val) {
        this.$emit('remove-tag', this.row, val, this.filterCurrentData(val, this.$props.data), this.$props.data)
      },
      clear (val) {
        this.$emit('clear', this.row, val, this.filterCurrentData(val, this.$props.data), this.$props.data)
      },
      blur (val) {
        this.$emit('blur', this.row, val, this.filterCurrentData(val, this.$props.data), this.$props.data)
      },
      focus (val) {
        this.$emit('focus', this.row, val, this.filterCurrentData(val, this.$props.data), this.$props.data)
      },
      isDisplay (item) {
        return item.display === true ? 'none' : 'block'
      },
      filterCurrentData (currentVal, data) {
        let obj = {}
        data.map((ktem, index) => {
          ktem[this.defaultProps.options].map(ntem => {
            if (ntem[this.defaultProps.value] === currentVal) {
              obj.item = ntem
              obj.index = index
            }
          })
        })
        return obj
      },
      createChange (row, val, item, data, obj) {
        data.map(ntem => {
          if (ntem.options) {
            ntem.options.map(otem => {
              if (otem[this.defaultProps.value] === val) {
                obj[item.item[this.defaultProps.prop]](row, val, item, data, obj)
              }
            })
          }
        })
      }
    }
  }
</script>