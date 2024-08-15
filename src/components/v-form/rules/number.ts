import { isNumber } from '@0x-jerry/utils'
import type { IRuleFunction } from './types'
import { getErrorMessage } from './validateError'

export interface INumberRule {
  min?: number
  max?: number
}

export const validate: IRuleFunction<INumberRule> = (ctx) => {
  const { value, rule } = ctx

  if (!isNumber(value)) {
    return getErrorMessage(ctx, 'number')
  }

  if (rule.min && rule.max) {
    if (value >= rule.min && value <= rule.max) {
      return
    }

    return getErrorMessage(ctx, 'number.range')
  }

  if (rule.min) {
    if (value >= rule.min) {
      return
    }
    return getErrorMessage(ctx, 'number.min')
  }

  if (rule.max) {
    if (value <= rule.max) {
      return
    }

    return getErrorMessage(ctx, 'number.max')
  }
}
