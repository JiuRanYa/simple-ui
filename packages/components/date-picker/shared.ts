import type { PropType } from 'vue'
import { buildProps } from '@simple-ui/common'
import type { DatePickerType, DatePickerTyping } from './props'

export const datePickerSharedProps = buildProps({
  type: String as PropType<DatePickerType>,
  typing: {
    type: String as PropType<DatePickerTyping>,
    required: false,
  },
})
