import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'la:id-card-solid',
      keepAlive: true,
      order: 1000,
      title: $t('point.title'),
    },
    name: '咕币',
    path: '/point',
    children: [
      {
        meta: {
          title: $t('point.account'),
        },
        name: 'PointAccounts',
        path: '/accounts',
        component: () => import('#/views/point/accounts/index.vue'),
      },
      {
        meta: {
          title: $t('point.userAccount'),
        },
        name: 'PointUserAccounts',
        path: '/user-accounts',
        component: () => import('#/views/point/useraccounts/index.vue'),
      },
    ],
  },
];

export default routes;
