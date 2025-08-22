import type { Arrayable } from '@0x-jerry/utils'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ComponentProps } from 'vue-component-type-helpers'
import type { VueComponent } from '../../types'
import type { IToValue } from '../../utils'
import type { VLayoutProps } from '../v-layout'

export interface FormComponentMapSetting {
  __internal: VueComponent
}

export interface IFormOptions {
  /**
   * Default data
   */
  data?: Record<string, unknown>
  layout?: VLayoutProps
  fields?: IToValue<IFormFieldConfig[]>

  /**
   * @default 'change'
   */
  triggerValidateOn?: 'blur' | 'change'
  class?: unknown
}

export type IFormFieldPath = Arrayable<PropertyKey>

export type IFormFieldConfig = ICommonFormFieldConfig & MapComponent<FormComponentMapSetting>

type MapComponent<T extends {}, Key extends keyof T = keyof T> = Key extends Key
  ? {
      component: Key
      componentProps?: ComponentProps<T[Key]>
    }
  : never

export interface ICommonFormFieldConfig {
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
   * Whether this field is required
   */
  required?: boolean

  /**
   * Field validate rules
   */
  schema?: StandardSchemaV1

  slot?: string

  class?: unknown
  style?: unknown
}

export type IFormEvalFunction<T = unknown> = (ctx: IFromActions) => T

export interface IFromItemProps {
  fieldError?: IFieldValidateResult
  fieldConfig: IFormFieldConfig
}

export interface IFromItemRenderProps<T = unknown> {
  modelValue: T
  'onUpdate:modelValue': (val: T) => void
  validateStatus?: string
  onBlur?: () => Promise<IFieldValidateResult[]>
  onChange?: () => Promise<IFieldValidateResult[]>
  onInput?: () => Promise<IFieldValidateResult[]>
}

// ---------

export interface IFieldSchema {
  field: IFormFieldPath
  schema: StandardSchemaV1
}

export interface IFieldValidateResult {
  field: IFormFieldPath
  issues?: string[]
}

export interface IGetErrors {
  (field?: IFormFieldPath): IFieldValidateResult | undefined
  (): IFieldValidateResult[]
}

export interface IGetData {
  (field: IFormFieldPath): unknown
  (): Record<string, unknown>
}

export interface IFromActions {
  /**
   * This will throw errors when validate failed.
   *
   * @param field
   * @returns
   */
  validate: <T>(field?: IFormFieldPath) => Promise<T>
  getValidateResult: (field?: IFormFieldPath) => Promise<IFieldValidateResult[]>
  clearValidate: () => void
  update: (data?: Record<string, unknown>) => void
  updateField: (field: IFormFieldPath, value?: unknown) => void
  getData: IGetData
  getErrors: IGetErrors
}
