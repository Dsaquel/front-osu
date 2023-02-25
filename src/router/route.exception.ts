// 跟鉴权无关的特殊路由
import { RouteRecordRaw } from 'vue-router';

const exceptionRoutes: Array<RouteRecordRaw> = [
  {
    path: '/401',
    name: '401',
    meta: {
      title: '需要登录',
    },
    component: () => import('~/views/exception/Exeception-401.vue'),
  },
  {
    path: '/403',
    name: '403',
    meta: {
      title: 'Access forbidden',
    },
    component: () => import('~/views/exception/Exeception-403.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '非常抱歉,页面走丢了',
    },
    component: () => import('~/views/exception/Exeception-404.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    meta: {},
    redirect: '/404',
  },
];

export default exceptionRoutes;
