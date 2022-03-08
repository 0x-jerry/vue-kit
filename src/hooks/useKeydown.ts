import { createKeyboardHandler } from '@0x-jerry/utils'

export const onGlobalKeydown = createKeyboardHandler((listener) => {
  window.addEventListener('keydown', (ev) => listener(ev))
})

export function useGlobalKeydown(key: string, listener: (e: KeyboardEvent) => any) {
  let cancel: null | (() => void)

  onMounted(() => {
    cancel = onGlobalKeydown(key, listener)
  })

  onUnmounted(() => {
    cancel?.()
  })
}
