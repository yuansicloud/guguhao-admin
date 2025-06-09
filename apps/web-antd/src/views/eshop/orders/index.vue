<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { OrderTable } from '@guguhao/eshop';

defineOptions({
  name: 'EshopOrders',
});
</script>

<template>
  <Page>
    <OrderTable />
  </Page>
</template>
