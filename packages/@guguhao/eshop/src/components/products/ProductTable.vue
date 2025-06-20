<script setup lang="ts">
import type { SortOrder } from '@abp/core';
import type { VbenFormProps, VxeGridListeners, VxeGridProps } from '@abp/ui';

import type { ProductDto, ProductGetListInput } from '../../types/products';

import { computed, onMounted, ref, watch } from 'vue';

import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '@abp/ui';
import dayjs from 'dayjs';

import { getProductList } from '../../api/products';
import { getDefaultStore } from '../../api/stores';

defineOptions({
  name: 'ProductTable',
});

const props = defineProps({
  storeId: {
    type: String,
    default: undefined,
  },
  categoryId: {
    type: String,
    default: undefined,
  },
  showHidden: {
    type: Boolean,
    default: false,
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
  disableSorting: {
    type: Boolean,
    default: false,
  },
  customColumns: {
    type: Array as () => Array<any>,
    default: () => [],
  },
  initialSorting: {
    type: String,
    default: undefined,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  tableTitle: {
    type: String,
    default: () => $t('EasyAbpEShopProducts.Product'),
  },
});

const sorting = ref<string | undefined>(props.initialSorting);
const storeIdRef = ref<string | undefined>(props.storeId);
const loading = ref(false);
const products = ref<ProductDto[]>([]);
const totalCount = ref(0);

const queryParams = computed<ProductGetListInput>(() => ({
  storeId: storeIdRef.value,
  categoryId: props.categoryId,
  showHidden: props.showHidden,
  sorting: sorting.value,
}));

const defaultColumns = [
  {
    align: 'center',
    field: 'displayName',
    showOverflow: true,
    title: $t('EasyAbpEShopProducts.ProductDisplayName'),
    sortable: !props.disableSorting,
  },
  {
    align: 'center',
    field: 'uniqueName',
    showOverflow: true,
    title: $t('EasyAbpEShopProducts.ProductUniqueName'),
    sortable: !props.disableSorting,
  },
  {
    align: 'center',
    field: 'isPublished',
    title: $t('EasyAbpEShopProducts.ProductIsPublished'),
    slots: {
      default: ({ row }: { row: ProductDto }) =>
        row.isPublished ? '✅' : '❌',
    },
  },
  {
    align: 'center',
    field: 'sold',
    title: $t('EasyAbpEShopProducts.ProductSold'),
    sortable: !props.disableSorting,
  },
  {
    align: 'center',
    field: 'creationTime',
    title: $t('abp.creationTime'),
    width: 150,
    sortable: !props.disableSorting,
    slots: {
      default: ({ row }: { row: ProductDto }) =>
        row.creationTime && dayjs(row.creationTime).isValid()
          ? dayjs(row.creationTime).format('YYYY-MM-DD HH:mm')
          : '-',
    },
  },
];

const columns = computed(() => {
  return props.customColumns.length > 0 ? props.customColumns : defaultColumns;
});

const formOptions: VbenFormProps = {
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
      fieldName: 'showHidden',
      formItemClass: 'col-span-1 items-baseline',
      label: $t('EasyAbpEShopProducts.ProductIsHidden'),
    },
  ],
  showCollapseButton: true,
  submitOnEnter: true,
};

const gridOptions = computed<VxeGridProps<ProductDto>>(() => ({
  border: true,
  stripe: true,
  columnConfig: {
    resizable: true,
  },
  columns: columns.value,
  exportConfig: {},
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (!storeIdRef.value) {
          return {
            list: [],
            total: 0,
          };
        }
        loading.value = true;
        try {
          const { items, totalCount: total } = await getProductList({
            maxResultCount: page.pageSize,
            skipCount: (page.currentPage - 1) * page.pageSize,
            ...queryParams.value,
            ...formValues,
          } as any);
          products.value = items;
          totalCount.value = total;
          return {
            list: items,
            total,
          };
        } catch (error) {
          console.error('Failed to fetch products:', error);
          return {
            list: [],
            total: 0,
          };
        } finally {
          loading.value = false;
        }
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
}));

const gridEvents: VxeGridListeners<ProductDto> = {
  sortChange: onSort,
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridEvents,
  gridOptions: gridOptions.value,
});

watch(
  queryParams,
  () => {
    if (props.autoLoad) {
      gridApi.query();
    }
  },
  { deep: true },
);

function onSort(params: { field: string; order: SortOrder }) {
  if (props.disableSorting) return;
  const sort = params.order ? `${params.field} ${params.order}` : undefined;
  sorting.value = sort;
  gridApi.query();
}

onMounted(async () => {
  if (!storeIdRef.value) {
    try {
      const defaultStore = await getDefaultStore();
      storeIdRef.value = defaultStore.id;
    } catch (error) {
      console.error('Failed to fetch default store:', error);
    }
  }
  if (props.autoLoad && storeIdRef.value) {
    gridApi.query();
  }
});

// Expose query method for parent component
defineExpose({
  query: () => gridApi.query(),
  refresh: () => gridApi.query(),
  getProducts: () => products.value,
  getTotalCount: () => totalCount.value,
  isLoading: () => loading.value,
});
</script>

<template>
  <Grid :table-title="tableTitle" table-layout="auto">
    <template #toolbar-tools>
      <slot name="toolbar-tools"></slot>
    </template>
  </Grid>
</template>

<style lang="scss" scoped></style>
