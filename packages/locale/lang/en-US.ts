import { defineLocaleConfig } from '..'

export function enUSLocale() {
  return defineLocaleConfig({
    locale: 'en-US',

    input: {
      placeholder: 'Please input',
    },

    inputEmoji: {
      copy: 'Copy successfully',
    },
  })
}
