<template>
  <div class="reg-edit">
    <el-form
      :model="reg"
      :rules="regRules"
      label-width="3em"
      ref="formRef"
      @submit.prevent
    >
      <div class="d-flex reg-title">
        <div class="d-flex name-des flex-1">
          <el-form-item label="名称" prop="name">
            <el-input v-model="reg.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" class="flex-1" prop="description">
            <el-input v-model="reg.description"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="偏移" prop="offset">
          <hex-input v-model="reg.offset" :min-length="4"></hex-input>
        </el-form-item>
      </div>
      <el-table :data="reg.fields.slice().reverse()">
        <el-table-column label="bits" min-width="8">
          <template #default="scope">
            <el-form-item
              label=""
              label-width="0px"
              :prop="'fields.' + scope.$index + '.bits'"
              :rules="{ validator: validateFieldBits, trigger: 'blur' }"
            >
              <div class="d-flex bits-input">
                <el-input
                  type="number"
                  min="0"
                  max="31"
                  v-model.number="scope.row.bits[1]"
                ></el-input>
                <span>:</span>
                <el-input
                  type="number"
                  min="0"
                  max="31"
                  v-model.number="scope.row.bits[0]"
                ></el-input>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="name" min-width="15">
          <template #default="scope">
            <el-form-item
              label=""
              label-width="0px"
              :prop="'fields.' + scope.$index + '.name'"
              :rules="{ validator: validateFieldName, trigger: 'blur' }"
            >
              <el-input v-model="scope.row.name"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="description" min-width="40">
          <template #default="scope">
            <el-form-item
              label=""
              label-width="0px"
              :prop="'fields.' + scope.$index + '.description'"
              :rules="{
                required: true,
                message: '请输入描述',
                trigger: 'blur',
              }"
            >
              <el-input
                type="textarea"
                autosize
                v-model="scope.row.description"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="access" label="access" min-width="12">
          <template #default="scope">
            <el-form-item
              label=""
              label-width="0px"
              :prop="'fields.' + scope.$index + '.access'"
              :rules="{ validator: validateFieldAccess, trigger: 'blur' }"
            >
              <el-input v-model="scope.row.access"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="reset" min-width="12">
          <template #default="scope">
            <el-form-item label="" label-width="0px">
              <hex-input
                v-model="scope.row.reset"
                :stringMode="true"
              ></hex-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column min-width="5">
          <template #default="scope">
            <el-button
              class="row-delete"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              tabindex="-1"
              @click="handleDeleteRow(reg.fields.length - 1 - scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <slot :reg="reg" :formRef="formRef"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref, watch } from "vue";
import { Register } from "../model/register";
import HexInput from "./HexInput.vue";
import { makeHex } from "../utils";
import { cloneDeep } from "lodash";

function validateName(
  _: any,
  value: string,
  callback: (s: string | void) => void
) {
  let nameRegExp = /^[A-Z][A-Z_0-9]{1,14}[A-Z0-9]$/;
  if (nameRegExp.test(value)) {
    return callback();
  } else {
    return callback("由A-Z开头, A-Z 0-9 _组成, 长度3~16");
  }
}

function validateDescription(
  _: any,
  value: string,
  callback: (s: string | void) => void
) {
  let nameRegExp = /^(\w+ )*\w+$/;
  if (nameRegExp.test(value)) {
    return callback();
  } else {
    return callback("请输入正确的描述");
  }
}

function validateOffset(
  _: any,
  value: number,
  callback: (s: string | void) => void
) {
  if (value % 4 === 0) {
    return callback();
  } else {
    return callback("Offset必须是4的整数倍");
  }
}

function validateFieldBits(
  _: any,
  value: number[],
  callback: (s: string | void) => void
) {
  if (
    !Number.isInteger(value[0]) ||
    !Number.isInteger(value[1]) ||
    (value[0] < 0 && value[1] > 31 && value[0] > value[1])
  ) {
    return callback("bits定义有误");
  } else {
    return callback();
  }
}

function validateFieldName(
  _: any,
  value: string,
  callback: (s: string | void) => void
) {
  let nameRegExp = /^\w+(\[\d+\])?$/;
  if (nameRegExp.test(value)) {
    return callback();
  } else {
    return callback("请输入正确的信号名");
  }
}

function validateFieldAccess(
  _: any,
  value: string,
  callback: (s: string | void) => void
) {
  let nameRegExp = /^RO|WO|RW|W1C$/;
  if (nameRegExp.test(value)) {
    return callback();
  } else {
    return callback("RO/WO/RW/W1C");
  }
}

export default defineComponent({
  components: { HexInput },
  props: {
    register: { type: Object as PropType<Register>, required: true },
  },
  setup(props) {
    const reg: Ref<Register> = ref(cloneDeep(props.register));
    const regRules = {
      name: [{ validator: validateName, trigger: "blur" }],
      description: [{ validator: validateDescription, trigger: "blur" }],
      offset: [{ validator: validateOffset, trigger: "blur" }],
    };
    const formRef = ref<HTMLFormElement>();
    const handleDeleteRow = (index: number) => {
      reg.value.fields.splice(index, 1);
    };
    watch(
      () => props.register,
      (newVal: Register) => {
        reg.value = cloneDeep(props.register);
      }
    );
    return {
      reg,
      regRules,
      makeHex,
      handleDeleteRow,
      formRef,
      validateFieldBits,
      validateFieldName,
      validateFieldAccess,
    };
  },
});
</script>

<style lang="scss" scoped>
.reg-edit {
  ::v-deep(tr) {
    th,
    td {
      padding: 0;
      .el-textarea__inner {
        min-height: 40px !important;
      }
    }
    td:last-child {
      display: flex;
      align-items: flex-start;
      .cell {
        padding: 6px;
      }
      border: none;
    }
  }
  .reg-title {
    justify-content: space-between;
    .el-form-item {
      margin: 0;
    }
    margin-bottom: 1rem;
  }
  .bits-input {
    align-items: center;
    ::v-deep(.el-input__inner) {
      padding: 0;
      text-align: center;
    }
    ::v-deep(input::-webkit-outer-spin-button),
    ::v-deep(input::-webkit-inner-spin-button) {
      -webkit-appearance: none;
      margin: 0;
    }
    ::v-deep(input[type="number"]) {
      -moz-appearance: textfield; /* Firefox */
    }
  }
}
</style>