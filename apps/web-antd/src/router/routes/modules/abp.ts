import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'https://abp.io/assets/favicon.ico/favicon-16x16.png',
      keepAlive: true,
      order: 9999,
      title: $t('abp.system'),
    },
    name: 'AbpFramework',
    path: '/abp',
    children: [
      {
        meta: {
          title: $t('abp.manage.title'),
          icon: 'arcticons:activity-manager',
        },
        name: 'Manage',
        path: '/manage',
        children: [
          {
            meta: {
              title: $t('abp.manage.identity.title'),
              icon: 'teenyicons:id-outline',
            },
            name: 'Identity',
            path: '/manage/identity',
            children: [
              {
                component: () => import('#/views/identity/users/index.vue'),
                name: 'Users',
                path: '/manage/identity/users',
                meta: {
                  title: $t('abp.manage.identity.user'),
                  icon: 'mdi:user-outline',
                },
              },
              {
                component: () => import('#/views/identity/roles/index.vue'),
                name: 'Roles',
                path: '/manage/identity/roles',
                meta: {
                  title: $t('abp.manage.identity.role'),
                  icon: 'carbon:user-role',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
