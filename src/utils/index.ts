import { ElMessageBox } from "element-plus";

export function makeHex(num: number, length: number = 0) {
  if (isNaN(num)) {
    return ""
  }
  let str = num.toString(16);
  if (str.length < length) {
    return "0x" + "0".repeat(length - str.length) + str.toUpperCase();
  } else {
    return "0x" + str.toUpperCase();
  }
}

export async function deleteConfirm(name: string = "该项"): Promise<boolean> {
  try {
    await ElMessageBox.confirm(
      `此操作将永久删除${name}, 是否继续?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    return true
  } catch {
    return false
  }
};