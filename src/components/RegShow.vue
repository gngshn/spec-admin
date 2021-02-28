<template>
  <div class="reg-show">
    <div class="d-flex header">
      <div>
        <span>{{ register.name }}: {{ register.description }}</span>
      </div>
      <span>{{ makeHex(register.offset, 8) }}</span>
    </div>
    <el-table border :data="register.fields.slice().reverse()">
      <el-table-column label="bits" min-width="10">
        <template #default="scope">
          <span v-if="scope.row.msb !== scope.row.lsb">
            {{ scope.row.msb }}:{{ scope.row.lsb }}
          </span>
          <span v-else> {{ scope.row.lsb }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="name" min-width="15">
      </el-table-column>
      <el-table-column prop="description" label="description" min-width="55">
      </el-table-column>
      <el-table-column prop="access" label="access" min-width="10">
      </el-table-column>
      <el-table-column label="reset" min-width="10">
        <template #default="scope">
          <span>{{ scope.row.reset }}</span>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { makeHex } from "../utils";
import { Register } from "../model/register";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    register: { type: Object as PropType<Register>, required: true },
  },
  setup() {
    return {
      makeHex,
    };
  },
});
</script>

<style lang="scss" scoped>
.reg-show {
  .d-flex {
    &.header {
      font-size: 1.2rem;
      padding: 1em;
      background: #eee;
      justify-content: space-between;
      div span {
        margin-right: 1em;
      }
    }
  }
}
</style>