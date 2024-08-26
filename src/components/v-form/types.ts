import type { Arrayable } from '@0x-jerry/utils'
import type { VLayoutProps } from '../v-layout'
import type { IRule } from './rules'
import type { IFromActions } from './hooks/useForm'
import type { Component } from 'vue'

export interface VFormProps<LayoutConfig = VLayoutProps> {
  /**
   * Default data
   */
  data?: Record<string, unknown>
  layout?: LayoutConfig
  rules?: Record<string, Arrayable<IRule>>
}

export interface IFormFieldConfig {
  field: Arrayable<string | number>
  label?: string
  /**
   * This will not trigger validate if false
   */
  if?: boolean | IFormEvalFunction<boolean>

  /**
   * This will trigger validate no matter what value this is
   */
  show?: boolean | IFormEvalFunction<boolean>

  rules?: Arrayable<IRule>

  slot?: string
  compoennt?: string | Component
  componentProps?: Record<string, unknown>
}

export type IFormEvalFunction<T = unknown> = (ctx: IFromActions) => T
