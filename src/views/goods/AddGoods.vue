<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['商品管理', '添加商品']"></nav-titles>

    <!-- 卡片区域 -->
    <my-card>
      <!-- 警告区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤区域 -->
      <el-steps :space="200" :active="activeIndex " finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
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
      activeIndex: 0,
    };
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}
</style>