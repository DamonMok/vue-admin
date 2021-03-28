<template>
  <div>
    <el-button type='info' @click="didClickedLogout">退出</el-button>
  </div>
</template>

<script>
  export default {
    methods: {
      // 退出登录
      didClickedLogout() {
        // 清空token
        window.sessionStorage.clear()
        // 跳转到登录页
        this.$router.push({name: 'Login'})
      }
    },
  }
</script>

<style lang="less" scoped>

</style>