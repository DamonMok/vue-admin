<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img src="~assets/img/damon.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type='info' @click="didClickedLogout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-2">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #fff;
  padding: 0;

  > div {
    display: flex;
    align-items: center;

    img {
      width: 80px;
      height: 60px;
    }

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #3a3f4d;
}

.el-main {
  background-color: #ecf0f2;
}
</style>