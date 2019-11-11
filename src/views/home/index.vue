<template>
  <div class="home-container">
    <el-card shadow="never">
      <div style="padding: 10px">
        <el-radio-group v-model="accountType" size="small">
          <el-radio-button label="用户" />
          <el-radio-button label="商户" />
          <el-radio-button label="服务商" />
          <el-radio-button label="机构" />
        </el-radio-group>
      </div>
      <el-row class="item-list">
        <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
          <div class="item">
            <div class="key">类别</div>
            <div class="value">用户</div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
          <div class="item">
            <div class="key">账户总数</div>
            <div class="value">231</div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
          <div class="item">
            <div class="key">当日借记总笔数</div>
            <div class="value">13</div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
          <div class="item">
            <div class="key">当日借记总金额</div>
            <div class="value">13</div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
          <div class="item">
            <div class="key">当日贷记总笔数</div>
            <div class="value">13</div>
          </div>
        </el-col>
        <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4">
          <div class="item">
            <div class="key">当日贷记总金额</div>
            <div class="value">13</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="never" style="margin-top: 20px;">
      <div style="padding: 10px">
        <el-radio-group v-model="errorType" size="small">
          <el-radio-button label="账户异常" />
          <el-radio-button label="动账异常" />
        </el-radio-group>
      </div>
      <el-table
        ref="standardTable"
        v-loading="loading"
        :data="data"
        size="small"
        style="width: 100%;"
      >
        <el-table-column prop="phone" label="子账户ID" />
        <el-table-column prop="username" label="账户名称" />
        <el-table-column prop="username" label="账户类型" />
        <el-table-column prop="username" label="状态" />
        <el-table-column prop="username" label="币种" />
        <el-table-column prop="phone" label="余额" />
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="最后到账时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查询记账流水" width="125" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['admin','user:edit']" size="mini" type="text" @click="view(scope.row)">进入查询</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </el-card>
    <!--    <el-row class="content">-->
    <!--      <img src="@/assets/images/chatu.png" alt="chatu">-->
    <!--      <p>欢迎进入账务系统平台</p>-->
    <!--    </el-row>-->
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadUser, edit } from '@/api/user'
import { getDepts } from '@/api/dept'
import { parseTime, downloadFile } from '@/utils/index'

export default {
  name: 'Home',
  mixins: [initData],
  // 设置数据字典
  dicts: ['user_status'],
  data() {
    return {
      accountType: '用户',
      errorType: '账户异常',
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      delLoading: false, deptName: '', depts: [], deptId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ]
    }
  },
  created() {
    this.getDeptDatas()
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = '/users'
      const sort = 'id,desc'
      const query = this.query
      const blurry = query.blurry
      const enabled = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (blurry) { this.params['blurry'] = blurry }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadUser(this.params).then(result => {
        downloadFile(result, '用户列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    getDeptDatas() {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (this.deptName) { params['name'] = this.deptName }
      getDepts(params).then(res => {
        this.depts = res.result.content
      })
    },
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.deptId = null
      } else {
        this.deptId = data.id
      }
      this.init()
    },
    add() {
      this.isAdd = true
      // this.$refs.form.getDepts()
      // this.$refs.form.getRoles()
      // this.$refs.form.getRoleLevel()
      this.$refs.form.dialog = true
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    },
    view(data) {
      this.$router.push('/account/flow')
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      // _this.getRoles()
      // _this.getDepts()
      // _this.getRoleLevel()
      _this.roleIds = []
      _this.form = { id: data.id, username: data.username, phone: data.phone, email: data.email, enabled: data.enabled.toString(), roles: [], dept: { id: data.dept.id }, job: { id: data.job.id }}
      data.roles.forEach(function(data, index) {
        _this.roleIds.push(data.id)
      })
      _this.deptId = data.dept.id
      _this.jobId = data.job.id
      // _this.getJobs(_this.deptId)
      _this.dialog = true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        edit(data).then(res => {
          this.$notify({
            title: this.dict.label.user_status[val] + '成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.response.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding: 20px;
  .item-list {
    .key {
      font-size: 14px;
      font-weight: 500;
    }
    .key, .value {
      line-height: 30px;
      text-align: center;
    }
  }
  .content {
    width: 300px;
    margin: 0 auto;
    img {
      width: 100%;
    }
    p {
      font-size: 16px;
      color: #676767;
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>
