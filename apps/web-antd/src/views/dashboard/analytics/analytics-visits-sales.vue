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
      series: [
        {
          animationDelay() {
            return Math.random() * 400;
          },
          animationEasing: 'exponentialInOut',
          animationType: 'scale',
          center: ['50%', '50%'],
          color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
          data: props.data, // Dynamically sort based on value
          name: '浏览器占比',
          radius: '80%',
          roseType: 'radius',
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
    series: [
      {
        animationDelay() {
          return Math.random() * 400;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        center: ['50%', '50%'],
        color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
        data: props.data, // Dynamically sort based on value
        name: '浏览器占比',
        radius: '80%',
        roseType: 'radius',
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
