<template>
  <div class="hex-input">
    <el-input v-model="numString" @blur="inputBlur"></el-input>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { makeString } from "../utils";

export default defineComponent({
  props: {
    modelValue: { type: Number, required: true },
    minLength: { type: Number, default: 0 },
  },
  setup(props, context) {
    let numString = ref("");
    watch(
      () => props.modelValue,
      (newVal) => (numString.value = makeString(newVal, props.minLength))
    );
    let inputBlur = () => {
      let num = parseInt(numString.value);
      num = isNaN(num) ? 0 : num;
      numString.value = makeString(num, props.minLength);
      context.emit("update:modelValue", num);
    };
    return {
      numString,
      inputBlur,
    };
  },
});
</script>

<style>
</style>