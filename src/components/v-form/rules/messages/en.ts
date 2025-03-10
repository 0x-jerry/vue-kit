import type { INumberRule } from '../builtin/number'
import type { IMessages } from './types'

export const messages: IMessages = {
  required: ({ label }) => `${label} must be filled`,
  number: 'Expect number',
  'number.min': ({ rule }) => `Expect number greater than ${(rule as INumberRule).min}`,
  'number.max': ({ rule }) => `Expect number less than ${(rule as INumberRule).max}`,
  'number.range': ({ rule }) =>
    `Expect number between ${(rule as INumberRule).min} and ${(rule as INumberRule).max}`,
  string: 'Expect string',
  'string.min': ({ rule }) => `Expect string length greater than ${(rule as INumberRule).min}`,
  'string.max': ({ rule }) => `Expect string length less than ${(rule as INumberRule).max}`,
  'string.range': ({ rule }) =>
    `Expect string length between ${(rule as INumberRule).min} and ${(rule as INumberRule).max}`,
  boolean: 'Expect boolean',
}
