import { isFn } from '@0x-jerry/utils'
import type { IValidateContext, IRule, IRuleFunction } from './types'
import { ruleConfig } from './configs'

export const validate: IRuleFunction<IRule> = async (ctx) => {
  const { rule } = ctx

  if (isFn(rule)) {
    return _validate(rule, ctx)
  }

  const validator = ruleConfig.rules[rule.type]

  if (!validator) {
    throw new Error(`Can not find validator for ${rule.type}`)
  }

  const errorMsg = await _validate(validator, ctx)

  if (errorMsg) {
    return rule.message || errorMsg
  }
}

async function _validate(validator: IRuleFunction, ctx: IValidateContext) {
  let errorMsg: string | undefined

  try {
    const err = await validator(ctx)
    if (err) {
      errorMsg = err
    }
  } catch (error) {
    errorMsg = error instanceof Error ? error.message : String(error)
  }

  return errorMsg
}
