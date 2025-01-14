<script setup lang="ts">
import type { MergeAssetsDto } from '../../types/assets';

import { defineEmits, defineOptions, h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { SwapOutlined } from '@ant-design/icons-vue';
import { Avatar, Button, Card, Input, message, Tag } from 'ant-design-vue';

import { mergeAssets } from '../../api/assets';
import { useAssets } from '../../hooks/useAssets';

defineOptions({
  name: 'AssetModal',
});

const emits = defineEmits<{
  (event: 'change'): void;
}>();
const { getAssetTypeColor, getAssetTypeValue } = useAssets();
const defaultModel = {} as MergeAssetsDto;
const formModel = ref<MergeAssetsDto>({ ...defaultModel });

const swapAssets = () => {
  const toSwapAssets = formModel.value.originalAsset;
  formModel.value.originalAsset = formModel.value.destinationAsset;
  formModel.value.destinationAsset = toSwapAssets;
};

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    const api = mergeAssets({
      destinationAssetId: formModel.value.destinationAsset.id,
      originalAssetId: formModel.value.originalAsset.id,
    });
    modalApi.setState({ loading: true });
    api
      .then(() => {
        message.success($t('AbpUi.SavedSuccessfully'));
        emits('change');
        modalApi.close();
      })
      .finally(() => {
        modalApi.setState({ loading: false });
      });
  },
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      formModel.value = { ...defaultModel };
      modalApi.setState({
        title: $t('AbpUi.AddNew'),
      });
      const dto = modalApi.getData<MergeAssetsDto>();
      formModel.value = dto;
      modalApi.setState({
        title: `${$t('jx3.Merge')}`,
      });
    }
  },
  title: 'Asset',
});
</script>

<template>
  <Modal>
    <Card title="保留的外观">
      <template #extra>
        <Tag :color="getAssetTypeColor(formModel.destinationAsset.assetType)">
          {{ getAssetTypeValue(formModel.destinationAsset.assetType) }}
        </Tag>
      </template>
      <div class="flex flex-col items-center justify-center space-y-2">
        <Avatar :src="formModel.destinationAsset.avatar" size="large" />
        <Input
          v-model:value="formModel.destinationAsset.name"
          :addon-before="$t('JX3.AssetName')"
          readonly
        />
        <Input
          v-model:value="formModel.destinationAsset.alias"
          :addon-before="$t('JX3.AssetAlias')"
          readonly
        />
        <Input
          v-model:value="formModel.destinationAsset.price"
          :addon-before="$t('JX3.AssetPrice')"
          readonly
        />
        <Input
          v-model:value="formModel.destinationAsset.wblName"
          :addon-before="$t('JX3.AssetWBLName')"
          readonly
        />
      </div>
    </Card>
    <Button
      type="primary"
      :icon="h(SwapOutlined)"
      class="mb-2 mt-2"
      @click="swapAssets"
    >
      交换
    </Button>
    <Card title="被替换（删除）的外观">
      <template #extra>
        <Tag :color="getAssetTypeColor(formModel.originalAsset.assetType)">
          {{ getAssetTypeValue(formModel.originalAsset.assetType) }}
        </Tag>
      </template>
      <div class="flex flex-col items-center justify-center space-y-2">
        <Avatar :src="formModel.originalAsset.avatar" size="large" />
        <Input
          v-model:value="formModel.originalAsset.name"
          :addon-before="$t('JX3.AssetName')"
          readonly
        />
        <Input
          v-model:value="formModel.originalAsset.alias"
          :addon-before="$t('JX3.AssetAlias')"
          readonly
        />
        <Input
          v-model:value="formModel.originalAsset.price"
          :addon-before="$t('JX3.AssetPrice')"
          readonly
        />
        <Input
          v-model:value="formModel.originalAsset.wblName"
          :addon-before="$t('JX3.AssetWBLName')"
          readonly
        />
      </div>
    </Card>
  </Modal>
</template>

<style scoped></style>
