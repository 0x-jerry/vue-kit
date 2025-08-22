// @jest-environment happy-dom
// Why we use happy-dom here? Because jsdom has some strict check for `HTMLInputElement.files`. We can not mock the value of input.

import { chooseFiles } from './chooseFiles'

describe('choose files', () => {
  it('choose', async () => {
    const blob = new Blob(['hello'])

    const p = chooseFiles()
    const el = document.querySelector('input[data-choose-file]')!

    expect(el).toBeTruthy()

    // @ts-expect-error
    el.files = [blob]

    el.dispatchEvent(new Event('change'))

    const res = await p
    expect(res).eql([blob])
  })

  it('choose canceled', async () => {
    const p = chooseFiles()
    const el = document.querySelector('input[data-choose-file]')!

    expect(el).toBeTruthy()

    el.dispatchEvent(new Event('change'))

    const res = await p
    expect(res).eql([])
  })

  it('error', async () => {
    const p = chooseFiles()
    const el = document.querySelector('input[data-choose-file]')!

    const err = new Event('error')
    el.dispatchEvent(err)

    await expect(p).rejects.toBe(err)
  })
})
