import { type Promisable } from '@0x-jerry/utils'
import { type Ref, toRaw } from 'vue'

export interface TransactionContext<T> {
  /**
   *
   * @param name default is 'default'
   */
  snapshot(stage?: string): void

  /**
   *
   * @param name default is 'default'
   */
  rollback(stage?: string): void
}
export interface UseTransactionOption {
  /**
   * @default false
   */
  notRollbackWhenCatchError?: boolean
}

export function useTransaction<T>(
  value: Ref<T>,
  fn: (ctx: TransactionContext<T>) => Promisable<void>,
  option: UseTransactionOption = {},
): Promisable<void> {
  const _snapshots = new Map<string, T>()

  const ctx: TransactionContext<T> = {
    snapshot(stage = 'default') {
      const _value = structuredClone(toRaw(value.value))
      _snapshots.set(stage, _value)
    },
    rollback(stage = 'default') {
      const _value = _snapshots.get(stage)

      if (!_value) {
        console.warn('Not found stage: ', stage)
        return
      }

      value.value = structuredClone(_value)
    },
  }

  ctx.snapshot()

  try {
    const resp = fn(ctx)

    if (resp instanceof Promise) {
      return resp.catch((err) => {
        if (!option.notRollbackWhenCatchError) {
          ctx.rollback()
        }
        return Promise.reject(err)
      })
    }
  } catch (error) {
    if (!option.notRollbackWhenCatchError) {
      ctx.rollback()
    }

    throw error
  }
}
