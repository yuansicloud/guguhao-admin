<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { defineProps, onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import dayjs from 'dayjs';
// Define the prop for the data list
const props = defineProps<{
  data: Array<{ time: string; value: number }>;
}>();

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

// Helper function to format the time data for the x-axis
const formatTimeData = (data: Array<{ time: string; value: number }>) => {
  return data.map((item) => dayjs(item.time).format('HH:mm'));
};

// Helper function to extract the value data for the chart
const formatValueData = (data: Array<{ time: string; value: number }>) => {
  return data.map((item) => item.value);
};

// Define the function to update the chart (ensure it's declared before being used)
const updateChart = () => {
  renderEcharts({
    grid: {
      bottom: 0,
      containLabel: true,
      left: '1%',
      right: '1%',
      top: '2%',
    },
    series: [
      {
        areaStyle: {},
        data: formatValueData(props.data),
        itemStyle: {
          color: '#5ab1ef',
        },
        smooth: true,
        type: 'line',
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#019680',
          width: 1,
        },
      },
      trigger: 'axis',
    },
    xAxis: {
      axisTick: {
        show: false,
      },
      boundaryGap: false,
      data: formatTimeData(props.data),
      splitLine: {
        lineStyle: {
          type: 'solid',
          width: 1,
        },
        show: true,
      },
      type: 'category',
    },
    yAxis: [
      {
        axisTick: {
          show: false,
        },
        max: Math.max(...props.data.map((item) => item.value)), // dynamically adjust max Y value
        splitArea: {
          show: true,
        },
        splitNumber: 4,
        type: 'value',
      },
    ],
  });
};

// Watch for changes in the `data` prop
watch(
  () => props.data,
  () => {
    updateChart();
  },
  { immediate: true },
);

onMounted(() => {
  updateChart();
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
