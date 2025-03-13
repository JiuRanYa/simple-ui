import { defineLocaleConfig } from '..'

export function zhCNLocale() {
  return defineLocaleConfig({
    locale: 'zh-CN',

    input: {
      placeholder: '请输入',
    },

    inputEmoji: {
      copy: '复制成功',
    },
  })
}
