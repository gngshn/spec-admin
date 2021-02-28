<template>
  <el-affix>
    <div class="header-menu d-flex">
      <el-button
        type="text"
        :icon="foldIconType"
        @click="foldIconClick()"
      ></el-button>
    </div>
  </el-affix>
</template>

<script lang='ts'>
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    collapse: Boolean,
  },
  setup(props, context) {
    const foldIconClick = () =>
      context.emit("update:collapse", !props.collapse);
    const foldIconType = computed(() => {
      return props.collapse ? "el-icon-s-unfold" : "el-icon-s-fold";
    });
    return {
      foldIconClick,
      foldIconType,
    };
  },
});
</script>

<style lang="scss" scoped>
.header-menu {
  background: #ccc;
  height: 3em;
  border-bottom: 1px solid #eee;
  margin-bottom: 2px;
  .el-button {
    padding: 0;
    padding-left: 0.2em;
    border: none;
    font-size: 2em;
    color: #888;
  }
}
</style>