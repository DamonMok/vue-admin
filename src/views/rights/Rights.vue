<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['权限管理', '权限列表']"></nav-titles>

    <!-- 卡片视图区域 -->
    <my-card>

      <!-- 表格 -->
      <el-table :data="rights" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template #default="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </my-card>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import {requestRights} from 'network/rights'

export default {
  components: {
    NavTitles,
    MyCard,
  },
  data() {
    return {
      rights: [], // 权限表格数据
    };
  },
  methods: {
    // 获取权限列表数据
    async getRights(type) {
      const {data: res} = await requestRights(type)
      // 获取失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      
      // 获取成功
      this.rights = res.data
    }
  },
  created () {
    this.getRights('list')
    
  },
};
</script>

<style lang="less" scoped>
</style>