import type { Fn } from '@0x-jerry/utils'
import { ref } from 'vue'

export type UseLoadingResult<T> = T & {
  isLoading: boolean
}

export function useLoading<T extends Fn>(fn: T) {
  const executingCount = ref(0)

  const wrapperFn = async (...args: unknown[]) => {
    try {
      executingCount.value++

      const result = await fn(...args)
      return result
    } finally {
      executingCount.value--
    }
  }

  Object.defineProperty(wrapperFn, 'isLoading', {
    get() {
      return executingCount.value > 0
    },
  })

  return wrapperFn as UseLoadingResult<T>
}
