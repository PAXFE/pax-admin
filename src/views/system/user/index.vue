<template>
  <div class="app-container">
    <!--form 组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dict.user_status" />
    <!-- 页面内容 -->
    <el-card shadow="never">
      <!--工具栏-->
      <div class="head-container">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <el-form :inline="true" class="search-form">
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-form-item label="名称/邮箱">
                  <el-input v-model="query.blurry" size="small" clearable placeholder="输入名称或者邮箱搜索" class="filter-item" @keyup.enter.native="toQuery" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-form-item label="日期">
                  <el-date-picker
                    v-model="query.date"
                    size="small"
                    style="max-width: 300px;"
                    type="daterange"
                    range-separator=":"
                    class="el-range-editor--small filter-item"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-form-item label="状态">
                  <el-select v-model="query.enabled" size="small" clearable placeholder="状态" class="filter-item" @change="toQuery">
                    <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-form-item>
                  <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                    <el-button size="small" type="primary" @click="toQuery">查询</el-button>
                    <el-button size="small" @click="toQuery">重置</el-button>
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <!-- 新增 -->
          <div v-permission="['admin','user:add']" style="display: inline-block;margin: 0px 2px;">
            <el-button
              class="filter-item"
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="add"
            >新增</el-button>
          </div>
          <!-- 导出 -->
          <div style="display: inline-block;">
            <el-button
              :loading="downloadLoading"
              size="small"
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="download"
            >导出</el-button>
          </div>
        </div>
      </div>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" />
        <el-table-column label="部门 / 岗位">
          <template slot-scope="scope">
            <div>{{ scope.row.dept.name }} / {{ scope.row.job.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled,)"
            />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(['admin','user:edit','user:del'])" label="操作" width="125" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['admin','user:edit']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','user:del']"
              placement="top"
              width="180"
            >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="text" size="mini">删除</el-button>
            </el-popover>
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
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadUser, edit } from '@/api/user'
import { getDepts } from '@/api/dept'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  name: 'User',
  components: { eForm },
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
      this.$refs.form.getDepts()
      this.$refs.form.getRoles()
      this.$refs.form.getRoleLevel()
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
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getRoles()
      _this.getDepts()
      _this.getRoleLevel()
      _this.roleIds = []
      _this.form = { id: data.id, username: data.username, phone: data.phone, email: data.email, enabled: data.enabled.toString(), roles: [], dept: { id: data.dept.id }, job: { id: data.job.id }}
      data.roles.forEach(function(data, index) {
        _this.roleIds.push(data.id)
      })
      _this.deptId = data.dept.id
      _this.jobId = data.job.id
      _this.getJobs(_this.deptId)
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
