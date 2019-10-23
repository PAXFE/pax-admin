<template>
  <div class="developer-tool-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix page-container-header">
        <span>开发者信息</span>
      </div>
      <div class="page-container-content">
        <el-row>
          <el-col :span="2" class="key"><span>requestUrl：</span></el-col>
          <el-col :span="10" class="value"><span>{{ userInfo.requestUrl }}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="key"><span>APIUserId：</span></el-col>
          <el-col :span="10" class="value"><span>{{ userInfo.accessId }}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="key"><span>APIAccessKey：</span></el-col>
          <el-col :span="10" class="value">
            <span style="margin-right: 30px;">{{ userInfo.accessKey }}</span>
            <el-button size="mini" @click="_resetAccessKey"><svg-icon icon-class="reset" /> 重置</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { resetAccessKey } from '@/api/user.js'

export default {
  name: 'DeveloperInfo',
  props: {},
  data() {
    return {
      userInfo: {
        requestUrl: '',
        accessId: '',
        accessKey: ''
      }
    }
  },
  async created() {
    const {
      requestUrl,
      accessId,
      accessKey
    } = await this.$store.dispatch('user/getUserInfo')
    this.userInfo.requestUrl = requestUrl
    this.userInfo.accessId = accessId
    this.userInfo.accessKey = accessKey
  },
  mounted() {},
  methods: {
    _resetAccessKey() {
      resetAccessKey().then(res => {
        if (res.code === 200) {
          this.userInfo.accessKey = res.result
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
