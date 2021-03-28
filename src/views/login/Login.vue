<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 1.Logo -->
      <div class="logo">
        <img src="~assets/logo.png" alt="" />
      </div>

      <!-- 2.表单 -->
      <div>
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login_form">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="didClickedLogin">登录</el-button>
            <el-button type="info" @click="didClickedReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { requestLogin } from "network/login.js";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    didClickedLogin() {
      this.$refs.loginRef.validate(async (valid) => {
        // 1.表单验证失败
        if (!valid) {
          return this.$message("用户名或密码格式错误！");
        }
        // 2.表单验证成功后的操作
        const { data: res } = await requestLogin(
          this.loginForm.username,
          this.loginForm.password
        );

        // 2.1用户名密码错误
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

        //2.2
        this.$message.success("登录成功！");
      });
    },
    didClickedReset() {
      console.log("reset");
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;

    .logo {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 10px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #ddd;
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #eee;
      }
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>