import type { Fn } from '@0x-jerry/utils'
import { ref, type UnwrapRef } from 'vue'

type Result<T> = T extends Promise<infer U> ? U : T

interface UseAsyncDataResult<T extends Fn, R> {
  load(...params: Parameters<T>): Promise<void>
  update(newData: R): void
  data: R
  isLoading: boolean
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

  let latestUpdateId = 0

  return {
    load,
    update,
    get data() {
      return data.value
    },
    get isLoading() {
      return requestCount.value > 0
    },
  }

  async function load(...args: Params) {
    requestCount.value++

    try {
      const currentReqId = ++latestUpdateId
      const res = await fn(...args)

      if (currentReqId === latestUpdateId) {
        data.value = (res || structuredClone(defaultValue)) as UnwrapRef<Result<ReturnType<T>>>
      }
    } finally {
      requestCount.value--
    }
  }

  function update(newData: Result<ReturnType<T>>) {
    ++latestUpdateId

    data.value = newData
  }
}
