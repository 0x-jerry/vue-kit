import { isString } from '@0x-jerry/utils'
import { ruleConfig } from './configs'
import type { IValidateContext } from './types'

export function getErrorMessage(ctx: IValidateContext, msgKey: string, message?: string) {
  if (message) {
    return message
  }

  const msg = ruleConfig.messages[msgKey]

  return msg ? (isString(msg) ? msg : msg(ctx)) : `Can not find error message for: ${msgKey}`
}
