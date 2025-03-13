import { booleanProps, buildProps } from '@simple-ui/common'

export const tabsTriggerProps = buildProps({
  value: String,
  disabled: booleanProps,
})

export interface TabsTriggerState {
  el: HTMLDivElement
}
