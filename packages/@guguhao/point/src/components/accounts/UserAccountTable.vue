<script setup lang="ts">
import type { IdentityUserDto } from '@abp/identity';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import { defineAsyncComponent, h } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useUsersApi } from '@abp/identity';
import { useVbenVxeGrid } from '@abp/ui';
import {
  BookOutlined,
  MessageOutlined,
  NotificationOutlined,
} from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

defineOptions({
  name: 'UserAccountTable',
});

const AccountModal = defineAsyncComponent(() => import('./AccountModal.vue'));
const PrivateMessageModal = defineAsyncComponent(
  () => import('./PrivateMessageModal.vue'),
);
const SystemMessageModal = defineAsyncComponent(
  () => import('./SystemMessageModal.vue'),
);

const CheckIcon = createIconifyIcon('ant-design:check-outlined');
const CloseIcon = createIconifyIcon('ant-design:close-outlined');

const { getPagedListApi } = useUsersApi();

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'filter',
      formItemClass: 'col-span-2 items-baseline',
      label: $t('AbpUi.Search'),
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<IdentityUserDto> = {
  columns: [
    {
      field: 'isActive',
      slots: { default: 'active' },
      title: $t('AbpIdentity.DisplayName:IsActive'),
    },
    { field: 'phoneNumber', title: $t('AbpIdentity.DisplayName:PhoneNumber') },
    { field: 'name', title: $t('AbpIdentity.DisplayName:Name') },
    {
      field: 'userName',
      minWidth: '100px',
      title: $t('AbpIdentity.DisplayName:UserName'),
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('AbpUi.Actions'),
      width: 200,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getPagedListApi({
          maxResultCount: page.pageSize,
          skipCount: (page.currentPage - 1) * page.pageSize,
          ...formValues,
        });
      },
    },
    response: {
      total: 'totalCount',
      list: 'items',
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<IdentityUserDto> = {
  cellClick: () => {},
};

const [AccountViewModal, accountModalApi] = useVbenModal({
  connectedComponent: AccountModal,
  fullscreenButton: true,
});

const [MessageModal, messageModalApi] = useVbenModal({
  connectedComponent: PrivateMessageModal,
  fullscreenButton: true,
});

const [SystemModal, systemModalApi] = useVbenModal({
  connectedComponent: SystemMessageModal,
  fullscreenButton: true,
});

const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

const handleView = (row: IdentityUserDto) => {
  accountModalApi.setData(row);
  accountModalApi.open();
};

const handleSendMessage = (row: IdentityUserDto) => {
  messageModalApi.setData(row);
  messageModalApi.open();
};

const handleSendSystemMessage = () => {
  systemModalApi.open();
};
</script>

<template>
  <Grid :table-title="$t('AbpIdentity.Users')">
    <template #toolbar-tools>
      <Button
        :icon="h(NotificationOutlined)"
        type="primary"
        @click="handleSendSystemMessage"
      >
        发送系统公告
      </Button>
    </template>
    <template #active="{ row }">
      <div class="flex flex-row justify-center">
        <div :class="row.isActive ? 'text-green-600' : 'text-red-600'">
          <CheckIcon v-if="row.isActive" />
          <CloseIcon v-else />
        </div>
      </div>
    </template>
    <template #action="{ row }">
      <div class="flex flex-row items-center justify-center space-x-2">
        <Button
          :icon="h(BookOutlined)"
          class="text-success"
          size="small"
          type="link"
          @click="handleView(row)"
        >
          {{ $t('point.ShowAccount') }}
        </Button>
        <Button
          :icon="h(MessageOutlined)"
          class="text-primary"
          size="small"
          type="link"
          @click="handleSendMessage(row)"
        >
          发送私信
        </Button>
      </div>
    </template>
  </Grid>
  <AccountViewModal @change="() => query()" />
  <MessageModal @change="() => query()" />
  <SystemModal @change="() => query()" />
</template>

<style lang="scss" scoped></style>
