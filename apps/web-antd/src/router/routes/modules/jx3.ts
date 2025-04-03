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
      {
        meta: {
          title: $t('jx3.game-items'),
        },
        name: 'JX3GameItems',
        path: '/game-items',
        component: () => import('#/views/jx3/game-items/index.vue'),
      },
      {
        meta: {
          title: $t('jx3.characters'),
        },
        name: 'JX3Characters',
        path: '/characters',
        component: () => import('#/views/jx3/characters/index.vue'),
      },
      {
        meta: {
          title: $t('jx3.character-templates'),
        },
        name: 'JX3CharacterTemplates',
        path: '/character-templates',
        component: () => import('#/views/jx3/character-templates/index.vue'),
      },
      {
        meta: {
          title: $t('jx3.assessments'),
        },
        name: 'JX3Assessments',
        path: '/assessments',
        component: () => import('#/views/jx3/assessments/index.vue'),
      },
    ],
  },
];

export default routes;
