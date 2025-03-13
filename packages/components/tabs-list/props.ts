import type { Side } from '@simple-ui/common'
import { booleanProps, buildProps } from '@simple-ui/common'
import type { PropType } from 'vue'

export const tabsListProps = buildProps({
  customStyle: booleanProps,
  tabPosition: {
    type: String as PropType<Side>,
  },
})
