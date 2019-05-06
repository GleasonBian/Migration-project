<template>
    <table-list :data-header="dataHeader" :static=true :data-static="dataStatic" :tab-style="tabStyle"></table-list>
</template>
<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        dataHeader: [{
          prop: 'date',
          label: '日期'
        }, {
          prop: 'name',
          label: '名称'
        }, {
          prop: 'province',
          label: '地区'
        }, {
          prop: 'city',
          label: '地区详情'
        }, {
          prop: 'address',
          label: 'zip名称'
        }],
        dataStatic: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333,
          id: '55488898777788'
        }, {
          date: '2016-05-04',
          name: '王小红',
          province: '北京',
          city: '海淀区',
          address: '海淀区田村',
          zip: 1000256,
          id: 'dSDAD655444521'
        }],
        tabStyle: {
          spanMethod: ({ row, column, rowIndex, columnIndex }) => {
            return this.getSpan({ row, column, rowIndex, columnIndex })
          }
        },
        input: '212'
      }
    },
    methods: {
      getSpan ({ row, column, rowIndex, columnIndex }, $event) {
        if (row.id !== null && row.id === '55488898777788') {
          if (columnIndex) {
            this.$nextTick(() => {
              let res = `<div><div>dsfdsfdsf</div><div>122244</div></div>`
              document.querySelectorAll('.el-table__row')[rowIndex].querySelector('.el-table_1_column_1').querySelector('.cell').innerHTML = res
              // console.log(rowIndex)
            })
            return [0, 6]
          }
        }
      },
      renderNodeName () {
        return (<div><span>dffdgg</span></div>)
      }
    }
  }
</script>
