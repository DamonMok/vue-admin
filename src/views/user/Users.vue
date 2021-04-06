<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['用户管理', '用户列表']"></nav-titles>

    <!-- 卡片区域 -->
    <my-card>
      <!-- 搜索框部分 -->
      <el-row :gutter="20" class="search-bar">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="getUsers" @change="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="users" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.mg_state" @change="didChangedState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditUserDialog(scope.row)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 设置 -->
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[2, 4, 6, 10]" :page-size="queryInfo.pagesize" :current-page="queryInfo.pagenum" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </my-card>

    <!-- 添加用户 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%" :before-close="didClickedClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" :prop="isEditDialog ? '' : 'username'">
          <el-input v-model="addForm.username" :disabled="isEditDialog"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-show="!isEditDialog">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="didClickedClose">取 消</el-button>
        <el-button type="primary" @click="didClickedSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import { requestUsers, requestChangeState, requestAddUser, 
         requestUserById, requestUpdateUserInfo } from "network/user";

export default {
  data() { 
    // 验证邮箱自定义规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+.)+[A-Za-z]{2,4}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机自定义规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: "", // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2, // 每页显示条数
      },
      users: [], // 用户列表数据
      total: 0, // 总页数
      dialogVisible: false, // 显示新增/修改用户对话框
      isEditDialog: false,  // 是否为编辑对话框
      validCount: 0,  // 是否完成所有验证

      // 新增用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 新增用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      }
    };
  },
  components: {
    NavTitles,
    MyCard,
  },
  methods: {
    // 获取用户信息
    async getUsers() {
      const { data: res } = await requestUsers(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      // console.log(res);

      this.users = res.data.users;
      this.total = res.data.total;
    },

    // 每页条数改变
    handleSizeChange(pageSize) {
      this.queryInfo.pagenum = 1;
      this.queryInfo.pagesize = pageSize;
      this.getUsers();
    },

    // 页数改变
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage;
      this.getUsers();
    },

    // 用户状态改变
    async didChangedState(user) {
      // 关闭当前所有消息弹框
      this.$message.closeAll();

      const { data: res } = await requestChangeState(user);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);
    },

    // 搜索
    didClickedSearch() {
      this.getUsers();
    },

    // 新增用户对话框
    showAddUserDialog() {
      this.isEditDialog = false
      this.dialogVisible = true;
    },

    // 修改用户对话框
    async showEditUserDialog(user) {
      this.isEditDialog = true
      this.dialogVisible = true

      // 用户信息查询并渲染
      const {data: res} = await requestUserById(user)
      this.addForm.username = res.data.username
      this.addForm.email = res.data.email
      this.addForm.mobile = res.data.mobile
      this.addForm.id = res.data.id
    },

    // 添加新用户
    addUser() {
      this.$refs.addForm.validate(async (valid, objs) => {

        // 验证不通过
        if (!valid) return

        const {data: res} = await requestAddUser(this.addForm)
        // 添加失败
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)

        // 成功
        this.getUsers()
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
      })
    },

    // 修改用户信息
    updateUserInfo() {
      const validList = ['email', 'mobile']
      this.$refs.addForm.validateField(validList, async (errmsg) => {
        // if (!errmsg) {
        //   // 使用部分表单验证时，会掉函数会调用多次
        //   // 使用this.validCount记录是否已经全部验证完
        //   this.validCount++
        // } else {
        //   this.validCount = 0
        // }

        this.validCount = !errmsg ? this.validCount+1 : 0

        // 验证不通过
        if (errmsg || this.validCount !== validList.length) return
        
        const {data: res} = await requestUpdateUserInfo(this.addForm)

        // 修改失败
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

        // 成功
        this.getUsers()
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
      })
    },

    // 新增/编辑用户确定提交
    didClickedSubmit() {
      if (!this.isEditDialog) {
        this.addUser()
      } else {
        this.updateUserInfo()
      }
    },

    // 关闭新增用户对话框
    didClickedClose() {
      this.dialogVisible = false
      this.$refs.addForm.resetFields()
    },
  },
  created() {
    this.getUsers(this.queryInfo);
  },
};
</script>

<style lang="less" scoped>
.search-bar {
  margin-bottom: 15px;
}

.el-pagination {
  margin-top: 15px;
}
</style>