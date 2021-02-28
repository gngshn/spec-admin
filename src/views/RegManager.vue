<template>
  <div class="registers">
    <h1>寄存器管理</h1>
    <mod-select
      v-if="modID === ''"
      v-model:chip="chip"
      v-model:mod="mod"
    ></mod-select>
    <reg-edit
      v-for="(reg, index) in pagination.data"
      :key="reg.id"
      v-model="pagination.data[index]"
      @reg-change="handleRegChange"
    ></reg-edit>
    <reg-edit
      v-if="mod !== null && mod !== ''"
      v-model="newReg"
      :isNew="true"
      @reg-change="handleRegChange"
    ></reg-edit>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from "vue";
import axios from "../utils/axios";
import ModSelect from "../components/ModSelect.vue";
import RegEdit from "../components/RegEdit.vue";
import { Pagination } from "../model/pagination";
import { Register } from "../model/register";

export default defineComponent({
  components: { ModSelect, RegEdit },
  props: {
    modID: { type: String, default: "" },
  },
  setup(props) {
    const currentComponent = ref("reg-show");
    const pagination: Ref<Pagination<Register>> = ref({
      limit: 10,
    } as Pagination<Register>);
    const chip = ref("");
    const mod = ref(props.modID);
    const fetchRegisters = async () => {
      if (mod.value === "") {
        pagination.value.data = [];
        return;
      }
      const res = await axios.get(
        `/generic/registers?parent=${mod.value}&skip=${pagination.value.skip}&limit=${pagination.value.limit}`
      );
      pagination.value = res.data;
    };
    const newRegVal = {
      id: "",
      name: "",
      description: "",
      offset: 0,
      fields: [{ reset: "" }],
      parent: mod.value,
    } as Register;
    const newReg: Ref<Register> = ref(JSON.parse(JSON.stringify(newRegVal)));
    newReg.value.parent = mod.value;
    watch(
      () => mod.value,
      (newVal) => (newReg.value.parent = newVal)
    );
    const handleRegChange = async () => {
      await fetchRegisters();
      newReg.value = JSON.parse(JSON.stringify(newRegVal));
      newReg.value.parent = mod.value;
    };
    onMounted(fetchRegisters);
    watch(mod, fetchRegisters);
    return {
      currentComponent,
      pagination,
      chip,
      mod,
      newReg,
      handleRegChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.registers {
  .mod-select {
    margin-bottom: 1rem;
  }
  margin: 1em;
  h1 {
    margin-left: 1rem;
    margin-bottom: 1rem;
  }
  .footer {
    background: #ccc;
  }
}
</style>