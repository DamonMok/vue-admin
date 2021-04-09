<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['商品管理', '商品分类']"></nav-titles>

    <!-- 卡片视图区域 -->
    <my-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 树形表格 -->
      <tree-table :data="categories" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false" class="tree-table">
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

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCategoryDialogVisible" width="50%">
      <el-form :model="categoryForm" :rules="categoryRules" ref="categoryForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoryForm.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="父级分类">
          <el-cascader v-model="addCategoryValue" :options="addCategories" @change="handleChange" :props="addCategoryProps" clearable ref="cascader"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddCategory">取 消</el-button>
        <el-button type="primary" @click="submitAddCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import { requestGoodsCategories, requestAddCategory } from "network/goods";

export default {
  components: {
    NavTitles,
    MyCard,
  },
  data() {
    return {
      queryInfo: {
        type: 3, // 获取分类的级别
        pagenum: 1, // 第几页
        pagesize: 2, // 每页多少条
      },
      categories: [], // 商品分类列表
      addCategories: [], // 添加商品分类的分类列表
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
      addCategoryDialogVisible: false, // 添加分类对话框
      categoryForm: {
        cat_name: "", // 分类名称
        cat_level: 0, // 分类层级
        cat_pid: 0, // 父级分类ID
      },
      categoryRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        cat_level: [
          { required: true, message: "请选择父级分类", trigger: "blur" },
        ],
      },
      // 层级选择器初始化属性
      addCategoryProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover", // 悬停展开
        checkStrictly: "true", // 可以选择任意分类
      },
      addCategoryValue: [], // 选中的父级分类
    };
  },
  methods: {
    // 获取商品分类列表
    async getCategories() {
      const { data: res } = await requestGoodsCategories(this.queryInfo);

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.categories = res.data.result;
      this.total = res.data.total;
    },
    // 获取添加商品分类的分类列表
    async getAddCategories() {
      const { data: res } = await requestGoodsCategories({ type: 2 });

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.addCategories = res.data;
      this.total = res.data.total;
    },
    // 分页size发生变化
    handleSizeChange(pagesize) {
      this.queryInfo.pagenum = 1;
      this.queryInfo.pagesize = pagesize;
      this.getCategories();
    },
    // 页码发生变化
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getCategories();
    },
    // 添加分类对话框
    showAddCategoryDialog() {
      this.getAddCategories();
      this.addCategoryDialogVisible = true;
    },
    // 添加分类选中分类
    handleChange() {
      if (this.addCategoryValue.length > 0) {
        this.addCategories.cat_pid = this.addCategoryValue[
          this.addCategoryValue.length - 1
        ];
        this.addCategories.cat_level = this.addCategoryValue.length;
      } else {
        this.addCategories.cat_pid = 0;
        this.addCategories.cat_level = 0;
      }
      // 选择完毕收起选择框
      this.$refs.cascader.toggleDropDownVisible();
    },
    // 确认添加分类
    async submitAddCategory() {
      console.log(this.addCategoryValue);
      console.log(this.categoryForm);
      const { data: res } = await requestAddCategory(this.categoryForm);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);

      this.getCategories();
      this.$message.success(res.meta.msg);
      this.addCategoryDialogVisible = false;
    },
    // 取消添加分类
    cancelAddCategory() {
      this.$refs.categoryForm.resetFields();
      this.categoryForm.cat_name = "";
      this.categoryForm.cat_level = 0;
      this.categoryForm.cat_pid = 0;
      this.addCategoryValue = [];
      this.addCategoryDialogVisible = false;
    },
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

.tree-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>