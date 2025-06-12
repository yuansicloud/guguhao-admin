<script setup lang="ts">
import type { IdentityUserDto } from '@abp/identity';

import type { PrivateMessageRequest } from '../../types/private-messages';

import { computed, defineOptions, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Form, Input, message, Select } from 'ant-design-vue';

import { sendPrivateMessage } from '../../api/private-messages';
import RichTextEditor from '../editor/RichTextEditor.vue';

defineOptions({
  name: 'PrivateMessageModal',
});

const emits = defineEmits(['change']);

const FormItem = Form.Item;
const Option = Select.Option;

const messageForm = ref<PrivateMessageRequest>({
  toUserId: '',
  category: 'SystemAnnouncement',
  content: '',
  title: '',
});

const editorRef = ref();

const categories = [
  { label: '系统公告', value: 'SystemAnnouncement' },
  { label: '咕币消息', value: 'PointService' },
  { label: '蹲号消息', value: 'JX3SearchTemplate' },
];

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
    await handleSendMessage();
  },
  onOpenChange: (isOpen: boolean) => {
    if (isOpen) {
      const userDto = modalApi.getData<IdentityUserDto>();
      if (userDto?.id) {
        messageForm.value.toUserId = userDto.id;
        messageForm.value.title = `系统公告`;
        modalApi.setState({
          title: `发送私信 - ${userDto.name ?? '用户'} (${userDto.userName})`,
        });
      }
    }
  },
  title: '发送私信',
});

const editorHeight = computed(() => {
  const state = modalApi.useStore((state) => state.fullscreen);
  return state.value ? 'calc(100vh - 300px)' : '200px';
});

const resetForm = () => {
  messageForm.value = {
    toUserId: '',
    category: 'SystemAnnouncement',
    content: '',
    title: '',
  };
};

const handleSendMessage = async () => {
  try {
    // Get the HTML content using the editor reference
    const editorContent = editorRef.value?.getHTML();

    // Form validation
    if (!editorContent) {
      message.error('消息内容不能为空');
      return;
    }

    // Send message using API
    await sendPrivateMessage({
      ...messageForm.value,
      content: editorContent,
    });

    message.success('消息发送成功');
    modalApi.close();

    // Emit change event for parent component
    emits('change');
  } catch (error) {
    console.error('Message sending failed:', error);
    message.error('消息发送失败，请稍后重试');
  }
};

// Expose the modal API for parent components
defineExpose({
  open: (user: IdentityUserDto) => {
    modalApi.setData(user);
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
        <Input v-model:value="messageForm.title" placeholder="消息标题" />
      </FormItem>

      <FormItem label="消息类型" name="category">
        <Select v-model:value="messageForm.category" style="width: 100%">
          <Option
            v-for="category in categories"
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}
          </Option>
        </Select>
      </FormItem>

      <FormItem label="消息内容" name="content">
        <RichTextEditor
          ref="editorRef"
          id="editor"
          v-model="messageForm.content"
          placeholder="请输入消息内容"
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
