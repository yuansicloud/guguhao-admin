<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { GameItemDto } from '../../types/game-item';

import { defineAsyncComponent, h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import { Button, message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { deleteApi, getPagedListApi } from '../../api/game-item';

defineOptions({
  name: 'GameItemTable',
});

const GameItemModal = defineAsyncComponent(() => import('./GameItemModal.vue'));
const CheckIcon = createIconifyIcon('ant-design:check-outlined');
const CloseIcon = createIconifyIcon('ant-design:close-outlined');

const sorting = ref<string | undefined>(undefined);

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'filter',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('AbpUi.Search'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('jx3.all'), value: null },
          { label: $t('AbpUi.Yes'), value: true },
          { label: $t('AbpUi.No'), value: false },
        ],
      },
      fieldName: 'IsHighValue',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('JX3.GameItemIsHighValue'),
    },
    {
      component: 'InputNumber',
      fieldName: 'MinPrice',
      label: '最小价格',
      labelWidth: 100,
    },
    {
      component: 'InputNumber',
      fieldName: 'MaxPrice',
      label: '最大价格',
      labelWidth: 100,
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<GameItemDto> = {
  border: true,
  columnConfig: {
    resizable: true,
  },
  columns: [
    {
      align: 'center',
      field: 'name',
      title: $t('JX3.GameItemName'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'alias',
      title: $t('JX3.GameItemAlias'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'category',
      title: $t('JX3.GameItemCategory'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'price',
      sortable: true,
      title: $t('JX3.GameItemPrice'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'creationTime',
      slots: {
        default: ({ row }) => {
          return row.creationTime && dayjs(row.creationTime).isValid()
            ? dayjs(row.creationTime).format('YYYY-MM-DD')
            : '';
        },
      },
      sortable: true,
      title: $t('abp.creationTime'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'lastModificationTime',
      slots: {
        default: ({ row }) => {
          return row.lastModificationTime &&
            dayjs(row.lastModificationTime).isValid()
            ? dayjs(row.lastModificationTime).format('YYYY-MM-DD')
            : '';
        },
      },
      sortable: true,
      title: $t('abp.lastModificationTime'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'description',
      showOverflow: true,
      title: $t('JX3.GameItemDescription'),
      width: 200,
    },
    {
      align: 'center',
      field: 'isHighValue',
      slots: { default: 'isHighValue' },
      title: $t('JX3.GameItemIsHighValue'),
      width: 'auto',
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
  stripe: true,
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<GameItemDto> = {
  cellClick: () => {},
  sortChange: onSort,
};

const [GameItemEditModal, createUpdateModalApi] = useVbenModal({
  connectedComponent: GameItemModal,
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

const handleEdit = (row: GameItemDto) => {
  createUpdateModalApi.setData(row);
  createUpdateModalApi.open();
};

const handleDelete = (row: GameItemDto) => {
  Modal.confirm({
    centered: true,
    content: $t('abp.WillDelete', [row.name]),
    onOk: async () => {
      await deleteApi(row.id);
      message.success($t('AbpUi.SuccessfullyDeleted'));
      gridApi.query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
};
</script>

<template>
  <Grid :table-title="$t('JX3.GameItem')" table-layout="auto">
    <template #toolbar-tools>
      <Button type="primary" @click="handleAdd">
        {{ $t('AbpUi.AddNew') }}
      </Button>
    </template>
    <template #isHighValue="{ row }">
      <div class="flex flex-row justify-center">
        <CheckIcon v-if="row.isHighValue" class="text-green-500" />
        <CloseIcon v-else class="text-red-500" />
      </div>
    </template>
    <template #action="{ row }">
      <div class="flex flex-row">
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
        <div class="basis-1/2">
          <Button
            :icon="h(DeleteOutlined)"
            block
            type="link"
            danger
            @click="handleDelete(row)"
          >
            {{ $t('AbpUi.Delete') }}
          </Button>
        </div>
      </div>
    </template>
  </Grid>
  <GameItemEditModal @change="() => gridApi.query()" />
</template>

<style lang="scss" scoped></style>
