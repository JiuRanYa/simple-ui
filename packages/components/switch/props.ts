import type { ComponentSize } from '@simple-ui/common'
import { booleanProps, buildProps } from '@simple-ui/common'
import type { PropType } from '@vue/runtime-core'

export const switchProps = buildProps({
  value: booleanProps,
  openIcon: Object,
  closeIcon: Object,
  size: [Number, String] as PropType<number | ComponentSize>,
})
