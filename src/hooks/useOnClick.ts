import { buildProps, GetPropsType } from '@/utils'
import type { Awaitable } from '@0x-jerry/utils'
import { PropType } from 'vue'
import { useProps } from './useProps'

export const useClickProps = buildProps({
  loading: {
    type: Boolean,
    default: false,
  },
  click: {
    type: Function as PropType<(payload: MouseEvent) => Awaitable<any>>,
    required: false,
  },
})

export type UseClickPropsType = GetPropsType<typeof useClickProps>

export function useOnClick() {
  const _isProcessing = ref(false)

  const props = useProps<UseClickPropsType>()

  const wrapper = async (payload: MouseEvent) => {
    _isProcessing.value = true

    try {
      await props?.click?.(payload)
    } catch (error) {
      throw error
    } finally {
      _isProcessing.value = false
    }
  }

  return {
    get isProcessing() {
      return unref(_isProcessing) || props?.loading
    },
    handler: wrapper,
  }
}
