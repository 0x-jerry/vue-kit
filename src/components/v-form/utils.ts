import { type Arrayable, ensureArray, isFn } from '@0x-jerry/utils'
import type { IFormEvalFunction, IFromActions } from './types'

export function isShallowEqual(arr1: Arrayable<unknown>, arr2: Arrayable<unknown>) {
  if (Array.isArray(arr1) && Array.isArray(arr2)) {
    if (arr1.length !== arr2.length) {
      return false
    }

    return arr1.every((v1, i) => v1 === arr2[i])
  } else {
    return arr1 === arr2
  }
}

export function calcFieldKey(keys: Arrayable<PropertyKey>) {
  return ensureArray(keys).join('.')
}

export function interopWithContext<T>(item: IFormEvalFunction<T> | T, ctx: IFromActions) {
  return isFn(item) ? item(ctx) : item
}
