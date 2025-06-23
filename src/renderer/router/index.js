/**
 * 路由配置
 */
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/WelcomeView.vue'),
    meta: {
      title: '欢迎页'
    }
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/MenuView.vue'),
    meta: {
      title: '商品菜单'
    }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('../views/DetailView.vue'),
    props: true,
    meta: {
      title: '商品详情'
    }
  },
  {
    path: '/end',
    name: 'End',
    component: () => import('../views/EndView.vue'),
    meta: {
      title: '结算页面'
    }
  },
  // 默认重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 路由前置守卫，处理标题
router.beforeEach((to, from, next) => {
  // 更新标题
  if (to.meta.title) {
    document.title = `数字标牌系统 - ${to.meta.title}`;
  }
  next();
});

export default router; 