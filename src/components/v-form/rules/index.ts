import { registerBuiltinRules } from './builtin'
export * from './types'
export * from './validate'
export { registerRule, setRuleMessages } from './configs'

registerBuiltinRules()
