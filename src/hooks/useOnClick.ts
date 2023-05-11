import { buildProps } from '@/utils'
import type { Promisable } from '@0x-jerry/utils'
import { useProps } from './useProps'
import type { ExtractPropTypes } from 'vue'

export const useClickProps = buildProps({
  loading: {
    type: Boolean,
    default: false,
  },
  onClick: {
    type: Function as PropType<(payload: MouseEvent) => Promisable<any>>,
    required: false,
  },
})

export type UseClickPropsType = ExtractPropTypes<typeof useClickProps>

export function useOnClick() {
  const _isProcessing = ref(false)

  const props = useProps<UseClickPropsType>()

  const wrapper = async (payload: MouseEvent) => {
    _isProcessing.value = true

    try {
      await props?.onClick?.(payload)
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
