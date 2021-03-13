<template>
  <div class="user-list">
    <h1>芯片列表</h1>
    <el-card>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.limit"
        :hide-on-single-page="true"
        :current-page="currentPage"
        @current-change="pageChange"
      >
      </el-pagination>
      <el-table :data="users">
        <el-table-column label="用户名" :min-width="80">
          <template #default="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="20">
          <template #default="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleResetPassword(scope.row)"
            >
              重置密码
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { User } from "../model/user";
import { Pagination } from "../model/pagination";
import { deleteConfirm } from "../utils";
import axios from "../utils/axios";
import { defaultPassword } from "./UserEdit.vue";
import { ElMessage, ElMessageBox } from "element-plus";

export default defineComponent({
  setup() {
    const router = useRouter();
    const pagination: Ref<Pagination<User>> = ref({
      total: 0,
      skip: 0,
      limit: 10,
      data: [],
    });

    const pageChange = async (page: number) => {
      await fetchUsers(pageToSkip(page));
    };

    const users = computed(() => {
      return pagination.value.data;
    });

    const pageToSkip = (page: number): number => {
      return (page - 1) * pagination.value.limit;
    };

    const currentPage = computed(() => {
      return pagination.value.skip / pagination.value.limit + 1;
    });

    const fetchUsers = async (skip: number = 0) => {
      const res = await axios.get(
        `/users?$sort=username&$skip=${skip}&$limit=10`
      );
      pagination.value = res.data;
    };

    onMounted(fetchUsers);

    const handleResetPassword = async (user: User) => {
      try {
        await ElMessageBox.confirm(
          `此操作将是${user.username}的密码重置为12345678, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
      } catch {
        return;
      }
      try {
        user.password = defaultPassword;
        await axios.put(`/users/${user.id}`, user);
        ElMessage.success(`已重置${user.username}的密码为${user.password}`);
      } catch {
        ElMessage.error(`重置${user.username}的密码失败`);
        return;
      }
    };
    const handleDelete = async (user: User) => {
      if (!(await deleteConfirm(user.username))) {
        return;
      }
      try {
        await axios.delete(`/users/${user.id}`);
        await fetchUsers(pageToSkip(currentPage.value));
      } catch {
        return;
      }
    };

    return {
      pagination,
      users,
      handleResetPassword,
      handleDelete,
      pageChange,
      currentPage,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-list {
  margin: 1em;
  h1 {
    margin-left: 1rem;
    margin-bottom: 1rem;
  }
  .el-table {
    .name-row {
      width: 8em;
    }
  }
}
</style>
