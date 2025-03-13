import type { ComponentSize } from '@simple-ui/common'
import { booleanProps, buildProps } from '@simple-ui/common'
import type { PropType } from 'vue'

export const avatarProps = buildProps({
  src: String,
  circle: booleanProps,
  icon: Object,
  alt: String,
  size: [Number, String] as PropType<number | ComponentSize>,
  iconScale: Number,
})
