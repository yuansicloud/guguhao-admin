<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { CharacterDto } from '../../types/characters';

import { h, ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { EditOutlined } from '@ant-design/icons-vue';
import { Button, message, Modal, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { postPagedListApi, updateApi } from '../../api/characters';
import { useCharacter } from '../../hooks/useCharacters';
import { state } from '../../types/characters';

defineOptions({
  name: 'CharacterTable',
});
const { getStateColor, getStateValue, stateDisplayMap } = useCharacter();
const CheckIcon = createIconifyIcon('ant-design:check-outlined');
const CloseIcon = createIconifyIcon('ant-design:close-outlined');

const sorting = ref<string | undefined>(undefined);

const valueTypeOptions = Object.keys(stateDisplayMap).map((key) => {
  const state = stateDisplayMap[Number(key) as state];
  return {
    label: state.value,
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
      fieldName: 'state',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('JX3.CharacterState'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [{ label: '成女', value: '成女' }, { label: '成男', value: '成男' }, { label: '萝莉', value: '萝莉' }, { label: '正太', value: '正太' }],
        placeholder: '请选择',
      },
      fieldName: 'shape',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('JX3.CharacterShape'),
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<CharacterDto> = {
  columnConfig: {
    resizable: true,
  },
  columns: [
    {
      align: 'center',
      field: 'state',
      slots: { default: 'state' },
      title: $t('JX3.CharacterState'),
      width: '100',
    },
    {
      align: 'center',
      className: 'font-bold',
      field: 'price',
      sortable: true,
      title: $t('JX3.CharacterPrice'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'offSaleTime',
      slots: {
        default: ({ row }) => {
          return row.offSaleTime && dayjs(row.offSaleTime).isValid()
            ? dayjs(row.offSaleTime).format('YYYY-MM-DD')
            : '';
        },
      },
      sortable: true,
      title: $t('JX3.CharacterOffSaleTime'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'onSaleTime',
      slots: {
        default: ({ row }) => {
          return row.onSaleTime && dayjs(row.onSaleTime).isValid()
            ? dayjs(row.onSaleTime).format('YYYY-MM-DD')
            : '';
        },
      },
      sortable: true,
      title: $t('JX3.CharacterOnSaleTime'),
      width: 'auto',
    },

    {
      align: 'center',
      field: 'description',
      showOverflow: true,
      title: $t('JX3.CharacterDescription'),
      width: 200,
    },
    {
      align: 'center',
      field: 'career',
      title: $t('JX3.CharacterCareer'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'shape',
      title: $t('JX3.CharacterShape'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'zoneName',
      title: $t('JX3.CharacterZoneName'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'serverName',
      title: $t('JX3.CharacterServerName'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'camp',
      title: $t('JX3.CharacterCamp'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'bookmarkNumber',
      sortable: true,
      title: $t('JX3.CharacterBookmarkNumber'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'achievementPoint',
      sortable: true,
      title: $t('JX3.CharacterAchievementPoint'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'equipmentPoint',
      sortable: true,
      title: $t('JX3.CharacterEquipmentPoint'),
      width: 'auto',
    },
    {
      align: 'center',
      field: 'petNumber',
      sortable: true,
      title: $t('JX3.CharacterPetNumber'),
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
        return await postPagedListApi({
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

const gridEvents: VxeGridListeners<CharacterDto> = {
  cellClick: () => { },
  sortChange: onSort,
};

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

const handleFetchCharacter = (row: CharacterDto) => {
  Modal.confirm({
    centered: true,
    content: $t('jx3.WillRefreshCharacter'),
    onOk: async () => {
      await updateApi(row.code);
      message.success($t('jx3.SuccessRefresh'));
      query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
};
</script>

<template>
  <Grid :table-title="$t('JX3.Character')" table-layout="auto">
    <!-- <template #toolbar-tools>
      <Button type="primary" @click="handleAdd">
        {{ $t('AbpUi.AddNew') }}
      </Button>
    </template> -->
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
    <template #state="{ row }">
      <Tag :color="getStateColor(row.state)">
        {{ getStateValue(row.state) }}
      </Tag>
    </template>
    <template #action="{ row }">
      <div class="flex flex-row">
        <div class="basis-1/2">
          <Button :icon="h(EditOutlined)" block type="link" class="text-warning" @click="handleFetchCharacter(row)">
            {{ $t('jx3.fetchWBLAppearanceInfo') }}
          </Button>
        </div>
      </div>
    </template>
  </Grid>
</template>

<style lang="scss" scoped></style>
