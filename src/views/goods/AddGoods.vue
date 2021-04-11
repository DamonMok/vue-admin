<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['商品管理', '添加商品']"></nav-titles>

    <!-- 卡片区域 -->
    <my-card>
      <!-- 警告区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤区域 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tabs标签页 -->
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" label-position="top">
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="categories" @change="handleChange" :props="categoryProps" clearable ref="cascader" size="medium"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="params" v-for="(params, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item, index) in onlyList" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload-demo" action="http://timemeetyou.com:8889/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headers" :on-success="uploadSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </my-card>
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%" @close="closePreview">
      <img :src="picPreviewUrl" alt="" class="preview-img">
    </el-dialog>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import { requestGoodsCategories, requestParams } from "network/goods";

export default {
  components: {
    NavTitles,
    MyCard,
  },
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      categories: [], // 商品分类
      categoryProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover", // 悬停展开
        checkStrictly: "true", // 可以选择任意分类
      },
      manyList: [], // 动态参数列表
      onlyList: [], // 静态属性列表
      headers: {
        // element-ui图片上传未使用axios,需要另外设置token
        Authorization: window.sessionStorage.getItem("token"),
      },
      imgDialogVisible: false, // 图片预览
      picPreviewUrl: "", // 图片预览地址
    };
  },
  methods: {
    // 获取分类列表
    async getCategories() {
      const { data: res } = await requestGoodsCategories();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.categories = res.data;
    },
    // 选择了分类
    handleChange() {
      // 选择完毕收起级联选择框
      this.$refs.cascader.toggleDropDownVisible();

      // 控制只允许选择第三级分类
      if (this.addForm.goods_cat.length < 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
    // 标签页切换钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.closeAll();
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 点击了标签
    async tabClick() {
      if (this.activeIndex === "1") {
        // 商品参数
        const { data: res } = await requestParams(this.catId, "many");
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

        this.manyList = res.data;
        console.log(this.manyList);
        // 把属性字符串转成数据
        this.manyList.forEach((item) => {
          if (!item.attr_vals) {
            item.attr_vals = [];
          } else {
            item.attr_vals = item.attr_vals.split(" ");
          }
        });
      } else if (this.activeIndex === "2") {
        // 商品属性
        // 商品参数
        const { data: res } = await requestParams(this.catId, "only");
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

        this.onlyList = res.data;
      } else if (this.activeIndex === "3") {
        // 上传图片
      }
    },
    // 预览图片
    handlePreview(file) {
      this.picPreviewUrl = file.response.data.url;
      this.imgDialogVisible = true;
    },
    // 关闭预览
    closePreview() {
      this.picPreviewUrl = "";
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.picUrl = file.response.data.url;
      const i = this.addForm.pics.findIndex((pic) => {
        pic.pic === tempPath;
      });
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm.pics);
    },
    // 图片上传
    uploadSuccess(response, file, fileList) {
      if (response.meta.status !== 200)
        return this.$message.error(response.meta.msg);

      // 上传成功
      const pic = { pic: response.data.tmp_path };
      this.addForm.pics.push(pic);
    },
  },
  created() {
    this.getCategories();
  },
  computed: {
    catId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}

.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.preview-img {
  width: 100%;
}
</style>