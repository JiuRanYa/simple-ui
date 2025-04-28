import type { PropType } from 'vue'
import { buildProps } from '@simple-ui/common'
import type { DatePickerType } from './props'

export const datePickerSharedProps = buildProps({
  type: String as PropType<DatePickerType>,
})
