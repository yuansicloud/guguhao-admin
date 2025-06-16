<script setup lang="ts">
import type { SystemMessageRequest } from '../../types/private-messages';

import { computed, defineOptions, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Form, Input, message } from 'ant-design-vue';

import { publishSystemMessage } from '../../api/private-messages';
import RichTextEditor from '../editor/RichTextEditor.vue';

defineOptions({
  name: 'SystemMessageModal',
});

const emits = defineEmits(['change']);

const FormItem = Form.Item;

const messageForm = ref<SystemMessageRequest>({
  content: '',
  title: '',
});

const editorRef = ref();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: true,
  onCancel() {
    modalApi.close();
  },
  onClosed() {
    resetForm();
  },
  onConfirm: async () => {
    await handlePublishMessage();
  },
  title: '发送系统公告',
});

const editorHeight = computed(() => {
  const state = modalApi.useStore((state) => state.fullscreen);
  return state.value ? 'calc(100vh - 300px)' : '200px';
});

const resetForm = () => {
  messageForm.value = {
    content: '',
    title: '',
  };
};

const handlePublishMessage = async () => {
  try {
    // Get the HTML content using the editor reference
    const editorContent = editorRef.value?.getHTML();

    // Form validation
    if (!editorContent) {
      message.error('消息内容不能为空');
      return;
    }

    if (!messageForm.value.title) {
      message.error('标题不能为空');
      return;
    }

    // Send message using API
    await publishSystemMessage({
      ...messageForm.value,
      content: editorContent,
    });

    message.success('系统公告发送成功');
    modalApi.close();

    // Emit change event for parent component
    emits('change');
  } catch (error) {
    console.error('System message publishing failed:', error);
    message.error('系统公告发送失败，请稍后重试');
  }
};

// Expose the modal API for parent components
defineExpose({
  open: () => {
    modalApi.open();
  },
});
</script>

<template>
  <Modal>
    <Form
      :model="messageForm"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <FormItem label="标题" name="title">
        <Input v-model:value="messageForm.title" placeholder="系统公告标题" />
      </FormItem>

      <FormItem label="消息内容" name="content">
        <RichTextEditor
          ref="editorRef"
          id="systemEditor"
          v-model="messageForm.content"
          placeholder="请输入系统公告内容"
          :height="editorHeight"
          :max-length="1000"
          theme="snow"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<style lang="scss" scoped>
.ml-2 {
  margin-left: 8px;
}
</style>
