import { InjectionKey, Ref } from 'vue'

export const SelectContextKey = Symbol() as InjectionKey<SelectContext>

export interface SelectContext {
  readonly disabled: boolean
  readonly value: unknown
  addOption(value: unknown, label: string): void
  removeOption(value: unknown): void
  change(value: unknown): void
}
