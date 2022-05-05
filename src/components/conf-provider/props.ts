import { buildProps, GetPropsType } from '@/utils'
import { PropType } from 'vue'
import { ToastConfig } from '../toast/config'

export type ConfProviderPropType = GetPropsType<typeof confProviderProps>

export const confProviderProps = buildProps({
  toast: {
    type: Object as PropType<ToastConfig>,
  },
})
