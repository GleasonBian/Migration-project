<template>
    <div class="box_login">
        <div class="login_page clearfix">
            <img class="pull-left" src="/static/img/login_img.png" width="607"/>
            <div class="pull-right login_right">
                <img src="static/img/header_logo.png" width="110"/>
                <div class="login_title">欢迎进入中台系统</div>
                <form-group :data="loginData" :data-but="dataBut" :custom=true :class-name="loginDataClass" @on-ok="login" :refs="loginFrom">
                    <template slot-scope="scope" slot="userid">
                        <div class="clearfix">
                            <img class="pull-left" src="/static/img/icon_user.png" alt="" height="36"/>
                            <el-input v-model="scope.rows.value" placeholder="请输入账号" class="pull-left"></el-input>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="password">
                        <div class="clearfix">
                            <img class="pull-left" src="/static/img/icon_password.png" alt="" height="36"/>
                            <el-input ref="password" v-focus="$refs" v-model="scope.rows.value" type="password" placeholder="请输入密码" class="pull-left" @keyup.enter.native="loginEnter"></el-input>
                        </div>
                    </template>
                    <template slot-scope="scope" slot="custom">
                        <div class="prompt">{{message}}</div>
                    </template>
                </form-group>
            </div>
        </div>
        <v-dialog :dialog="editUserData">
            <form-group :data="editUserForm" :dataBut="dataBut2" @on-cancel="cancel" @close-dialog="closeDialog">
               <template slot-scope="scope" slot="loginMessage">
                 <div class="login-message-box">您的密码过于简单,请修改密码!</div>
              </template>
            </form-group>
        </v-dialog>
    </div>
</template>

<script>
  import base from 'base'

  export default {
    data () {
      return {
        loginDataClass: 'loginDataClass',
        loginData: {
          labelWidth: '80px',
          from: [{
            prop: 'userid',
            custom: true,
            value: '',
            rules: [{required: true, message: '账号不能为空', trigger: 'blur,change'}]
          }, {
            prop: 'password',
            custom: true,
            value: '',
            rules: [{required: true, message: '密码不能为空', trigger: 'blur,change'}]
          }, {
            custom: true,
            prop: 'custom'
          }]
        },
        dataBut: [{
          text: '登录',
          key: 'ok'
        }],
        message: '',
        loginFrom: 'login_from',
        editUserData: {
          show: false,
          width: '500px'
        },
        editUserForm: {
          labelWidth: '140px',
          class: 'passWordForm',
          from: [{
            label: '',
            custom: true,
            prop: 'loginMessage'
          }, {
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
        dataBut2: [{
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
    methods: {
      login (data) {
        this.$Ajax.post({
          url: this.$Api.login.ajaxLoginCheck,
          data: data,
          cb: res => {
            let status = res.data.result === true ? '201' : ''
            if (res.data.result) {
              if (res.data.message.indexOf('密码过于简单') > -1) {
                this.editUserData.show = true
                return
              } else {
              }
              this.$Utils.setSessionStorage('menuActive', '0-0')
              this.$Utils.setCookie('requirePath', status)
              if (status === '201') {
                this.$router.push({name: base.defaultRouterPath})
              }
            } else {
              this.message = res.data.message
            }
          }
        })
      },
      getRules (index, fn) {
        this.loginData.from[index].rules[0].validator = fn
      },
      loginEnter () {
        this.$bus.emit('get-sbumit', this.loginFrom, this.dataBut[0])
      },
      cancel () {
        this.closeDialogFn()
      },
      closeDialog () {
        this.closeDialogFn()
      },
      closeDialogFn () {
        this.editUserData.show = false
        setTimeout(() => {
          this.$bus.emit('form-clear')
        }, 50)
      }
    },
    directives: {
      focus: {
        // 登录时获取默认焦点事件
        inserted: function (el, res) {
          res.value.password.focus()
        }
      }
    }
  }
</script>
<style>
    .box_login{
        background:#fff;
    }
    .box_login .login_page{
        width: 1200px;
        height:470px;
        position: fixed;
        left:50%;
        top:50%;
        margin-left:-600px;
        margin-top:-235px;
    }
    .login_right{
        padding-top:40px;
        width:500px;
        text-align:center;
    }
    .login_title{
        font-size: 31px;
        color: #333;
        line-height:120px;
        font-family: ".萍方-简";
        font-weight: 100;
    }
    .box_login .el-form{
        width: 400px;
        margin: 0 auto;
    }
    .box_login .el-form .el-input{
        width:auto;
    }
    .login_page .el-form .el-input__inner{
        border-left:none;
        border-radius: 0 4px 4px 0;
        width:200px;
    }
    .box_login .el-form img{
        margin-top: 2px;
    }
    .login_page .dataBut .el-form-item__content .el-button{
        width:246px;
        margin-left: -74px;
        height:40px;
        font-size:16px;
        font-weight:bold;
        color: #fff;
        border-radius: 20px;
        background: -webkit-linear-gradient(left, #3dabff , #39defe);
        background: -o-linear-gradient(right, #3dabff, #39defe);
        background: -moz-linear-gradient(right, #3dabff, #39defe);
        background: linear-gradient(to right, #3dabff , #39defe);
    }
    .login_page .dataBut .el-form-item__content .el-button:hover,
    .login_page .dataBut .el-form-item__content .el-button:active,
    .login_page .dataBut .el-form-item__content .el-button:focus{
        background: -webkit-linear-gradient(left, #0264ff , #02c0fc);
        background: -o-linear-gradient(right, #0264ff, #02c0fc);
        background: -moz-linear-gradient(right, #0264ff, #02c0fc);
        background: linear-gradient(to right, #0264ff , #02c0fc);
    }
    .el-form-item.dataBut.loginDataClass {
        text-align: center;
    }
</style>
<style scoped>
    .message {
        line-height: 12px;
        font-size: 12px;
        color: #ff0000;
        float: left;
    }
    .login-message-box{
      color:red;
      font-size:15px;
    }
</style>
