<script lang="ts" setup>
import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { $t } from '#/locales';

const userStore = useUserStore();

// 这是一个示例数据，实际项目中需要根据实际情况进行调整
// url 也可以是内部路由，在 navTo 方法中识别处理，进行内部跳转
// 例如：url: /dashboard/workspace
const projectItems: WorkbenchProjectItem[] = [
  {
    color: '',
    content: '移动端估计平台。',
    date: '2025-01-15',
    group: 'JX3',
    icon: 'https://www.guguhao.com/static/images/logo.png',
    title: $t('jx3.guguhao'),
    url: 'https://www.guguhao.com/',
  },
  {
    color: '',
    content: '万宝楼官方平台',
    date: '2025-01-15',
    group: 'JX3',
    icon: 'https://jx3.seasunwbl.com/favicon.ico',
    title: $t('jx3.WBL'),
    url: 'https://jx3.seasunwbl.com/',
  },
  {
    color: '',
    content: '剑三商会搜号平台',
    date: '2025-01-15',
    group: 'JX3',
    icon: 'https://pc.jx3sh.com/favicon.ico',
    title: $t('jx3.J3SH'),
    url: 'https://pc.jx3sh.com/#/wbl',
  },
  {
    color: '',
    content: '爱剑三搜号平台',
    date: '2025-01-15',
    group: 'JX3',
    icon: 'https://www.aijx3.cn/favicon.ico',
    title: $t('jx3.AIJX3'),
    url: 'https://www.aijx3.cn/',
  },
  {
    color: '',
    content: '外观物价搜索平台',
    date: '2025-01-15',
    group: 'JX3',
    icon: 'https://www.jx3search.com/favicon.ico',
    title: $t('jx3.JX3Search'),
    url: 'https://www.jx3search.com/',
  },
];
// 同样，这里的 url 也可以使用以 http 开头的外部链接
const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    color: '#1fdaca',
    icon: 'ion:home-outline',
    title: '首页',
    url: '/',
  },
  {
    color: '#bf0c2c',
    icon: 'ion:grid-outline',
    title: '仪表盘',
    url: '/dashboard',
  },
  {
    color: '#3fb27f',
    icon: 'ion:settings-outline',
    title: ' 用户管理',
    url: '/manage/identity/users', // 这里的 URL 是示例，实际项目中需要根据实际情况进行调整
  },
  {
    color: '#4daf1bc9',
    icon: 'ion:key-outline',
    title: '权限管理',
    url: '/manage/identity/roles',
  },
  {
    color: '#00d8ff',
    icon: 'ion:bar-chart-outline',
    title: '剑三外观',
    url: '/assets',
  },
  {
    color: '#e18525',
    icon: 'ion:layers-outline',
    title: '角色',
    url: '/assets',
  },
];

const todoItems = ref<WorkbenchTodoItem[]>([
  {
    completed: false,
    content: `剑三角色查询，刷新`,
    date: '2025-01-10 11:00:00',
    title: '剑三角色模块',
  },
  {
    completed: true,
    content: `剑三外观查询，新增，编辑及删除`,
    date: '2025-01-10 11:00:00',
    title: '剑三外观模块',
  },
]);
const trendItems: WorkbenchTrendItem[] = [
  {
    avatar: 'svg:avatar-2',
    content: `写代码写吐了, <a>回家</a> `,
    date: '1个小时前',
    title: '鱼鱼',
  },
];

const router = useRouter();

// 这是一个示例方法，实际项目中需要根据实际情况进行调整
// This is a sample method, adjust according to the actual project requirements
function navTo(nav: WorkbenchProjectItem | WorkbenchQuickNavItem) {
  if (nav.url?.startsWith('http')) {
    openWindow(nav.url);
    return;
  }
  if (nav.url?.startsWith('/')) {
    router.push(nav.url).catch((error) => {
      console.error('Navigation failed:', error);
    });
  } else {
    console.warn(`Unknown URL for navigation item: ${nav.title} -> ${nav.url}`);
  }
}
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        早安, {{ userStore.userInfo?.realName }}, 开始您一天的工作吧！
      </template>
      <template #description> 今日晴，20℃ - 32℃！ </template>
    </WorkbenchHeader>

    <div class="mt-5 flex flex-col lg:flex-row">
      <div class="mr-4 w-full lg:w-3/5">
        <WorkbenchProject :items="projectItems" title="项目" @click="navTo" />
        <WorkbenchTrends :items="trendItems" class="mt-5" title="最新动态" />
      </div>
      <div class="w-full lg:w-2/5">
        <WorkbenchQuickNav
          :items="quickNavItems"
          class="mt-5 lg:mt-0"
          title="快捷导航"
          @click="navTo"
        />
        <WorkbenchTodo :items="todoItems" class="mt-5" title="功能Roadmap" />
      </div>
    </div>
  </div>
</template>
