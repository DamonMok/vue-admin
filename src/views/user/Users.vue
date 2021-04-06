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
          <el-button type="primary" @click="didClickedAddUser">添加用户</el-button>
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
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[2, 4, 6, 10]" :page-size="queryInfo.pagesize" :current-page="queryInfo.pagenum" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </my-card>

    <!-- 添加用户 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="didClickedClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
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

import { requestUsers, requestChangeState } from "network/user";

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
      dialogVisible: false, // 显示新增用户对话框

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
    async didChangedState(userInfo) {
      // 关闭当前所有消息弹框
      this.$message.closeAll();

      const { data: res } = await requestChangeState(
        userInfo.id,
        userInfo.mg_state
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);
    },

    // 搜索
    didClickedSearch() {
      this.getUsers();
    },

    // 新增用户按钮
    didClickedAddUser() {
      this.dialogVisible = true;
    },

    // 新增用户确定提交
    didClickedSubmit() {
      this.dialogVisible = false
    },

    // 关闭新增用户对话框
    didClickedClose() {
      this.dialogVisible = false
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