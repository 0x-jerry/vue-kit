import { sleep } from '@0x-jerry/utils'
import { ref } from 'vue'
import { useTransaction } from './useTransaction'

describe('useTransaction', () => {
  it('should fallback when throw an error', () => {
    const n = ref(1)

    const fn = vi.fn()

    try {
      useTransaction(n, () => {
        n.value = 3

        throw new Error('some error')
      })
    } catch (error) {
      fn()
    }

    expect(fn).toBeCalledTimes(1)

    expect(n.value).toBe(1)
  })

  it('should fallback when throw an error in async function', async () => {
    const n = ref(1)

    const fn = vi.fn()

    try {
      await useTransaction(n, async () => {
        n.value = 3
        await sleep(1)

        throw new Error('some error')
      })
    } catch (error) {
      fn()
    }

    expect(fn).toBeCalledTimes(1)

    expect(n.value).toBe(1)
  })
})
