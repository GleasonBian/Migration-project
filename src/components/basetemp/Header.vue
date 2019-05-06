<template>
    <div ref="header" class="header clearfix">
        <img class="header_log pull-left " src="static/img/header_logo.png" alt="" height="38"/>
        <div class="header_title pull-left">中台</div>
        <div class="bizHeader pull-left">
            <biz-header></biz-header>
        </div>
        <div class="othterMenu  pull-right clearfix">
            <em v-for="(meun, index) in othterMenu" @click="menus(meun, index)"
                :class="activeFn(index)">{{meun.name}}</em>
            <span class="user_info clearfix" @click="editUser">
              <img class="pull-left user_icon" src="static/img/user_icon.png"/>
              <span class="pull-left">{{name}}</span>
            </span>
            <span class="logout" @click="logout">退出</span>
        </div>
        <v-dialog :dialog="editUserData">
            <form-group :data="editUserForm" :dataBut="dataBut" @on-cancel="cancel"
                        @close-dialog="closeDialog"></form-group>
        </v-dialog>
    </div>
</template>

<script>
  import base from 'base'

  export default {
    name: 'v-header',
    data () {
      return {
        name: '',
        othterMenu: [],
        editUserData: {
          show: false,
          width: '560px'
        },
        editUserForm: {
          labelWidth: '140px',
          from: [{
            label: '原密码',
            prop: 'password',
            value: '',
            type: 'password',
            required: true,
            placeholder: '请输入原密码',
            rules: [{trigger: 'blur'}]
          }, {
            label: '新密码',
            prop: 'newPassword',
            value: '',
            type: 'password',
            required: true,
            placeholder: '请输入新密码',
            rules: [
              {required: true, message: '新密码不能为空', trigger: 'blur'},
              {min: 6, max: 12, message: '请输入新密码长度在6到12个字符', trigger: 'blur'}]
          }, {
            label: '再次请输入新密码',
            prop: 'checkPass',
            value: '',
            type: 'password',
            required: true,
            placeholder: '再次请输入新密码',
            rules: [{trigger: 'blur'}]
          }]
        },
        dataBut: [{
          text: '确定',
          key: 'ok',
          url: this.$Api.login.modifyUserPassword
        }, {
          text: '取消',
          key: 'cancel'
        }]
      }
    },
    computed: {
      getOldPass () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入原密码'))
          } else {
            let data = {}
            this.isModifyUserPassword(data, 0)
            this.$Ajax.post({
              url: this.$Api.login.checkOriginalPassword,
              data: data,
              cb: res => {
                if (!res.data) {
                  callback(new Error('原密码不正确，请重新填写!'))
                }
                callback()
              }
            })
          }
        }
      },
      getCheckPass () {
        return (rule, value, callback) => {
          if (!value) {
            callback(new Error('再次请输入新密码'))
          } else if (value !== this.editUserForm.from[1].value) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        }
      }
    },
    created () {
      this.editUserFormFn()
      this.getSystem()
      this.getCurrentUser()
    },
    methods: {
      activeFn (index) {
        return Number(this.$Utils.getSessionStorage('active')) === index ? 'active' : ''
      },
      getSystem () {
        this.$Ajax.post({
          url: this.$Api.login.getSystem,
          cb: res => {
            if (res.data.result) {
              this.othterMenu = res.data.data
              this.setDefaultActive(this.othterMenu)
            }
          }
        })
      },
      setDefaultActive (data) {
        data.map((item, i) => {
          if (item.code === this.$Consts.PERMISSIONRELATIONS.PROJECTNAME) {
            document.title = item.name
            this.$Utils.setSessionStorage('active', i)
          }
        })
      },
      menus (data, index) {
        this.$Utils.setSessionStorage('active', index)
        location.href = '/' + data.urlPath
      },
      getCurrentUser () {
        this.$Ajax.post({
          url: this.$Api.login.getCurrentUser,
          cb: res => {
            if (res.data.result) {
              this.$Utils.setSessionStorage('userInfo', res.data.data)
              this.name = res.data.data.userName
            }
          }
        })
      },
      getLogout () {
        this.$Ajax.post({
          url: this.$Api.login.logout,
          cb: res => {
          }
        })
        this.$Utils.setCookie('requirePath', '')
        if (base.loginPath === 'login') {
          this.$router.push({name: base.loginPath})
        } else {
          location.href = base.loginPath
        }
      },
      logout () {
        this.getLogout()
      },
      editUser () {
        this.editUserData.show = true
      },
      cancel () {
        this.closeDialogFn()
      },
      closeDialog () {
        this.closeDialogFn()
      },
      editUserFormFn () {
        this.getRules(0, this.getOldPass)
        this.getRules(2, this.getCheckPass)
      },
      getRules (index, fn) {
        this.editUserForm.from[index].rules[0].validator = fn
      },
      isModifyUserPassword (data, index) {
        if (this.editUserForm.from[index].value) {
          data[this.editUserForm.from[index].prop] = this.editUserForm.from[index].value
        }
      },
      closeDialogFn () {
        this.editUserData.show = false
        setTimeout(() => {
          this.$bus.emit('form-clear')
        }, 50)
      }
    },
    mounted () {
      this.$store.state.heightH = this.$refs.header.clientHeight + 4
      this.$bus.on('upload-system', () => {
        this.getSystem()
      })
    },
    destroyed () {
      this.$bus.off('upload-system')
    }
  }
</script>
<style>
    .pull-left, .logout {
        cursor: pointer;
    }
</style>
