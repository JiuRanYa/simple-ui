import type { Side } from '@simple-ui/common'
import { buildProps, eventProp } from '@simple-ui/common'
import type { PropType } from 'vue'

export interface TabTriggerEmitState {
  name: string
  disabled: boolean
}

export const tabsProps = buildProps({
  value: String,
  tabPosition: {
    type: String as PropType<Side>,
  },
  onTabClick: eventProp<(state: TabTriggerEmitState) => void>(),
})
