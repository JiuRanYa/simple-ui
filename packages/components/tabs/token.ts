import type { TabsTriggerState } from '@simple-ui/components/tabs-trigger/props'
import type { TabTriggerEmitState } from '@simple-ui/components/tabs/props'
import type { InjectionKey } from 'vue'

export interface TabsContext {
  props: {
    value?: string
  }
  changeTab: (tabName: string, tabState: TabTriggerEmitState, shouldChangeTab: boolean) => void
  recordTriggerAttr: (key: string, value: TabsTriggerState) => void
}
export const tabsContextKey: InjectionKey<TabsContext> = Symbol('BlTabs')
