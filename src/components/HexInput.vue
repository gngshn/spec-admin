<template>
  <div class="hex-input">
    <el-input v-model="numString" @blur="inputBlur"></el-input>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { makeHex } from "../utils";

export default defineComponent({
  props: {
    modelValue: { required: true },
    minLength: { type: Number, default: 0 },
    stringMode: { type: Boolean, default: false },
  },
  setup(props, context) {
    const getString = (value: string | number) => {
      if (props.stringMode) {
        return makeHex(parseInt(value as string), props.minLength);
      } else {
        return makeHex(value as number, props.minLength);
      }
    };
    let numString = ref(getString(props.modelValue as string | number));
    const intputValue = computed(() => {
      if (props.stringMode) {
        return numString.value;
      } else {
        return parseInt(numString.value);
      }
    });
    watch(props, () => {
      numString.value = getString(props.modelValue as string | number);
    });
    let inputBlur = () => {
      numString.value = getString(
        props.stringMode ? numString.value : parseInt(numString.value)
      );
      context.emit("update:modelValue", intputValue.value);
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