import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/battle',
    name: 'battle',
    component: () => import('@/views/Battle.vue'),
    meta: { title: '战斗', requiresAuth: true }
  },
  {
    path: '/pets',
    name: 'pets',
    component: () => import('@/views/PetManagement.vue'),
    meta: { title: '魂宠管理', requiresAuth: true }
  },
  {
    path: '/exploration',
    name: 'exploration',
    component: () => import('@/views/Exploration.vue'),
    meta: { title: '探索', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings.vue'),
    meta: { title: '设置', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 延迟加载store
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '宠魅'} - 魂宠世界`

  // 检查认证
  if (to.meta.requiresAuth) {
    // 动态导入store以避免初始化时的依赖问题
    import('@/stores/player').then(({ usePlayerStore }) => {
      const playerStore = usePlayerStore()
      if (!playerStore.player) {
        next({ name: 'home' })
      } else {
        next()
      }
    }).catch(() => {
      next({ name: 'home' })
    })
  } else {
    next()
  }
})

export default router
