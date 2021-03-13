<template>
  <div class="home d-flex">
    <div class="sider">
      <side-menu
        :collapse="collapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        >></side-menu
      >
    </div>
    <div class="d-flex flex-column flex-1">
      <div class="header"><header-menu v-model:collapse="collapse" /></div>
      <div class="main flex-1">
        <router-view :key="$route.path" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import HeaderMenu from "../components/HeaderMenu.vue";
import SideMenu from "../components/SideMenu.vue";

export default defineComponent({
  setup() {
    const collapse = ref(false);
    return {
      collapse,
    };
  },
  components: {
    SideMenu,
    HeaderMenu,
  },
});
</script>

<style lang="scss" scoped>
</style>