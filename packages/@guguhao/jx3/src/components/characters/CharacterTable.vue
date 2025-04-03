<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { CharacterDto } from '../../types/characters';
import type { ConfigDto } from '../../types/settings';

import { computed, h, onMounted, ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import {
  AccountBookOutlined,
  BookOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue';
import { Button, message, Modal, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { convertToTemplateApi } from '../../api/character-templates';
import {
  assessCharacterApi,
  postPagedListApi,
  updateApi,
} from '../../api/characters';
import { getConfigApi } from '../../api/settings';
import { useCharacter } from '../../hooks/useCharacters';
import { state } from '../../types/characters';

defineOptions({
  name: 'CharacterTable',
});
const { getStateColor, getStateValue, stateDisplayMap } = useCharacter();
const CheckIcon = createIconifyIcon('ant-design:check-outlined');
const CloseIcon = createIconifyIcon('ant-design:close-outlined');

const sorting = ref<string | undefined>(undefined);

const searchConfig = ref<ConfigDto>({
  assetCategories: {},
  careers: [],
  shapes: [],
  tags: [],
});

const careerOptions = computed(() =>
  searchConfig.value.careers.map((c) => ({ label: c, value: c })),
);

const shapeOptions = computed(() =>
  searchConfig.value.shapes.map((c) => ({ label: c, value: c })),
);

const tagOptions = computed(() =>
  searchConfig.value.tags.map((c) => ({ label: c, value: c })),
);

const assetOptions = computed(() =>
  Object.entries(searchConfig.value.assetCategories).flatMap(
    ([category, assets]) => ({
      label: category,
      options: assets.map((a) => ({ label: a.alias, value: a.alias })),
    }),
  ),
);

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
    // Add careers select
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: careerOptions,
        placeholder: '请选择职业',
      },
      fieldName: 'career',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('JX3.CharacterCareer'),
    },
    // Add shapes select
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: shapeOptions,
        placeholder: '请选择体型',
      },
      fieldName: 'shape',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('JX3.CharacterShape'),
    },
    // Add asset categories select
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterable: true, // Enable local search
        mode: 'multiple',
        options: assetOptions,
        placeholder: '请选择外观',
      },
      fieldName: 'assets',
      formItemClass: 'col-span-1 items-baseline',
      label: '外观',
    },
    // Add tags select
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: tagOptions,
        placeholder: '请选择亮点',
      },
      fieldName: 'tags',
      formItemClass: 'col-span-1 items-baseline',
      label: '亮点',
    },
    // Add price range select
    {
      component: 'InputNumber',
      componentProps: {
        allowClear: true,
        min: 0,
        placeholder: '最小价格',
      },
      fieldName: 'minPrice',
      formItemClass: 'col-span-1 items-baseline',
      label: '最小价格',
    },
    {
      component: 'InputNumber',
      componentProps: {
        allowClear: true,
        min: 0,
        placeholder: '最大价格',
      },
      fieldName: 'maxPrice',
      formItemClass: 'col-span-1 items-baseline',
      label: '最大价格',
    },
    // Add bookmark number range select
    {
      component: 'InputNumber',
      componentProps: {
        allowClear: true,
        min: 0,
        placeholder: '最小收藏',
      },
      fieldName: 'minBookmarkNumber',
      formItemClass: 'col-span-1 items-baseline',
      label: '最小收藏',
    },
    {
      component: 'InputNumber',
      componentProps: {
        allowClear: true,
        min: 0,
        placeholder: '最大收藏',
      },
      fieldName: 'maxBookmarkNumber',
      formItemClass: 'col-span-1 items-baseline',
      label: '最大收藏',
    },
    // Add achievement points range select
    {
      component: 'InputNumber',
      componentProps: {
        allowClear: true,
        min: 0,
        placeholder: '最小成就',
      },
      fieldName: 'minAchievementPoint',
      formItemClass: 'col-span-1 items-baseline',
      label: '最小成就',
    },
    {
      component: 'InputNumber',
      componentProps: {
        allowClear: true,
        min: 0,
        placeholder: '最大成就',
      },
      fieldName: 'maxAchievementPoint',
      formItemClass: 'col-span-1 items-baseline',
      label: '最大成就',
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
      fieldName: 'ShowOnlySuggested',
      formItemClass: 'col-span-1 items-baseline',
      label: '只显示推荐',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('jx3.all'), value: null },
          { label: '已获取', value: true },
          { label: '未获取', value: false },
        ],
      },
      fieldName: 'isFetched',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('JX3.CharacterDescription'),
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
      width: 300,
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
  cellClick: () => {},
  sortChange: onSort,
};

const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

onMounted(async () => {
  searchConfig.value = await getConfigApi(true);
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
const handleAssessCharacter = (row: CharacterDto) => {
  Modal.confirm({
    centered: true,
    content: $t('jx3.WillAssessCharacter'),
    onOk: async () => {
      await assessCharacterApi(row.id);
      message.success($t('jx3.Success'));
      query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
};

const handleConvertCharacterToTemplate = (row: CharacterDto) => {
  Modal.confirm({
    centered: true,
    content: $t('jx3.WillConvertCharacterToTemplate'),
    onOk: async () => {
      await convertToTemplateApi(row.id);
      message.success($t('jx3.Success'));
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
        <div class="basis-1/3">
          <Button
            :icon="h(RedoOutlined)"
            block
            type="link"
            class="text-success"
            @click="handleFetchCharacter(row)"
          >
            {{ $t('jx3.fetchWBLAppearanceInfo') }}
          </Button>
        </div>
        <div class="basis-1/3">
          <Button
            :icon="h(AccountBookOutlined)"
            block
            type="link"
            class="text-primary"
            @click="handleAssessCharacter(row)"
          >
            {{ $t('jx3.assess') }}
          </Button>
        </div>
        <div class="basis-1/3">
          <Button
            :icon="h(BookOutlined)"
            block
            type="link"
            class="text-warning"
            @click="handleConvertCharacterToTemplate(row)"
          >
            {{ $t('jx3.convertToTemplate') }}
          </Button>
        </div>
      </div>
    </template>
  </Grid>
</template>

<style lang="scss" scoped></style>
