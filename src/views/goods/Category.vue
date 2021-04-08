<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['商品管理', '商品分类']"></nav-titles>

    <!-- 卡片视图区域 -->
    <my-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
    </my-card>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import {requestGoodsCategories} from 'network/goods'

  export default {
    components: {
      NavTitles,
      MyCard,
    },
    data() {
      return {
        queryInfo: {
          type: [],  // 获取分类的级别
          pagenum: 1,  // 第几页
          pagesize: 5  // 每页多少条
        },
        categories: [],  // 商品分类列表
      }
    },
    methods: {
      // 获取商品分类列表
      async getCategories() {
        const {data: res} = await requestGoodsCategories(this.queryInfo)

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

        this.categories = res.data

        console.log(this.categories);
      }
    },
    created () {
      this.getCategories()
    },
  }
</script>

<style lang="less" scoped>

</style>