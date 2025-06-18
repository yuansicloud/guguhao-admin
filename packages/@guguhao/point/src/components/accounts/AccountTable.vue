<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { AccountDto, AccountGetListInput } from '../../types/accounts';

import { defineAsyncComponent, h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { BookOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';

import { getPagedListApi } from '../../api/accounts';

defineOptions({
  name: 'AccountTable',
});
const sorting = ref<string | undefined>(undefined);
const AccountViewModal = defineAsyncComponent(
  () => import('./AccountModal.vue'),
);
const PrivateMessageModal = defineAsyncComponent(
  () => import('./PrivateMessageModal.vue'),
);

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'InputNumber',
      fieldName: 'minBalance',
      label: $t('point.MinBalance'),
    },
    {
      component: 'InputNumber',
      fieldName: 'maxBalance',
      label: $t('point.MaxBalance'),
    },
    {
      component: 'InputNumber',
      fieldName: 'minCoupons',
      label: $t('point.MinCoupons'),
    },
    {
      component: 'InputNumber',
      fieldName: 'maxCoupons',
      label: $t('point.MaxCoupons'),
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<AccountDto> = {
  columns: [
    { field: 'phoneNumber', title: $t('point.PhoneNumber'), width: 150 },
    { field: 'balance', title: $t('point.Balance'), sortable: true },
    { field: 'coupons', title: $t('point.Coupons'), sortable: true },
    { field: 'experience', title: $t('point.Experience'), sortable: true },
    { field: 'lockedBalance', title: $t('point.LockedBalance') },
    { field: 'totalUsed', title: $t('point.TotalUsed'), sortable: true },
    {
      field: 'totalUsedCoupons',
      title: $t('point.TotalUsedCoupons'),
      sortable: true,
    },
    { field: 'membershipDisplayName', title: $t('point.MembershipName') },
    { field: 'userName', title: $t('point.UserName'), width: 150 },
    { field: 'name', title: $t('point.Name'), width: 150 },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('AbpUi.Actions'),
      width: 300,
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
          sorting: sorting.value,
        } as AccountGetListInput);
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
    refresh: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<AccountDto> = {
  cellClick: () => {},
  sortChange: onSort,
};

const [AccountModal, accountModalApi] = useVbenModal({
  connectedComponent: AccountViewModal,
  fullscreenButton: true,
});

const [MessageModal, messageModalApi] = useVbenModal({
  connectedComponent: PrivateMessageModal,
  fullscreenButton: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

const handleViewAccount = (row: AccountDto) => {
  accountModalApi.setData({ id: row.userId });
  accountModalApi.open();
};

const handleSendMessage = (row: AccountDto) => {
  // Convert AccountDto to format expected by PrivateMessageModal (with id property)
  messageModalApi.setData({
    id: row.userId,
    name: row.name,
    userName: row.userName,
  });
  messageModalApi.open();
};

function onSort(params: { field: string; order: SortOrder }) {
  const sort = params.order ? `${params.field} ${params.order}` : undefined;
  sorting.value = sort;
  gridApi.query();
}
</script>

<template>
  <Grid :table-title="$t('point.Accounts')">
    <template #action="{ row }">
      <div class="flex flex-row items-center justify-center space-x-2">
        <Button
          :icon="h(BookOutlined)"
          class="text-success"
          size="small"
          type="link"
          @click="handleViewAccount(row)"
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
          {{ $t('point.SendMessage') }}
        </Button>
      </div>
    </template>
  </Grid>
  <AccountModal @change="() => gridApi.query()" />
  <MessageModal @change="() => gridApi.query()" />
</template>

<style lang="scss" scoped></style>
