<template>
  <div style="width: 50%">
    <form-group :data="dataForm" class="box_pool" :dataBut="dataBut" @on-cancel="cancel" :custom=true @on-ok="save">
      <template slot-scope="scope" slot="picture">
        <div class="box_nowrap">图片要求：宽高比300x300，小于等于1M，格式为JPG/PNG/GIF</div>
        <v-upload :data="logoData" @on-success-header="logoDataSuccess"></v-upload>
      </template>
      <template slot-scope="scope" slot="pictureSelect">
        <div class="box_nowrap">图片要求：宽高比300x300，小于等于1M，格式为JPG/PNG/GIF</div>
        <v-upload :data="logoDataSelect" @on-success-header="SlogoDataSuccess"></v-upload>
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
                prop: 'name',
                label: '阶段名称：',
                value: '',
                labelWidth: '150px',
                rules: [
                  { required: true, message: '请输入阶段名称', trigger: 'blur,change' },
                  {max: 15, message: '限制在15个汉字内', trigger: 'blur,change'}
                ]
              },
              {
                label: '阶段图片:',
                prop: 'picture',
                labelWidth: '150px',
                custom: true,
                value: '',
                rules: [
                  { required: true, message: '请输入阶段图片', trigger: 'blur,change' }
                ]
              },
              {
                label: '阶段图片(选中状态):',
                prop: 'pictureSelect',
                labelWidth: '150px',
                custom: true,
                value: '',
                rules: [
                  { required: true, message: '请输入阶段图片(选中状态)', trigger: 'blur,change' }
                ]
              },
              {
                label: '阶段说明:',
                prop: 'describtion',
                labelWidth: '150px',
                value: '',
                rules: [
                  {required: true, message: '请输入阶段说明', trigger: 'blur,change'}
                ]
              }
            ]
          },
          logoData: {
            src: '',
            showFileList: false,
            header: true,
            name: 'logoFile'
          },
          logoDataSelect: {
            src: '',
            url: this.$Api.customPackage.uploadLogo2,
            showFileList: false,
            header: true,
            name: 'logoFile2'
          },
          dataBut: [{text: '取消', key: 'cancel'}, {text: '保存', key: 'ok', type: 'primary'}],
          id: '',
          state: ''
        }
      },
      created () {
        this.state = this.$route.params.state
        this.id = this.$route.params.id
        if (this.state === 'edit') {
          this.getData(this.id)
        }
      },
      methods: {
        getData (id) {
          this.$Ajax.get({
            url: this.$Api.customPackage.getPhaseById,
            data: {
              params: {
                id: id
              }
            },
            cb: res => {
              if (res.status === 200) {
                let resdata = res.data.data
                this.dataForm.from.map((item) => {
                  item.value = resdata[item.prop]
                })
                this.logoData.src = this.$ImgPath.imgApi.imgApi + resdata.picture
                this.logoDataSelect.src = this.$ImgPath.imgApi.imgApi + resdata.pictureSelect
              }
            }
          })
        },
        logoDataSuccess (res) {
          this.dataForm.from[1].value = res.message
        },
        SlogoDataSuccess (res) {
          this.dataForm.from[2].value = res.message
        },
        cancel () {
          this.$router.push({name: 'setmealmanager'})
        },
        save (params) {
          if (this.state === 'add') {
            this.uploadData(this.$Api.customPackage.savePhase, params, '保存成功')
          } else if (this.state === 'edit') {
            params.id = this.id
            this.uploadData(this.$Api.customPackage.saveEditPhase, params, '编辑成功')
          }
        },
        uploadData (url, params, message) {
          this.$Ajax.post({
            url: url,
            data: params,
            cb: res => {
              if (res.status === 200) {
                this.$message(message)
                this.$router.push({name: 'setmealmanager'})
              }
            }
          })
        }
      }
    }
</script>

<style>
</style>
