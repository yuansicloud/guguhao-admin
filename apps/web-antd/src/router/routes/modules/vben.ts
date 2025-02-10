import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      badgeType: 'dot',
      icon: VBEN_LOGO_URL,
      order: 9998,
      title: $t('jx3.recommendedProjects'),
    },
    name: 'JX3Project',
    path: '/jx3-projects',
    children: [
      {
        name: 'GuguhaoWeb',
        path: '/guguhao-web',
        component: IFrameView,
        meta: {
          icon: 'https://www.guguhao.com/static/images/logo.png',
          link: 'https://www.guguhao.com/',
          title: $t('jx3.guguhao'),
        },
      },
      {
        name: 'WBL',
        path: '/wbl',
        component: IFrameView,
        meta: {
          icon: 'https://jx3.seasunwbl.com/favicon.ico',
          link: 'https://jx3.seasunwbl.com/',
          title: $t('jx3.WBL'),
        },
      },
      {
        name: 'J3SH',
        path: '/j3sh',
        component: IFrameView,
        meta: {
          icon: 'https://pc.jx3sh.com/favicon.ico',
          link: 'https://pc.jx3sh.com/#/wbl',
          title: $t('jx3.J3SH'),
        },
      },
      {
        name: 'AIJJX3',
        path: '/aijx3',
        component: IFrameView,
        meta: {
          icon: 'https://www.aijx3.cn/favicon.ico',
          link: 'https://www.aijx3.cn/',
          title: $t('jx3.AIJX3'),
        },
      },
      {
        name: 'JX3search',
        path: '/jx3search',
        component: IFrameView,
        meta: {
          icon: 'https://www.jx3search.com/favicon.ico',
          link: 'https://www.jx3search.com/',
          title: $t('jx3.JX3Search'),
        },
      },
      {
        name: 'j3wj',
        path: '/j3wj',
        component: IFrameView,
        meta: {
          icon: 'https://www.j3wj.com/img/favicon.ico',
          link: 'https://www.j3wj.com/',
          title: $t('jx3.j3wj'),
        },
      },
    ],
  },
];

export default routes;
