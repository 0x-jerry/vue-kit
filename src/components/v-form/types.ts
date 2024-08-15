import type { Arrayable } from '@0x-jerry/utils'
import type { VLayoutProps } from '../v-layout'
import type { IRule } from './rules'
import type { IFormContext } from './hooks/useForm'

export interface VFormProps<LayoutConfig = VLayoutProps> {
  /**
   * Default data
   */
  data: unknown
  layout?: LayoutConfig
  rules?: Record<string, Arrayable<IRule>>
}

export interface IFromConfig extends VFormFieldProps {
  fileds: VFormFieldProps[]
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

type IFormEvalFunction<T = unknown> = (ctx: IFormContext) => T
