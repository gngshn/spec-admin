<template>
  <el-affix>
    <el-menu router :collapse="collapse" v-bind="$attrs">
      <el-menu-item index="/">
        <i class="el-icon-s-grid"></i><span>Dashboard</span>
      </el-menu-item>
      <el-submenu index="1">
        <template #title>
          <i class="el-icon-cpu"></i><span>芯片管理</span>
        </template>
        <el-menu-item index="/chips/list">
          <span>芯片列表</span>
        </el-menu-item>
        <el-menu-item index="/chips/create">
          <span>新建芯片</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template #title>
          <i class="el-icon-set-up"></i><span>模块管理</span>
        </template>
        <el-menu-item index="/mods/list">
          <span>模块列表</span>
        </el-menu-item>
        <el-menu-item index="/mods/create">
          <span>新建模块</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/registers">
        <i class="el-icon-setting"></i>
        <span>寄存器管理</span>
      </el-menu-item>
    </el-menu>
  </el-affix>
</template>

<script lang='ts'>
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    collapse: Boolean,
  },
  setup() {
    const inheritAttrs = ref(false);
    return {
      inheritAttrs,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100vh;
  border: none;

  &:not(.el-menu--collapse) {
    width: 16em;
  }
}
.el-menu--collapse span {
  display: none;
}
</style>
