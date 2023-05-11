import { buildProps } from '@/utils'
import { type PropType, type ExtractPropTypes } from 'vue'
import { type ToastConfig } from '../toast/config'

export type ConfProviderPropType = ExtractPropTypes<typeof confProviderProps>

export const confProviderProps = buildProps({
  toast: {
    type: Object as PropType<ToastConfig>,
  },
})
