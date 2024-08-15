import { defineContext } from 'src/hooks'
import type { InjectionKey } from 'vue'

export interface IFormContext {
  data: Record<string, unknown>
}

const key = Symbol() as InjectionKey<IFormContext>

export const useForm = defineContext(key)
