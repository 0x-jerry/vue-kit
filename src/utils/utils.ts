import { is } from '@0x-jerry/utils'

/**
 *
 * @param val
 * @example
 *
 * ```ts
 * parseStyleProperty(12) // => 12px
 * parseStyleProperty('1rem') // => 1rem
 * ```
 *
 *
 */
export const parseStyleProperty = (val: string | number, unit = 'px') =>
  is.string(val) ? val : val + unit
