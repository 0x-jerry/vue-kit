import { ensureArray, isFn, type Arrayable } from '@0x-jerry/utils'
import type { IFormEvalFunction, IFromActions } from './types'

export function calcFieldKey(arr: Arrayable<unknown>) {
  return ensureArray(arr).join('.')
}

export function interopWithContext<T>(item: IFormEvalFunction<T> | T, ctx: IFromActions) {
  return isFn(item) ? item(ctx) : item
}
