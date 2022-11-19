import { createKeyboardEventHandler } from '@/functions'
import { Fn } from '@vueuse/core'

export function useGlobalKeydown(key: string, listener: (e: KeyboardEvent) => any): Fn {
  return useEventListener('keydown', (e) => createKeyboardEventHandler(key, () => listener(e))(e))
}
