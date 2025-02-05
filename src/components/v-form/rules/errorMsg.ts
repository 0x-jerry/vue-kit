import { isString } from '@0x-jerry/utils'
import { ruleConfig } from './configs'
import type { IValidateContext } from './types'

export function getErrorMessage(ctx: IValidateContext, msgKey: string, fallbackMsg?: string) {
  const msg = ruleConfig.messages[msgKey]

  const builtinMsg = msg ? (isString(msg) ? msg : msg(ctx)) : null

  return builtinMsg || fallbackMsg || `Can not find error message for: ${msgKey}`
}
