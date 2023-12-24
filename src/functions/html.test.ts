// @jest-environment happy-dom

import { composeHtmlString, html } from './html'

describe('html tagged template', () => {
  it('should compose html', () => {
    const fn = vi.fn()
    const result = composeHtmlString`<div onclick=${fn}> hello ${2} </div>`

    expect(result).matchSnapshot()

    const result2 = composeHtmlString`<div onclick=${fn} dbclick=${fn} > hello ${2} </div>`

    expect(result2).matchSnapshot()
  })

  it('should bind click event', () => {
    const fn = vi.fn()

    const result = html`<div onclick=${fn} ondblclick=${fn}>hello ${2}</div>`

    expect(result).matchSnapshot()

    result.querySelector('div')?.dispatchEvent(new Event('click'))
    expect(fn).toBeCalledTimes(1)

    result.querySelector('div')?.dispatchEvent(new Event('dblclick'))
    expect(fn).toBeCalledTimes(2)
  })

  it('should respect HTMLElement', () => {
    const fn = vi.fn()

    const btn = html`<button onclick=${fn}>b1</button>`

    const result = html`<div>${btn}</div>`

    expect(result).matchSnapshot()

    result.querySelector('button')?.dispatchEvent(new Event('click'))
    expect(fn).toBeCalledTimes(1)
  })

  it('should respect Array', () => {
    const fn = vi.fn()

    const btns = [
      //
      html`<button onclick=${fn}>b1</button>`,
      html`<button onclick=${fn}>b2</button>`,
    ]

    const result = html`<div>
      ${btns}
      <!-- test -->
    </div>`

    expect(result).matchSnapshot()

    result.querySelectorAll('button').forEach((item) => {
      item.dispatchEvent(new Event('click'))
    })

    expect(fn).toBeCalledTimes(2)
  })
})
