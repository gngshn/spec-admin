<template>
  <el-affix>
    <div class="header-menu d-flex">
      <el-button
        class="fold-button"
        type="text"
        :icon="foldIconType"
        @click="foldIconClick()"
      ></el-button>
      <div class="d-flex user-info" v-if="getUsername() !== ''">
        <h3>Hello, {{ getUsername() }}</h3>
        <el-button
          type="warning"
          icon="el-icon-switch-button"
          size="mini"
          circle
          @click="logout"
        ></el-button>
      </div>
    </div>
  </el-affix>
</template>

<script lang='ts'>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import { getUsername } from "../utils";

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
    const router = useRouter();
    const logout = () => {
      sessionStorage.clear();
      router.push("/login");
    };
    return {
      foldIconClick,
      foldIconType,
      getUsername,
      logout,
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
  .fold-button {
    padding: 0;
    padding-left: 0.2em;
    border: none;
    font-size: 2em;
    color: #888;
  }
  .user-info {
    margin-right: 1em;
    h3 {
      margin-right: 0.2em;
    }
  }
}
.d-flex {
  justify-content: space-between;
  align-items: center;
}
</style>