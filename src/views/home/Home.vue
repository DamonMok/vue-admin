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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 水平展开收起按钮 -->
        <div class="toggle-button" @click="didClickedToggleButton">|||</div>
        <el-menu background-color="#3a3f4e" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id+''" v-for="menu in menus" :key="menu.id">
            <template slot="title">
              <i class="el-icon-film"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index=" '/' + subMenu.path+''" v-for="subMenu in menu.children" :key="subMenu.id">
              <i class="el-icon-menu"></i>
              <span>{{ subMenu.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {requestMenus} from 'network/home'

export default {
  data() {
    return {
      // 左侧数据菜单
      menus: [],

      // 是否水平折叠菜单
      isCollapse: false
    }
  },
  methods: {
    // 退出登录
    didClickedLogout() {
      // 清空token
      window.sessionStorage.clear();
      // 跳转到登录页
      this.$router.push({ name: "Login" });
    },

    // 获取左侧菜单数据
    async getMenus() {
      const {data:res} = await requestMenus()

      if (res.meta.status !== 200) return this.$message.error(res.meta.status)

      this.menus = res.data
    },

    // 菜单水平缩放
    didClickedToggleButton() {
      this.isCollapse = !this.isCollapse
    }
  },
  created () {
    this.getMenus()
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

  .el-menu {
    border-right: 0;
  }

  .toggle-button {
    font-size: 10px;
    line-height: 24px;
    background-color: #4a5064;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

</style>