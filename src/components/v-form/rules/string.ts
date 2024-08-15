import { isString } from '@0x-jerry/utils'
import type { IRuleFunction } from './types'
import { getErrorMessage } from './validateError'

export interface IStringRule {
  min?: number
  max?: number
}

export const validate: IRuleFunction<IStringRule> = (ctx) => {
  const { rule, value } = ctx
  if (!isString(value)) {
    return getErrorMessage(ctx, 'string')
  }

  const length = value.length

  if (rule.min && rule.max) {
    if (length >= rule.min && length <= rule.max) {
      return
    }

    return getErrorMessage(ctx, 'string.range')
  }

  if (rule.min) {
    if (length >= rule.min) {
      return
    }
    return getErrorMessage(ctx, 'string.min')
  }

  if (rule.max) {
    if (length <= rule.max) {
      return
    }

    return getErrorMessage(ctx, 'string.max')
  }
}
