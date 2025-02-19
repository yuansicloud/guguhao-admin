<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import { computed, h, onMounted, ref } from 'vue';
import type { ConfigDto } from '../../types/settings';

import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { AccountBookOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { Button, message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getPagedListApi, assessCharacterTemplateApi, deleteApi } from '../../api/character-templates';
import { getConfigApi } from '../../api/settings';
import type { CharacterTemplateDto } from '../../types/character-templates';

defineOptions({
  name: 'CharacterTemplateTable',
});

const sorting = ref<string | undefined>(undefined);

const searchConfig = ref<ConfigDto>({
  careers: [],
  shapes: [],
  assetCategories: {},
  tags: [],
});

const careerOptions = computed(() =>
  searchConfig.value.careers.map(c => ({ label: c, value: c }))
);

const shapeOptions = computed(() =>
  searchConfig.value.shapes.map(c => ({ label: c, value: c }))
);

const assetOptions = computed(() =>
  Object.entries(searchConfig.value.assetCategories).flatMap(([category, assets]) => ({
    label: category,
    options: assets.map(a => ({ label: a.alias, value: a.alias }))
  })),
);

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
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
        options: assetOptions,
        placeholder: '请选择外观',
        filterable: true,  // Enable local search
      },
      fieldName: 'description',
      formItemClass: 'col-span-1 items-baseline',
      label: '外观',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<CharacterTemplateDto> = {
  columnConfig: {
    resizable: true,
  },
  columns: [
    {
      align: 'center',
      field: 'description',
      showOverflow: true,
      title: $t('JX3.CharacterDescription'),
      width: 200,
    },
    {
      align: 'center',
      className: 'font-bold',
      field: 'marketPrice',
      sortable: true,
      title: $t('JX3.MarketPrice'),
      width: 'auto',
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
      field: 'tags',
      title: $t('jx3.Tags'),
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

const gridEvents: VxeGridListeners<CharacterTemplateDto> = {
  cellClick: () => { },
  sortChange: onSort,
};

const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

onMounted(async () => {
  searchConfig.value = await getConfigApi(true);
  console.log(searchConfig.value)
});

function onSort(params: { field: string; order: SortOrder }) {
  const sort = params.order ? `${params.field} ${params.order}` : undefined;
  sorting.value = sort;
  query();
}

const handleAssessCharacter = (row: CharacterTemplateDto) => {
  Modal.confirm({
    centered: true,
    content: $t('jx3.WillAssessCharacter'),
    onOk: async () => {
      await assessCharacterTemplateApi(row.id);
      message.success($t('jx3.Success'));
      query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
};

const handleDelete = (row: CharacterTemplateDto) => {
  Modal.confirm({
    centered: true,
    content: $t('abp.WillDelete', [row.career]),
    onOk: async () => {
      await deleteApi(row.id);
      message.success($t('jx3.Success'));
      query();
    },
    title: $t('AbpUi.AreYouSure'),
  });
};

</script>

<template>
  <Grid :table-title="$t('JX3.Character')" table-layout="auto">
    <template #action="{ row }">
      <div class="flex flex-row">
        <div class="basis-1/3">
          <Button :icon="h(AccountBookOutlined)" block type="link" class="text-primary"
            @click="handleAssessCharacter(row)">
            {{ $t('jx3.assess') }}
          </Button>
        </div>
        <div class="basis-1/3">
          <Button :icon="h(DeleteOutlined)" block type="link" danger @click="handleDelete(row)">
            {{ $t('AbpUi.Delete') }}
          </Button>
        </div>
      </div>
    </template>
  </Grid>
</template>

<style lang="scss" scoped></style>
