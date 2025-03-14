import type { PropType } from 'vue'
import { booleanProps, buildProps } from '@simple-ui/common'

export interface ContextMenuParam {
  x: number
  y: number
}
export const contextMenuProps = buildProps({
  active: booleanProps,
  transitionName: String,
  onShow: Function as PropType<(params: ContextMenuParam) => void>,
  onClose: Function as PropType<(params: ContextMenuParam) => void>,
})
