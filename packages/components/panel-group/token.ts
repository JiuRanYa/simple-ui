import type { CSSProperties, InjectionKey, Ref } from 'vue'
import type { PanelData } from '../panel/types'
import type { DragStates, PanelGroupStates } from './types'
import type { PanelGroupProps } from './props'

export interface PanelGroupContext {
  groupId: string
  groupProps: PanelGroupProps
  states: PanelGroupStates
  dragStates: Ref<DragStates>
  registerPanel: (panelData: Ref<PanelData>) => void
  getPanelStyle: (panelData: Ref<PanelData>) => CSSProperties
  startDragging: (event: MouseEvent, resizeHandleId: string) => void
  stopDragging: (event: MouseEvent, resizeHandleId: string) => void
  registerResizeHandler: (resizeHandleId: string) => (event: MouseEvent) => void
  reset: () => void
}
export const panelGroupKey: InjectionKey<PanelGroupContext> = Symbol('BlPanelGroup')
