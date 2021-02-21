<template>
  <el-form :model="chip" :rules="rules" ref="ruleForm">
    <el-form-item label="名字" prop="name">
      <el-input v-model="chip.name"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      chip: {
        name: "",
      },
      rules: {
        name: [{ required: true, message: "test", trigger: "blur" }],
      },
    };
  },
};
</script>