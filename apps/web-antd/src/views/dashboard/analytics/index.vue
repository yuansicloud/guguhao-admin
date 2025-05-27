<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import { markRaw, onMounted, ref } from 'vue';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import { SvgBellIcon, SvgCakeIcon, SvgCardIcon } from '@vben/icons';

import { getCDNData, getCDNTopData } from '#/api/core/administration';

import AnalyticsSession from './analytics-session.vue';
import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisitsSales from './analytics-visits-sales.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';
import AnalyticsVisits from './analytics-visits.vue';

const dayDataModel = ref<{ time: string; value: number }[]>([]);
const monthDataModel = ref<{ time: string; value: number }[]>([]);
const deviceDataModel = ref<{ name: string; value: number }[]>([]);
const browserDataModel = ref<{ name: string; value: number }[]>([]);
const overviewItems = ref<AnalysisOverviewItem[]>();
overviewItems.value = [];

onMounted(async () => {
  const dayData = await getCDNData({
    mode: 'day',
    metric: 'request',
    domainName: 'www.guguhao.com',
    interval: 'hour',
  });

  dayDataModel.value = dayData.detailData;

  const weekData = await getCDNData({
    mode: 'week',
    metric: 'request',
    domainName: 'www.guguhao.com',
    interval: 'day',
  });

  const monthData = await getCDNData({
    mode: 'month',
    metric: 'request',
    domainName: 'www.guguhao.com',
    interval: 'day',
  });

  monthDataModel.value = monthData.detailData;

  const deviceData = await getCDNTopData({
    mode: 'month',
    metric: 'ua_device',
    domainName: 'www.guguhao.com',
    filter: 'request',
  });

  deviceDataModel.value = deviceData.detailData;

  const browserData = await getCDNTopData({
    mode: 'month',
    metric: 'ua_browser',
    domainName: 'www.guguhao.com',
    filter: 'request',
  });

  browserDataModel.value = browserData.detailData;

  overviewItems.value = [
    {
      icon: markRaw(SvgCardIcon),
      title: '小时访问量',
      totalTitle: '24小时总访问量',
      totalValue: dayData.summarizedData.value,
      value: dayData.detailData[0].value,
    },
    {
      icon: markRaw(SvgCakeIcon),
      title: '今日访问量',
      totalTitle: '周总访问量',
      totalValue: weekData.summarizedData.value,
      value: weekData.detailData[weekData.detailData.length - 1].value,
    },
    {
      icon: markRaw(SvgBellIcon),
      title: '周访问量',
      totalTitle: '月总访问量',
      totalValue: monthData.summarizedData.value,
      value: monthData.detailData
        .slice(-7)
        .reduce((sum: any, item: { value: any }) => sum + item.value, 0),
    },
  ];
});

const chartTabs: TabOption[] = [
  {
    label: '日流量趋势',
    value: 'trends',
  },
  {
    label: '月访问量',
    value: 'visits',
  },
];
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <AnalyticsSession />
    <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
      <template #trends>
        <AnalyticsTrends :data="dayDataModel" />
      </template>
      <template #visits>
        <AnalyticsVisits :data="monthDataModel" />
      </template>
    </AnalysisChartsTabs>

    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/2"
        title="月访问设备"
      >
        <AnalyticsVisitsSource :data="deviceDataModel" />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mt-0 md:w-1/2" title="月访问浏览器">
        <AnalyticsVisitsSales :data="browserDataModel" />
      </AnalysisChartCard>
    </div>
  </div>
</template>
