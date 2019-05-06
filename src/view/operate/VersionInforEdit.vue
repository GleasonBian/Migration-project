<template>
  <div>
    <form-group :data="dataForm" class="box_pool" :dataBut="dataBut" @on-cancel="cancel" :custom=true @on-ok="getValid">
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
              prop: 'iosVersionCode',
              labelWidth: '150px',
              value: '',
              type: 'number',
              min: 0,
              placeholder: '请输入Ios版本代码',
              required: true,
              rules: [{ required: true, message: '请输入Ios版本代码', trigger: 'blur,change' }]
            }, {
              label: 'Android版本代码:',
              prop: 'androidVersionCode',
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
        ],
        tbId: 0
      }
    },
    created () {
      let rows = this.$route.params.rows
      if (rows === undefined) {
        this.$message('请重新选择需要编辑的内容！')
        this.$router.push({name: 'versionInfor'})
      }
      this.setValue(rows)
    },
    methods: {
      setValue (rows) {
        this.dataForm.from[0].value = rows.channelName
        this.dataForm.from[1].value = rows.title
        this.dataForm.from[2].value = rows.channelCode
        let code = '草稿'
        if (rows.status === 'Onine') {
          code = '在线'
        } else if (rows.status === 'OffLine') {
          code = '已下线'
        }
        this.dataForm.from[3].value = code
        this.dataForm.from[4].value = rows.iosDownloadUrl
        this.dataForm.from[5].value = rows.androidDownloadUrl
        this.dataForm.from[6].value = rows.iosVersionCode
        this.dataForm.from[7].value = rows.androidVersionCode
        this.dataForm.from[8].value = rows.sourceVerionCode
        this.dataForm.from[9].value = rows.note
        let isForceUpdateVersionCode = '否'
        if (rows.isForceUpdateVersion !== 'NO') {
          isForceUpdateVersionCode = '是'
        }
        this.dataForm.from[10].value = isForceUpdateVersionCode
        let isForceUpdateResourceCode = '否'
        if (rows.isForceUpdateResource !== 'NO') {
          isForceUpdateResourceCode = '是'
        }
        this.dataForm.from[11].value = isForceUpdateResourceCode
        this.tbId = rows.id
      },
      getValid (res) {
        if (res.iosVersionCode < 0 || res.androidVersionCode < 0 || res.sourceVerionCode < 0) {
          this.$message('版本不能小于0！')
          return
        }
        if (res.statusCode === '草稿') {
          res.statusCode = 0
        } else if (res.statusCode === '在线') {
          res.statusCode = 1
        } else if (res.statusCode === '已下线') {
          res.statusCode = 2
        }
        if (res.isForceUpdateVersionCode === '否') {
          res.isForceUpdateVersionCode = 0
        } else if (res.isForceUpdateVersionCode === '是') {
          res.isForceUpdateVersionCode = 1
        }
        if (res.isForceUpdateResourceCode === '否') {
          res.isForceUpdateResourceCode = 0
        } else if (res.isForceUpdateResourceCode === '是') {
          res.isForceUpdateResourceCode = 1
        }
        res.iosVersionCode = parseInt(res.iosVersionCode)
        res.androidVersionCode = parseInt(res.androidVersionCode)
        res.sourceVerionCode = parseInt(res.sourceVerionCode)
        res.id = this.tbId
        this.$Ajax.post({
          url: this.$Api.operate.update,
          data: res,
          cb: res => {
            if (res.data.result) {
              this.$message('编辑成功！')
              this.$router.push({name: 'versionInfor'})
            }
          }
        })
      },
      cancel () {
        this.$router.push({name: 'versionInfor'})
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
