import { ref } from 'vue'

export type UseLoadingResult<T> = T & {
  isLoading: boolean
}

export function useLoading<Fn extends (...args: any) => any>(fn: Fn) {
  const executingCount = ref(0)

  const wrapperFn = async (...args: any) => {
    try {
      executingCount.value++

      const result = await fn(...args)
      return result
    } catch (error) {
      throw error
    } finally {
      executingCount.value--
    }
  }

  Object.defineProperty(wrapperFn, 'isLoading', {
    get() {
      return executingCount.value > 0
    },
  })

  return wrapperFn as UseLoadingResult<Fn>
}
