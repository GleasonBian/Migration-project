<template>
  <div class="hello">
    <tab-but :data="tabBut" @on-add="tabButAdd"></tab-but>
    <table-list :data="tableData" :data-header="dataHeader" :tabStyle="tabStyle"></table-list>
    <v-dialog :dialog="dialog">
      <form-group :data="dataForm" :dataForm="dataFormsss" :rules="rules">
        <template v-slot:userName="scope">
          bvzbd
        </template>
        <template slot="mn">
          <div>王家良</div>
        </template>
      </form-group>
    </v-dialog>
    <form-group :data="dataForm" :dataForm="dataFormsss" :rules="rules">
      <template v-slot:userName="scope">
        bvzbd
      </template>
      <template slot="mn">
        <div>王家良</div>
      </template>
    </form-group>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        rules: {
          text: [{required: true, message: '年龄不能为空'}],
          name: [{required: true, message: '年龄不能为空'}],
          pass: [{required: true, message: '年龄不能为空'}]
        },
        dataFormsss: {
          labelWidth: '200px'
        },
        dataGroup: {},
        dataForm: [{
          label: '天下',
          prop: 'mn',
          custom: true
        }, {
          label: '天下第一',
          prop: 'text',
          autocomplete: true
        }, {
          label: '用户名',
          prop: 'name',
          value: '',
          prefix: 'userName',
          prepend: 'userName1'
        }, {
          label: '密码',
          prop: 'pass',
          value: '',
          prepend: true,
          labelSlot: true,
          prefix: 'passName'
        }, {
          label: '区域',
          prop: 'select',
          value: [],
          select: [{
            label: '区域一',
            value: '0'
          }, {
            label: '区域二',
            value: '1'
          }, {
            label: '区域三',
            value: '2'
          }]
        }, {
          label: '单选',
          prop: 'radio',
          value: '',
          radio: [{
            label: '线上品牌商赞助'
          }, {
            label: '线下场地免费'
          }]
        }, {
          label: '多选',
          prop: 'checkbox',
          value: [],
          button: true,
          checkbox: [{
            label: '美食/餐厅线上活动',
            name: 'type'
          }, {
            label: '地推活动',
            name: 'type'
          }, {
            label: '线下主题活动',
            name: 'type'
          }, {
            label: '单纯品牌曝光',
            name: 'type'
          }]
        }, {
          label: '时间',
          prop: 'data',
          value: '',
          date: {
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期'
          }
        }],
        dialog: {
          show: false
        },
        dialogFooter: [{
          text: '取消',
          key: 'cancel'
        }, {
          text: '确定',
          key: 'ok'
        }],
        dialogData: [{
          key: 'a',
          label: '用户姓名a:',
          value: '',
          placeholder: '请输入用户姓名，例如：李四',
          rules: [{
            required: true, message: '请输入正确用户名信息', trigger: 'blur'
          }]
        }, {
          key: 'b',
          label: '用户姓名b:',
          value: '',
          placeholder: '请输入用户姓名，例如：李四',
          rules: [{
            required: true, message: '请输入正确用户名信息', trigger: 'blur'
          }]
        }, {
          key: 'c',
          label: '用户姓名c:',
          value: '',
          placeholder: '请输入用户姓名，例如：李四',
          rules: [{
            required: true, message: '请输入正确用户名信息', trigger: 'blur'
          }]
        }, {
          key: 'd',
          label: '用户姓名d:',
          value: '',
          placeholder: '请输入用户姓名，例如：李四',
          rules: [{
            required: true, message: '请输入正确用户名信息', trigger: 'blur'
          }]
        }],
        msg: 'Welcome to Your Vue.js App',
        tabStyle: {
          height: 400
        },
        dataHeader: [{
          prop: 'date',
          label: '日期',
          width: '300',
          type: 'selection'
          /* ,
          slot: true */
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
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1515 弄',
          zip: 200333,
          id: '123456789'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 15185 弄',
          zip: 200333,
          id: '1234566878'
        }],
        tabBut: [{
          text: '增加',
          key: 'add'
        }, {
          text: '删除',
          key: 'del',
          delKey: 'ids',
          delKeyName: 'id',
          url: ''
        }, {
          text: '更新',
          key: 'edit'
        }, {
          text: '查询',
          key: 'search'
        }, {
          text: '重置',
          key: 'reset'
        }, {
          text: '导出',
          key: 'exports'
        }, {
          text: '导入',
          key: 'imports'
        }, {
          text: '自定义',
          key: 'other'
        }]
      }
    },
    methods: {
      ok () {
        this.dialogs.show = true
      },
      tabButAdd () {
        this.dialog.show = true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
