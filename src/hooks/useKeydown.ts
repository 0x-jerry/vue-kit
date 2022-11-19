import { createKeyboardEventHandler } from '@/functions'

export function useGlobalKeydown(key: string, listener: (e: KeyboardEvent) => any) {
  return useEventListener('keydown', (e) => createKeyboardEventHandler(key, () => listener(e))(e))
}
