import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('jx3.title'),
    },
    name: '剑三',
    path: '/jx3',
    children: [
      {
        meta: {
          title: $t('jx3.assets'),
        },
        name: 'JX3Assets',
        path: '/assets',
        component: () => import('#/views/jx3/assets/index.vue'),
      },
    ],
  },
];

export default routes;
