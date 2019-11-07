<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-form :inline="true" class="search-form">
      <el-form-item label="搜索内容">
        <el-input v-model="query.value" size="small" clearable placeholder="请输入你要搜索的内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="query.date"
          type="daterange"
          range-separator=":"
          class="el-range-editor--small filter-item"
          style="height: 30.5px;width: 220px"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="$parent.toQuery">查询</el-button>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-reset" @click="$parent.toQuery"><span class="svg-container"><svg-icon icon-class="reset" /></span>重置</el-button>
      </el-form-item>
    </el-form>
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
</template>

<script>
import { downloadFile } from '@/utils/index'
import { downloadLog } from '@/api/log'
export default {
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    download() {
      this.$parent.beforeInit()
      this.downloadLoading = true
      downloadLog(this.$parent.params).then(result => {
        downloadFile(result, '系统日志列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>
