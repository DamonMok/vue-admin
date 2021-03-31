<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['用户管理', '用户列表']"></nav-titles>

    <!-- 卡片区域 -->
    <my-card>
      <!-- 搜索框部分 -->
      <el-row :gutter="20" class="search-bar">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
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
            <el-switch v-model="scope.row.mg_state">
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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[2, 4, 6, 10]"
        :page-size="queryInfo.pagesize"
        :current-page="queryInfo.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </my-card>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import { requestUsers } from "network/user";

export default {
  data() {
    return {
      queryInfo: {
        query: "", // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2, // 每页显示条数
      },
      users: [], // 用户列表数据
      total:0,  // 总页数
    };
  },
  components: {
    NavTitles,
    MyCard,
  },
  methods: {
    // 获取用户信息
    async getUsers(queryInfo) {
      const { data: res } = await requestUsers(queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      console.log(res);

      this.users = res.data.users;
      this.total = res.data.total
    },

    // 每页条数
    handleSizeChange(pageSize) {
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = pageSize
      this.getUsers(this.queryInfo)
    },

    // 页数改变
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUsers(this.queryInfo)
    }
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
</style>