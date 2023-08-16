import { defineContext } from '@/hooks/defineContext'
import { type InjectionKey } from 'vue'

const SelectContextKey = Symbol() as InjectionKey<SelectContext>

export interface SelectContext<V = unknown> {
  readonly disabled: boolean
  readonly value: V
  readonly selected: {
    value: V
    label: string
  }
  addOption(value: V, label: string): void
  removeOption(value: V): void
  change(value: V): void
}

export const useSelectContext = defineContext(SelectContextKey)