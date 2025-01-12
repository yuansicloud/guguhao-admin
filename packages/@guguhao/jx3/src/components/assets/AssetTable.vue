<script setup lang="ts">
import type { SortOrder } from '@abp/core';

import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { AssetDto } from '../../types/assets';

import { defineAsyncComponent, h, ref } from 'vue';

import { useAccess } from '@vben/access';
import { useVbenModal } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import { Button, message, Modal } from 'ant-design-vue';

import { deleteApi, getPagedListApi } from '../../api/assets';
import { AssetPermissions } from '../../constants/permissions';
import { AssetType } from '../../types/assets';
import { useAssets } from '../../hooks/useAssets';
import { Tag } from 'ant-design-vue';
const { getAssetTypeColor, getAssetTypeValue, assetTypeDisplayMap } =
  useAssets();
defineOptions({
  name: 'AssetTable',
});

const AssetModal = defineAsyncComponent(() => import('./AssetModal.vue'));
const CheckIcon = createIconifyIcon('ant-design:check-outlined');
const CloseIcon = createIconifyIcon('ant-design:close-outlined');

const sorting = ref<string | null>(null);

const { hasAccessByCodes } = useAccess();

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
      fieldName: 'assetType',
      formItemClass: 'col-span-1 items-baseline',
      componentProps: {
        allowClear: true,
        options: valueTypeOptions,
        placeholder: '请选择',
      },
      label: $t('JX3.AssetAssetType'),
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<AssetDto> = {
  columns: [
    {
      align: 'left',
      field: 'name',
      minWidth: 120,
      title: $t('JX3.AssetName'),
    },
    {
      align: 'left',
      field: 'alias',
      title: $t('JX3.AssetAlias'),
    },
    {
      align: 'left',
      field: 'price',
      title: $t('JX3.AssetPrice'),
      sortable: true,
    },
    {
      align: 'left',
      field: 'assetType',
      slots: { default: 'assetType' },
      title: $t('JX3.AssetAssetType'),
    },
    {
      align: 'center',
      field: 'isHighValue',
      slots: { default: 'isHighValue' },
      title: $t('JX3.AssetIsHighValue'),
    },
    {
      align: 'center',
      field: 'isUnique',
      slots: { default: 'isUnique' },
      title: $t('JX3.AssetIsUnique'),
    },
    {
      align: 'left',
      field: 'description',
      showOverflow: true,
      title: $t('JX3.AssetDescription'),
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: $t('AbpUi.Actions'),
      // visible: hasAccessByCodes([
      //   AssetPermissions.Update,
      //   AssetPermissions.Delete,
      // ]),
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

const handleDelete = (row: AssetDto) => {
  Modal.confirm({
    centered: true,
    content: $t('Abp.WillDeleteClaim', [row.name]),
    onOk: async () => {
      await deleteApi(row.id);
      message.success($t('AbpUi.SuccessfullyDeleted'));
      query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
};
</script>

<template>
  <Grid :table-title="$t('JX3.Asset')">
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
