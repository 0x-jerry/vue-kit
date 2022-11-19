import { Fn } from '@0x-jerry/utils'
import { shallowRef } from 'vue'

type Result<T> = T extends Promise<infer U> ? U : T

interface UseAsyncDataResult<T extends Fn> {
  load(...params: Parameters<T>): Promise<void>
  readonly loading: boolean
  readonly value?: Result<ReturnType<T>>
}

export function useAsyncData<T extends Fn>(fn: T): UseAsyncDataResult<T>
export function useAsyncData<T extends Fn>(
  fn: T,
  defaultValue: Result<ReturnType<T>>
): Required<UseAsyncDataResult<T>>
export function useAsyncData<T extends Fn>(
  fn: T,
  defaultValue?: Result<ReturnType<T>>
): UseAsyncDataResult<T> {
  type Params = Parameters<T>

  const data = shallowRef(defaultValue)

  const loading = shallowRef(false)

  async function load(...args: Params) {
    loading.value = true

    try {
      const res = await fn.call(null, ...args)

      data.value = res
    } finally {
      loading.value = false
    }
  }

  return {
    load,
    get value() {
      return data.value as any
    },
    get loading() {
      return loading.value
    },
  }
}
