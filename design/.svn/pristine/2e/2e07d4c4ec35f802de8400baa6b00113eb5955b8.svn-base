<template>
  <div>
    <tab-but :data="tabData" @on-add="tabAdd" @on-edit="tabEdit"></tab-but>
    <table-list :data="tableData" :data-header="dataHeader" :tabStyle="tabStyle"></table-list>
    <v-dialog :dialog="dialogData">
      <form-group :data="dataForm" :rules="rules" @on-cancel="cancel" :clear=true></form-group>
    </v-dialog>
    <v-dialog :dialog="dialogDataEdit">
      <form-group :data="dataFormEdit" :rules="rulesEdit" @on-cancel="cancelEdit" :echo=true></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        tabData: [{
          text: '增加',
          key: 'add'
        }, {
          text: '删除',
          key: 'del',
          delKey: 'ids',
          delKeyName: 'id',
          url: ''
        }, {
          text: '编辑',
          key: 'edit'
        }],
        dataHeader: [{
          prop: 'date',
          label: '日期',
          type: 'selection'
        }, {
          prop: 'name',
          label: '名称',
          width: '100'
        }, {
          prop: 'province',
          label: '地区',
          width: '60'
        }, {
          prop: 'city',
          label: '城市',
          width: '200'
        }, {
          prop: 'address',
          label: '地区详情'
        }, {
          prop: 'zip',
          label: 'zip名称'
        }],
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333,
          id: '5445445545'
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
          border: true
        },
        dialogData: {
          show: false
        },
        dialogDataEdit: {
          show: false
        },
        dataForm: [{
          label: '活动名称',
          prop: 'events',
          value: 'dgadg',
          type: 'text'
        }, {
          label: '即时配送',
          prop: 'delivery',
          value: 'dgdgdg',
          type: 'text'
        }, {
          label: '活动性质',
          prop: 'activities',
          value: '221',
          type: 'text'
        }],
        dataFormEdit: [{
          label: '活动名称',
          prop: 'name',
          value: 'dgadg',
          type: 'text'
        }, {
          label: '即时配送',
          prop: 'userName',
          value: 'dgdgdg',
          type: 'text'
        }],
        rules: {
          'data.0.value': [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
          'data.1.value': [{required: true, message: '即时配送不能为空', trigger: 'blur'}],
          'data.2.value': [{required: true, message: '活动性质不能为空', trigger: 'blur'}]
        },
        rulesEdit: {
          'data.0.value': [{required: true, message: 'name不能为空', trigger: 'blur'}],
          'data.1.value': [{required: true, message: 'userName不能为空', trigger: 'blur'}]
        }
      }
    },
    methods: {
      tabAdd () {
        this.dialogData.show = true
      },
      cancel () {
        this.dialogData.show = false
        this.$bus.emit('form-clear')
      },
      cancelEdit () {
        this.dialogDataEdit.show = false
        this.$bus.emit('form-clear')
      },
      tabEdit () {
        this.dialogDataEdit.show = true
      }
    },
    mounted () {
      this.$bus.on('close-dialog', () => {
        this.dialogData.show = false
      })
    }
  }
</script>
