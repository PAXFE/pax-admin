<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!-- 页面内容 -->
    <el-card shadow="never">
      <!--工具栏-->
      <div class="head-container">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <el-form :inline="true" class="search-form">
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-form-item label="名称/描述">
                  <el-input
                    v-model="query.value"
                    clearable
                    size="small"
                    placeholder="输入名称或者描述搜索"
                    class="filter-item"
                    @keyup.enter.native="toQuery"
                  />
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
                <el-form-item>
                  <el-button size="small" type="primary" @click="toQuery">查询</el-button>
                  <el-button size="small" @click="toQuery">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <!-- 新增 -->
          <div v-permission="['admin','roles:add']" style="display: inline-block;margin: 0px 2px;">
            <el-button
              class="filter-item"
              size="small"
              type="primary"
              icon="el-icon-plus"
              @click="add"
            >新增</el-button>
          </div>
          <!-- 导入 -->
          <div style="display: inline-block;">
            <el-button
              :loading="downloadLoading"
              size="small"
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="download"
            >导入</el-button>
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
      <el-row :gutter="15">
        <!--角色管理-->
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">角色列表</span>
            </div>
            <el-table v-loading="loading" :data="data" highlight-current-row size="small" style="width: 100%;" @current-change="handleCurrentChange">
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="dataScope" label="数据权限" />
              <el-table-column prop="permission" label="角色权限" />
              <el-table-column prop="level" label="角色级别" />
              <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />
              <el-table-column :show-overflow-tooltip="true" width="130px" prop="createTime" label="创建日期">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="checkPermission(['admin','roles:edit','roles:del'])" label="操作" width="130px" align="center">
                <template slot-scope="scope">
                  <el-button v-permission="['admin','roles:edit']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
                  <el-popover
                    :ref="scope.row.id"
                    v-permission="['admin','roles:del']"
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
        </el-col>
        <!-- 授权 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
                <span class="role-span">菜单分配</span>
              </el-tooltip>
              <el-button
                v-permission="['admin','roles:edit']"
                :disabled="!showButton"
                :loading="menuLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px"
                type="primary"
                @click="saveMenu"
              >保存</el-button>
            </div>
            <el-tree
              ref="menu"
              :data="menus"
              :default-checked-keys="menuIds"
              :props="defaultProps"
              check-strictly
              accordion
              show-checkbox
              node-key="id"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/role'
import { getMenusTree } from '@/api/menu'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
import { editMenu, get, downloadRole } from '@/api/role'
export default {
  name: 'Role',
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentId: 0, menuLoading: false, showButton: false,
      delLoading: false, menus: [], menuIds: []
    }
  },
  created() {
    this.getMenus()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.showButton = false
      this.url = '/roles'
      const sort = 'level,asc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['blurry'] = value }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      // 清空菜单的选中
      this.$refs.menu.setCheckedKeys([])
      return true
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
    getMenus() {
      getMenusTree().then(res => {
        this.menus = res.result
      })
    },
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.menuIds = []
        // 菜单数据需要特殊处理
        val.menus.forEach(function(data, index) {
          _this.menuIds.push(data.id)
        })
      }
    },
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const menu = { id: data.id }
        role.menus.push(menu)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const menu = { id: data }
        role.menus.push(menu)
      })
      editMenu(role).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    },
    update() {
      // 无刷新更新 表格数据
      get(this.currentId).then(res => {
        for (let i = 0; i < this.data.length; i++) {
          if (res.id === this.data[i].id) {
            this.data[i] = res
            break
          }
        }
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.deptIds = []
      _this.form = { id: data.id, name: data.name, remark: data.remark, depts: data.depts, dataScope: data.dataScope, level: data.level, permission: data.permission }
      if (_this.form.dataScope === '自定义') {
        _this.getDepts()
      }
      for (let i = 0; i < _this.form.depts.length; i++) {
        _this.deptIds[i] = _this.form.depts[i].id
      }
      _this.dialog = true
    },
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadRole(this.params).then(result => {
        downloadFile(result, '角色列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style scoped>
  /deep/ .el-tree-node__label{
    margin-left: 5px;
  }
</style>
