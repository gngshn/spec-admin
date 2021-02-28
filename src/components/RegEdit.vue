<template>
  <el-card class="reg-man">
    <reg-show v-if="isShowing" :register="modelValue">
      <div class="d-flex footer">
        <el-button
          type="primary"
          icon="el-icon-edit"
          @click="isShowing = false"
        >
          编辑
        </el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(modelValue)"
        >
          删除
        </el-button>
      </div>
    </reg-show>
    <reg-form
      v-if="!isShowing"
      :register="modelValue"
      v-slot="{ reg, formRef }"
    >
      <div class="d-flex footer">
        <div class="d-flex">
          <el-button
            type="success"
            icon="el-icon-success"
            @click="handleSave(reg, formRef)"
          >
            提交
          </el-button>
          <el-button
            type="warning"
            icon="el-icon-refresh"
            @click="isShowing = true"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleAddRow(reg)"
          >
            增加行
          </el-button>
        </div>
        <el-button
          v-if="isNew === false"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(modelValue)"
        >
          删除
        </el-button>
      </div>
    </reg-form>
  </el-card>
</template>

<script lang="ts">
import { PropType, ref } from "vue";
import { RegField, Register } from "../model/register";
import RegShow from "./RegShow.vue";
import RegForm from "./RegForm.vue";
import axios from "../utils/axios";
// import { ElMessage } from "element-plus";
// import { deleteConfirm } from "../utils";

export default {
  components: { RegShow, RegForm },
  props: {
    modelValue: { type: Object as PropType<Register>, required: true },
    isNew: { type: Boolean, default: false },
  },
  setup(props, context) {
    const isShowing = ref(props.isNew ? false : true);
    const handleSave = async (reg: Register, formRef: HTMLFormElement) => {
      try {
        await formRef.validate();
        if (props.isNew) {
          reg.id = "";
          await axios.post("/generic/registers", reg);
          context.emit("reg-change");
        } else {
          await axios.put(`/generic/registers/${reg.id}`, reg);
          context.emit("update:modelValue", reg);
          isShowing.value = true;
        }
        // ElMessage.success("保存成功");
      } catch {
        // ElMessage.error("保存失败");
      }
    };
    const handleDelete = async (reg: Register) => {
      // if (!(await deleteConfirm())) {
      //   return;
      // }
      try {
        await axios.delete(`/generic/registers/${reg.id}`);
        // ElMessage.success({ message: "删除成功", type: "success" });
        context.emit("reg-change");
      } catch {
        // ElMessage.error("删除失败");
      }
    };
    const handleAddRow = async (reg: Register) => {
      reg.fields.push({} as RegField);
    };

    return {
      isShowing,
      handleSave,
      handleDelete,
      handleAddRow,
    };
  },
};
</script>

<style lang="scss" scoped>
.reg-man {
  margin-bottom: 1rem;
  .footer {
    justify-content: space-between;
    margin-top: 0.5rem;
  }
}
</style>