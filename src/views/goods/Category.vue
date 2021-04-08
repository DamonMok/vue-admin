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

      <!-- 树形表格 -->
      <tree-table :data="categories" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效列自定义模板 -->
        <template #isOk="scope">
          <i class="el-icon-error" v-if="scope.row.cat_deleted" style="color: red"></i>
          <i class="el-icon-success" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序列自定义模板 -->
        <template #level="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
          <el-tag type="warning" v-else size="mini">三级</el-tag>
        </template>
        <!-- 操作列自定义模板 -->
        <template #operation="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
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
      queryInfo: {
        type: [], // 获取分类的级别
        pagenum: 1, // 第几页
        pagesize: 2, // 每页多少条
      },
      categories: [], // 商品分类列表
      total: 0, // 商品总条数
      columns: [
        // 分类名称列
        { label: "分类名称", prop: "cat_name" },
        // 是否有效列
        { label: "是否有效", type: "template", template: "isOk" },
        // 排序列
        { label: "排序", type: "template", template: "level" },
        // 操作列
        { label: "操作", type: "template", template: "operation" },
      ],
    };
  },
  methods: {
    // 获取商品分类列表
    async getCategories() {
      const { data: res } = await requestGoodsCategories(this.queryInfo);

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.categories = res.data.result;
      this.total = res.data.total;
      console.log(res);
    },
    // 分页size发生变化
    handleSizeChange(pagesize) {
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = pagesize
      this.getCategories()
    },
    // 页码发生变化 
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getCategories()
    }
  },
  created() {
    this.getCategories();
  },
};
</script>

<style lang="less" scoped>
  .el-pagination {
    margin-top: 15px;
  }
</style>