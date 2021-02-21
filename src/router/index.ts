import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import ChipList from '../views/ChipList.vue'
import ChipEdit from '../views/ChipEdit.vue'
import Test from '../views/Test.vue'

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
    ]
  },
  {
    path: '/test',
    component: Test
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})