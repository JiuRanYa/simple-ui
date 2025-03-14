import type dayjs from 'dayjs'
import type { CSSProperties, PropType, Ref } from 'vue'

export const booleanProps = {
  type: Boolean,
  default: null,
}
export const booleanNumberProp = {
  type: [Boolean, Number],
  default: null,
}
export const valueProp = {
  type: [String, Number, Boolean],
  default: null,
}
export const booleanStringProps = {
  type: [Boolean, String],
  default: null,
}
export function eventProp<F extends AnyFunction = VoidFunction>() {
  return eventTypes as PropType<MaybeArray<F>>
}

export const eventTypes = [Function, Array]

export type EnsureValue<T> = Exclude<T, undefined | null>

export type MaybeRef<T> = T | Ref<T>
export type MaybeArray<T> = T | T[]
export type MaybeElement = HTMLElement | SVGElement | undefined | null
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>

export type AnyFunction = (...args: any[]) => any

export type Expand<T> = T extends unknown ? { [K in keyof T]: T[K] } : never

export type Side = 'top' | 'left' | 'right' | 'bottom'

export type ComponentSize = 'small' | 'middle' | 'large'

export type StyleType = string | CSSProperties | Array<string | CSSProperties>

export type Alignment = 'start' | 'end'

export type AlignedPlacement = `${Side}-${Alignment}`

export type Placement = Side | AlignedPlacement

export type Dateable = number | string | Date | dayjs.Dayjs

export type Mutable<T> = { -readonly [P in keyof T]: T[P] }

export function createIconProp(defaultValue: Record<any, any> | AnyFunction | null = null) {
  return {
    isFunc: true,
    default: defaultValue,
  }
}

export type EditType = 'auto' | 'edit' | 'show'
