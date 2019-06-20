<template>
  <div>
    <tab-but :data="tabData" @on-add="tabAdd"></tab-but>
    <table-list :data-header="dataHeader" :tabStyle="tabStyle" :url="tabUrl" :params="tabParams">
      <template v-slot:template="scope">
        <tab-but :data="tabData11" @on-del="tabDels(scope.row)" @on-edit="tabEdit(scope.row)"></tab-but>
      </template>
    </table-list>
    <v-dialog :dialog="dialogData">
      <form-group :data="dataForm" :rules="rules" @on-cancel="cancel" :clear=true :data-but="dataBut"
                  @close-dialog="closeDialog"></form-group>
    </v-dialog>
    <v-dialog :dialog="dialogDataEdit">
      <form-group :data="dataFormEdit" :rules="rulesEdit" @on-cancel="cancelEdit" :data-but="dataBut1"
                  @close-dialog="closeDialog1" :edit=true></form-group>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        tabUrl: this.$Api.tab.tab,
        tabParams: {
          order: 'asc',
          offset: 0,
          limit: 20,
          tableName: ''
        },
        tabData: [{
          text: '增加',
          key: 'add'
        }, {
          text: '删除',
          key: 'del',
          selection: true,
          url: this.$Api.tab.tabdel,
          filterName: 'ids',
          filterkey: 'id'
        }],
        tabData11: [{
          text: '删除',
          key: 'del',
          url: this.$Api.tab.tabdel
        }, {
          text: '编辑',
          key: 'edit',
          filterName: 'id',
          filterKey: 'id',
          url: this.$Api.tab.tabdel
        }],
        dataHeader: [{
          prop: 'id',
          label: '日期',
          type: 'selection'
        }, {
          prop: 'id',
          label: '日期'
        }, {
          prop: 'tableName',
          label: '名称'
        }, {
          prop: 'className',
          label: '地区'
        }, {
          prop: 'createType',
          label: '城市'
        }, {
          prop: 'comment',
          label: '地区详情'
        }, {
          prop: 'userId',
          label: 'zip名称'
        }, {
          prop: 'cz',
          label: '操作',
          slot: true
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
        dataForm: {
          from: [{
            prop: 'tableName',
            label: '名称',
            value: '',
            type: 'text'
          }, {
            prop: 'className',
            label: '地区',
            value: '',
            type: 'text'
          }, {
            prop: 'createType',
            label: '城市',
            value: null,
            type: 'text'
          }, {
            prop: 'comment',
            label: '地区详情',
            value: '',
            type: 'text'
          }, {
            prop: 'userId',
            label: 'zip名称',
            value: null,
            type: 'text'
          }]
        },
        dataFormEdit: {
          from: [{
            prop: 'tableName',
            label: '名称',
            value: '',
            type: 'text'
          }, {
            prop: 'className',
            label: '地区',
            value: '',
            type: 'text'
          }, {
            prop: 'createType',
            label: '城市',
            value: null,
            type: 'text'
          }, {
            prop: 'comment',
            label: '地区详情',
            value: '',
            type: 'text'
          }, {
            prop: 'userId',
            label: 'zip名称',
            value: null,
            type: 'text'
          }]
        },
        rules: {
          'data.0.value': [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
          'data.1.value': [{required: true, message: '即时配送不能为空', trigger: 'blur'}],
          'data.2.value': [{required: true, message: '活动性质不能为空', trigger: 'blur'}]
        },
        rulesEdit: {
          'data.0.value': [{required: true, message: 'name不能为空', trigger: 'blur'}],
          'data.1.value': [{required: true, message: 'userName不能为空', trigger: 'blur'}]
        },
        dataBut: [{
          text: '确定',
          key: 'ok',
          url: this.$Api.tab.tabUp
        }],
        dataBut1: [{
          text: '确定',
          key: 'ok',
          url: this.$Api.tab.tabUp
        }],
        echoOption: []
      }
    },
    methods: {
      tabDel (data) {
        console.log(data)
      },
      tabAdd () {
        this.dialogData.show = true
        this.$bus.emit('form-clear')
      },
      cancel () {
        this.dialogData.show = false
        this.$bus.emit('form-clear')
      },
      cancelEdit () {
        this.dialogDataEdit.show = false
        this.$bus.emit('form-clear')
      },
      tabEdit (item) {
        this.dialogDataEdit.show = true
        this.$nextTick(() => {
          this.$bus.emit('form-edit-data', this.dataFormEdit.from, item)
        })
      },
      closeDialog () {
        this.dialogData.show = false
      },
      closeDialog1 () {
        this.dialogDataEdit.show = false
      },
      tabDels (item) {
        this.$bus.emit('del-table', {
          url: this.$Api.tab.tabdel,
          data: {
            ids: [item.id]
          }
        })
      }
    }
  }
</script>
