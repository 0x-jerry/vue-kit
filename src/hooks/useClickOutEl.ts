import { isContainEl } from '@/utils'
import { Arrayable, toArray } from '@0x-jerry/utils'
import { Ref } from 'vue'

export function useClickOutEl(
  els: Arrayable<Ref<HTMLElement | null | undefined>>,
  listener: EventListener,
) {
  useEventListener('click', (ev) => {
    const elements = toArray(els).filter((n) => !!unref(n))
    if (!elements.length) return
    if (!ev.target) return

    const isContain = elements.some((el) => isContainEl(ev.target as any, el.value!))

    if (!isContain) {
      listener(ev)
    }
  })
}
