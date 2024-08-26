import type { Arrayable } from '@0x-jerry/utils'
import type { VLayoutProps } from '../v-layout'
import type { IRule } from './rules'
import type { Component } from 'vue'

export interface IFormConfig {
  /**
   * Default data
   */
  data?: Record<string, unknown>
  layout?: VLayoutProps
  rules?: Record<string, Arrayable<IRule>>
}

export type IFormFieldPath = Arrayable<string | number>

export interface IFormFieldConfig {
  field: IFormFieldPath
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

// ---------

export interface IFieldRuleError {
  field: IFormFieldPath
  errors: string[]
}

export interface IGetErrors {
  (field: IFormFieldPath): IFieldRuleError | undefined
  (): IFieldRuleError[]
}

export interface IGetData {
  (field: IFormFieldPath): unknown
  (): Record<string, unknown>
}

export interface IFromActions {
  validate: (field?: IFormFieldPath) => Promise<IFieldRuleError[]>
  clearValidate: () => void
  update: (data?: Record<string, unknown>) => void
  updateField: (field: IFormFieldPath, value?: unknown) => void
  getData: IGetData
  getErrors: IGetErrors
}
