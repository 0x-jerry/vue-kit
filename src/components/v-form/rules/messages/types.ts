import type { IValidateContext } from '../types'

export type IMessageFunction = (ctx: IValidateContext) => string

export type IMessages = Record<string, string | IMessageFunction>
