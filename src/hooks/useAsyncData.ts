import type { Fn } from '@0x-jerry/utils'
import { computed, ref, type Ref, type UnwrapRef } from 'vue'

type Result<T> = T extends Promise<infer U> ? U : T

interface UseAsyncDataResult<T extends Fn, R> {
  load(...params: Parameters<T>): Promise<void>
  data: Ref<R>
  isLoading: Ref<boolean>
}

export function useAsyncData<T extends Fn>(
  fn: T,
): UseAsyncDataResult<T, null | Result<ReturnType<T>>>
export function useAsyncData<T extends Fn>(
  fn: T,
  defaultValue: Result<ReturnType<T>>,
): UseAsyncDataResult<T, Result<ReturnType<T>>>
export function useAsyncData<T extends Fn>(
  fn: T,
  defaultValue?: Result<ReturnType<T>>,
): UseAsyncDataResult<T, unknown> {
  type Params = Parameters<T>

  const data = ref(defaultValue)

  const requestCount = ref(0)

  let latestReqId = 0

  async function load(...args: Params) {
    requestCount.value++

    try {
      const currentReqId = ++latestReqId
      const res = await fn(...args)

      if (currentReqId === latestReqId) {
        data.value = (res || structuredClone(defaultValue)) as UnwrapRef<Result<ReturnType<T>>>
      }
    } finally {
      requestCount.value--
    }
  }

  return {
    load,
    data,
    isLoading: computed(() => requestCount.value > 0),
  }
}
