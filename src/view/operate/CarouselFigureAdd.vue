<template>
  <div>
    <form-group :data="dataForm" class="box_pool" :dataBut="dataBut" @on-cancel="cancel" :clear=true :custom=true @on-ok="getValid">
      <template v-slot:imgUrl="scope">
        <v-upload :data="uploadData" :customBeforeUpload="customBeforeUpload" @on-success="uploadSuccess" @before-upload="beforeUpload">
          <div><el-button size="small" type="primary">上传标题图片</el-button></div>
        </v-upload>
        <img :src="imgSrc" v-show="imgSrc !== ''" class="editImg" />
      </template>
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
              label: '所属区域:',
              prop: 'typeCode',
              labelWidth: '150px',
              value: '',
              select: [
                {value: 1, label: '自营商城首页banner'},
                {value: 10, label: '微信商城首页banner'},
                {value: 20, label: 'APP商城首页banner'}
              ],
              required: true,
              rules: [{ required: true, message: '请选择所属区域', trigger: 'blur,change' }]
            }, {
              label: '标题:',
              prop: 'title',
              labelWidth: '150px',
              value: '',
              placeholder: '请输入标题'
            }, {
              label: '链接:',
              prop: 'url',
              labelWidth: '150px',
              value: '',
              placeholder: '请输入链接'
            }, {
              label: '显示顺序:',
              prop: 'sortOrderNo',
              labelWidth: '150px',
              value: null,
              type: 'number',
              min: 0,
              placeholder: '请输入数字序号'
            }, {
              label: '描述:',
              prop: 'description',
              labelWidth: '150px',
              value: '',
              type: 'textarea',
              rows: 4,
              placeholder: '请输入描述'
            }, {
              label: '开始时间-结束时间:',
              prop: 'startTimeStr',
              labelWidth: '150px',
              value: '',
              date: {
                type: 'daterange',
                rangeSeparator: '至',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
              }
            }, {
              prop: 'imgUrl',
              label: '标题图片：',
              value: '',
              labelWidth: '150px',
              custom: true,
              required: true,
              rules: [{ required: true, message: '请上传标题图片', trigger: 'blur,change' }]
            }
          ]
        },
        dataBut: [
          {text: '取消', key: 'cancel'}, {text: '保存', key: 'ok', type: 'primary'}
        ],
        uploadData: {
          url: this.$Api.carousel.uploadImage,
          listType: 'text',
          custom: true,
          showFileList: false
        },
        customBeforeUpload: true,
        imgSrc: '',
        isImgFlag: true
      }
    },
    methods: {
      getValid (res) {
        let startTime = ''
        if (res.startTimeStr && res.startTimeStr.length !== 0) {
          startTime = res.startTimeStr + ' 00:00'
        }
        let endTime = ''
        if (res.endTime) {
          endTime = res.endTime + ' 00:00'
        }
        let data = {
          title: this.undefinedToEmpty(res.title),
          url: this.undefinedToEmpty(res.url),
          typeCode: res.typeCode,
          stateCode: 0,
          sortOrderNo: this.undefinedToEmpty(res.sortOrderNo),
          description: this.undefinedToEmpty(res.description),
          imgUrl: res.imgUrl,
          startTimeStr: startTime,
          endTimeStr: endTime
        }
        this.$Ajax.post({
          url: this.$Api.carousel.save,
          data: data,
          cb: res => {
            if (res.data.result) {
              this.$message('新增成功！')
              this.$router.push({name: 'carouselFigure'})
            }
          }
        })
      },
      undefinedToEmpty (val) {
        if (val === undefined) {
          val = ''
        }
        return val
      },
      cancel () {
        this.$bus.emit('form-clear')
      },
      uploadSuccess (res) {
        if (!this.isImgFlag) {
          return
        }
        if (res.result) {
          this.dataForm.from[6].value = res.message
          this.imgSrc = this.$ImgPath.imgApi.imgApi + '/' + res.message
          this.$message('导入文件成功')
        } else {
          this.$message.error(res.message)
        }
      },
      beforeUpload (file) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png'
        if (!isImg) {
          this.$message.error('只能上传图片!')
          this.isImgFlag = false
        } else {
          this.isImgFlag = true
        }
        return this.isImgFlag
      }
    }
  }
</script>

<style scoped>
  .box_pool{ width: 600px; margin: 50px 0 0 50px;}
</style>
<style>
  .box_pool .dataBut{ text-align: center; padding-top: 40px;}
  .editImg{ max-width: 100%;  max-height: 500px;}
</style>
