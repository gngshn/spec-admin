<template>
  <div class="mod-list">
    <h1>模块列表</h1>
    <el-card>
      <mod-select
        v-model:chip="chipFilter"
        v-model:mod="modFilter"
      ></mod-select>
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
      <el-table :data="mods">
        <el-table-column label="模块名称" :min-width="10">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址偏移" :min-width="10">
          <template #default="scope">
            <span>{{ makeHex(scope.row.regOffset, 8) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模块描述" :min-width="60">
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
import { computed, defineComponent, onMounted, Ref, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Mod } from "../model/mod";
import { Pagination } from "../model/pagination";
import axios from "../utils/axios";
import ModSelect from "../components/ModSelect.vue";
import { deleteConfirm, makeHex } from "../utils";

export default defineComponent({
  components: { ModSelect },
  setup() {
    const router = useRouter();
    const pagination: Ref<Pagination<Mod>> = ref({
      total: 0,
      skip: 0,
      limit: 10,
      data: [],
    });
    const chipFilter = ref("");
    const modFilter = ref("");

    watch(chipFilter, async () => {
      fetchMods();
    });
    watch(modFilter, async () => {
      fetchMods();
    });

    const pageChange = async (page: number) => {
      await fetchMods(pageToSkip(page));
    };

    const mods = computed(() => {
      return pagination.value.data;
    });

    const pageToSkip = (page: number): number => {
      return (page - 1) * pagination.value.limit;
    };

    const currentPage = computed(() => {
      return pagination.value.skip / pagination.value.limit + 1;
    });

    const fetchMods = async (skip: number = 0) => {
      let chipParam = "";
      let parentParam = "";
      if (chipFilter.value !== "" && chipFilter.value !== null) {
        chipParam = `&chip=${chipFilter.value}`;
      }
      if (modFilter.value !== "" && modFilter.value !== null) {
        parentParam = `&parent=${modFilter.value}`;
      }
      const resChildren = await axios.get(
        `/generic/mods?$sort=name&$skip=${skip}&$limit=${pagination.value.limit}${chipParam}${parentParam}`
      );
      pagination.value = resChildren.data;
      if (modFilter.value !== "" && modFilter.value !== null) {
        let modRes = await axios.get(`/generic/mods/${modFilter.value}`);
        pagination.value.data.unshift(modRes.data);
      }
    };

    onMounted(fetchMods);

    const handleEdit = (mod: Mod) => {
      router.push({ path: `/mods/edit/${mod.id}` });
    };
    const handleDelete = async (mod: Mod) => {
      if (!(await deleteConfirm(mod.name))) {
        return;
      }
      try {
        await axios.delete(`/generic/mods/${mod.id}`);
        await fetchMods(pageToSkip(currentPage.value));
      } catch {
        return;
      }
    };

    return {
      pagination,
      mods,
      chipFilter,
      modFilter,
      handleEdit,
      handleDelete,
      pageChange,
      currentPage,
      makeHex,
    };
  },
});
</script>

<style lang="scss" scoped>
.mod-list {
  margin: 1em;
  h1 {
    margin-left: 1rem;
    margin-bottom: 1rem;
  }
  .el-table {
    margin-top: 2em;
    .name-row {
      width: 8em;
    }
  }
}
</style>
