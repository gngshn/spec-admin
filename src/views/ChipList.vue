<template>
  <div class="chip-list">
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
      <el-table :data="chips">
        <el-table-column label="芯片名称" :min-width="20">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="芯片描述" :min-width="60">
          <template #default="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :min-width="20">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">
              编辑
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
import { ElMessageBox } from "element-plus";
import { computed, defineComponent, onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { Chip } from "../model/chip";
import { Pagination } from "../model/pagination";
import axios from "../utils/axios";

export default defineComponent({
  setup() {
    const router = useRouter();
    const pagination: Ref<Pagination<Chip>> = ref({
      total: 0,
      skip: 0,
      limit: 10,
      data: [],
    });

    const pageChange = async (page: number) => {
      await fetchChips(pageToSkip(page));
    };

    const chips = computed(() => {
      return pagination.value.data;
    });

    const pageToSkip = (page: number): number => {
      return (page - 1) * pagination.value.limit;
    };

    const currentPage = computed(() => {
      return pagination.value.skip / pagination.value.limit + 1;
    });

    const fetchChips = async (skip: number = 0) => {
      const res = await axios.get(`/generic/chips?skip=${skip}&limit=10`);
      pagination.value = res.data;
      pagination.value.data.sort((a, b) => a.name.localeCompare(b.name));
    };

    const deleteConfirm = async () => {
      try {
        await ElMessageBox.confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
      } catch (e) {}
    };

    onMounted(fetchChips);

    const handleEdit = (chip: Chip) => {
      router.push({ path: `/chips/edit/${chip.id}` });
    };
    const handleDelete = async (chip: Chip) => {
      await deleteConfirm();
      await axios.delete(`/generic/chips/${chip.id}`);
      await fetchChips(pageToSkip(currentPage.value));
    };

    return {
      pagination,
      chips,
      handleEdit,
      handleDelete,
      pageChange,
      currentPage,
    };
  },
});
</script>

<style lang="scss" scoped>
.chip-list {
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
