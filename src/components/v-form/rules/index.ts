import { registerBuiltinRules } from './builtin'
export * from './types'
export { validate } from './validate'
export { registerRule, setRuleMessages } from './configs'

registerBuiltinRules()
