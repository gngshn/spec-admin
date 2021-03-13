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
      {
        path: '/users/list',
        component: () => import('../views/UserList.vue'),
      },
      {
        path: '/users/create',
        component: () => import('../views/UserEdit.vue'),
      },
    ]
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    meta: { isPublic: true }
  },
  {
    path: '/change-password',
    component: () => import('../views/PasswordChange.vue'),
    meta: { isPublic: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(to => {
  if (sessionStorage.token) {
    if (to.path == '/login') {
      return '/'
    }
  } else {
    if (!to.meta.isPublic) {
      return '/login'
    }
  }
})

export default router