import { onMounted, onUnmounted } from 'vue'

interface UseDragOption {
  start: (target: HTMLElement, e: MouseEvent) => void
  end: () => void
  update: (dx: number, dy: number, target: HTMLElement) => void
}

export function useDrag(opt: Partial<UseDragOption> = {}) {
  let dragging = false
  let target: HTMLElement | null = null

  const update = (e: MouseEvent) => {
    if (!dragging) return

    opt.update?.(e.movementX, e.movementY, target!)
  }

  const end = () => {
    dragging = false
    target = null
    opt.end?.()
  }

  onMounted(() => {
    window.addEventListener('mouseup', end)
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mouseup', end)
    window.removeEventListener('mousemove', update)
  })

  return function start(e: MouseEvent) {
    dragging = true
    target = e.target as HTMLDivElement

    opt.start?.(target, e)
  }
}

/**
 * https://css-tricks.com/restart-css-animation/
 *
 * @param el
 * @param className
 */
export function resetAnimation(el: HTMLElement, className: string) {
  // -> removing the class
  el.classList.remove(className)

  // -> triggering reflow /* The actual magic */
  // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
  // Oops! This won't work in strict mode. Thanks Felis Phasma!
  // element.offsetWidth = element.offsetWidth;
  // Do this instead:
  void el.offsetWidth

  // -> and re-adding the class
  el.classList.add(className)
}
