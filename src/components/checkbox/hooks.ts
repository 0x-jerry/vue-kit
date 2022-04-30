import { InjectionKey } from 'vue'

export const CheckboxGroupContextKey = Symbol() as InjectionKey<RadioGroupContext>

interface RadioGroupContext {
  readonly disabled: boolean
  readonly value: unknown[]
  change(value: unknown, selected: boolean): void
}
