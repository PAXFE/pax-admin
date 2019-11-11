<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="isAdd ? '新增角色' : '编辑角色'" append-to-body width="520px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" style="width: 145px;" />
      </el-form-item>
      <el-form-item label="角色权限" prop="permission">
        <el-input v-model="form.permission" style="width: 145px;" />
      </el-form-item>
      <el-form-item label="角色级别" prop="sort">
        <el-input-number v-model.number="form.level" :min="1" controls-position="right" style="width: 145px;" />
      </el-form-item>
      <el-form-item v-if="form.dataScope === '自定义'" label="数据权限">
        <treeselect v-model="deptIds" :options="depts" multiple style="width: 380px" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input v-model="form.remark" style="width: 380px;" rows="5" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/account'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, depts: [], deptIds: [],
      form: { name: '', depts: [], remark: '', dataScope: '本级', level: 3, permission: '' },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.form.dataScope === '自定义' && this.deptIds.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
      } else {
        this.form.depts = []
        if (this.form.dataScope === '自定义') {
          for (let i = 0; i < this.deptIds.length; i++) {
            this.form.depts.push({
              id: this.deptIds[i]
            })
          }
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          } else {
            return false
          }
        })
      }
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { name: '', depts: [], remark: '', dataScope: '本级', level: 3, permission: '' }
    },
    getDepts() {
      // getDepts({ enabled: true }).then(res => {
      //   this.depts = res.content
      // })
    },
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
