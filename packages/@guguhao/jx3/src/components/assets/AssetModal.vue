<script setup lang="ts">
import { defineOptions, defineEmits, ref, toValue } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import dayjs from 'dayjs';
import {
  Avatar,
  message,
  Form,
  Input,
  Select,
  Checkbox,
  InputNumber,
  Textarea,
  DatePicker,
} from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { createApi, getApi, updateApi } from '../../api/assets';
import {
  AssetType,
  type AssetDto,
  type CreateUpdateAssetDto,
} from '../../types/assets';
import { useAssets } from '../../hooks/useAssets';
import { formatToDate } from '@abp/core';
defineOptions({
  name: 'AssetModal',
});

const emits = defineEmits<{
  (event: 'change', data: AssetDto): void;
}>();

const { assetTypeDisplayMap } = useAssets();
const entityId = ref<string | null>(null);

const defaultModel = {} as CreateUpdateAssetDto;
const form = ref<FormInstance>();
const FormItem = Form.Item;
const formModel = ref<CreateUpdateAssetDto>({ ...defaultModel });

// Options for assetType Select
const valueTypeOptions = Object.keys(assetTypeDisplayMap).map((key) => {
  const assetType = assetTypeDisplayMap[Number(key) as AssetType];
  return {
    label: assetType.value,
    value: Number(key), // Ensure the value is the enum number, not a string
  };
});

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await form.value?.validate();
    const api = entityId.value
      ? updateApi(entityId.value, toValue(formModel))
      : createApi(toValue(formModel));
    modalApi.setState({ loading: true });
    api
      .then((res) => {
        message.success($t('AbpUi.Success'));
        emits('change', res);
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
      const assetDto = modalApi.getData<AssetDto>();
      if (assetDto?.id) {
        entityId.value = assetDto.id;
        modalApi.setState({ loading: true });
        try {
          const dto = await getApi(assetDto.id);
          formModel.value = dto;
          modalApi.setState({
            title: `${$t('JX3.Asset')} - ${dto.name}`,
          });
        } catch (error) {
          message.error($t('AbpUi.Error'));
        } finally {
          modalApi.setState({ loading: false });
        }
      }
    }
  },
  title: 'Asset',
});

function onDateChange(e: any) {
  formModel.value.officialSaleDate = dayjs.isDayjs(e)
    ? formatToDate(e)
    : undefined;
}
</script>

<template>
  <Modal>
    <Form
      ref="form"
      :label-col="{ span: 6 }"
      :model="formModel"
      :wrapper-col="{ span: 18 }"
    >
      <FormItem :label="$t('JX3.AssetAvatar')" name="avatar">
        <Avatar :src="formModel.avatar" :size="60" shape="square" />
      </FormItem>

      <FormItem
        :label="$t('JX3.AssetMediaResources')"
        name="mediaResources"
        v-if="formModel.mediaResources"
      >
        <Avatar :src="formModel.mediaResources" :size="60" shape="square" />
      </FormItem>

      <FormItem :label="$t('JX3.AssetName')" name="name" required>
        <Input v-model:value="formModel.name" />
      </FormItem>

      <FormItem :label="$t('JX3.AssetAlias')" name="alias">
        <Input v-model:value="formModel.alias" />
      </FormItem>

      <FormItem :label="$t('JX3.AssetAssetType')" name="assetType">
        <Select
          v-model:value="formModel.assetType"
          :options="valueTypeOptions"
        />
      </FormItem>

      <FormItem :label="$t('JX3.AssetSubType')" name="subType">
        <Input v-model:value="formModel.subType" />
      </FormItem>

      <FormItem
        :label="$t('JX3.AssetIsHighValue')"
        name="isHighValue"
        valuePropName="checked"
      >
        <Checkbox v-model:checked="formModel.isHighValue"> </Checkbox>
      </FormItem>

      <FormItem
        :label="$t('JX3.AssetIsUnique')"
        name="isUnique"
        valuePropName="checked"
      >
        <Checkbox v-model:checked="formModel.isUnique"> </Checkbox>
      </FormItem>

      <FormItem :label="$t('JX3.AssetPrice')" name="price">
        <InputNumber v-model:value="formModel.price" style="width: 100%" />
      </FormItem>

      <FormItem :label="$t('JX3.AssetCategory')" name="category">
        <Input v-model:value="formModel.category" />
      </FormItem>

      <FormItem
        :label="$t('JX3.AssetOfficialSaleDate')"
        name="officialSaleDate"
      >
        <DatePicker
          :placeholder="$t('JX3.AssetOfficialSaleDate')"
          :value="
            formModel.officialSaleDate
              ? dayjs(formModel.officialSaleDate, 'YYYY-MM-DD')
              : ''
          "
          style="width: 100%"
          @change="onDateChange($event)"
        />
      </FormItem>

      <FormItem :label="$t('JX3.AssetGetSource')" name="getSource">
        <InputNumber v-model:value="formModel.getSource" style="width: 100%" />
      </FormItem>

      <FormItem :label="$t('JX3.AssetDescription')" name="description">
        <Textarea
          v-model:value="formModel.description"
          :auto-size="{ minRows: 2 }"
        />
      </FormItem>

      <FormItem :label="$t('JX3.AssetWBLName')" name="wblName">
        <Input v-model:value="formModel.wblName" readonly />
      </FormItem>
    </Form>
  </Modal>
</template>

<style scoped></style>
