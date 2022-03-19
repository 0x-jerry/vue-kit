import { buildProps, GetPropsType } from '@/utils'
import type { Awaitable } from '@0x-jerry/utils'
import { ComponentInternalInstance, ObjectDirective, PropType } from 'vue'
import { useProps } from './useProps'

export const useClickProps = buildProps({
  loading: {
    type: Boolean,
    default: false,
  },
  click: {
    type: Function as PropType<() => Awaitable<any>>,
    required: false,
  },
})

export type UseClickPropsType = GetPropsType<typeof useClickProps>

export function useClick() {
  const loading = ref(false)

  const props = useProps<UseClickPropsType>()

  const wrapper = async () => {
    loading.value = true
    try {
      await props?.click?.()
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    get processing() {
      return unref(loading) || props?.loading
    },
    handler: wrapper,
  }
}
