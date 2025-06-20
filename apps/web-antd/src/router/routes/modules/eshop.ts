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
          title: $t('EasyAbpEShopOrders.Order'),
        },
        name: 'eshopOrders',
        path: '/orders',
        component: () => import('#/views/eshop/orders/index.vue'),
      },
      {
        meta: {
          title: $t('EasyAbpEShopStores.Store'),
        },
        name: 'eshopStores',
        path: '/stores',
        component: () => import('#/views/eshop/stores/index.vue'),
      },
      {
        meta: {
          title: $t('EasyAbpEShopProducts.Product'),
        },
        name: 'eshopProducts',
        path: '/products',
        component: () => import('#/views/eshop/products/index.vue'),
      },
    ],
  },
];

export default routes;
