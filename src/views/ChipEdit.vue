<template>
  <div class="chip-edit">
    <h1>{{ id ? "编辑" : "新建" }}芯片</h1>
    <el-card>
      <el-form
        :model="chip"
        :rules="chipRules"
        label-position="right"
        label-width="6em"
        ref="formRef"
        @submit.prevent="save"
      >
        <el-form-item label="芯片名称" prop="name">
          <el-input v-model="chip.name"></el-input>
        </el-form-item>
        <el-form-item label="芯片描述" prop="description">
          <el-input
            type="textarea"
            autosize
            v-model="chip.description"
          ></el-input>
        </el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { Chip } from "../model/chip";
import axios from "../utils/axios";

export default defineComponent({
  props: {
    id: String,
  },
  setup(props) {
    const router = useRouter();
    const chip: Ref<Chip> = ref({
      id: "",
      name: "",
      description: "",
    });
    const chipRules = ref({
      name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      description: [{ required: true, message: "请输入描述", trigger: "blur" }],
    });
    const formRef = ref<HTMLFormElement>();
    const save = async () => {
      try {
        await formRef.value?.validate();
        let res;
        if (props.id) {
          res = await axios.put(`/generic/chips/${props.id}`, chip.value);
        } else {
          res = await axios.post("/generic/chips", chip.value);
        }
        if (res.status === 200 || res.status === 201) {
          router.push("/chips/list");
        }
      } catch {
        return;
      }
    };
    const getChip = async () => {
      if (props.id) {
        const res = await axios.get(`/generic/chips/${props.id}`);
        chip.value = res.data;
      }
    };
    onMounted(getChip);
    return {
      chip,
      chipRules,
      save,
      getChip,
      formRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.chip-edit {
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
