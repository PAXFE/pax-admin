<template>
  <div class="application-mgt-container">
    <el-card shadow="never">
      <div class="filter-container">
        <el-button type="primary" icon="el-icon-plus" class="btn-create" @click="handleCreate">添加</el-button>
        <el-input placeholder="请输入应用名称" v-model="searchText" class="search-wrapper">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>
      <el-row class="table-wrapper">
        <el-row class="table">
          <el-table
            :data="list"
            style="width: 100%">
            <el-table-column v-if="roles[0] === 1" label="用户" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.username }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用类型" align="center">
              <template slot-scope="scope">
<!--                <span v-if="scope.row.appType === '1'" class="svg-container">-->
<!--                  <svg-icon icon-class="android" />-->
<!--                </span>-->
<!--                <span v-if="scope.row.appType === '2'" class="svg-container">-->
<!--                  <svg-icon icon-class="IOS" />-->
<!--                </span>-->
<!--                <span v-if="scope.row.appType === '3'" class="svg-container">-->
<!--                  <svg-icon icon-class="app" />-->
<!--                </span>-->
                <span>{{ scope.row.appType | appTypeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="应用名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.appName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="包名" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.appPackageName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用途" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.appUse }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
                <el-button type="text" size="small" @click="handleUpdate(scope.row)">修改</el-button>
                <el-popover
                  :ref="`popover-${scope.$index}`"
                  placement="top"
                  width="160"
                  style="margin-left: 5px;">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDelete(scope.row.appId, scope.$index)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text" size="small">删除</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </el-row>
      </el-row>
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        class="data-form"
        ref="dataForm"
        :rules="dialogStatus !== 'view' ? rules : {}"
        :model="temp"
        label-position="right"
        label-width="100px">
        <el-form-item v-if="roles[0] === 1" label="用户" prop="userId">
          <span v-if="dialogStatus === 'view'" class="value">{{temp.username}}</span>
          <el-select v-else v-model="temp.userId" filterable placeholder="请选择" style="width: 300px;">
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
          <span v-if="dialogStatus === 'view'" class="value">{{temp.appName}}</span>
          <el-input v-else v-model="temp.appName" maxlength="32" placeholder="请输入" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="应用类型" prop="appType">
          <span v-if="dialogStatus === 'view'" class="value">{{ temp.appType | appTypeFilter }}</span>
          <el-select v-else v-model="temp.appType" filterable placeholder="请选择" style="width: 300px;">
            <el-option
              v-for="item in appTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包名" prop="appPackageName">
          <span v-if="dialogStatus === 'view'" class="value">{{ temp.appPackageName }}</span>
          <el-input v-else v-model="temp.appPackageName" placeholder="请输入" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="用途" prop="appUse">
          <span v-if="dialogStatus === 'view'" class="value">{{ temp.appUse }}</span>
          <el-input v-else v-model="temp.appUse" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="200" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'view'" label="appId">
          <span class="value">{{ temp.appId }}</span>
          <el-tooltip class="item" content="复制" placement="top">
            <span class="svg-container" v-clipboard:copy="temp.appId" v-clipboard:success="clipboardSuccess">
              <svg-icon icon-class="copy" />
            </span>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'view'" label="appSecret">
          <span v-if="isHideAppSecret && temp.appSecret" class="value">{{ `${temp.appSecret.substr(0, 4)}******` }}</span>
          <el-tooltip v-if="isHideAppSecret" content="显示appSecret" placement="top">
            <span @click="isHideAppSecret=false"><svg-icon icon-class="eye-open" /></span>
          </el-tooltip>
          <span v-if="!isHideAppSecret" class="value">{{ temp.appSecret }}</span>
          <el-tooltip v-if="!isHideAppSecret" content="隐藏appSecret" placement="top">
            <span @click="isHideAppSecret=true"><svg-icon icon-class="eye" /></span>
          </el-tooltip>
          <el-tooltip class="item" content="复制" placement="top">
            <span class="svg-container" v-clipboard:copy="temp.appSecret" v-clipboard:success="clipboardSuccess">
              <svg-icon icon-class="copy" />
            </span>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'view'" label="registUrl">
          <span class="value">{{ temp.registUrl }}</span>
          <el-tooltip content="复制" placement="top">
            <span class="svg-container" v-clipboard:copy="temp.registUrl" v-clipboard:success="clipboardSuccess">
              <svg-icon icon-class="copy" />
            </span>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus !== 'view'" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='view' ? dialogFormVisible = false : (dialogStatus==='create'?createData():updateData())">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { fetchApp, fetchAppDetail, addApp, updateApp, deleteApp } from '@/api/application.js'
import { fetchUser } from '@/api/user.js'
import { validName, validatePackage } from '@/utils/validate'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

const appTypeOptions = [
  { 'label': 'Android', 'value': '1' },
  { 'label': 'iOS', 'value': '2' },
  { 'label': 'Other', 'value': '3' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const appTypeKeyValue = appTypeOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})

export default {
  name: 'ApplicationMgt',
  components: { Pagination },
  directives: {
    clipboard
  },
  filters: {
    appTypeFilter(type) {
      return appTypeKeyValue[type]
    }
  },
  data() {
    const _validAppName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入应用名称'))
      } else if (!validName(value)) {
        callback(new Error('请输入2-32位任意字符！'))
      } else {
        callback()
      }
    }
    const _validatePackage = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入包名'))
      } else if (!validatePackage(value)) {
        callback(new Error('请输入正确的包名'))
      } else {
        callback()
      }
    }
    return {
      isHideAppSecret: true,
      searchText: '',
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        parameter: undefined
      },
      list: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加',
        view: '查看'
      },
      temp: {
        userId: undefined,
        appId: undefined,
        appName: '',
        appType: '', // 1:Android  2:IoS  3:Other
        appPackageName: '',
        appUse: ''
      },
      rules: {
        userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
        appName: [{ required: true, trigger: 'blur', validator: _validAppName }],
        appType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
        appPackageName: [{ required: true, trigger: 'blur', validator: _validatePackage }],
        appUse: [{ required: true, message: '请输入用途', trigger: 'blur' }]
      },
      appTypeOptions,
      userOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    handleSearch() {
      this.listQuery.parameter = this.searchText
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchApp(this.listQuery).then(response => {
        this.list = response.result.list
        this.total = response.result.total

        this.listLoading = false
      })
    },
    // 获取下拉选用户
    _fetchUser() {
      fetchUser({
        pageNum: 1,
        pageSize: 10000
      }).then(response => {
        this.userOptions = []
        response.result.list.forEach(item => {
          this.userOptions = [{ 'label': item.name, 'value': item.userId }, ...this.userOptions]
        })
      })
    },
    resetTemp() {
      this.temp = {
        userId: undefined,
        appId: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      if (this.roles[0] === 1) { // 管理员
        this._fetchUser()
      } else {
        this.temp.userId = this.userId
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleView(row) {
      fetchAppDetail(row.appId).then(res => {
        this.temp = Object.assign({}, row, res.result)
        this.dialogStatus = 'view'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (this.roles[0] === 1) { // 管理员
        this._fetchUser()
      } else {
        this.temp.userId = this.userId
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加应用
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addApp(this.temp).then(res => {
            if (res.code === 200) {
              this.getList()
              this.dialogFormVisible = false
              const { appId, appSecret, registUrl } = res.result
              this.$alert(
                `<p style="text-align: left;">
                  <strong>appId：</strong>
                  <span class="value">${appId}</span>
                </p>
                <p style="text-align: left;">
                  <strong>appSecret：</strong>
                  <span class="value">${appSecret}</span>
                </p>
                <p style="text-align: left;">
                  <strong>registUrl：</strong>
                  <span class="value">${registUrl}</span>
                </p>`,
                '成功',
                {
                  confirmButtonText: '确定',
                  type: 'success',
                  center: true,
                  dangerouslyUseHTMLString: true
                }).then(() => {
              })
              // this.$message({
              //   message: res.msg,
              //   type: 'success'
              // })
            }
          })
        }
      })
    },
    // 修改应用
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateApp(this.temp).then(res => {
            if (res.code === 200) {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: res.msg,
                type: 'success'
              })
            }
          })
        }
      })
    },
    // 删除应用
    handleDelete(appId, index) {
      deleteApp(appId).then(res => {
        if (res.code === 200) {
          this.getList()
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.$refs[`popover-${index}`].doClose()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.application-mgt-container {
  padding: 20px;
  .filter-container {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    background: #ffffff;
    .btn-create {
      margin-right: 30px;
    }
    .search-wrapper {
      max-width: 300px;
    }
  }
  .table-wrapper {
    .table {
      background: #ffffff;
    }
  }
  .data-form {
    .value {
      margin-left: 10px;
      font-size: 14px;
      color: rgba(71,86,99,.8);
    }
    .svg-container {
      margin-left: 5px;
    }
  }
}
</style>
<style lang="scss">
@import "~@/styles/element-variables.scss";
.application-mgt-container {
  .el-input-group__append {
    background: $--color-primary;
    border: 1px solid $--color-primary;
    .el-icon-search {
      color: #ffffff;
    }
  }
}
</style>
