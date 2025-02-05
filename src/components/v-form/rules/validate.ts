import { isEmpty, isFn } from '@0x-jerry/utils'
import type { IValidateContext, IRule, IRuleFunction } from './types'
import { ruleConfig } from './configs'
import { getErrorMessage } from './errorMsg'

const validate: IRuleFunction<IRule> = async (ctx) => {
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

export const validateRules = async (ctx: IValidateContext<IRule[]>) => {
  const { rule: rules, required, value, label } = ctx

  const errors: string[] = []

  const valueIsEmpty = isEmpty(value)

  if (valueIsEmpty) {
    if (required) {
      const msg = getErrorMessage(ctx, 'required')

      errors.push(msg)
    }

    return errors
  }

  for (const rule of rules) {
    const error = await validate({
      label,
      value,
      rule,
    })

    if (error) {
      errors.push(error)
    }
  }

  return errors
}
