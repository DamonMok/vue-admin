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
          <template #default="scope">
            <el-row v-for="(item1, index) in scope.row.children" :key="index" :class="{'bottom-border': true, 'top-border': index ===0, 'vcenter': true}">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, index) in item1.children" :key="index" :class="{'top-border':index !==0, 'vcenter': true}">
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag v-for="(item3, index) in item2.children" :key="index" type="warning" closable @close="removeRightById(scope.row, item3.id)">
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
          <template #default="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="delete" size="mini">删除</el-button>
            <el-button type="warning" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="closeDialog">
      <!-- 权限树 -->
      <el-tree :data="rights" :props="defaultProps" @node-click="handleNodeClick" show-checkbox node-key="id" default-expand-all :default-checked-keys="defaultNodes" ref="tree"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavTitles from "components/content/NavTitles";
import MyCard from "components/content/MyCard";

import { requestRoles, requestRemoveRight, requestAllotRight } from "network/roles";
import { requestRights } from "network/rights"

export default {
  components: {
    NavTitles,
    MyCard,
  },
  data() {
    return {
      // 角色列表数据
      roles: [],

      // 分配权限对话框的显示/隐藏
      setRightDialogVisible: false,

      // 权限列表数据
      rights: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },

      // 分配权限对话框中的默认选中节点
      defaultNodes:[],

      // 当前分配权限的角色ID
      roleId: 0
    };
  },
  methods: {
    // 获取角色列表
    async getRoles() {
      const { data: res } = await requestRoles();

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.roles = res.data;
    },

    // 获取所有权限数据
    async getRights(type) {
      const {data: res} = await requestRights(type)
      // 获取失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      
      // 获取成功
      this.rights = res.data
    },

    // 删除权限
    async removeRightById(role, rightId) {
      // 弹框提示
      const confirmResult = await this.$confirm(
        "此操作将删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult === "confirm") {
        const { data: res } = await requestRemoveRight(role.id, rightId);

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

        // 成功
        this.$message.success("取消权限成功");
        role.children = res.data;
      }
    },

    // 获取所有默认选中的节点
    getDefaultNodes(node, array) {
      if (!node.children) {
        return array.push(node.id)
      }

      node.children.forEach(item => {
        this.getDefaultNodes(item, array)
      });
    },

    // 分配权限对话框
    showSetRightDialog(role) {
      this.roleId = role.id

      // 获取所有权限
      this.getRights('tree')
      
      // 获取所有被选中的三级节点
      this.getDefaultNodes(role, this.defaultNodes)

      // 显示分配权限对话框
      this.setRightDialogVisible = true
    },

    // 分配权限对话框关闭
    closeDialog() {
      this.defaultNodes = []
    },

    // 点击选择节点
    handleNodeClick() {
      // console.log(1);
    },

    // 分配权限确定按钮
    async allotRights() {
      // 获取勾选的权限数组字符串
      const rights = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
      const rightStr = rights.join(',')

      // 发送请求
      const {data: res} = await requestAllotRight(this.roleId, rightStr)
      // 失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      // 成功
      this.getRoles()
      this.$message.success(res.meta.msg)
      this.setRightDialogVisible = false
      
    }
  },
  created() {
    this.getRoles();
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}

.el-tag {
  margin: 7px;
}

.vcenter {
  display: flex;
  align-items: center;
}

.top-border {
  border-top: 1px solid #eee;
}

.bottom-border {
  border-bottom: 1px solid #eee;
}
</style>