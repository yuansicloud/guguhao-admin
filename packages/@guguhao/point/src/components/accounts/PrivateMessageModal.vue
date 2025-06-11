<script setup lang="ts">
import type { IdentityUserDto } from '@abp/identity';

import type { PrivateMessageRequest } from '../../types/private-messages';

import { defineOptions, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Form, Input, message, Select } from 'ant-design-vue';

import { sendPrivateMessage } from '../../api/private-messages';

defineOptions({
  name: 'PrivateMessageModal',
});

const emits = defineEmits(['change']);

const FormItem = Form.Item;
const Option = Select.Option;

const messageForm = ref<PrivateMessageRequest>({
  toUserId: '',
  category: 'PointService',
  content: '',
  title: '',
});

const categories = [
  { label: '咕币消息', value: 'PointService' },
  { label: '蹲号消息', value: 'JX3SearchTemplate' },
  { label: '系统公告', value: 'SystemAnnouncement' },
];

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  fullscreenButton: false,
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
        messageForm.value.title = `来自管理员的消息 - ${new Date().toLocaleDateString()}`;
        modalApi.setState({
          title: `发送私信 - ${userDto.name ?? '用户'} (${userDto.userName})`,
        });
      }
    }
  },
  title: '发送私信',
});

const resetForm = () => {
  messageForm.value = {
    toUserId: '',
    category: 'PointService',
    content: '',
    title: '',
  };
};

const handleSendMessage = async () => {
  try {
    // Form validation
    if (!messageForm.value.content.trim()) {
      message.error('消息内容不能为空');
      return;
    }

    // Send message using API
    await sendPrivateMessage(messageForm.value);

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
        <div class="rich-text-editor-container">
          <Input.TextArea
            v-model:value="messageForm.content"
            :rows="8"
            placeholder="请输入消息内容"
            :maxlength="1000"
            show-count
            class="rich-text-editor"
          />
        </div>
      </FormItem>
    </Form>
  </Modal>
</template>

<style lang="scss" scoped>
.rich-text-editor-container {
  width: 100%;

  .rich-text-editor {
    width: 100%;
    border-radius: 4px;
  }
}

.ml-2 {
  margin-left: 8px;
}
</style>
