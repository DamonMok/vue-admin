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
      <el-tabs v-model="tagName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="addParams">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyList" border style="width: 100%">
            <!-- 添加选项的展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="closeTag(scope.row, index)">
                  {{ item }}
                </el-tag>
                <el-input class="input-new-tag input-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="addParams('edit', scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="addParams">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyList" border style="width: 100%">
            <!-- 添加选项的展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="closeTag(scope.row, index)">
                  {{ item }}
                </el-tag>
                <el-input class="input-new-tag input-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="addParams('edit', scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </my-card>
    <!-- 添加动态参数|静态属性对话框 -->
    <el-dialog :title="operate + paramsTitle" :visible.sync="dialogVisible" width="50%" @close="dialogClose">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="paramsTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import {
  requestGoodsCategories,
  requestParams,
  requestAddParams,
  requestParamsById,
  requestUpdateParams,
  requestDeleteParams,
} from "network/goods";

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
      tagName: "many", // 当前选择的tab标签页
      manyList: [], // 动态参数list
      onlyList: [], // 静态属性list
      dialogVisible: false, // 添加参数对话框
      // 添加表单
      addForm: {
        attr_name: "",
      },
      // 表单验证
      rules: {
        attr_name: {
          required: true,
          message: "请输入活动名称",
          trigger: "blur",
        },
      },
      operate: "", // 添加或编辑操作
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
      // 选择完毕收起级联选择框
      this.$refs.cascader.toggleDropDownVisible();

      // 控制只允许选择第三级分类
      if (this.addCategoryValue.length < 3) {
        this.addCategoryValue = [];
        this.manyList = [];
        this.onlyList = [];
        return;
      }

      this.getManyOrOnly();
    },

    // 标签页发生改变
    handleClick() {
      this.getManyOrOnly();
    },

    // 获取动态参数/静态属性
    async getManyOrOnly() {
      const { data: res } = await requestParams(this.catId, this.tagName);
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);

      res.data.forEach((item) => {
        item.inputVisible = false; // 添加选项input的显示/隐藏
        item.inputValue = ""; // 添加选项input的双向绑定
        item.attr_vals = this.getAttrValues(item.attr_vals);
      });

      this.tagName === "many"
        ? (this.manyList = res.data)
        : (this.onlyList = res.data);

      console.log(this.manyList);
    },

    // 显示添加/编辑参数|属性对话框
    async addParams(operate, attr_id) {
      this.operate = operate === "edit" ? "编辑" : "添加";
      this.dialogVisible = true;

      // 渲染编辑对话框的分类参数
      if (this.operate === "编辑") {
        // 获取当前分类参数
        const { data: res } = await requestParamsById(
          this.catId,
          attr_id,
          this.tagName
        );

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.addForm = res.data;
      }
    },

    // 对话框关闭
    dialogClose() {
      this.$refs.addForm.resetFields();
    },

    // 确定添加/编辑参数
    submitAddParams() {
      this.$refs.addForm.validate(async (valid) => {
        // 表单验证
        if (!valid) return;

        // 发送请求
        if (this.operate !== "编辑") {
          // 添加
          const { data: res } = await requestAddParams(
            this.catId,
            this.addForm.attr_name,
            this.tagName
          );
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
        } else {
          // 编辑
          const { data: res } = await requestUpdateParams(
            this.addForm.cat_id,
            this.addForm.attr_id,
            this.addForm.attr_name,
            this.addForm.attr_sel
          );
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
        }

        this.getManyOrOnly();
        this.dialogVisible = false;
      });
    },

    // 删除参数
    async deleteParams(attr_id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);

      if (confirmRes === "confirm") {
        const { data: res } = await requestDeleteParams(this.catId, attr_id);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

        // 删除成功
        this.getManyOrOnly();
        this.$message.closeAll();
        this.$message.success(res.meta.msg);
      }
    },
    // 更新选项请求
    async updateParams(row) {
      // 发送请求
      const { data: res } = await requestUpdateParams(
        row.cat_id,
        row.attr_id,
        row.attr_name,
        this.tagName,
        row.attr_vals.join(" ")
      );

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);
    },

    // 显示添加选项的输入框时调用
    showInput(row) {
      row.inputVisible = true;
      // 文本框自动获得焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加选项文本框失去焦点时调用
    handleInputConfirm(row) {
      // let inputValue = this.inputValue;
      // if (inputValue) {
      //   this.dynamicTags.push(inputValue);
      // }
      row.inputVisible = false;
      if (!row.inputValue) return;

      row.attr_vals.push(row.inputValue);
      row.inputValue = "";

      this.updateParams(row);
    },
    // 把动态属性下的选项字符串转换成数组
    getAttrValues(attrValues) {
      if (attrValues.length == 0) return [];
      return attrValues.split(" ");
    },
    // 删除选项
    closeTag(row, index) {
      row.attr_vals.splice(index, 1);
      this.updateParams(row);
    },
  },
  computed: {
    // 添加参数、属性按钮是否可点击
    isDisabled() {
      return this.addCategoryValue.length !== 3;
    },

    // 获取当前第三级分类Id
    catId() {
      return this.addCategoryValue.length === 3
        ? this.addCategoryValue[2]
        : null;
    },
    paramsTitle() {
      return this.tagName === "many" ? "动态参数" : "静态属性";
    },
  },
  created() {
    this.getAddCategories();
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}

.input-tag {
  width: 120px !important;
}

.el-tag {
  margin: 10px;
}
</style>