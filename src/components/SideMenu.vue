<template>
  <el-menu router :collapse="collapse" :default-openeds="['2']">
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
  border: none;

  &:not(.el-menu--collapse) {
    width: 16em;
  }
}
.el-menu--collapse span {
  display: none;
}
</style>
