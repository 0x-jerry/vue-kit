// @jest-environment jsdom
import { createKeyboardEventHandler } from './createKeyboardEventHandler'
import { type KeyOption } from './parse'

describe('crateKeyboardHandler', () => {
  it('should listen to key `k`', () => {
    const fakeKeydownEvent = new KeyboardEvent('keydown', {
      key: 'k',
    })

    const fn = vi.fn()
    const handler = createKeyboardEventHandler('k', fn)

    handler(fakeKeydownEvent)
    expect(fn).toBeCalledTimes(1)

    handler(fakeKeydownEvent)
    expect(fn).toBeCalledTimes(2)
  })

  it('should listen to combo keys', () => {
    const fakeKeydownEvent = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
    })

    const fn = vi.fn()
    const handler = createKeyboardEventHandler('meta + k', fn)

    handler(fakeKeydownEvent)
    expect(fn).toBeCalledTimes(1)
  })

  it('should work with multiple options', () => {
    let opt = null as null | KeyOption
    const handler = createKeyboardEventHandler(['meta + k', 'meta + a'], (o) => {
      opt = o
    })

    handler(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        shiftKey: true,
      }),
    )

    expect(opt?.key).toBe('k')

    handler(
      new KeyboardEvent('keydown', {
        key: 'a',
        metaKey: true,
      }),
    )

    expect(opt?.key).toBe('a')
  })
})
