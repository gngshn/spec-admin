import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import ChipList from '../components/ChipList.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/chips/list',
        component: ChipList,
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})