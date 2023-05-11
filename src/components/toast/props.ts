import { buildProps } from '@/utils'
import type { ExtractPropTypes, PropType } from 'vue'

export type ToastPropType = ExtractPropTypes<typeof toastProps>

export const toastProps = buildProps({
  position: {
    type: String as PropType<'left' | 'right'>,
  },
  duration: {
    type: Number,
  },
})
