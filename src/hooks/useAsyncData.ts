import { type Fn } from '@0x-jerry/utils'
import { cloneDeep } from 'lodash-es'
import { ref, type Ref } from 'vue'

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
): UseAsyncDataResult<T, any> {
  type Params = Parameters<T>

  const data = ref(defaultValue)

  const loading = ref(false)

  let latestReqId = 0

  async function load(...args: Params) {
    loading.value = true

    try {
      const currentReqId = ++latestReqId
      const res = await fn(...args)

      if (currentReqId === latestReqId) {
        data.value = res || cloneDeep(defaultValue)
      }
    } finally {
      loading.value = false
    }
  }

  return {
    load,
    data,
    isLoading: loading,
  }
}
