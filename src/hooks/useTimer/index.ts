import { sleep, SleepResult } from '@0x-jerry/utils'
import { onMounted, onUnmounted } from 'vue'

export interface UseTimerOption {
  repeat?: boolean
  immediate?: boolean
  omitError?: boolean
}

export function useTimer(fn: () => any, timeout: number, opt: UseTimerOption = {}) {
  let handler: SleepResult | null = null
  let isPending = false

  const start = async () => {
    if (isPending) return

    isPending = true

    handler = sleep(timeout)
    await handler

    try {
      await fn()
    } catch (error) {
      if (!opt.omitError) {
        throw error
      }
      //  else omit this error
    } finally {
      isPending = false
    }

    if (opt.repeat) {
      start()
    }
  }

  const cancel = () => {
    isPending = false
    handler?.cancel()
    handler = null
  }

  if (opt.immediate) {
    onMounted(start)
  }

  onUnmounted(cancel)

  return {
    start,
    cancel,
  }
}

export const useRepeatTimer = (
  fn: () => any,
  timeout: number,
  opt?: Omit<UseTimerOption, 'repeat'>
) => {
  const option = Object.assign(
    {
      repeat: true,
      immediate: true,
    },
    opt
  )

  return useTimer(fn, timeout, option)
}
