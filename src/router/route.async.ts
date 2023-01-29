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
        path: '',
        name: 'user-profile',
        component: () => import('~/views/user/UserProfile.vue'),
      },
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
    props: { minWindow: false },
    children: [
      {
        path: '',
        name: 'tournament',
        component: () => import('~/views/tournament/TournamentHome.vue'),
      },
      {
        path: ':tournamentId',
        name: 'tournament-detail',
        component: () => import('~/views/tournament/TournamentDetail.vue'),
      },
      {
        path: ':tournamentId/update',
        name: 'tournament-update',
        component: () => import('~/views/tournament/TournamentUpdate.vue'),
      },
      {
        path: ':tournamentId/mappools',
        name: 'mappool-manager',
        component: () => import('~/views/tournament/MappoolManager.vue'),
      },
      {
        path: ':tournamentId/bracket',
        name: 'tournament-bracket',
        component: () => import('~/views/tournament/TournamentBracket.vue'),
      },
      {
        path: ':tournamentId/qualifier',
        name: 'qualifier-detail',
        component: () => import('~/views/qualifier/QualifierDetail.vue'),
      },
      {
        path: ':tournamentId/qualifier/lobbies',
        name: 'qualifier-lobbies',
        component: () => import('~/views/qualifier/QualifierLobbies.vue'),
      },
      {
        path: ':tournamentId/requests',
        name: 'tournament-requests',
        component: () => import('~/views/tournament/TournamentRequests.vue'),
      },
      {
        path: ':tournamentId/participants',
        name: 'tournament-participants',
        component: () => import('~/views/tournament/TournamentParticipants.vue'),
      },
      {
        path: 'drafts',
        children: [
          {
            path: ':draftId',
            name: 'draft-detail',
            component: () => import('~/views/draft/DraftDetail.vue'),
          },
          {
            path: 'create',
            name: 'draft-create',
            component: () => import('~/views/draft/DraftCreate.vue'),
          },
          {
            path: ':draftId/update',
            name: 'draft-update',
            component: () => import('~/views/draft/DraftUpdate.vue'),
          },
        ],
      },
      // {},
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
