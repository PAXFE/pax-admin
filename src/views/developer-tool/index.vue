<template>
  <div class="developer-tool-container">
    <el-card shadow="never">
      <div slot="header" class="clearfix page-container-header">
        <span>消息推送工具</span>
      </div>
      <div class="page-container-content">
        <el-form class="message-form" ref="dataForm" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="应用" prop="appId">
            <el-select v-model="form.appId" filterable placeholder="请选择" style="width: 300px;">
              <el-option
                v-for="item in appOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息标题" prop="title">
            <el-input v-model="form.title" maxlength="32" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="消息内容" prop="content">
            <el-input type="textarea" v-model="form.content" maxlength="200" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="发送对象" prop="clientIds">
            <el-input v-model="form.clientIds" placeholder="请输入clientId，多个用逗号(,)隔开" style="width: 720px;"></el-input>
          </el-form-item>
          <el-form-item label="离线保存" prop="expireTime">
            <el-row>
              <el-col :span="6">
                <el-radio-group v-model="isSave">
                  <el-radio :label="false">不保存</el-radio>
                  <el-radio :label="true">保存</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="18">
                <p v-if="isSave">保存 <el-input class="time-input" size="mini" v-model="form.expireTime"></el-input> 秒，该时段之后上线的用户将收不到消息</p>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="_push">发送</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { fetchApp } from '@/api/application.js'
import { push } from '@/api/dev.js'

export default {
  name: 'DeveloperTool',
  props: {},
  data() {
    return {
      appOptions: [],
      isSave: false,
      form: {
        appId: '',
        title: '',
        content: '',
        clientIds: '',
        expireTime: 0
      },
      rules: {
        appId: [{ required: true, message: '请选择应用', trigger: 'change' }],
        title: [{ required: true, message: '请输入消息标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
        clientIds: [{ required: true, message: '请输入发送对象', trigger: 'blur' }]
      }
    }
  },
  created() {
    this._fetchApp()
  },
  mounted() {},
  methods: {
    // 获取下拉选应用
    _fetchApp() {
      fetchApp({
        pageNum: 1,
        pageSize: 10000
      }).then(response => {
        this.appOptions = []
        response.result.list.forEach(item => {
          this.appOptions = [{ 'label': item.appName, 'value': item.appId }, ...this.appOptions]
        })
      })
    },
    _push() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          push(this.form).then(res => {
            if (res.code === 200) {
              this.$alert(`<strong>messageId：</strong>${res.result}`, '成功', {
                confirmButtonText: '确定',
                type: 'success',
                center: true,
                dangerouslyUseHTMLString: true
              }).then(() => {
                this.isSave = false
                this.form = {
                  appId: '',
                  title: '',
                  content: '',
                  clientIds: '',
                  expireTime: 0
                }
                this.$nextTick(() => {
                  this.$refs['dataForm'].clearValidate()
                })
              })
              // this.$message({
              //   message: res.msg,
              //   type: 'success'
              // })
            }
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
  .page-container-header {
    font-size: 16px;
    font-weight: 600;
    color: #545454;
  }
  .page-container-content {}
  .message-form {
    width: 800px;
    .el-input {
      width: 300px;
      &.time-input {
        width: 70px;
      }
    }
  }
}
</style>
