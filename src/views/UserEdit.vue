<template>
  <div class="user-edit">
    <h1>新建用户</h1>
    <el-card>
      <el-form
        :model="user"
        :rules="userRules"
        label-position="right"
        label-width="6em"
        ref="formRef"
        @submit.prevent="save"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { User } from "../model/user";
import axios from "../utils/axios";
import { usernameValidator } from "../utils";
import { ElMessage } from "element-plus";

export const defaultPassword = "12345678";

export default defineComponent({
  setup() {
    const router = useRouter();
    const user: Ref<User> = ref({
      id: "",
      username: "",
      password: "",
    });
    const userRules = ref({
      username: [
        { required: true, message: "请输入名称", trigger: "blur" },
        { validator: usernameValidator, trigger: "blur" },
      ],
    });
    const formRef = ref<HTMLFormElement>();
    const save = async () => {
      try {
        await formRef.value?.validate();
        user.value.password = defaultPassword;
        let res = await axios.post("/users", user.value);
        if (res.status === 201) {
          ElMessage.success("创建用户成功");
          router.push("/users/list");
        }
      } catch {
        return;
      }
    };
    return {
      user,
      userRules,
      save,
      formRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-edit {
  margin: 1rem;
  h1 {
    margin-left: 1rem;
    margin-bottom: 1rem;
  }
  .el-button {
    margin-left: 6em;
  }
}
</style>
