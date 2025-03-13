import type { Choice, Operator, RuleData, RuleDataVal, RuleOption } from '@simple-ui/components/filter'
import { Category, InputType, LogicalOperator } from '@simple-ui/components/filter'

export { InputType, Category, LogicalOperator }
export type { Operator, Choice, RuleData, RuleDataVal, RuleOption }

export interface FilterGroupItem {
  ruleData: RuleData | null
  readonly?: boolean
}
