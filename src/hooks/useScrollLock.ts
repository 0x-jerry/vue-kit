export interface UseLockScrollOption {
  offset?: string
}

let scrollWidth = ''

export function useScrollLock(el: HTMLElement, opt: UseLockScrollOption = {}) {
  const locked = ref(false)

  const option: Required<UseLockScrollOption> = Object.assign(
    {
      offset: scrollWidth ? scrollWidth : (scrollWidth = getScrollbarWidth() + 'px'),
    },
    {
      opt,
    },
  )

  const preStatus = {
    overflow: '',
    hasScroll: false,
    padding: '0',
  }

  watch(locked, (isLocked) => {
    if (isLocked) {
      preStatus.overflow = el.style.overflow

      const hasScrollBar = el.clientHeight !== el.scrollHeight

      preStatus.hasScroll = hasScrollBar

      el.style.overflowY = 'hidden'

      if (hasScrollBar) {
        preStatus.padding = el.style.paddingRight
        const pr = preStatus.padding
          ? `calc(${preStatus.padding} + ${option.offset})`
          : option.offset

        el.style.paddingRight = pr
      }
    } else {
      el.style.overflow = preStatus.overflow

      if (preStatus.hasScroll) {
        el.style.paddingRight = preStatus.padding
      }
    }
  })

  return locked
}

/**
 * https://stackoverflow.com/a/13382873
 */
function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // Removing temporary elements from the DOM
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}
