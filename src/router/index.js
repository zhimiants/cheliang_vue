
import { createRouter, createWebHashHistory } from 'vue-router'

import redirect from './modules/redirect'
import error from './modules/error'
import login from './modules/login'
import lock from './modules/lock'
import home from './modules/home'
import test from './modules/test'
import aichat from './modules/aichat'
import system from './modules/system'
import product from './modules/product'
import order from './modules/order'

/* 菜单栏的路由 */
//固定菜单
// export const fixedRoutes = [...home,...system]
// // 动态菜单
// export const asyncRoutes = [...test]

//固定的菜单
export const fixedRoutes = [...home,...aichat]
//动态的菜单
export const asyncRoutes = [...system,...product,...order]
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    ...redirect, // 统一的重定向配置
    ...login,
    ...lock,
    ...fixedRoutes,
    ...error,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

export default router
