import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import ChipList from '../views/ChipList.vue'
import ChipEdit from '../views/ChipEdit.vue'
import ModList from '../views/ModList.vue'
import ModEdit from '../views/ModEdit.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/chips/list',
        component: ChipList,
      },
      {
        path: '/chips/create',
        component: ChipEdit,
      },
      {
        path: '/chips/edit/:id',
        component: ChipEdit,
        props: true,
      },
      {
        path: 'mods/list',
        component: ModList,
      },
      {
        path: '/mods/create',
        component: ModEdit,
      },
      {
        path: '/mods/edit/:id',
        component: ModEdit,
        props: true,
      },
    ]
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
