<template>

  <el-container class="login-container">
    <el-header class="page-header">
      <img src="@/assets/images/logo_text.png" alt="logo">
      <!--      <div class="logo-wrapper">-->
      <!--        <img src="@/assets/images/logo.png" alt="logo">-->
      <!--        <p><i>{{title}}</i></p>-->
      <!--      </div>-->
      <p>服务热线：023-67904081</p>
    </el-header>
    <el-main class="page-content">
      <el-row class="content-wrapper">
        <el-col :span="14" class="content-left">
          <img src="@/assets/images/chatu.png" alt="chatu">
        </el-col>
        <el-col :span="10" class="content-right">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
            <div class="title-container">
              <h3 class="title">用户登录</h3>
            </div>
            <el-form-item prop="username">
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
              >
                <img slot="prefix" src="@/assets/images/user.png" alt="user">
              </el-input>
            </el-form-item>
            <el-tooltip v-model="capsTooltip" content="大写已开启" placement="right" manual>
              <el-form-item prop="password">
                <el-input
                  ref="password"
                  v-model="loginForm.password"
                  placeholder="密码"
                  name="password"
                  type="password"
                  tabindex="1"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                >
                  <img slot="prefix" src="@/assets/images/password.png" alt="password">
                </el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item>
              <div class="captcha-wrapper">
                <el-input v-model="loginForm.verifyCode" placeholder="验证码" class="captcha-input" />
                <img src="http://192.168.16.102:27081/cms/user/createRandomCode?1570849306218" alt="captcha">
              </div>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="page-footer">
      <p>Copyright © 2011-2016 百富计算机技术(深圳)有限公司 All Rights Reserved.</p>
    </el-footer>
  </el-container>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      title: 'pax-admin',
      loginForm: {
        username: 'admin',
        password: '123456'
        // verifyCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
.login-container {
  .page-header {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    line-height: 60px;
    img {
      height: 50%;
      margin-top: 15px;
    }
    /*.logo-wrapper {*/
    /*  display: flex;*/
    /*  justify-content: flex-start;*/
    /*  img {*/
    /*    height: 50%;*/
    /*    margin-top: 15px;*/
    /*  }*/
    /*  p {*/
    /*    font-size: 20px;*/
    /*    font-weight: 600;*/
    /*  }*/
    /*}*/
  }
  .page-content {
    background: url("../../assets/images/bg.jpg") no-repeat;
    .content-wrapper {
      position: relative;
      max-width: 640px;
      background: #ffffff;
      margin: 8% auto;
      overflow: hidden;
      .content-left {
        padding: 50px;
        img {
          width: 200px;
          margin-left: 30px;
        }
      }
      .content-right {
        padding: 30px 20px;
        border-left: 1.5px solid #e5e5e5;
        .login-form {
          .title-container {
            position: relative;

            .title {
              font-size: 26px;
              color: #000000;
              margin: 0px auto 20px auto;
              text-align: center;
              font-weight: bold;
            }
          }
          .el-input__prefix {
            img {
              width: 42%;
              margin: 8px;
            }
          }
          .captcha-wrapper {
            display: flex;
            justify-content: space-between;
            .captcha-input {
              width: 55%;
            }
            img {
              height: 35px;
              max-width: 45%;
            }
          }
        }
      }
    }
  }
  .page-footer {
    p {
      text-align: center;
      line-height: 60px;
    }
  }
}

/*@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}*/

/* reset element-ui css */
.login-container {
  .el-input {
    /*display: inline-block;*/
    /*height: 47px;*/
    /*width: 85%;*/

    input {
      /*background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;*/

      /*&:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }*/
    }
  }

  .el-form-item {
    /*border: 1px solid rgba(255, 255, 255, 0.1);*/
    /*background: rgba(0, 0, 0, 0.1);*/
    /*border-radius: 5px;*/
    /*color: #454545;*/
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  /*background-color: $bg;*/
  overflow: hidden;

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
