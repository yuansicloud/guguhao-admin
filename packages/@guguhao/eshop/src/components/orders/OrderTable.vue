<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { OrderDto } from '../../types/orders';

import { h, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { Button } from 'ant-design-vue';
import dayjs from 'dayjs';

// Import AccountModal and useVbenModal
import AccountModal from '../../../../point/src/components/accounts/AccountModal.vue';
import { getPagedListApi } from '../../api/orders';
import { useOrderStatus } from '../../hooks/useOrderStatus';

defineOptions({
  name: 'OrderTable',
});

const sorting = ref<string | undefined>(undefined);

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    // Add form fields here if needed
  ],
  showCollapseButton: true,
  submitOnEnter: true,
};

const { getStatusInfo } = useOrderStatus();

const gridOptions: VxeGridProps<OrderDto> = {
  columnConfig: {
    resizable: true,
  },
  columns: [
    {
      align: 'center',
      field: 'orderNumber',
      showOverflow: true,
      title: $t('订单号'),
      width: 180,
    },
    {
      align: 'center',
      field: 'orderLines',
      title: $t('订单明细'),
      width: 240,
      slots: {
        default: ({ row }) =>
          Array.isArray(row.orderLines)
            ? row.orderLines
                .map((line) => `${line.skuName}x${line.quantity}`)
                .join('; ')
            : '-',
      },
    },
    {
      align: 'center',
      field: 'orderStatus',
      sortable: true,
      title: $t('状态'),
      width: 120,
      slots: {
        default: ({ row }) => {
          const { name, color } = getStatusInfo(row.orderStatus);
          return h('span', { style: `color: ${color}` }, name);
        },
      },
    },
    {
      align: 'center',
      field: 'actualTotalPrice',
      title: $t('实付金额'),
      width: 120,
    },
    {
      align: 'center',
      field: 'customerRemark',
      title: $t('客户备注'),
      width: 180,
    },
    {
      align: 'center',
      field: 'creationTime',
      title: $t('创建时间'),
      width: 150,
      sortable: true,
      slots: {
        default: ({ row }) =>
          row.creationTime && dayjs(row.creationTime).isValid()
            ? dayjs(row.creationTime).format('YYYY-MM-DD HH:mm')
            : '-',
      },
    },
    {
      align: 'center',
      field: 'completionTime',
      title: $t('完成时间'),
      width: 150,
      slots: {
        default: ({ row }) =>
          row.completionTime && dayjs(row.completionTime).isValid()
            ? dayjs(row.completionTime).format('YYYY-MM-DD HH:mm')
            : '-',
      },
    },
    {
      align: 'center',
      field: 'paidTime',
      title: $t('支付时间'),
      width: 150,
      slots: {
        default: ({ row }) =>
          row.paidTime && dayjs(row.paidTime).isValid()
            ? dayjs(row.paidTime).format('YYYY-MM-DD HH:mm')
            : '-',
      },
    },
    {
      align: 'center',
      field: 'totalPrice',
      title: $t('订单总价'),
      width: 120,
    },
    {
      align: 'center',
      field: 'totalDiscount',
      title: $t('总优惠'),
      width: 120,
    },
    {
      align: 'center',
      field: 'refundAmount',
      title: $t('退款金额'),
      width: 120,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('操作'),
      width: 180,
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
    refresh: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<OrderDto> = {
  cellClick: () => {},
  sortChange: onSort,
};

const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

// Setup AccountModal modal instance
const [AccountModalComp, accountModalApi] = useVbenModal({
  connectedComponent: AccountModal,
});

onMounted(async () => {
  // Any additional setup
});

function onSort(params: { field: string; order: SortOrder }) {
  const sort = params.order ? `${params.field} ${params.order}` : undefined;
  sorting.value = sort;
  query();
}

function openAccountModal(row: OrderDto) {
  // Pass only id, AccountModal expects IdentityUserDto, so pass as { id: ... }
  accountModalApi.setData({ id: row.customerUserId });
  accountModalApi.open();
}
</script>

<template>
  <Grid :table-title="$t('订单列表')" table-layout="auto">
    <template #action="{ row }">
      <div class="flex flex-row">
        <div class="basis-1/2">
          <Button block type="link" @click="openAccountModal(row)">
            {{ $t('用户详情') }}
          </Button>
        </div>
      </div>
    </template>
  </Grid>
  <!-- Render the AccountModal -->
  <AccountModalComp />
</template>

<style lang="scss" scoped></style>
