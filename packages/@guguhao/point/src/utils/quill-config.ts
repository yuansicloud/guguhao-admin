import { Quill } from '@vueup/vue-quill';

// Chinese localization for Quill
const zhCN = {
  placeholder: '请输入内容...',
  toolbar: {
    bold: '粗体',
    italic: '斜体',
    underline: '下划线',
    strike: '删除线',
    link: '链接',
    image: '图片',
    color: '文字颜色',
    background: '背景颜色',
    align: {
      default: '默认对齐',
      center: '居中对齐',
      right: '右对齐',
      justify: '两端对齐',
    },
    size: {
      small: '小号',
      normal: '正常',
      large: '大号',
      huge: '超大号',
    },
    header: {
      1: '标题1',
      2: '标题2',
      3: '标题3',
      4: '标题4',
      5: '标题5',
      6: '标题6',
    },
    list: {
      bullet: '无序列表',
      ordered: '有序列表',
    },
    indent: {
      '+1': '增加缩进',
      '-1': '减少缩进',
    },
    direction: {
      rtl: '从右到左',
    },
    blockquote: '引用',
    'code-block': '代码块',
    formula: '公式',
    clean: '清除格式',
  },
};

// Custom type definitions
interface LocalizationOptions {
  [key: string]: any;
  language?: string;
}

interface LocalizationLanguages {
  [key: string]: any;
}

// Add Chinese localization to Quill
const initQuill = () => {
  // Register Chinese localization
  const Lang = Quill.import('core/module');

  class Localization extends Lang {
    languages: LocalizationLanguages;
    modules: Record<string, any>;
    options: LocalizationOptions;

    constructor(quill: any, options: LocalizationOptions) {
      super(quill, options);
      this.languages = {
        'zh-hans': zhCN,
      };
      this.modules = {
        toolbar: this.localize('toolbar'),
      };
      this.options = options;
    }

    getLocaleData(lang: any, path: string, defaultValue?: string) {
      const keys = path.split('.');
      let result = lang;

      // Loop through the keys to get the nested property
      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          return defaultValue;
        }
      }

      return result ?? defaultValue;
    }

    localize(path: string, defaultValue?: string) {
      const lang = this.languages[this.options.language || 'zh-hans'] || {};
      return this.getLocaleData(lang, path, defaultValue);
    }
  }

  Quill.register('modules/localization', Localization, true);
};

export { initQuill };
