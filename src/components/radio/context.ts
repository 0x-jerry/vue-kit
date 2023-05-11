import { type InjectionKey } from 'vue'

export const RadioGroupContextKey = Symbol() as InjectionKey<RadioGroupContext>

export interface RadioGroupContext {
  readonly disabled: boolean
  readonly value: unknown
  change(value: unknown): void
}
