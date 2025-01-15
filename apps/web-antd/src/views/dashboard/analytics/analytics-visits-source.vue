<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { defineProps, onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

// Define the prop for the data list
const props = defineProps<{
  data: Array<{ name: string; value: number }>;
}>();

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

// Watch for changes in the `data` prop and update the chart
watch(
  () => props.data,
  () => {
    renderEcharts({
      legend: {
        bottom: '2%',
        left: 'center',
      },
      series: [
        {
          animationDelay() {
            return Math.random() * 100;
          },
          animationEasing: 'exponentialInOut',
          animationType: 'scale',
          avoidLabelOverlap: false,
          color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
          data: props.data, // Use dynamic data here
          emphasis: {
            label: {
              fontSize: '12',
              fontWeight: 'bold',
              show: true,
            },
          },
          itemStyle: {
            borderRadius: 10,
            borderWidth: 2,
          },
          label: {
            position: 'center',
            show: false,
          },
          labelLine: {
            show: false,
          },
          name: '访问来源',
          radius: ['40%', '65%'],
          type: 'pie',
        },
      ],
      tooltip: {
        trigger: 'item',
      },
    });
  },
  { immediate: true },
);

onMounted(() => {
  renderEcharts({
    legend: {
      bottom: '2%',
      left: 'center',
    },
    series: [
      {
        animationDelay() {
          return Math.random() * 100;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        avoidLabelOverlap: false,
        color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
        data: props.data, // Use dynamic data here
        emphasis: {
          label: {
            fontSize: '12',
            fontWeight: 'bold',
            show: true,
          },
        },
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
        },
        label: {
          position: 'center',
          show: false,
        },
        labelLine: {
          show: false,
        },
        name: '访问来源',
        radius: ['40%', '65%'],
        type: 'pie',
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
