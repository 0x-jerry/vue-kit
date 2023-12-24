import { ref } from 'vue'

export type UseLoadingResult<T> = T & {
  isLoading: boolean
}

export function useLoading<Fn extends (...args: any) => any>(fn: Fn) {
  const isLoading = ref(false)

  const wrapperFn = async (...args: any) => {
    try {
      isLoading.value = true

      const result = await fn(...args)
      return result
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  Object.defineProperty(wrapperFn, 'isLoading', {
    get() {
      return isLoading.value
    },
  })

  return wrapperFn as UseLoadingResult<Fn>
}
