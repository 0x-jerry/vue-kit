import type { IFormFieldValidateContext } from '../types'

export type IMessageFunction = (ctx: IFormFieldValidateContext) => string

export type IMessages = Record<string, string | IMessageFunction>
