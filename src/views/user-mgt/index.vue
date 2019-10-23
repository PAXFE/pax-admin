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
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系电话" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.tel }}</span>
              </template>
            </el-table-column>
            <el-table-column label="邮箱" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column label="企业名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.enterpriseName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="营业执照" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.busiLicenseImage !== ''"  type="text" @click="handlePreviewImage(scope.row.busiLicenseImage)">查看</el-button>
<!--                <span>{{ scope.row.busiLicenseImage }}</span>-->
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleUpdate(scope.row)">修改</el-button>
                <el-popover
                  :ref="`popover-${scope.$index}`"
                  placement="top"
                  width="160">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleDelete(scope.row.userId, scope.$index)">确定</el-button>
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
        ref="dataForm"
        :rules="rules"
        :model="temp"
        abel-position="right"
        label-width="100px">
        <el-row justify="space-between">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" maxlength="32" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="temp.tel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-input v-model="temp.enterpriseName" maxlength="32" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="营业执照" prop="timestamp">
              <el-upload
                class="upload"
                style="width: 300px;"
                :action="imageAction"
                :on-preview="handlePreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture">
                <el-button size="small" type="primary">{{ fileList.length > 0 ? '重新上传' : '点击上传' }}</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg、png等图片文件，且不超过3M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="营业执照" :visible.sync="previewDialogVisible">
<!--      <img :src="previewImageUrl" alt="previewImage">-->
      <div style="height: 600px">
        <img :src="previewImageUrl" style="max-width: 100%;max-height: 100%;display: block; margin: 0 auto;" alt="营业执照"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { fetchUser, addUser, updateUser, deleteUser } from '@/api/user.js'
import { validName, validEmail, validateMobile, validateTel } from '@/utils/validate'

export default {
  name: 'UserMgt',
  components: { Pagination },
  props: {},
  data() {
    const _validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入姓名'))
      } else if (!validName(value)) {
        callback(new Error('请输入2-32位任意字符！'))
      } else {
        callback()
      }
    }
    const _validEnterpriseName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入企业名称'))
      } else if (!validName(value)) {
        callback(new Error('请输入2-32位任意字符！'))
      } else {
        callback()
      }
    }
    const _validEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const _validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入联系电话'))
      } else if (!validateMobile(value) && !validateTel(value)) {
        callback(new Error('请输入正确的联系电话'))
      } else {
        callback()
      }
    }
    return {
      imageAction: `${process.env.VUE_APP_BASE_API}image/upload`,
      previewDialogVisible: false,
      previewImageUrl: '',
      fileList: [],
      searchText: '',
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      list: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      temp: {
        id: undefined,
        name: '',
        tel: '',
        email: '',
        enterpriseName: '',
        busiLicenseImage: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', validator: _validName }],
        tel: [{ required: true, trigger: 'blur', validator: _validPhone }],
        email: [{ required: true, trigger: 'blur', validator: _validEmail }],
        enterpriseName: [{ required: true, trigger: 'blur', validator: _validEnterpriseName }]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    handleSearch() {},
    getList() {
      this.listLoading = true
      fetchUser(this.listQuery).then(response => {
        this.list = response.result.list
        this.total = response.result.total

        this.listLoading = false
      })
    },
    // 查看营业执照
    handlePreviewImage(imageUrl) {
      this.previewImageUrl = imageUrl
      this.previewDialogVisible = true
    },
    resetTemp() {
      this.fileList = []
      this.temp = {
        id: undefined,
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 上传图片成功
    handleSuccess(response, file, fileList) {
      if (response.code === 10000) {
        this.fileList = [file]
        this.temp.busiLicenseImage = response.result.imageId
      }
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.fileList = []
    },
    // 预览图片
    handlePreview(file) {
      this.handlePreviewImage(file.url)
    },
    // 添加用户
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUser(this.temp).then(res => {
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
    // 修改用户
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.temp).then(res => {
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
    // 删除用户
    handleDelete(userId, index) {
      deleteUser(userId).then(res => {
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
