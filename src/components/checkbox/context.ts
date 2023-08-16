import { defineContext } from '@/hooks/defineContext'
import { type InjectionKey } from 'vue'

const CheckboxGroupContextKey = Symbol() as InjectionKey<CheckboxGroupContext>

export interface CheckboxGroupContext {
  readonly disabled: boolean
  readonly value: unknown[]
  change(value: unknown, selected: boolean): void
}

export const useCheckboxGroupContext = defineContext(CheckboxGroupContextKey)