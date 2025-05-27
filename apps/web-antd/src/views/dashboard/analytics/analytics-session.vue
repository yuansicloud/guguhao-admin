<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { useAccess } from '@vben/access';

import {
  Button,
  Card,
  Input,
  message,
  Modal,
  Spin,
  TypographyText,
} from 'ant-design-vue';

import { getJX3SessionId, setJX3SessionId } from '#/api/core/administration';

const { hasAccessByCodes } = useAccess();

const sessionId = ref<string>('');
const isLoading = ref(false);
const isModalVisible = ref(false);
const newSessionId = ref('');
const isUpdating = ref(false);

const hasJX3Permission = hasAccessByCodes(['JX3.Character.Manage']);

const loadSessionId = async () => {
  try {
    isLoading.value = true;
    const response = await getJX3SessionId();
    sessionId.value = response || '';
  } catch {
    message.error('加载剑三Session失败');
  } finally {
    isLoading.value = false;
  }
};

const showUpdateModal = () => {
  newSessionId.value = sessionId.value; // Pre-fill with current session ID
  isModalVisible.value = true;
};

const handleUpdateSession = async () => {
  if (!newSessionId.value) {
    message.warn('请输入Session ID');
    return;
  }

  try {
    isUpdating.value = true;
    await setJX3SessionId(newSessionId.value);
    sessionId.value = newSessionId.value;
    isModalVisible.value = false;
    message.success('剑三Session更新成功');
  } catch {
    message.error('更新剑三Session失败');
  } finally {
    isUpdating.value = false;
  }
};

const handleCancel = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  if (hasJX3Permission) {
    loadSessionId();
  }
});

const sessionStatusText = computed(() =>
  sessionId.value ? '爬行中' : '倒下了',
);
const sessionStatusClass = computed(() =>
  sessionId.value ? 'text-green-500' : 'text-red-500',
);
</script>

<template>
  <Card v-if="hasJX3Permission" class="my-5">
    <template #title>
      <div class="flex items-center">
        <span>剑三虫虫状态</span>
      </div>
    </template>
    <template #extra>
      <Button type="link" @click="showUpdateModal">
        {{ sessionId ? '更新Session' : '设置Session' }}
      </Button>
    </template>
    <div v-if="isLoading" class="flex justify-center py-8">
      <Spin />
    </div>
    <div v-else class="flex flex-col">
      <div class="flex items-center justify-between">
        <div class="text-base">
          当前状态:
          <span :class="sessionStatusClass" class="font-semibold">
            {{ sessionStatusText }}
          </span>
        </div>
      </div>
      <div v-if="sessionId" class="mt-2">
        <TypographyText copyable class="text-gray-500">
          {{ sessionId }}
        </TypographyText>
      </div>
      <div v-else class="mt-2 text-gray-500">请点击右上角按钮设置Session。</div>
    </div>

    <Modal
      v-model:open="isModalVisible"
      title="更新剑三Session ID"
      :confirm-loading="isUpdating"
      @ok="handleUpdateSession"
      @cancel="handleCancel"
    >
      <Input
        v-model:value="newSessionId"
        placeholder="请输入新的剑三Session ID"
        class="mt-4"
        @press-enter="handleUpdateSession"
      />
    </Modal>
  </Card>
</template>
