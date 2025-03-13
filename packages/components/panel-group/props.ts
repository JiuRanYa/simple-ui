import { booleanProps, buildProps, eventProp } from '@simple-ui/common'
import type { ExtractPropTypes, PropType } from 'vue'
import type { PanelDirection, PanelGroupStates } from './types'

export const panelGroupProps = buildProps({
  direction: {
    type: String as PropType<PanelDirection>,
  },
  grid: booleanProps,
  disabled: booleanProps,
  layout: Array as PropType<number[]>,
  gridLayout: Array as PropType<number[]>,
  onDragEnd: eventProp<(states: PanelGroupStates) => void>(),
  onDragMove: eventProp<(states: PanelGroupStates) => void>(),
  showPreviewDot: booleanProps,
})

export type PanelGroupProps = ExtractPropTypes<typeof panelGroupProps>
