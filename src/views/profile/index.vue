<template>
  <div class="developer-tool-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix page-container-header">
        <span>个人中心</span>
      </div>
      <div class="page-container-content">
        <el-row>
          <el-col :span="2" class="key"><span>用户名：</span></el-col>
          <el-col :span="10" class="value"><span>{{ userInfo.loginAccount }}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="key"><span>角色：</span></el-col>
          <el-col :span="10" class="value"><span>{{ userInfo.roleId === 1 ? '管理员' : '开发者' }}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="key"><span>姓名：</span></el-col>
          <el-col v-if="!showNameEditForm" :span="10" class="value">
            <span style="margin-right: 30px;">{{ userInfo.name }}</span>
            <el-button size="mini" icon="el-icon-edit" @click="showNameEditForm = true">修改</el-button>
          </el-col>
          <el-col v-else :span="10">
            <el-form :inline="true">
              <el-form-item>
                <el-input v-model="userInfo.name" placeholder="姓名" size="mini" />
              </el-form-item>
              <el-form-item>
                <el-button size="mini" @click="showNameEditForm = false">取消</el-button>
                <el-button size="mini" type="primary" @click="_updateUser">确定</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="key"><span>电话：</span></el-col>
          <el-col v-if="!showTelEditForm" :span="10" class="value">
            <span style="margin-right: 30px;">{{ userInfo.tel }}</span>
            <el-button size="mini" icon="el-icon-edit" @click="showTelEditForm = true">修改</el-button>
          </el-col>
          <el-col v-else :span="10">
            <el-form :inline="true">
              <el-form-item>
                <el-input v-model="userInfo.tel" placeholder="电话" size="mini" />
              </el-form-item>
              <el-form-item>
                <el-button size="mini" @click="showTelEditForm = false">取消</el-button>
                <el-button size="mini" type="primary" @click="_updateUser">确定</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <!--        <el-row>-->
        <!--          <el-col :span="2" class="key"><span>APIUserId：</span></el-col>-->
        <!--          <el-col :span="10" class="value"><span>{{ userInfo.accessId }}</span></el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="2" class="key"><span>APIAccessKey：</span></el-col>-->
        <!--          <el-col :span="10" class="value">-->
        <!--            <span style="margin-right: 30px;">{{ userInfo.accessKey }}</span>-->
        <!--            <el-button size="mini" @click="_resetAccessKey"><svg-icon icon-class="reset" /> 重置</el-button>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-row>
          <el-col :span="2" class="key"><span>密码：</span></el-col>
          <el-col v-if="!showPwdEditForm" :span="10">
            <el-button size="mini" icon="el-icon-edit" @click="showPwdEditForm = true">修改</el-button>
          </el-col>
          <el-col v-else :span="4">
            <el-form>
              <el-form-item>
                <el-input v-model="passwordForm.oldPassword" type="password" placeholder="旧密码" size="mini" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="passwordForm.newPassword" type="password" placeholder="新密码" size="mini" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="passwordForm.newPasswordRepeat" type="password" placeholder="确认密码" size="mini" />
              </el-form-item>
              <el-form-item>
                <el-button size="mini" @click="showPwdEditForm = false">取消</el-button>
                <el-button size="mini" type="primary" @click="_updatePassword">确定</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { resetAccessKey, updateUser, updatePassword } from '@/api/user.js'

export default {
  name: 'Profile',
  props: {},
  data() {
    return {
      userInfo: {
        userId: '',
        loginAccount: '',
        name: '',
        tel: '',
        roleId: '',
        accessId: '',
        accessKey: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: ''
      },
      showPwdEditForm: false,
      showNameEditForm: false,
      showTelEditForm: false
    }
  },
  watch: {
    userInfo: {
      handler(newValue, oldValue) {
        console.log(newValue)
      },
      deep: true
    }

  },
  async created() {
    const {
      userId,
      loginAccount,
      name,
      tel,
      roleId,
      accessId,
      accessKey
    } = await this.$store.dispatch('user/GetUserInfo')
    this.userInfo.userId = userId
    this.userInfo.loginAccount = loginAccount
    this.userInfo.name = name
    this.userInfo.tel = tel
    this.userInfo.roleId = roleId
    this.userInfo.accessId = accessId
    this.userInfo.accessKey = accessKey
  },
  mounted() {},
  methods: {
    closeEditForm() {
      this.showPwdEditForm = false
      this.showNameEditForm = false
      this.showTelEditForm = false
    },
    _updateUser() {
      updateUser(this.userInfo).then(res => {
        if (res.code === 200) {
          this.closeEditForm()
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }
      })
    },
    _resetAccessKey() {
      resetAccessKey().then(res => {
        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }
      })
    },
    _updatePassword() {
      updatePassword(this.passwordForm).then(res => {
        if (res.code === 200) {
          this.closeEditForm()
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .developer-tool-container {
    padding: 20px;
    background: #f0f0f0;
    .el-form-item {
      margin-bottom: 0;
    }
    .page-container-header {
      font-size: 16px;
      font-weight: 600;
      color: #545454;
    }
    .page-container-content {
      .el-row {
        margin: 10px 0;
        line-height: 36px;
      }
      .key, .value {
        font-size: 14px;
        color: rgba(71,86,99,.8);
      }
      .key {
        display: flex;
        justify-content: flex-end;
        font-weight: 500;
        padding: 0 16px;
        text-indent: .7em;
        margin-right: 30px;
        white-space: nowrap;
        text-align: right;
        width: 130px;
      }
    }
    .message-form {
      width: 800px;
      .el-input {
        width: 300px;
        &.time-input {
          width: 50px;
        }
      }
    }
  }
</style>
