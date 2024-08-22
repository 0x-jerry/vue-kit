import { ensureArray, isObject, type Arrayable } from '@0x-jerry/utils'

export function getValue(data: unknown, fields: Array<string | number>): unknown {
  if (fields.length < 1) return
  if (!isObject(data)) return

  const [key, ...restKeys] = fields

  if (restKeys.length) {
    return getValue(data[String(key)], restKeys)
  }

  return data[String(key)]
}

export function setValue(data: unknown, fields: Array<string | number>, value: unknown): boolean {
  if (fields.length < 1) return false
  if (!isObject(data)) return false

  const [key, ...restKeys] = fields

  if (restKeys.length) {
    data[String(key)] ??= {}

    const subData = data[String(key)]

    if (!isObject(subData)) return false

    return setValue(subData, restKeys, value)
  }

  data[String(key)] = value

  return true
}

export function calcFieldKey(arr: Arrayable<unknown>) {
  return ensureArray(arr).join('.')
}