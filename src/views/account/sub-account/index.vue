<template>
  <div class="app-container">
    <!-- 页面内容 -->
    <el-card shadow="never">
      <detail-list title="主账户信息">
        <detail-list-item term="账户ID">xxxxxx</detail-list-item>
        <detail-list-item term="账户名称">xxxxxx</detail-list-item>
        <detail-list-item term="账户状态">xxxxxx</detail-list-item>
        <detail-list-item term="子账户数量">12</detail-list-item>
        <detail-list-item term="开户时间">xxxxxx</detail-list-item>
      </detail-list>
      <el-divider />
      <detail-list title="子账户列表">
        <!--工具栏-->
        <div class="head-container">
          <!-- 操作按钮区域 -->
          <div class="table-operator">
            <!-- 批量操作 -->
            <div v-if="selectedRowKeys.length > 0" style="display: inline-block;margin: 0px 2px;">
              <el-dropdown>
                <el-button size="small">
                  批量操作<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>激活</el-dropdown-item>
                  <el-dropdown-item>冻结</el-dropdown-item>
                  <el-dropdown-item>解冻</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="standard-table">
          <!--表格渲染-->
          <div class="alert">
            <el-alert type="info" :closable="false">
              <div slot="title">
                已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>&nbsp;项
                <a style="margin-left: 24px" @click="onClearSelected">清空</a>
              </div>
            </el-alert>
          </div>
          <el-table
            ref="standardTable"
            v-loading="loading"
            :data="data"
            size="small"
            style="width: 100%;"
            @selection-change="onSelectChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
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
            <el-table-column v-if="checkPermission(['admin','user:edit','user:del'])" label="查询记账流水" width="125" align="center">
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
        </div>
      </detail-list>
    </el-card>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadUser, edit } from '@/api/user'
import { getDepts } from '@/api/dept'
import { parseTime, downloadFile } from '@/utils/index'
import DetailList from '@/components/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'AccountChange',
  components: {
    DetailList,
    DetailListItem
  },
  mixins: [initData],
  // 设置数据字典
  dicts: ['user_status'],
  data() {
    return {
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

<style scoped>
</style>
