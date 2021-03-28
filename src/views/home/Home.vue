<template>
  <el-container class="home-container">
    <el-header>
      <el-button type='info' @click="didClickedLogout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    // 退出登录
    didClickedLogout() {
      // 清空token
      window.sessionStorage.clear();
      // 跳转到登录页
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #3f4648;
  }

  .el-aside {
    background-color: #3a3f4d;
  }

  .el-main {
    background-color: #ecf0f2;
  }
</style>