import type { Arrayable } from '@0x-jerry/utils'
import type { VLayoutProps } from '../v-layout'
import type { IRule } from './rules'
import type { Component } from 'vue'
import type { IToValue } from '../../utils'

export interface IFormOptions {
  /**
   * Default data
   */
  data?: Record<string, unknown>
  layout?: VLayoutProps
  rules?: Record<string, Arrayable<IRule>>
  fields?: IToValue<IFormFieldConfig[]>

  /**
   * @default 'change'
   */
  triggerValidateOn?: 'blur' | 'change'
  class?: unknown
}

export type IFormFieldPath = Arrayable<string | number>

export interface IFormFieldConfig {
  /**
   * Field path, should be unique
   */
  field: IFormFieldPath

  /**
   * Field label
   */
  label?: string

  /**
   * This will not trigger validate if false
   */
  if?: boolean | IFormEvalFunction<boolean>

  /**
   * This will trigger validate no matter what value this is
   */
  show?: boolean | IFormEvalFunction<boolean>

  /**
   * Field validate rules
   */
  rules?: Arrayable<IRule>

  slot?: string
  compoennt?: string | Component
  componentProps?: Record<string, unknown>

  class?: unknown
  style?: unknown
}

export type IFormEvalFunction<T = unknown> = (ctx: IFromActions) => T

// ---------

export interface IFieldRuleError {
  field: IFormFieldPath
  errors: string[]
}

export interface IFieldRuleCollection {
  field: IFormFieldPath
  rules: IRule[]
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
