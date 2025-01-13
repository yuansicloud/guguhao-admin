<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { AssetDto } from '../../types/assets';

import { defineAsyncComponent, h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { EditOutlined } from '@ant-design/icons-vue';
import { Button, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getPagedListApi } from '../../api/assets';
import { useAssets } from '../../hooks/useAssets';
import { AssetType } from '../../types/assets';

defineOptions({
  name: 'AssetTable',
});
const { assetTypeDisplayMap, getAssetTypeColor, getAssetTypeValue } =
  useAssets();
const AssetModal = defineAsyncComponent(() => import('./AssetModal.vue'));
const CheckIcon = createIconifyIcon('ant-design:check-outlined');
const CloseIcon = createIconifyIcon('ant-design:close-outlined');

const sorting = ref<string | undefined>(undefined);

const valueTypeOptions = Object.keys(assetTypeDisplayMap).map((key) => {
  const assetType = assetTypeDisplayMap[Number(key) as AssetType];
  return {
    label: assetType.value,
    value: Number(key), // Ensure the value is the enum number, not a string
  };
});

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
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: valueTypeOptions,
        placeholder: '请选择',
      },
      fieldName: 'assetType',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('JX3.AssetAssetType'),
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<AssetDto> = {
  columnConfig: {
    resizable: true,
  },
  columns: [
    {
      align: 'center',
      field: 'name',
      title: $t('JX3.AssetName'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'alias',
      title: $t('JX3.AssetAlias'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'price',
      sortable: true,
      title: $t('JX3.AssetPrice'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'assetType',
      slots: { default: 'assetType' },
      title: $t('JX3.AssetAssetType'),
      width: '100',
    },
    {
      align: 'center',
      field: 'isHighValue',
      slots: { default: 'isHighValue' },
      title: $t('JX3.AssetIsHighValue'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'isUnique',
      slots: { default: 'isUnique' },
      title: $t('JX3.AssetIsUnique'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'wblName',
      sortable: true,
      title: $t('JX3.AssetWBLName'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'category',
      sortable: true,
      title: $t('JX3.AssetCategory'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'subType',
      sortable: true,
      title: $t('JX3.AssetSubType'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'getSource',
      sortable: true,
      title: $t('JX3.AssetGetSource'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'officialSaleDate',
      slots: {
        default: ({ row }) => {
          return row.officialSaleDate && dayjs(row.officialSaleDate).isValid()
            ? dayjs(row.officialSaleDate).format('YYYY-MM-DD')
            : '';
        },
      },
      sortable: true,
      title: $t('JX3.AssetOfficialSaleDate'),
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
      title: $t('JX3.AssetDescription'),
      width: 200,
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
  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
};

const gridEvents: VxeGridListeners<AssetDto> = {
  cellClick: () => {},
  sortChange: onSort,
};

const [AssetEditModal, roleModalApi] = useVbenModal({
  connectedComponent: AssetModal,
});

const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

function onSort(params: { field: string; order: SortOrder }) {
  const sort = params.order ? `${params.field} ${params.order}` : undefined;
  sorting.value = sort;
  query();
}

const handleAdd = () => {
  roleModalApi.setData({});
  roleModalApi.open();
};

const handleEdit = (row: AssetDto) => {
  roleModalApi.setData(row);
  roleModalApi.open();
};

// const handleDelete = (row: AssetDto) => {
//   Modal.confirm({
//     centered: true,
//     content: $t('Abp.WillDeleteClaim', [row.name]),
//     onOk: async () => {
//       await deleteApi(row.id);
//       message.success($t('AbpUi.SuccessfullyDeleted'));
//       query();
//     },
//     title: $t('AbpUi.AreYouSure'),
//   });
// };
</script>

<template>
  <Grid :table-title="$t('JX3.Asset')" table-layout="auto">
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
    <template #isUnique="{ row }">
      <div class="flex flex-row justify-center">
        <CheckIcon v-if="row.isUnique" class="text-green-500" />
        <CloseIcon v-else class="text-red-500" />
      </div>
    </template>
    <template #assetType="{ row }">
      <Tag :color="getAssetTypeColor(row.assetType)">
        {{ getAssetTypeValue(row.assetType) }}
      </Tag>
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
        <!-- <div class="basis-1/2">
          <Button
            :icon="h(DeleteOutlined)"
            block
            danger
            type="link"
            @click="handleDelete(row)"
          >
            {{ $t('AbpUi.Delete') }}
          </Button>
        </div> -->
      </div>
    </template>
  </Grid>
  <AssetEditModal @change="() => query()" />
</template>

<style lang="scss" scoped></style>
