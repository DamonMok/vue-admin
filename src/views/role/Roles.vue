<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['权限管理', '角色列表']"></nav-titles>

    <!-- 卡片视图区域 -->
    <my-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="roles" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="delete" size="mini">删除</el-button>
            <el-button type="warning" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-card>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import {requestRoles} from 'network/roles'

export default {
  components: {
    NavTitles,
    MyCard,
  },
  data() {
    return {
      // 角色列表数据
      roles: [],
    }
  },
  methods: {
    async getRoles() {
      const {data: res} = await requestRoles()

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.roles = res.data
    }
  },
  created () {
    this.getRoles()
  },
};
</script>

<style lang="less" scoped>
</style>