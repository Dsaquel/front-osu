// 需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('~/components/Ui/Layout/childs/MainLayout.vue'),
    props: { minWindow: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('~/views/home/HomeIndex.vue'),
      },
    ],
  },
  {
    path: '/users/:userId',
    component: () => import('~/components/Ui/Layout/childs/MainLayout.vue'),
    props: { minWindow: true },
    children: [
      {
        path: 'tournaments',
        name: 'user-tournament',
        component: () => import('~/views/user/UserTournament.vue'),
      },
    ],
  },
  {
    path: '/tournaments',
    component: () => import('~/components/Ui/Layout/childs/MainLayout.vue'),
    props: { minWindow: true },
    children: [
      {
        path: '',
        name: 'tournament',
        component: () => import('~/views/tournament/TournamentHome.vue'),
      },
      {
        path: ':tournamentId',
        name: 'tournament-id',
        component: () => import('~/views/tournament/TournamentDetail.vue'),
      },
      {
        path: ':tournamentId/update',
        name: 'tournament-update',
        component: () => import('~/views/tournament/TournamentUpdate.vue'),
      },
      {
        path: 'drafts',
        children: [
          {
            path: 'create',
            name: 'draft-create',
            component: () => import('~/views/draft/DraftCreate.vue'),
          },
          {
            path: ':draftId',
            children: [
              {
                path: 'update',
                name: 'draft-update',
                component: () => import('~/views/draft/DraftUpdate.vue'),
              },
            ],
          },
        ],
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
