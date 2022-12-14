// 需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('~/components/ui/layout/childs/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('~/views/home/HomeIndex.vue'),
      },
    ],
  },
  {
    path: '/users/:id',
    component: () => import('~/components/ui/layout/childs/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('~/views/clients/ClientsHome.vue'),
      },
    ],
  },
  {
    path: '/tournaments',
    component: () => import('~/components/ui/layout/childs/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'tournaments',
        component: () => import('~/views/tournaments/TournamentsHome.vue'),
      },
    ],
  },
  {
    path: '/process',
    name: 'process',
    meta: {
      title: 'Template configuration process',
      icon: '',
    },
    component: () => import('~/views/example/MarkdownPage.vue'),
  },
  {
    path: '/response-code',
    name: 'reponse-code',
    meta: {
      title: '',
      icon: '',
    },
    component: () => import('~/views/osu/ResponseCode.vue'),
  },
];

export default asyncRoutes;
