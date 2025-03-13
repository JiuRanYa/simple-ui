import type { DeepPartial } from '../types'

export interface LocaleConfig {
  locale: string

  input: {
    placeholder: string
  }

  inputEmoji: {
    copy: string
  }
}

export type LocaleOptions = DeepPartial<LocaleConfig>
export type LocaleNames = Exclude<keyof LocaleConfig, 'locale' | 'wordSpace'>

export type ClassType = string | Record<string, any> | Array<string | Record<string, any>>
