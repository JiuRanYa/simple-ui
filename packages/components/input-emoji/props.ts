import type { ComponentSize, EditType } from '@panda-ui/common'
import { buildProps, eventProp, localeProp } from '@panda-ui/common'
import type { ExtractPropTypes, PropType } from 'vue'
import type { emojiPickerProps } from '../emoji-picker/props'

export const inputEmojiProps = buildProps({
  value: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  placeholderClass: {
    type: String,
    default: '',
  },
  defaultEmoji: {
    type: String,
    default: '😀',
  },
  emojiOptions: {
    type: Object as PropType<ExtractPropTypes<typeof emojiPickerProps>>,
  },
  size: {
    type: String as PropType<ComponentSize>,
    default: 'middle',
  },
  type: {
    type: String as PropType<EditType>,
    default: 'auto',
  },
  locale: localeProp('inputEmoji'),
  onChange: eventProp<(value: string) => void>(),
  onInput: eventProp<(value: string, event: Event) => void>(),
})
