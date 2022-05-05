import { useConfProvider } from '../conf-provider/context'

export interface ToastConfig {
  position?: 'left' | 'right'
  duration?: number
}

export function useToastConfig(): Required<ToastConfig> {
  const conf = useConfProvider()?.toast

  return {
    position: conf?.position ?? 'right',
    duration: conf?.duration ?? 2000,
  }
}
