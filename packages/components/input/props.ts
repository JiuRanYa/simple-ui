import { buildProps } from '@panda-ui/common/props'
import type { ComponentSize } from '@panda-ui/common'
import { booleanProps, eventProp, localeProp } from '@panda-ui/common'
import type { PropType } from 'vue'

export type InputType = 'default' | 'secondary'
export const inputProps = buildProps({
  value: String,
  debounce: booleanProps,
  placeholder: String,
  autocomplete: booleanProps,
  onChange: Function as PropType<(value: string) => void>,
  onBlur: eventProp<(value: string, event: FocusEvent) => void>(),
  type: String as PropType<InputType>,
  autofocus: booleanProps,
  disabled: booleanProps,
  readonly: booleanProps,
  delay: Number,
  size: String as PropType<ComponentSize>,
  locale: localeProp('input'),
})
