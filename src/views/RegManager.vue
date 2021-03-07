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
      :modelValue="newReg"
      :isNew="true"
      v-if="mod !== null && mod !== ''"
      :key="newKeyCount"
      @reg-change="handleRegChange"
    ></reg-edit>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  Ref,
  ref,
  watch,
} from "vue";
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
    const newKeyCount = ref(0);
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
    const newReg: ComputedRef<Register> = computed(() => {
      return {
        id: "",
        name: "",
        description: "",
        offset: NaN,
        fields: [
          {
            bits: [NaN, NaN],
            name: "",
            description: "",
            access: "",
            reset: "",
          },
        ],
        parent: mod.value,
      };
    });
    const handleRegChange = async () => {
      await fetchRegisters();
      newKeyCount.value += 1;
    };
    onMounted(fetchRegisters);
    watch(mod, fetchRegisters);
    return {
      currentComponent,
      newKeyCount,
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