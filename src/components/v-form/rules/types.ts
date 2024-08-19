import type { Awaitable } from '@0x-jerry/utils'
import type { Merge } from 'type-fest'
import type { INumberRule } from './number'
import type { IStringRule } from './string'
import type { IBooleanRule } from './boolean'

/**
 * Used to extends the builtin rules
 */
export interface IExtendRule {
  number: INumberRule
  string: IStringRule
  boolean: IBooleanRule
}

export type IRule = ExtendRules<IExtendRule> | IRuleFunction

export type IRuleFunction<Rule = unknown> = (
  ctx: IValidateContext<Rule>,
) => Awaitable<string | void>

export interface IValidateContext<Rule = unknown> {
  label?: string
  value: unknown
  rule: Rule
}

interface IRuleCommonProps<T> {
  type: T
  message?: string
}

type ExtendRules<T extends {}, U extends keyof T = keyof T> = U extends U
  ? // biome-ignore lint/complexity/noBannedTypes: <explanation>
    T[U] extends {}
    ? Merge<IRuleCommonProps<U>, T[U]>
    : never
  : never
