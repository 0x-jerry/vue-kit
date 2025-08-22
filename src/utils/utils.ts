import { isObject } from '@0x-jerry/utils'

export function getValue(data: unknown, fieldPath: Array<PropertyKey>): unknown {
  if (fieldPath.length < 1) return
  if (!isObject(data)) return

  const [key, ...restKeys] = fieldPath

  if (restKeys.length) {
    return getValue(data[String(key)], restKeys)
  }

  return data[String(key)]
}

export function setValue(data: unknown, fieldPath: Array<PropertyKey>, value: unknown): boolean {
  if (fieldPath.length < 1) return false
  if (!isObject(data)) return false

  const [key, ...restKeys] = fieldPath

  if (restKeys.length) {
    data[String(key)] ??= {}

    const subData = data[String(key)]

    if (!isObject(subData)) return false

    return setValue(subData, restKeys, value)
  }

  data[String(key)] = value

  return true
}
