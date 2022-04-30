import { InjectionKey } from 'vue'

export const RadioGroupContextKey = Symbol() as InjectionKey<RadioGroupContext>

interface RadioGroupContext {
  readonly disabled: boolean
  readonly value: unknown
  change(value: unknown): void
}
