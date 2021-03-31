<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ titles[0] }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ titles[1] }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    props: {
      titles: {
        type: Array,
        default() {
          return []
        }
      },
    },
  }
</script>

<style lang="less" scoped>

</style>