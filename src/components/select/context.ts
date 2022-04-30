import { InjectionKey } from 'vue'

export const SelectContextKey = Symbol() as InjectionKey<SelectContext>

export interface SelectContext {
  readonly disabled: boolean
  readonly value: unknown
  change(value: unknown): void
}
