<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import { h, onMounted, ref } from 'vue';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import { RedoOutlined } from '@ant-design/icons-vue';
import { Button, message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getPagedListApi } from '../../api/assessments';
import { assessCharacterTemplateApi } from '../../api/character-templates';
import { assessCharacterApi } from '../../api/characters';
import type { AssessmentDto } from '../../types/assessments';

defineOptions({
  name: 'AssessmentTable',
});

const sorting = ref<string | undefined>(undefined);


const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<AssessmentDto> = {
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
      field: 'averagePrice',
      sortable: true,
      title: '预测价格',
      width: 'auto',
    },
    {
      align: 'center',
      className: 'font-bold',
      field: 'priceRange',
      sortable: true,
      title: '价格区间',
      width: 'auto',
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
      field: 'wblPrice',
      sortable: true,
      title: '万宝楼价格',
      width: 120,
    },
    {
      align: 'center',
      field: 'characterType',
      title: '角色类型',
      width: 150,
      slots: {
        default: ({ row }) => {
          const types = {
            0: '万宝楼',
            1: '模板',
          };
          return types[row.characterType] || '-';
        }
      }
    },
    {
      align: 'center',
      field: 'status',
      title: '状态',
      width: 150,
      slots: {
        default: ({ row }) => [
          h(
            'span',
            {
              class: {
                'text-success': row.isCompleted,
                'text-warning': row.isInProgress && !row.isCompleted,
                'text-error': !row.isCompleted && !row.isInProgress
              }
            },
            row.isCompleted
              ? '已完成'
              : '进行中'
          )
        ]
      }
    },
    // {
    //   align: 'center',
    //   field: 'rating',
    //   title: '评分',
    //   width: 120,
    //   slots: {
    //     default: ({ row }) => {
    //       const stars = [];
    //       for (let i = 0; i < 5; i++) {
    //         stars.push(
    //           h('i', {
    //             class: i < (row.rating || 0) ? 'i-ant-design:star-filled text-warning' : 'i-ant-design:star-outlined text-gray-400',
    //             style: { marginRight: '2px' }
    //           })
    //         );
    //       }
    //       return h('div', { class: 'flex items-center' }, stars);
    //     }
    //   }
    // },
    {
      align: 'center',
      field: 'modelDate',
      title: '模型日期',
      width: 150,
      slots: {
        default: ({ row }) =>
          row.modelDate && dayjs(row.modelDate).isValid()
            ? dayjs(row.modelDate).format('YYYY-MM-DD')
            : '-'
      }
    },
    {
      align: 'right',
      field: 'adjustedPrice',
      title: '调整价格',
      width: 150,
    },
    {
      align: 'center',
      field: 'similarCharacters',
      title: '相似角色',
      width: 200,
      slots: {
        default: ({ row }) => row.similarCharacters?.length || 0
      }
    },
    {
      align: 'center',
      field: 'predictionResults',
      title: '预测结果',
      width: 200,
      slots: {
        default: ({ row }) => row.predictionResults?.length || 0
      }
    },
    {
      align: 'center',
      field: 'confidence',
      title: '置信度',
      width: 150,
      slots: {
        default: ({ row }) => `${Math.round((row.confidence || 0))}%`
      }
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

const gridEvents: VxeGridListeners<AssessmentDto> = {
  cellClick: () => { },
  sortChange: onSort,
};

const [Grid, { query }] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions,
});

onMounted(async () => {
});

function onSort(params: { field: string; order: SortOrder }) {
  const sort = params.order ? `${params.field} ${params.order}` : undefined;
  sorting.value = sort;
  query();
}

const handleAssessCharacter = (row: AssessmentDto) => {
  var api = row.characterType === 0 ? assessCharacterApi : assessCharacterTemplateApi;
  Modal.confirm({
    centered: true,
    content: $t('jx3.WillAssessCharacter'),
    onOk: async () => {
      await api(row.characterId);
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
          <Button :icon="h(RedoOutlined)" block type="link" class="text-success" @click="handleAssessCharacter(row)">
            {{ $t('jx3.refresh') }}
          </Button>
        </div>
      </div>
    </template>
  </Grid>
</template>

<style lang="scss" scoped></style>
