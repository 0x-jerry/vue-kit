import { useConfProvider } from '../conf-provider/context'
import { type ToastPropType } from './props'

export interface ToastConfig extends ToastPropType {}

export function useToastConfig(config?: Partial<ToastConfig>): Readonly<Required<ToastConfig>> {
  const conf = useConfProvider()?.toast

  return {
    get position() {
      return getOption('position', 'right')
    },
    get duration() {
      return getOption('duration', 2000)
    },
  }

  function getOption<K extends keyof ToastConfig>(
    key: K,
    defaultValue: NonNullable<ToastConfig[K]>,
  ) {
    return config?.[key] ?? conf?.[key] ?? defaultValue
  }
}
