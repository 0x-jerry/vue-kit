import type { Arrayable } from '@0x-jerry/utils'
import type { VLayoutProps } from '../v-layout'
import type { IRule } from './rules'
import type { IFromActions } from './hooks/useForm'

export interface VFormProps<LayoutConfig = VLayoutProps> {
  /**
   * Default data
   */
  data?: Record<string, unknown>
  layout?: LayoutConfig
  rules?: Record<string, Arrayable<IRule>>
  fields?: VFormFieldProps[]
}

export interface VFormFieldProps {
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

  /**
   * If this is a string, treat it as a slot, otherwise treat it as a component
   */
  render?: string | IFormEvalFunction

  rules?: Arrayable<IRule>
}

export type IFormEvalFunction<T = unknown> = (ctx: IFromActions) => T
