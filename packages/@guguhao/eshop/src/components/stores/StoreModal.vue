<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';

import type { CreateUpdateStoreDto, StoreDto } from '../../types/stores';

import { defineEmits, defineOptions, ref, toValue } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Form, Input, message } from 'ant-design-vue';

import { createStore, getStoreById, updateStore } from '../../api/stores';

defineOptions({
  name: 'StoreModal',
});

const emits = defineEmits<{
  (event: 'change', data: StoreDto): void;
}>();

const entityId = ref<null | string>(null);

const defaultModel: CreateUpdateStoreDto = {
  name: '',
  extraProperties: {},
};
const form = ref<FormInstance>();
const FormItem = Form.Item;
const formModel = ref<CreateUpdateStoreDto>({ ...defaultModel });

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await form.value?.validate();
    const api = entityId.value
      ? updateStore(entityId.value, toValue(formModel))
      : createStore(toValue(formModel));
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
      const storeDto = modalApi.getData<StoreDto>();
      if (storeDto?.id) {
        entityId.value = storeDto.id;
        modalApi.setState({ loading: true });
        try {
          const dto = await getStoreById(storeDto.id);
          formModel.value = dto;
          modalApi.setState({
            title: `${$t('EasyAbpEShopStores.Store')} - ${dto.name}`,
          });
        } catch {
          message.error($t('AbpUi.Error'));
        } finally {
          modalApi.setState({ loading: false });
        }
      }
    }
  },
  title: 'Store',
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
      <FormItem :label="$t('EasyAbpEShopStores.Store')" name="name" required>
        <Input v-model:value="formModel.name" />
      </FormItem>
    </Form>
  </Modal>
</template>

<style scoped></style>
