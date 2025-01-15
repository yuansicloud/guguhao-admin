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
  return data.map((item) => dayjs(item.time).format('MM-DD'));
};

// Helper function to extract the value data for the chart
const formatValueData = (data: Array<{ time: string; value: number }>) => {
  return data.map((item) => item.value); // Extract the value data
};

// Watch for changes in the `data` prop and update the chart
watch(
  () => props.data,
  () => {
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
          barMaxWidth: 80,
          data: formatValueData(props.data),
          type: 'bar',
        },
      ],
      tooltip: {
        axisPointer: {
          lineStyle: {
            width: 1,
          },
        },
        trigger: 'axis',
      },
      xAxis: {
        data: formatTimeData(props.data), // Use formatted time data for the x-axis
        type: 'category',
      },
      yAxis: {
        max: Math.max(...props.data.map((item) => item.value)), // Dynamically adjust max Y value
        splitNumber: 4,
        type: 'value',
      },
    });
  },
  { immediate: true },
);

onMounted(() => {
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
        barMaxWidth: 80,
        data: formatValueData(props.data),
        type: 'bar',
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: 1,
        },
      },
      trigger: 'axis',
    },
    xAxis: {
      data: formatTimeData(props.data),
      type: 'category',
    },
    yAxis: {
      max: Math.max(...props.data.map((item) => item.value)), // Dynamically adjust max Y value
      splitNumber: 4,
      type: 'value',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
