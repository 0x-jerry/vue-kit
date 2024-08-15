import { defineContext } from 'src/hooks'
import { reactive, ref, type InjectionKey } from 'vue'
import type { VFormFieldProps } from '../types'
import type { Arrayable } from '@0x-jerry/utils'
import type { IRule } from '../rules'

export interface IFormContext {
  data: Record<string, unknown>
}

export interface IFormInteralContext extends IFormContext {
  fileds: VFormFieldProps[]
  rules: IInteralRule[]
}

const key = Symbol() as InjectionKey<IFormInteralContext>

export const useForm = defineContext(key, createFormContext)

export function createFormContext(): IFormInteralContext {
  const ctx: IFormInteralContext = {
    data: reactive({}),
    fileds: [],
    rules: [],
  }

  return ctx
}

export interface IInteralRule {
  key: Arrayable<string | number>
  rules: Arrayable<IRule>
}
