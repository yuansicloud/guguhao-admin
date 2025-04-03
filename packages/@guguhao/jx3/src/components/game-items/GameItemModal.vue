<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';

import type {
  CreateUpdateGameItemDto,
  GameItemDto,
} from '../../types/game-item';

import { defineEmits, defineOptions, ref, toValue } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  Avatar,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Textarea,
} from 'ant-design-vue';

import { createApi, getApi, updateApi } from '../../api/game-item';

defineOptions({
  name: 'GameItemModal',
});

const emits = defineEmits<{
  (event: 'change', data: GameItemDto): void;
}>();

const entityId = ref<null | string>(null);

const defaultModel = {
  isHighValue: false,
} as CreateUpdateGameItemDto;
const form = ref<FormInstance>();
const FormItem = Form.Item;
const formModel = ref<CreateUpdateGameItemDto>({ ...defaultModel });

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
        message.success($t('AbpUi.SavedSuccessfully'));
        emits('change', res);
        modalApi.close();
      })
      .finally(() => {
        modalApi.setState({ loading: false });
      });
  },
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      entityId.value = null;
      formModel.value = { ...defaultModel };
      modalApi.setState({
        title: $t('AbpUi.AddNew'),
      });
      const gameItemDto = modalApi.getData<GameItemDto>();
      if (gameItemDto?.id) {
        entityId.value = gameItemDto.id;
        modalApi.setState({ loading: true });
        try {
          const dto = await getApi(gameItemDto.id);
          formModel.value = dto;
          modalApi.setState({
            title: `${$t('JX3.GameItem')} - ${dto.name}`,
          });
        } catch {
          message.error($t('AbpUi.Error'));
        } finally {
          modalApi.setState({ loading: false });
        }
      }
    }
  },
  title: 'Game Item',
});
</script>

<template>
  <Modal>
    <Form
      ref="form"
      :label-col="{ span: 6 }"
      :model="formModel"
      :wrapper-col="{ span: 18 }"
    >
      <FormItem
        :label="$t('JX3.GameItemAvatar')"
        name="avatar"
        v-if="formModel.avatar"
      >
        <Avatar :src="formModel.avatar" :size="60" shape="square" />
      </FormItem>

      <FormItem :label="$t('JX3.GameItemName')" name="name" required>
        <Input v-model:value="formModel.name" />
      </FormItem>

      <FormItem :label="$t('JX3.GameItemAlias')" name="alias">
        <Input v-model:value="formModel.alias" />
      </FormItem>

      <FormItem :label="$t('JX3.GameItemCategory')" name="category">
        <Input v-model:value="formModel.category" />
      </FormItem>

      <FormItem
        :label="$t('JX3.GameItemIsHighValue')"
        name="isHighValue"
        value-prop-name="checked"
      >
        <Checkbox v-model:checked="formModel.isHighValue" />
      </FormItem>

      <FormItem :label="$t('JX3.GameItemPrice')" name="price">
        <InputNumber v-model:value="formModel.price" style="width: 100%" />
      </FormItem>

      <FormItem :label="$t('JX3.GameItemDescription')" name="description">
        <Textarea
          v-model:value="formModel.description"
          :auto-size="{ minRows: 2 }"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<style scoped></style>
