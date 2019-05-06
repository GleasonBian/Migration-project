<template>
  <div>
    <form-group :data="dataForm" class="box_pool" :dataBut="dataBut" @on-cancel="cancel" :clear=true :custom=true @on-ok="getValid">
    </form-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          from: [
            {
              label: '应用名称:',
              prop: 'channelName',
              labelWidth: '150px',
              value: '',
              required: true,
              placeholder: '请输入应用名称',
              rules: [{ required: true, message: '请输入应用名称', trigger: 'blur,change' }]
            }, {
              label: '应用说明:',
              prop: 'title',
              labelWidth: '150px',
              value: '',
              required: true,
              placeholder: '请输入应用说明',
              rules: [{ required: true, message: '请输入应用说明', trigger: 'blur,change' }]
            }, {
              label: '应用标示:',
              prop: 'channelCode',
              labelWidth: '150px',
              value: '',
              required: true,
              placeholder: '请输入应用标示',
              rules: [{ required: true, message: '请输入应用标示', trigger: 'blur,change' }]
            }, {
              label: '在线状态:',
              prop: 'statusCode',
              labelWidth: '150px',
              value: '',
              required: true,
              placeholder: '请选择在线状态',
              rules: [{ required: true, message: '请输入应用标示', trigger: 'blur,change' }],
              select: [{
                value: '0',
                label: '草稿'
              }, {
                value: '1',
                label: '在线'
              }, {
                value: '2',
                label: '已下线'
              }]
            }, {
              label: 'IOS下载地址:',
              prop: 'iosDownloadUrl',
              labelWidth: '150px',
              value: '',
              placeholder: '请输入Ios下载地址',
              required: true,
              rules: [{ required: true, message: '请输入Ios下载地址', trigger: 'blur,change' }]
            }, {
              label: 'Android下载地址:',
              prop: 'androidDownloadUrl',
              labelWidth: '150px',
              value: '',
              placeholder: '请输入Android下载地址',
              required: true,
              rules: [{ required: true, message: '请输入Android下载地址', trigger: 'blur,change' }]
            }, {
              label: 'IOS版本代码:',
              prop: 'iosVersionCode1',
              labelWidth: '150px',
              value: '',
              type: 'number',
              min: 0,
              placeholder: '请输入Ios版本代码',
              required: true,
              rules: [{ required: true, message: '请输入Ios版本代码', trigger: 'blur,change' }]
            }, {
              label: 'Android版本代码:',
              prop: 'androidVersionCode1',
              labelWidth: '150px',
              value: '',
              type: 'number',
              min: 0,
              placeholder: '请输入Android版本代码',
              required: true,
              rules: [{ required: true, message: '请输入Android版本代码', trigger: 'blur,change' }]
            }, {
              label: '资源版本:',
              prop: 'sourceVerionCode',
              labelWidth: '150px',
              value: '',
              type: 'number',
              min: 0,
              required: true,
              placeholder: '请输入资源版本',
              rules: [{ required: true, message: '请输入资源版本', trigger: 'blur,change' }]
            }, {
              label: '升级提示:',
              prop: 'note',
              labelWidth: '150px',
              value: '',
              type: 'textarea',
              rows: 4,
              required: true,
              placeholder: '请输入升级提示',
              rules: [{ required: true, message: '请输入升级提示', trigger: 'blur,change' }]
            }, {
              label: '是否强制版本更新:',
              prop: 'isForceUpdateVersionCode',
              labelWidth: '150px',
              value: '',
              required: true,
              placeholder: '请选择是否强制版本更新',
              rules: [{ required: true, message: '请选择是否强制版本更新', trigger: 'blur,change' }],
              select: [{
                value: '0',
                label: '否'
              }, {
                value: '1',
                label: '是'
              }]
            }, {
              label: '是否强制热更新:',
              prop: 'isForceUpdateResourceCode',
              labelWidth: '150px',
              value: '',
              required: true,
              placeholder: '请选择是否强制热更新',
              rules: [{ required: true, message: '请选择是否强制热更新', trigger: 'blur,change' }],
              select: [{
                value: '0',
                label: '否'
              }, {
                value: '1',
                label: '是'
              }]
            }
          ]
        },
        dataBut: [
          {text: '取消', key: 'cancel'}, {text: '保存', key: 'ok', type: 'primary'}
        ]
      }
    },
    methods: {
      getValid (res) {
        if (res.iosVersionCode1 < 0 || res.androidVersionCode1 < 0 || res.sourceVerionCode < 0) {
          this.$message('版本不能小于0！')
          return
        }
        res.iosVersionCode1 = parseInt(res.iosVersionCode1)
        res.androidVersionCode1 = parseInt(res.androidVersionCode1)
        res.sourceVerionCode = parseInt(res.sourceVerionCode)
        this.$Ajax.post({
          url: this.$Api.operate.save,
          data: res,
          cb: res => {
            if (res.data.result) {
              this.$message('创建成功！')
              this.$router.push({name: 'versionInfor'})
            }
          }
        })
      },
      cancel () {
        this.$bus.emit('form-clear')
      }
    }
  }
</script>

<style scoped>
  .box_pool{ width: 600px; margin: 50px 0 0 50px;}
</style>
<style>
  .box_pool .dataBut{ text-align: center; padding-top: 40px;}
</style>
