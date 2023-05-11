import { createAutoIncrementGenerator, Fn, isFn, isIterable, isObject } from '@0x-jerry/utils'
import { isElement } from '../utils'

/**
 * create a dom element
 *
 * @example
 *
 * ```ts
 * const click = () => console.log('cool')
 *
 * const el = html`
 * <div>
 * <button onclick=${click}> click me </button>
 * </div>
 * `
 *
 * document.body.append(el)
 * ```
 *
 * @param strings
 * @param values
 * @returns
 */
export function html(strings: TemplateStringsArray, ...values: any[]): DocumentFragment {
  const ctx = composeHtmlString(strings, ...values)

  const root = document.createElement('div')

  root.innerHTML = ctx.html

  walk(root, (node) => {
    if (node.nodeType === document.COMMENT_NODE) {
      const el = ctx.elements[node.textContent!.trim()]

      if (el) {
        node.parentElement?.replaceChild(el, node)
      }

      return
    }

    if (!isElement(node)) {
      return
    }

    for (const item of Array.from(node.attributes)) {
      let fn

      if (item.name.startsWith('on') && (fn = ctx.events[item.value])) {
        const eventName = item.name.slice(2)

        node.addEventListener(eventName, fn)
        node.removeAttribute(item.name)
      }
    }
  })

  const fragment = document.createDocumentFragment()

  fragment.append(...root.childNodes)

  return fragment
}

function walk(root: Node, cb: (node: Node) => void) {
  cb(root)

  for (const child of root.childNodes) {
    walk(child, cb)
  }
}

export function composeHtmlString(strings: TemplateStringsArray, ...values: any[]) {
  const nextId = createAutoIncrementGenerator('e')

  let _html = ''

  const events: Record<string, Fn> = {}

  const elements: Record<string, Node> = {}

  for (let idx = 0; idx < strings.length; idx++) {
    const str = strings[idx]
    const value = values[idx]

    _html += str

    if (idx < strings.length - 1) {
      concatValue(value)
    }
  }

  return {
    html: _html,
    events,
    elements,
  }

  function concatValue(value: any) {
    if (isObject(value) && isIterable(value)) {
      for (const item of value) {
        if (isFn(item)) {
          continue
        }

        concatValue(item)
      }

      return
    }

    if (value instanceof Node) {
      const id = nextId()
      _html += `<!-- ${id} -->`
      elements[id] = value
      return
    }

    if (isFn(value)) {
      const id = nextId()

      _html += `"${id}"`
      events[id] = value
      return
    }

    _html += String(value)
  }
}
