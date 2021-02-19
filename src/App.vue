<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}
.flex-2 {
  flex: 2;
}
.flex-4 {
  flex: 4;
}
.flex-8 {
  flex: 8;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>