<script setup lang="ts">
import type { Delta } from '@vueup/vue-quill';

import type { PropType } from 'vue';

import { defineOptions, onMounted, ref, watch } from 'vue';

import { QuillEditor } from '@vueup/vue-quill';

import { initQuill } from '../../utils/quill-config';

import '@vueup/vue-quill/dist/vue-quill.snow.css';

defineOptions({
  name: 'RichTextEditor',
});

// Props declaration
const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<Delta | string>,
    default: '',
  },
  placeholder: {
    type: String,
    default: '请输入内容...',
  },
  height: {
    type: [String, Number],
    default: '400px',
  },
  maxLength: {
    type: Number,
    default: 1000,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['update:modelValue', 'change', 'blur', 'focus']);

// Helper function to calculate text length from Delta
const calculateDeltaLength = (delta: Delta | string | undefined): number => {
  if (!delta) return 0;
  if (typeof delta === 'string') return delta.length;

  // For Delta format, sum up the length of all text inserts
  return (
    delta.ops?.reduce((length, op) => {
      if (typeof op.insert === 'string') {
        return length + op.insert.length;
      }
      return length;
    }, 0) || 0
  );
};

// Content ref
const content = ref(props.modelValue);
const contentLength = ref(0);
const quillEditor = ref();

// Initialize Quill with Chinese localization
onMounted(() => {
  initQuill();
  contentLength.value = calculateDeltaLength(content.value);
});

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== content.value) {
      content.value = newValue;
      contentLength.value = calculateDeltaLength(newValue);
    }
  },
);

// Watch for internal changes to content
watch(
  () => content.value,
  (newValue) => {
    contentLength.value = calculateDeltaLength(newValue);
    emits('update:modelValue', newValue);
    emits('change', newValue);
  },
);

// Method to get HTML content
const getHTML = () => {
  if (quillEditor.value) {
    return quillEditor.value.getHTML();
  }
  return '';
};

// Expose methods to parent components
defineExpose({
  getHTML,
});

// Event handlers
</script>

<template>
  <div class="rich-text-editor-container">
    <QuillEditor
      ref="quillEditor"
      v-model:content="content"
      class="rich-text-editor"
      :style="{ height }"
      :options="{
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
          ],
        },
        placeholder,
        readOnly,
        theme: 'snow',
      }"
    />
    <div v-if="maxLength > 0" class="text-count">
      {{ contentLength }}/{{ maxLength }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rich-text-editor-container {
  width: 100%;
  position: relative;

  .rich-text-editor {
    width: 100%;
    border-radius: 4px;
  }

  .text-count {
    text-align: right;
    color: #999;
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>
