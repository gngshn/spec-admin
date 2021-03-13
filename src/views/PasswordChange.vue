<template>
  <div class="login">
    <el-card>
      <template #header>账户登录</template>
      <el-form
        label-width="5em"
        :model="changePasswordDto"
        :rules="changePasswordDtoRules"
        ref="formRef"
        @submit.prevent="changePassword"
      >
        <el-form-item label="名字" prop="username">
          <el-input v-model="changePasswordDto.username"></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            type="password"
            v-model="changePasswordDto.oldPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="changePasswordDto.newPassword"
          ></el-input>
        </el-form-item>
        <div class="login-button">
          <el-button type="primary" native-type="submit">修改密码</el-button>
          <el-button
            type="success"
            @click="$router.push('/login')"
            v-if="!logined"
          >
            返回登录
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from "@vue/runtime-core";
import { ChangePasswordDto } from "../model/user";
import axios from "../utils/axios";
import { useRouter } from "vue-router";
import { passwordValidator, usernameValidator } from "../utils";

export default defineComponent({
  setup() {
    const changePasswordDto: Ref<ChangePasswordDto> = ref({
      username: "",
      oldPassword: "",
      newPassword: "",
    });
    const changePasswordDtoRules = {
      username: [
        { required: true, message: "用户名不能为空", trigger: "blur" },
        { validator: usernameValidator, trigger: "blur" },
      ],
      oldPassword: [
        { required: true, message: "密码不能为空", trigger: "blur" },
        { min: 8, max: 16, message: "长度为8-16字符", trigger: "blur" },
      ],
      newPassword: [
        { required: true, message: "密码不能为空", trigger: "blur" },
        { min: 8, max: 16, message: "长度为8-16字符", trigger: "blur" },
      ],
    };
    const formRef = ref<HTMLFormElement>();
    const logined = computed(() => sessionStorage.token as boolean);
    const router = useRouter();
    const changePassword = async () => {
      try {
        await formRef.value?.validate();
        sessionStorage.clear();
        const res = await axios.post(
          "/change-password",
          changePasswordDto.value
        );
        if (res.status == 200) {
          router.push("/login");
        }
      } catch {
        return;
      }
    };
    return {
      changePasswordDto,
      changePasswordDtoRules,
      formRef,
      changePassword,
      logined,
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
    flex-direction: row-reverse;
    justify-content: space-between;
  }
}
</style>