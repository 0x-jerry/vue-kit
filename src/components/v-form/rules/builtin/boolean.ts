import { isBoolean } from '@0x-jerry/utils'
import type { IRuleFunction } from '../types'
import { getErrorMessage } from '../validateError'

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface IBooleanRule {}

export const validate: IRuleFunction<IBooleanRule> = (ctx) => {
  if (!isBoolean(ctx.value)) {
    return getErrorMessage(ctx, 'boolean')
  }
}
