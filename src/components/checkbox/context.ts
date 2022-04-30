import { InjectionKey } from 'vue'

export const CheckboxGroupContextKey = Symbol() as InjectionKey<CheckboxGroupContext>

interface CheckboxGroupContext {
  readonly disabled: boolean
  readonly value: unknown[]
  change(value: unknown, selected: boolean): void
}
