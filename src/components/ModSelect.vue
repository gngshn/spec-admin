<template>
  <div class="mod-select">
    <div v-if="isForm" class="d-flex">
      <el-form-item label="所属芯片" prop="chip">
        <el-select :modelValue="chip" @change="chipChange">
          <el-option
            v-for="item in chips"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            filterable
            clearable
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属模块">
        <el-cascader
          :modelValue="mod"
          @change="modChange"
          :disabled="chip === ''"
          :options="modsTree"
          :props="{
            checkStrictly: true,
            emitPath: false,
            expandTrigger: 'hover',
          }"
          filterable
          clearable
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
    </div>
    <div v-else class="d-flex">
      <div>
        <span>所属芯片:</span>
        <el-select :modelValue="chip" @change="chipChange">
          <el-option
            v-for="item in chips"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <span>所属模块</span>
        <el-cascader
          :modelValue="mod"
          @change="modChange"
          :disabled="chip === ''"
          :options="modsTree"
          :props="{
            checkStrictly: true,
            emitPath: false,
            expandTrigger: 'hover',
          }"
          filterable
          clearable
          :show-all-levels="false"
        ></el-cascader>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "../utils/axios";
import { computed, defineComponent, onMounted, ref, Ref, watch } from "vue";
import { Chip } from "../model/chip";
import { Mod } from "../model/mod";

interface ModTreeItem {
  value: string;
  label: string;
  parent: string;
  children: undefined | Array<any>;
}
interface ModTreeItemObj {
  [key: string]: Array<ModTreeItem>;
}

export default defineComponent({
  props: {
    chip: String,
    mod: String,
    skip: String,
    isForm: Boolean,
  },
  setup(props, context) {
    const chips: Ref<Array<Chip>> = ref([]);
    const mods: Ref<Array<Mod>> = ref([]);
    const getChips = async () => {
      const res = await axios.get("/generic/chips");
      chips.value = res.data.data;
    };
    const getMods = async () => {
      const res = await axios.get(`/generic/mods?chip=${props.chip}`);
      mods.value = res.data.data;
    };
    const modsTree = computed(() => {
      let modOptions = [];
      for (let item of mods.value) {
        if (item.id === props.skip) {
          continue;
        }
        let modTreeItem: ModTreeItem = {
          value: item.id,
          label: item.name,
          parent: item.parent,
          children: undefined,
        };
        modOptions.push(modTreeItem);
      }
      let tree: Array<ModTreeItem> = [];
      let record: ModTreeItemObj = {};
      for (let item of modOptions) {
        if (parseInt(item.parent)) {
          if (!record[item.parent]) {
            record[item.parent] = [];
          }
          record[item.parent].push(item);
        } else {
          tree.push(item);
        }
      }
      for (let item of modOptions) {
        if (record[item.value]) {
          item.children = record[item.value];
        } else {
          item.children = undefined;
        }
      }
      return tree;
    });
    const chipChange = async (newChip: string) => {
      context.emit("update:mod", "");
      context.emit("update:chip", newChip);
    };
    const modChange = (newMod: string) => {
      context.emit("update:mod", newMod);
    };
    watch(
      () => props.chip,
      async () => {
        await getMods();
      }
    );
    onMounted(getChips);
    onMounted(getMods);
    return {
      chipChange,
      modChange,
      chips,
      mods,
      modsTree,
    };
  },
});
</script>

<style lang="scss" scoped>
.mod-select > div > div > span {
  margin: 0.5em;
}
</style>