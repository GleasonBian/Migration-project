<template>
  <div>
    <form-group :data="dataForm" :rules="rules" :clear=true :data-but="dataBut"></form-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          from: [{
            prop: 'tableName',
            label: '名称',
            value: '',
            type: 'text',
            show: true
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
          tableName: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
          className: [{required: true, message: '即时配送不能为空', trigger: 'blur'}],
          'from.2.value': [{required: true, message: '活动性质不能为空', trigger: 'blur'}]
        },
        rulesEdit: {
          'from.0.value': [{required: true, message: 'name不能为空', trigger: 'blur'}],
          'from.1.value': [{required: true, message: 'userName不能为空', trigger: 'blur'}]
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
    }
  }
</script>

<style scoped>

</style>
