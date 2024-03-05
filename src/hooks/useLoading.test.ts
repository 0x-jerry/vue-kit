import { sleep } from '@0x-jerry/utils'
import { useLoading } from '.'

describe('useLoading', () => {
  it('should return a wrapper fn', async () => {
    const fn = () => sleep(100)

    const fnWrapper = useLoading(fn)
    expect(fnWrapper.isLoading).toBe(false)

    const p = fnWrapper()
    expect(fnWrapper.isLoading).toBe(true)
    await p
    expect(fnWrapper.isLoading).toBe(false)
  })

  it('should throw error', async () => {
    const fn = async () => {
      await sleep(100)
      throw new Error('1')
    }

    const fnWrapper = useLoading(fn)
    expect(fnWrapper.isLoading).toBe(false)

    const p = fnWrapper()
    expect(fnWrapper.isLoading).toBe(true)

    try {
      await p

      // this expect should not execute
      expect(true).toBe(false)
    } catch (error) {
      expect(error).eqls(new Error('1'))
    }

    expect(fnWrapper.isLoading).toBe(false)
  })

  it('should return pass thought params', async () => {
    const addOne = async (value: number) => {
      await sleep(100)
      return value + 1
    }

    const fnWrapper = useLoading(addOne)
    expect(fnWrapper.isLoading).toBe(false)

    const p = fnWrapper(1)
    expect(fnWrapper.isLoading).toBe(true)

    const result = await p
    expect(result).toBe(2)

    expect(fnWrapper.isLoading).toBe(false)
  })

  it('should loading when execute multiple times', async () => {
    const addOne = async (value: number) => {
      await sleep(100)
      return value + 1
    }

    const fnWrapper = useLoading(addOne)
    expect(fnWrapper.isLoading).toBe(false)

    const p = fnWrapper(1)
    await sleep(10)
    const p2 = fnWrapper(2)

    expect(fnWrapper.isLoading).toBe(true)
    const result = await p
    expect(result).toBe(2)

    expect(fnWrapper.isLoading).toBe(true)
    const result2 = await p2
    expect(result2).toBe(3)

    expect(fnWrapper.isLoading).toBe(false)
  })
})
