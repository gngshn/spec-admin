<template>
  <div class="mod-edit">
    <h1>{{ id ? "编辑" : "新建" }}模块</h1>
    <el-card>
      <el-form
        :model="mod"
        :rules="modRules"
        label-position="right"
        label-width="6em"
        ref="formRef"
        @submit.prevent="save"
      >
        <mod-select
          :isForm="true"
          v-model:chip="mod.chip"
          v-model:mod="mod.parent"
          v-model:skip="mod.id"
        ></mod-select>
        <div class="d-flex">
          <el-form-item label="模块名称" prop="name">
            <el-input v-model="mod.name"></el-input>
          </el-form-item>
          <el-form-item label="地址偏移" prop="regOffset">
            <hex-input v-model="mod.regOffset" :minLength="4"></hex-input>
          </el-form-item>
        </div>
        <el-form-item label="模块描述" prop="description">
          <el-input
            type="textarea"
            autosize
            v-model="mod.description"
          ></el-input>
        </el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from "vue";
import { useRouter } from "vue-router";
import HexInput from "../components/HexInput.vue";
import ModSelect from "../components/ModSelect.vue";
import { Mod } from "../model/mod";
import axios from "../utils/axios";

function regOffsetValidator(_: any, value: number, callback: any) {
  if (isNaN(value) || value < 0 || value > 0xffffffff) {
    callback("请输入合理的 32bit 数字");
  } else {
    callback();
  }
}

export default defineComponent({
  components: {
    ModSelect,
    HexInput,
  },
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
      regOffset: NaN,
    };
    const router = useRouter();
    const mod: Ref<Mod> = ref(Object.assign({}, zeroMod));
    const modRules = ref({
      name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      description: [{ required: true, message: "请输入描述", trigger: "blur" }],
      chip: [{ required: true, message: "请选择芯片", trigger: "change" }],
      regOffset: [{ validator: regOffsetValidator, trigger: "blur" }],
    });

    const formRef = ref<HTMLFormElement>();

    const save = async () => {
      try {
        console.log("save");
        await formRef.value?.validate();
        let res;
        if (props.id) {
          res = await axios.put(`/generic/mods/${props.id}`, mod.value);
        } else {
          res = await axios.post("/generic/mods", mod.value);
        }
        if (res.status === 200 || res.status === 201) {
          router.push("/mods/list");
        }
      } catch {
        return;
      }
    };
    const fetchData = async () => {
      if (props.id) {
        const res = await axios.get(`/generic/mods/${props.id}`);
        mod.value = res.data;
      } else {
        mod.value = Object.assign({}, zeroMod);
      }
    };
    onMounted(fetchData);
    watch(
      () => props.id,
      async () => {
        fetchData();
      }
    );
    return {
      mod,
      modRules,
      save,
      fetchData,
      formRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.mod-edit {
  margin: 1rem;
  :deep(.d-flex .el-input) {
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
