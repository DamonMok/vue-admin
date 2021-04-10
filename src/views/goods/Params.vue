<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['商品管理', '分类参数']"></nav-titles>

    <!-- 卡片视图区域 -->
    <my-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!-- 下拉选择区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader v-model="addCategoryValue" :options="addCategories" @change="handleChange" :props="addCategoryProps" clearable ref="cascader"></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs标签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="dynamic">
          <el-button type="primary" :disabled="isDisabled">添加参数</el-button>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="static">
          <el-button type="primary" :disabled="isDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>

    </my-card>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import { requestGoodsCategories } from "network/goods";

export default {
  components: {
    NavTitles,
    MyCard,
  },
  data() {
    return {
      // 层级选择器初始化属性
      addCategoryProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover", // 悬停展开
        checkStrictly: "true", // 可以选择任意分类
      },
      addCategoryValue: [], // 选中的父级分类
      addCategories: [],
      activeName: "dynamic", // 当前选择的tab标签页
    };
  },
  methods: {
    // 获取添加商品分类的分类列表
    async getAddCategories() {
      const { data: res } = await requestGoodsCategories();

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.addCategories = res.data;
      this.total = res.data.total;
    },
    handleChange() {
      // 选择完毕收起选择框
      this.$refs.cascader.toggleDropDownVisible();

      // 控制只允许选择第三级分类
      if (this.addCategoryValue.length < 3) {
        this.addCategoryValue = [];
        return;
      }
    },
    // 标签页发生改变
    handleClick() {
      console.log(this.activeName);
    },
  },
  computed: {
    // 添加参数、属性按钮是否可点击
    isDisabled() {
      return this.addCategoryValue.length !== 3;
    },
  },
  created() {
    this.getAddCategories();
  },
};
</script>

<style lang="less" scoped>
</style>