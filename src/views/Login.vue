<template>
  <div class="login">
    <el-card>
      <template #header>账户登录</template>
      <el-form
        label-width="4em"
        :model="user"
        :rules="userRules"
        ref="formRef"
        @submit.prevent="login"
      >
        <el-form-item label="名字" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <div class="login-button">
          <el-button type="success" @click="$router.push('/change-password')">
            修改密码
          </el-button>
          <el-button type="primary" native-type="submit">登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "@vue/runtime-core";
import { User } from "../model/user";
import axios from "../utils/axios";
import { useRouter } from "vue-router";
import { passwordValidator, usernameValidator } from "../utils";
import { ElMessage } from "element-plus";

export default defineComponent({
  setup() {
    const user: Ref<User> = ref({
      id: "",
      username: "",
      password: "",
    });
    const userRules = {
      username: [
        { required: true, message: "用户名不能为空", trigger: "blur" },
        { validator: usernameValidator, trigger: "blur" },
      ],
      password: [
        { required: true, message: "密码不能为空", trigger: "blur" },
        { min: 8, max: 16, message: "长度为8-16字符", trigger: "blur" },
      ],
    };
    const formRef = ref<HTMLFormElement>();
    const router = useRouter();
    const login = async () => {
      try {
        await formRef.value?.validate();
        const res = await axios.post("/login", user.value);
        if (res.data.needChangePassword) {
          sessionStorage.clear();
          ElMessage.error("请先修改密码");
          router.push("/change-password");
        } else {
          sessionStorage.user = user.value.username;
          sessionStorage.token = res.data.token;
          router.push("/");
        }
      } catch {
        return;
      }
    };
    return {
      user,
      userRules,
      formRef,
      login,
    };
  },
});
</script>

<style lang="scss" scoped>
.login {
  ::v-deep(.el-card) {
    width: 24em;
    margin: 8rem auto;
  }
  .login-button {
    display: flex;
    justify-content: space-between;
  }
}
</style>