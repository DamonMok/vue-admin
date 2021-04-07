<template>
  <div>
    <!-- 面包屑导航 -->
    <nav-titles :titles="['权限管理', '角色列表']"></nav-titles>

    <!-- 卡片视图区域 -->
    <my-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="roles" border style="width: 100%">
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template #default="scoped">
            <el-row  v-for="(item1, index) in scoped.row.children" :key="index" :class="{'bottom-border': true, 'top-border': index ===0, 'vcenter': true}">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, index) in item1.children" :key="index" :class="{'top-border':index !==0, 'vcenter': true}">
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag v-for="(item3, index) in item2.children" :key="index" type="warning">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row> 
          </template>
        </el-table-column>

        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="delete" size="mini">删除</el-button>
            <el-button type="warning" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-card>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import {requestRoles} from 'network/roles'

export default {
  components: {
    NavTitles,
    MyCard,
  },
  data() {
    return {
      // 角色列表数据
      roles: [],
    }
  },
  methods: {
    async getRoles() {
      const {data: res} = await requestRoles()

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.roles = res.data
    }
  },
  created () {
    this.getRoles()
  },
};
</script>

<style lang="less" scoped>
  .el-table {
    margin-top: 15px;
  }

  .el-tag {
    margin: 7px
  }

  .vcenter {
    display: flex;
    align-items : center;
  }

  .top-border {
    border-top: 1px solid #eee;
  }

  .bottom-border {
    border-bottom: 1px solid #eee;
  }
</style>