<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['权限管理', '权限列表']"></nav-titles>

    <!-- 卡片视图区域 -->
    <my-card>

      <!-- 表格 -->
      <el-table :data="rights" border style="width: 100%">
        <el-table-column type="index" label="#" width="180"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column prop="level" label="权限等级"></el-table-column>
      </el-table>
    </my-card>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

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
};
</script>

<style lang="less" scoped>
</style>