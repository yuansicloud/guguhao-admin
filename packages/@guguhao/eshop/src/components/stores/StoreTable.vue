<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { StoreDto } from '../../types/stores';

import { defineAsyncComponent, h, ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { EditOutlined } from '@ant-design/icons-vue';
import { Button, message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { deleteStore, getStoreList } from '../../api/stores';

defineOptions({
  name: 'StoreTable',
});

const { hasAccessByCodes } = useAccess();

const StoreModal = defineAsyncComponent(() => import('./StoreModal.vue'));

const sorting = ref<string | undefined>(undefined);

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      fieldName: 'name',
      label: $t('EasyAbpEShopStores.Store'),
      component: 'Input',
    },
  ],
  showCollapseButton: true,
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<StoreDto> = {
  columnConfig: {
    resizable: true,
  },
  columns: [
    {
      align: 'center',
      field: 'name',
      showOverflow: true,
      title: $t('EasyAbpEShopStores.Store'),
      sortable: true,
    },
    {
      align: 'center',
      field: 'creationTime',
      title: $t('abp.creationTime'),
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
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('AbpUi.Actions'),
      width: 180,
    },
  ],
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const { items, totalCount } = await getStoreList({
          maxResultCount: page.pageSize,
          skipCount: (page.currentPage - 1) * page.pageSize,
          sorting: sorting.value,
          ...formValues,
        });
        return {
          list: items,
          total: totalCount,
        };
      },
    },
    response: {
      result: 'list',
      total: 'total',
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<StoreDto> = {
  sortChange: onSort,
};

const [StoreEditModal, createUpdateModalApi] = useVbenModal({
  connectedComponent: StoreModal,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

function onSort(params: { field: string; order: SortOrder }) {
  const sort = params.order ? `${params.field} ${params.order}` : undefined;
  sorting.value = sort;
  gridApi.query();
}

const handleAdd = () => {
  createUpdateModalApi.setData({});
  createUpdateModalApi.open();
};

const handleEdit = (row: StoreDto) => {
  createUpdateModalApi.setData(row);
  createUpdateModalApi.open();
};

const handleDelete = (row: StoreDto) => {
  Modal.confirm({
    centered: true,
    content: $t('abp.WillDelete', [row.name]),
    onOk: async () => {
      await deleteStore(row.id);
      message.success($t('AbpUi.SuccessfullyDeleted'));
      gridApi.query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
};
</script>

<template>
  <Grid :table-title="$t('EasyAbpEShopStores.Store')" table-layout="auto">
    <template #toolbar-tools>
      <Button
        v-if="hasAccessByCodes(['EasyAbp.EShop.Stores.Store.Manage'])"
        type="primary"
        @click="handleAdd"
      >
        {{ $t('AbpUi.AddNew') }}
      </Button>
    </template>
    <template #action="{ row }">
      <div
        v-if="hasAccessByCodes(['EasyAbp.EShop.Stores.Store.Manage'])"
        class="flex flex-row"
      >
        <div class="basis-1/2">
          <Button
            :icon="h(EditOutlined)"
            block
            type="link"
            @click="handleEdit(row)"
          >
            {{ $t('AbpUi.Edit') }}
          </Button>
        </div>
        <!-- <div class="basis-1/2">
          <Button
            :icon="h(DeleteOutlined)"
            block
            type="link"
            danger
            @click="handleDelete(row)"
          >
            {{ $t('AbpUi.Delete') }}
          </Button>
        </div> -->
      </div>
    </template>
  </Grid>
  <StoreEditModal @change="() => gridApi.query()" />
</template>

<style lang="scss" scoped></style>
