import type { Placement } from '@floating-ui/dom'
import type {
  ComponentSize,
} from '@simple-ui/common'
import {
  booleanNumberProp,
  booleanProps,
  booleanStringProps,
  buildProps,
  eventProp,
} from '@simple-ui/common'
import type { PropType } from 'vue'
import type { SelectOption } from '../option/props'
import type { SelectRawOption, SelectValue } from './.symbol'

export const selectProps = buildProps({
  value: [String, Number, Array, Object] as PropType<SelectValue>,
  visible: booleanProps,
  transitionName: String,
  listClass: Array as PropType<string[]>,
  size: String as PropType<ComponentSize>,
  options: {
    type: Array as PropType<SelectRawOption[]>,
  },
  fitPopper: booleanNumberProp,
  placement: String as PropType<Placement>,
  to: booleanStringProps,
  creatable: booleanProps,
  clearable: booleanProps,
  filterable: booleanProps,
  popperAlive: booleanProps,
  defaultFirstOption: booleanProps,
  placeholder: String,
  multiple: booleanProps,
  onChange:
    eventProp<(newValue: SelectValue | undefined, oldValue: SelectValue | undefined) => void>(),
  onSelect: eventProp<(option?: SelectOption) => void>(),
  disabled: booleanProps,
})
