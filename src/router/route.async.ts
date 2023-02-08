// 需要鉴权的业务路由
import { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router';

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('~/components/Ui/Layout/childs/MainLayout.vue'),
    props: { minWindow: true },
    meta: {
      breadcrumb: [{ text: 'home' }],
    },
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
    meta: {
      breadcrumb: [
        {
          text: 'home',
          to: { name: 'home' },
        },
        { text: 'tournaments' },
      ],
    },
    children: [
      {
        path: '',
        name: 'tournaments',
        component: () => import('~/views/tournament/TournamentHome.vue'),
      },
      {
        path: ':tournamentId',
        name: 'tournament-detail',
        component: () => import('~/views/tournament/TournamentDetail.vue'),
        meta: {
          breadcrumb(route: RouteLocationNormalizedLoaded) {
            const { tournamentId } = route.params;
            return [
              {
                text: 'home',
                to: { name: 'home' },
              },
              {
                text: 'tournaments',
                to: { name: 'tournaments' },
              },
              {
                text: `tournament-${tournamentId}`,
              },
            ];
          },
        },
      },
      {
        path: ':tournamentId/update',
        name: 'tournament-update',
        component: () => import('~/views/tournament/TournamentUpdate.vue'),
        meta: {
          breadcrumb(route: RouteLocationNormalizedLoaded) {
            const { tournamentId } = route.params;
            return [
              {
                text: 'home',
                to: { name: 'home' },
              },
              {
                text: 'tournaments',
                to: { name: 'tournaments' },
              },
              {
                text: 'tournaments',
                to: {
                  name: 'tournament-detail',
                  params: {
                    tournamentId,
                  },
                },
              },
              {
                text: 'update',
              },
            ];
          },
        },
      },
      {
        path: ':tournamentId/mappools',
        name: 'mappool-manager',
        component: () => import('~/views/tournament/MappoolManager.vue'),
        meta: {
          breadcrumb(route: RouteLocationNormalizedLoaded) {
            const { tournamentId } = route.params;
            return [
              {
                text: 'home',
                to: { name: 'home' },
              },
              {
                text: 'tournaments',
                to: { name: 'tournaments' },
              },
              {
                text: 'tournaments',
                to: {
                  name: 'tournament-detail',
                  params: {
                    tournamentId,
                  },
                },
              },
              {
                text: 'mappools',
              },
            ];
          },
        },
      },
      {
        path: ':tournamentId/bracket',
        name: 'tournament-bracket',
        component: () => import('~/views/tournament/TournamentBracket.vue'),
        meta: {
          breadcrumb(route: RouteLocationNormalizedLoaded) {
            const { tournamentId } = route.params;
            return [
              {
                text: 'home',
                to: { name: 'home' },
              },
              {
                text: 'tournaments',
                to: { name: 'tournaments' },
              },
              {
                text: 'tournaments',
                to: {
                  name: 'tournament-detail',
                  params: {
                    tournamentId,
                  },
                },
              },
              {
                text: 'bracket',
              },
            ];
          },
        },
      },
      {
        path: ':tournamentId/qualifier',
        name: 'qualifier-detail',
        component: () => import('~/views/qualifier/QualifierDetail.vue'),
        meta: {
          breadcrumb(route: RouteLocationNormalizedLoaded) {
            const { tournamentId } = route.params;
            return [
              {
                text: 'home',
                to: { name: 'home' },
              },
              {
                text: 'tournaments',
                to: { name: 'tournaments' },
              },
              {
                text: 'tournaments',
                to: {
                  name: 'tournament-detail',
                  params: {
                    tournamentId,
                  },
                },
              },
              {
                text: 'qualifier',
              },
            ];
          },
        },
      },
      {
        path: ':tournamentId/qualifier/lobbies',
        name: 'qualifier-lobbies',
        component: () => import('~/views/qualifier/QualifierLobbies.vue'),
        meta: {
          breadcrumb(route: RouteLocationNormalizedLoaded) {
            const { tournamentId } = route.params;
            return [
              {
                text: 'home',
                to: { name: 'home' },
              },
              {
                text: 'tournaments',
                to: { name: 'tournaments' },
              },
              {
                text: 'tournaments',
                to: {
                  name: 'tournament-detail',
                  params: {
                    tournamentId,
                  },
                },
              },
              {
                text: 'qualifier',
                to: {
                  name: 'qualifier-detail',
                  params: {
                    tournamentId,
                  },
                },
              },
              {
                text: 'lobbies',
              },
            ];
          },
        },
      },
      {
        path: ':tournamentId/requests',
        name: 'tournament-requests',
        component: () => import('~/views/tournament/TournamentRequests.vue'),
        meta: {
          breadcrumb(route: RouteLocationNormalizedLoaded) {
            const { tournamentId } = route.params;
            return [
              {
                text: 'home',
                to: { name: 'home' },
              },
              {
                text: 'tournaments',
                to: { name: 'tournaments' },
              },
              {
                text: 'tournaments',
                to: {
                  name: 'tournament-detail',
                  params: {
                    tournamentId,
                  },
                },
              },
              {
                text: 'requests',
              },
            ];
          },
        },
      },
      {
        path: ':tournamentId/participants',
        name: 'tournament-participants',
        component: () => import('~/views/tournament/TournamentParticipants.vue'),
        meta: {
          breadcrumb(route: RouteLocationNormalizedLoaded) {
            const { tournamentId } = route.params;
            return [
              {
                text: 'home',
                to: { name: 'home' },
              },
              {
                text: 'tournaments',
                to: { name: 'tournaments' },
              },
              {
                text: 'tournaments',
                to: {
                  name: 'tournament-detail',
                  params: {
                    tournamentId,
                  },
                },
              },
              {
                text: 'participants',
              },
            ];
          },
        },
      },
      {
        path: 'drafts',
        children: [
          {
            path: ':draftId',
            name: 'draft-detail',
            component: () => import('~/views/draft/DraftDetail.vue'),
            meta: {
              breadcrumb(route: RouteLocationNormalizedLoaded) {
                const { draftId } = route.params;
                return [
                  {
                    text: 'home',
                    to: { name: 'home' },
                  },
                  {
                    text: 'tournaments',
                    to: { name: 'tournaments' },
                  },
                  {
                    text: `draft-${draftId}`,
                  },
                ];
              },
            },
          },
          {
            path: 'create',
            name: 'draft-create',
            component: () => import('~/views/draft/DraftCreate.vue'),
            meta: {
              breadcrumb: [
                {
                  text: 'home',
                  to: { name: 'home' },
                },
                { text: 'tournaments', to: { name: 'tournaments' } },
                // all draft here
                { text: 'create' },
              ],
            },
          },
          {
            path: ':draftId/update',
            name: 'draft-update',
            component: () => import('~/views/draft/DraftUpdate.vue'),
            meta: {
              breadcrumb(route: RouteLocationNormalizedLoaded) {
                const { draftId } = route.params;
                return [
                  {
                    text: 'home',
                    to: { name: 'home' },
                  },
                  {
                    text: 'tournaments',
                    to: { name: 'tournaments' },
                  },
                  {
                    text: `draft-${draftId}`,
                    to: { name: 'draft-detail', params: { draftId } },
                  },
                  {
                    text: 'udpate',
                  },
                ];
              },
            },
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
