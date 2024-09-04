import { registerRule } from '../configs'
import { validate as boolean } from './boolean'
import { validate as number } from './number'
import { validate as string } from './string'

export function registerBuiltinRules() {
  registerRule('boolean', boolean)
  registerRule('number', number)
  registerRule('string', string)
}
