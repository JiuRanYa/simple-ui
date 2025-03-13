import type { PropType } from 'vue'
import type { ComponentSize } from '@simple-ui/common/index'
import { booleanProps, buildProps } from '@simple-ui/common/index'

export type ButtonType =
  | 'primary'
  | 'success'
  | 'default'
  | 'error'
  | 'warning'
  | 'outline'
  | 'secondary'
  | 'ghost'

export const buttonProps = buildProps({
  disabled: booleanProps,
  type: String as PropType<ButtonType>,
  size: String as PropType<ComponentSize>,
  icon: Object,
})

export const buttonGroupProps = buildProps({
  circle: booleanProps,
})
