<template>
  <el-cascader
          :props="defaultProps"
          :options="data"
          v-model="modelValue"
          :change-on-select="changeOnSelect"
          @change="handleChange"
          @active-item-change="activeItemChange"
          @blur="blur"
          @focus="focus">
  </el-cascader>
</template>

<script>
  import cites from 'customtemp/cites'

  export default {
    name: 'v-cites',
    data () {
      return {
        data: [],
        modelValue: [],
        defaultProps: {
          label: 'text'
        },
        citesData: []
      }
    },
    props: {
      changeOnSelect: Boolean,
      clear: Boolean,
      disabled: Boolean,
      placeholder: String,
      separator: String,
      value: Array
    },
    created () {
      this.modelValue = this.value !== '[]' ? this.value : this.modelValue
      this.data = cites
    },
    watch: {
      'value': {
        handler (val, oldVal) {
          this.modelValue = val !== '[]' ? val : this.modelValue
        },
        deep: true
      }
    },
    methods: {
      handleChange (val) {
        this.clearCitesData()
        this.filterLabel(this.data, val, this.citesData)
        this.$emit('on-change', {
          label: val,
          value: this.citesData
        })
      },
      filterLabel (data, current, arr) {
        return data.map(item => {
          current.map(ntem => {
            if (item.value === ntem) {
              arr.push(item[this.defaultProps.label])
            }
          })
          if (item.children !== undefined && item.children.length > 0) {
            this.filterLabel(item.children, current, arr)
          }
          return item
        })
      },
      activeItemChange (val) {
        this.clearCitesData()
        this.$emit('active-item-change', val, this.citesData)
      },
      blur (event) {
        this.clearCitesData()
        this.$emit('blur', event, this.citesData)
      },
      focus () {
        this.clearCitesData()
        this.$emit('focus', event, this.citesData)
      },
      clearCitesData () {
        this.citesData = []
      }
    },
    mounted () {
      this.$bus.on('cites-clear', () => {
        this.modelValue = []
      })
    },
    destroyed () {
      this.$bus.off('cites-clear')
    }
  }
</script>

<style scoped>

</style>
