import { computed } from 'vue'
import type { LocaleConfig } from '@simple-ui/common'
import { zhCNLocale } from './lang/zh-CN'

export const defaultLocale = computed(() => zhCNLocale())

export function defineLocaleConfig(locale: LocaleConfig) {
  return locale
}

export * from './lang/en-US'
export * from './lang/zh-CN'
