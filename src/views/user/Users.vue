<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['用户管理', '用户列表']"></nav-titles>

    <!-- 卡片区域 -->
    <my-card>
      <!-- 搜索框部分 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>


    </my-card>
  </div>
</template>

<script>
  import NavTitles from 'components/content/NavTitles'
  import MyCard from 'components/content/MyCard'

  export default {
    components: {
      NavTitles,
      MyCard
    },
  }
</script>

<style lang="less" scoped>

</style>