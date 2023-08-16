import { defineContext } from '@/hooks/defineContext'
import { type InjectionKey } from 'vue'

const RadioGroupContextKey = Symbol() as InjectionKey<RadioGroupContext>

export interface RadioGroupContext {
  readonly disabled: boolean
  readonly value: unknown
  change(value: unknown): void
}

export const useRadioGroupContext = defineContext(RadioGroupContextKey)