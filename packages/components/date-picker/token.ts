import type { DatePickerDynamicConfig, DatePickerDynamicType, Meta, datePickerProps } from '@simple-ui/components/date-picker/props'
import type { Dateable } from '@simple-ui/common/types'
import type { ComputedRef, ExtractPropTypes, InjectionKey, Ref, UnwrapNestedRefs } from 'vue'

export interface DatePickerContext {
  currentValue: ComputedRef<string | string[]>
  isRange: ComputedRef<boolean>
  startMeta: Meta
  endMeta: Meta
  props: ExtractPropTypes<typeof datePickerProps>
  dynamicType: Ref<DatePickerDynamicType>
  dynamicConfig: UnwrapNestedRefs<DatePickerDynamicConfig>
  disabledDate: Ref<Dateable[]>
  handlePickDate: (dateStr: string) => void
  isDisabledDate: (dateStr: string) => boolean
  getValueFormat: () => string
  getDisabledDate: () => Dateable[]
}

export const DATE_PICKER_INJECTION_KEY: InjectionKey<DatePickerContext> = Symbol('date-picker')
