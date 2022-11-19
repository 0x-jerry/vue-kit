import { keyMap } from './keyMap'

export interface KeyOption {
  key: string
  meta?: boolean
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
}

export const specialKeys = ['meta', 'ctrl', 'alt', 'shift'] as const

export type SpecialKey = typeof specialKeys[number]

export const isSpecialKey = (key: string): key is SpecialKey =>
  specialKeys.includes(key as SpecialKey)

const comboSymbol = '+'

const isInvalidKey = /\s/

/**
 * Support format:
 * ```
 * meta+a
 * shift + b
 * a
 * f1
 * ```
 * @param keyStr
 * @returns
 */
export function parseKeyOption(keyStr: string): KeyOption {
  const opt: KeyOption = {
    key: '',
  }

  keyStr
    .split(comboSymbol)
    .filter((n) => !!n.trim())
    .forEach((n) => {
      const s = n.trim()
      const key = keyMap[s] || s

      if (isSpecialKey(key)) opt[key] = true
      else opt.key = key
    })

  if (isInvalidKey.test(opt.key)) {
    throw new Error(`Parse \`${keyStr}\` failed! Please check key string.`)
  }

  return opt
}
