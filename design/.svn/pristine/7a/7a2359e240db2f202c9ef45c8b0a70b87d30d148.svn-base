<template>
    <div>
        <select-but :data="selectBut" @change="change" ref="selectBut"></select-but>
        <!-- <select-but :data="selectBtn" :ref="'select' + scope.row.id" :row="scope.row"
                      @change="selectChange"></select-but> -->
    </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        selectBut: [{
          value: '选项1',
          clearable: true,
          options: [{
            value: '10',
            label: '黄金糕6',
            prop: 'name10'
          }, {
            value: '11',
            label: '双皮奶',
            prop: 'name11'
          }, {
            value: '12',
            label: '蚵仔煎6',
            prop: 'name12'
          }, {
            value: '13',
            label: '龙须面6',
            prop: 'name13'
          }, {
            value: '14',
            label: '北京烤鸭6',
            prop: 'name14'
          }]
        }, {
          value: '',
          options: [{
            value: '20',
            label: '黄金糕8',
            prop: 'name'
          }, {
            value: '21',
            label: '双皮奶8',
            prop: 'age'
          }, {
            value: '22',
            label: '蚵仔煎',
            prop: 'big'
          }, {
            value: '23',
            label: '龙须面8',
            prop: 'bigs'
          }, {
            value: '24',
            label: '北京烤鸭8',
            prop: 'bigo'
          }]
        }, {
          value: '',
          options: [{
            value: '30',
            label: '黄金糕5',
            prop: 'bigo30'
          }, {
            value: '31',
            label: '双皮奶7',
            prop: 'bigo31'
          }, {
            value: '32',
            label: '蚵仔煎7',
            prop: 'bigo32'
          }, {
            value: '33',
            label: '龙须面7',
            prop: 'bigo33'
          }, {
            value: '34',
            label: '北京烤鸭4',
            prop: 'bigo34'
          }]
        }]
      }
    },
    props: {},
    methods: {
      change (val, item, data) {
        this.$refs.selectBut.createChange(val, item, data, this)
      },
      name10 (val) {
        console.log(val)
      },
      name11 (val) {
        console.log(val)
      },
      name12 (val) {
        console.log(val)
      },
      name13 (val) {
        console.log(val)
      },
      name14 (val) {
        console.log(val)
      }
    }
  }
</script>

<style scoped>

</style>
