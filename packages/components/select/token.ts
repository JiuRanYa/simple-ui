import type { InjectionKey } from 'vue'
import type { SelectStates } from './useSelect'

export interface SelectContext {
  props: {
    value?: string | number | unknown | unknown[] | any[]
  }
  states: SelectStates
}
export const selectKey: InjectionKey<SelectContext> = Symbol('BlSelect')
