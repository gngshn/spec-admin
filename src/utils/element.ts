import { App, Component } from 'vue'
import {
  ElAffix,
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElCascader,
  ElCard,
  ElIcon,
  ElTable,
  ElTableColumn,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElPagination,
} from 'element-plus'

const components: Array<Component> = [
  ElAffix,
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElCascader,
  ElCard,
  ElIcon,
  ElTable,
  ElTableColumn,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElPagination,
]

export default (app: App<Element>) => {
  components.forEach(c => { app.component(c.name as string, c) })
}