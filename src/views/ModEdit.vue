<template>
  <div class="mod-edit">
    <h1>{{ id ? "编辑" : "新建" }}模块</h1>
    <el-form
      :model="mod"
      :rules="modRules"
      label-position="right"
      label-width="6em"
      ref="formRef"
    >
      <div class="parent-select d-flex">
        <el-form-item label="所属芯片" prop="chip">
          <el-select v-model="mod.chip" @change="updateMods">
            <el-option
              v-for="item in chips"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属模块">
          <el-cascader
            :disabled="mod.chip === ''"
            :options="modsTree"
            :props="{
              checkStrictly: true,
              emitPath: false,
              expandTrigger: 'hover',
            }"
            filterable
            clearable
            :show-all-levels="false"
            v-model="mod.parent"
          ></el-cascader>
        </el-form-item>
      </div>
      <div class="d-flex">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="mod.name"></el-input>
        </el-form-item>
        <el-form-item label="地址偏移" prop="regOffset">
          <el-input v-model="mod.regOffset"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="模块描述" prop="description">
        <el-input type="textarea" autosize v-model="mod.description"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Chip } from "../model/chip";
import { Mod } from "../model/mod";
import axios from "../utils/axios";

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
    id: String,
  },
  setup(props) {
    const zeroMod: Mod = {
      id: "",
      name: "",
      description: "",
      chip: "",
      parent: "",
      regOffset: "",
    };
    const router = useRouter();
    const mod: Ref<Mod> = ref(Object.assign({}, zeroMod));
    const modRules = ref({
      name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      description: [{ required: true, message: "请输入描述", trigger: "blur" }],
      chip: [{ required: true, message: "请选择芯片", trigger: "change" }],
      regOffset: [
        { required: true, message: "请输入寄存器地址偏移", trigger: "blur" },
      ],
    });
    const mods: Ref<Array<Mod>> = ref([]);
    const chips: Ref<Array<Chip>> = ref([]);

    const formRef = ref<HTMLFormElement>();

    const getChips = async () => {
      const res = await axios.get("/generic/chips");
      chips.value = res.data.data;
    };
    const getMods = async () => {
      const res = await axios.get(`/generic/mods?chip=${mod.value.chip}`);
      mods.value = res.data.data;
    };

    const modsTree = computed(() => {
      let modOptions = [];
      for (let item of mods.value) {
        if (item.id === mod.value.id) {
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
    const save = async () => {
      if (formRef.value) {
        try {
          await formRef.value.validate();
        } catch (e) {
          return;
        }
      }
      let res;
      if (props.id) {
        res = await axios.put(`/generic/mods/${props.id}`, mod.value);
      } else {
        res = await axios.post("/generic/mods", mod.value);
      }
      if (res.status === 200 || res.status === 201) {
        router.push("/mods/list");
      }
    };
    const fetchData = async () => {
      if (props.id) {
        const res = await axios.get(`/generic/mods/${props.id}`);
        mod.value = res.data;
      } else {
        mod.value = Object.assign({}, zeroMod);
      }
      await getChips();
      await getMods();
    };
    const updateMods = async () => {
      await getMods();
    };
    onMounted(fetchData);
    watch(props, async () => {
      fetchData();
    });
    return {
      mod,
      modRules,
      save,
      fetchData,
      updateMods,
      chips,
      modsTree,
      formRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.mod-edit {
  margin: 1rem;
  .d-flex:deep(.el-input) {
    width: 16rem;
  }
  h1 {
    margin-left: 1rem;
    margin-bottom: 1rem;
  }
  .el-button {
    margin-left: 6em;
  }
}
</style>
