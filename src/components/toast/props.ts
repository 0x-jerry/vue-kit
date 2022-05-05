import { buildProps, GetPropsType } from '@/utils'
import { PropType } from 'vue'

export type ToastPropType = GetPropsType<typeof toastProps>

export const toastProps = buildProps({
  position: {
    type: String as PropType<'left' | 'right'>,
  },
  duration: {
    type: Number,
  },
})
