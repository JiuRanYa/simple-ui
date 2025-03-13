import type { Placement } from '@simple-ui/common'
import { booleanProps, booleanStringProps, buildProps } from '@simple-ui/common'
import type { PropType } from 'vue'

export type TriggerType = 'click' | 'hover'

export const toolTipProps = buildProps({
  content: String,
  wrap: booleanStringProps,
  placement: String as PropType<Placement>,
  transfer: booleanProps,
  reverse: booleanProps,
  visible: booleanProps,
  trigger: String as PropType<TriggerType>,
  disabled: booleanProps,
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  noArrow: booleanProps,
  transition: String,
})
