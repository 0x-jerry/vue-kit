import { en } from './messages'
import { validate as boolean } from './boolean'
import { validate as number } from './number'
import { validate as string } from './string'
import type { IRuleFunction } from './types'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const builtinRules: Record<string, IRuleFunction<any>> = {
  boolean,
  number,
  string,
}

export const ruleConfig = {
  messages: en,
  builtinRules,
}
