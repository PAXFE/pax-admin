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
                <el-form-item label="打款单号">
                  <el-input v-model="query.blurry" size="small" clearable placeholder="输入打款单号" class="filter-item" @keyup.enter.native="toQuery" />
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
      </div>
      <detail-list title="回填信息">
        <detail-list-item term="付款日期">2019-08-10</detail-list-item>
        <detail-list-item term="付款单号">1234123421</detail-list-item>
        <detail-list-item term="子账户ID">3214321432</detail-list-item>
        <detail-list-item term="子账户名称">xxxxxx</detail-list-item>
        <el-row>
          <el-col :span="24">
            <el-button type="primary" size="small">确认提交</el-button>
          </el-col>
        </el-row>
      </detail-list>
      <el-divider />
      <detail-list title="回填信息">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">回填记录1</el-col>
          <el-col :span="6">
            <el-button type="text">查看详情</el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="6">回填记录2</el-col>
          <el-col :span="6">
            <el-button type="text">查看详情</el-button>
          </el-col>
        </el-row>
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
