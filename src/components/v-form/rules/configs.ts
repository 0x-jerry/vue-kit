import { en, type IMessages } from './messages'
import type { IRuleFunction } from './types'

export const ruleConfig = {
  messages: en,
  rules: {} as Record<string, IRuleFunction>,
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function registerRule(type: string, rule: IRuleFunction<any>) {
  const rules = ruleConfig.rules
  if (type in rules) {
    console.warn(`Rule type ${type} has registered, ${type} rule will replaced!`)
  }

  rules[type] = rule
}

export function setRuleMessages(messages: IMessages) {
  ruleConfig.messages = messages
}
