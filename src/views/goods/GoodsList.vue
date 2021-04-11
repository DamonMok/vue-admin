<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['商品管理', '商品列表']"></nav-titles>

    <!-- 卡片区域 -->
    <my-card>
      <!-- 搜索框部分 -->
      <el-row :gutter="20" class="search-bar">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="getGoods" @change="getGoods">
            <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template #default="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditGoodsDialog(scope.row)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoodsDialog(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-card>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import { requestGoods } from "network/goods";

export default {
  data() {
    return {
      queryInfo: {
        query: "", // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2, // 每页显示条数
      },
      goodsList: [], // 商品列表
      totalPages: 0, // 商品总页数
    };
  },
  components: {
    NavTitles,
    MyCard,
  },
  methods: {
    // 获取商品列表
    async getGoods() {
      const { data: res } = await requestGoods(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meat.msg);

      this.goodsList = res.data.goods;
      this.totalPages = res.data.total;
    },

    // 添加商品跳转
    addGoods() {
      this.$router.push("/goods/add");
    },
  },
  created() {
    this.getGoods();
  },
  filters: {
    dateFormat: function (originVal) {
      const dt = new Date(originVal * 1000);
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");

      const hh = (dt.getHours() + "").padStart(2, "0");
      const mm = (dt.getMinutes() + "").padStart(2, "0");
      const ss = (dt.getSeconds() + "").padStart(2, "0");

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>