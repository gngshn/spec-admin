import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/chips/list',
        component: () => import('../views/ChipList.vue'),
      },
      {
        path: '/chips/create',
        component: () => import('../views/ChipEdit.vue'),
      },
      {
        path: '/chips/edit/:id',
        component: () => import('../views/ChipEdit.vue'),
        props: true,
      },
      {
        path: '/mods/list',
        component: () => import('../views/ModList.vue'),
      },
      {
        path: '/mods/create',
        component: () => import('../views/ModEdit.vue'),
      },
      {
        path: '/mods/edit/:id',
        component: () => import('../views/ModEdit.vue'),
        props: true,
      },
      {
        path: '/registers',
        component: () => import('../views/RegManager.vue'),
      },
      {
        path: '/registers/:modID',
        component: () => import('../views/RegManager.vue'),
        props: true,
      },
    ]
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
