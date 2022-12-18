// 需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('~/components/Ui/Layout/childs/MainLayout.vue'),
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
    component: () => import('~/components/Ui/Layout/childs/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('~/views/clients/ClientsHome.vue'),
      },
      {
        path: 'tournaments/draft',
        name: 'user-tournament-draft',
        component: () => import('~/views/user/UserTournamentDraft.vue'),
      },
    ],
  },
  {
    path: '/tournaments',
    component: () => import('~/components/Ui/Layout/childs/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'tournament',
        component: () => import('~/views/tournament/TournamentHome.vue'),
      },
      {
        path: 'create',
        name: 'tournament-create',
        component: () => import('~/views/tournament/DraftCreate.vue'),
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
