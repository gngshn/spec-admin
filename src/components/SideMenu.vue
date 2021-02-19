<template>
  <el-menu router :collapse="collapse">
    <el-submenu index="1">
      <template #title>
        <i class="el-icon-cpu"></i> <span>芯片</span>
      </template>
      <el-menu-item index="/chips/list">RTS3917</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script lang='ts'>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    collapse: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100vh;

  &:not(.el-menu--collapse) {
    width: 16em;
  }
}
</style>