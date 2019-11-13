<template>
  <div class="app-container">
    <!-- 页面内容 -->
    <el-card shadow="never">
      <!--工具栏-->
      <div class="head-container">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <el-form :inline="true" class="search-form">
            <el-row :gutter="24">
              <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-form-item label="菜单名称">
                  <el-input v-model="query.value" size="small" clearable placeholder="模糊搜索" class="filter-item" @keyup.enter.native="toQuery" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-form-item label="日期">
                  <el-date-picker
                    v-model="query.date"
                    type="daterange"
                    range-separator=":"
                    class="el-range-editor--small filter-item"
                    size="small"
                    style="max-width: 300px;"
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
          <div v-permission="['admin','menu:add']" style="display: inline-block;margin: 0px 2px;">
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
      <!--表单组件-->
      <eForm ref="form" :is-add="isAdd" />
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :default-expand-all="expand" row-key="id" size="small">
        <el-table-column :show-overflow-tooltip="true" label="菜单名称" width="125px" prop="name" />
        <el-table-column prop="icon" label="图标" align="center" width="60px">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" align="center" label="排序">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="path" label="路由地址" />
        <el-table-column :show-overflow-tooltip="true" prop="permission" label="权限标识" />
        <!--<el-table-column :show-overflow-tooltip="true" prop="componentName" label="组件名称"/>-->
        <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径" />
        <el-table-column prop="iframe" label="外链" width="75px">
          <template slot-scope="scope">
            <span v-if="scope.row.iframe">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="iframe" label="缓存" width="75px">
          <template slot-scope="scope">
            <span v-if="scope.row.cache">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="iframe" label="可见" width="75px">
          <template slot-scope="scope">
            <span v-if="scope.row.hidden">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" width="135px">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(['admin','menu:edit','menu:del'])" label="操作" width="130px" align="center">
          <template slot-scope="scope">
            <el-button v-permission="['admin','menu:edit']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','menu:del']"
              placement="top"
              width="200"
            >
              <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="text" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import initData from '@/mixins/initData'
import { del, downloadMenu } from '@/api/menu'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  name: 'Menu',
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false, expand: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = '/api/menus'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['blurry'] = value }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
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
    add() {
      this.isAdd = true
      this.$refs.form.getMenus()
      this.$refs.form.dialog = true
    },
    edit(data) {
      console.log(data)
      this.isAdd = false
      const _this = this.$refs.form
      _this.getMenus()
      _this.form = { id: data.id, component: data.component, componentName: data.componentName, name: data.name, sort: data.sort, pid: data.pid, path: data.path, iframe: data.iframe.toString(), roles: [], icon: data.icon, cache: data.cache, hidden: data.hidden, level: data.level, permission: data.permission }
      _this.dialog = true
    },
    changExpand() {
      this.expand = !this.expand
      this.init()
    },
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadMenu(this.params).then(result => {
        downloadFile(result, '菜单列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
