import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'la:id-card-solid',
      keepAlive: true,
      order: 1000,
      title: $t('eshop.title'),
    },
    name: '商城',
    path: '/eshop',
    children: [
      {
        meta: {
          title: $t('eshop.order'),
        },
        name: 'eshopOrders',
        path: '/orders',
        component: () => import('#/views/eshop/orders/index.vue'),
      },
    ],
  },
];

export default routes;
