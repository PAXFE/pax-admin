<template>
  <div class="application-mgt-container">
    <el-card shadow="never">
      <div class="filter-container">
        <el-form ref="filterForm" label-width="80px">
          <el-row>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
              <el-form-item label="用户">
                <el-input v-model="listQuery.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
              <el-form-item label="应用名称">
                <el-input v-model="listQuery.appName"></el-input>
              </el-form-item>
            </el-col>
            <div v-if="isExpanded">
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-form-item label="注册时间">
                  <el-date-picker
                    v-model="times"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00']"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="handleTimeChange">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                <el-form-item label="clientId">
                  <el-input v-model="listQuery.clientId"></el-input>
                </el-form-item>
              </el-col>
            </div>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="filter-btns" :class="{ 'is-expanded': isExpanded }">
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
                <el-button v-if="!isExpanded" type="text" @click="isExpanded = true">展开 <i class="el-icon-arrow-down"></i></el-button>
                <el-button v-if="isExpanded" type="text" @click="isExpanded = false">收起 <i class="el-icon-arrow-up"></i></el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
            <el-table-column label="应用名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.appName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="clientId" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.clientId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="设备SN" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.deviceSn }}</span>
              </template>
            </el-table-column>
            <el-table-column label="注册时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="在线状态" width="100px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.status === '1' ? '在线' : '下线' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </el-row>
      </el-row>
    </el-card>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { fetchDevice } from '@/api/device.js'

export default {
  name: 'DeviceMgt',
  components: { Pagination },
  props: {},
  data() {
    return {
      isExpanded: false,
      searchText: '',
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        clientId: undefined,
        datetimeb: undefined,
        datetimee: undefined,
        username: undefined,
        appName: undefined
      },
      list: [],
      times: []
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    handleTimeChange(times) {
      this.listQuery.datetimeb = times[0]
      this.listQuery.datetimee = times[1]
    },
    handleReset() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        clientId: undefined,
        datetimeb: undefined,
        datetimee: undefined,
        username: undefined,
        appName: undefined
      }
      this.getList()
    },
    handleSearch() {
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchDevice(this.listQuery).then(response => {
        this.list = response.result.list
        this.total = response.result.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .application-mgt-container {
    padding: 20px;
    .filter-container {
      background: #ffffff;
      .el-date-editor,
      .el-input {
        max-width: 300px;
      }
      .filter-btns {
        &.is-expanded {
          /*display: flex;*/
          /*justify-content: flex-end;*/
        }
      }
    }
    .table-wrapper {
      .table {
        background: #ffffff;
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
  .el-date-editor .el-range-separator {
    width: 10% !important;
  }
}
</style>
