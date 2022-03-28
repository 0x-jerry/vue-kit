/**
 *
 * @param str
 * @example
 *
 * ```ts
 * parseStyleProperty(12) // => 12px
 * parseStyleProperty('1rem') // => 1rem
 * ```
 *
 *
 */
export const parseStyleProperty = (str: string | number) =>
  typeof str === 'string' ? str : str + 'px'
