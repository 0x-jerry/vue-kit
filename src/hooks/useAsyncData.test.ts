import { sleep } from '@0x-jerry/utils'
import { useAsyncData } from '.'

describe('useAsyncData', () => {
  it('should return default value', () => {
    const data = useAsyncData(() => '', '123')

    expect(data.data).toBe('123')
  })

  it('should return resolved value', async () => {
    const data = useAsyncData(async () => {
      await sleep(10)
      return 'resolved'
    })

    expect(data.data).toBe(undefined)
    await data.load()
    expect(data.data).toBe('resolved')
  })

  it('should threw error', async () => {
    const data = useAsyncData(async () => {
      await sleep(10)
      throw new Error('error')
      // biome-ignore lint/correctness/noUnreachable: test only
      return ''
    }, '123')

    expect(data.data).toBe('123')

    await expect(data.load).rejects.toThrow('error')
    expect(data.data).toBe('123')
  })

  it('should loading when load data', async () => {
    const data = useAsyncData(async () => {
      await sleep(10)
      return 1
    }, 0)
    expect(data.isLoading).toBe(false)

    const res = data.load()
    expect(data.isLoading).toBe(true)

    await res
    expect(data.isLoading).toBe(false)
  })

  it('should loading when request multiple times', async () => {
    const data = useAsyncData(async () => {
      await sleep(100)
      return 1
    }, 0)

    expect(data.isLoading).toBe(false)

    const res = data.load()
    await sleep(10)
    const res2 = data.load()

    expect(data.isLoading).toBe(true)

    await res
    expect(data.isLoading).toBe(true)

    await res2
    expect(data.isLoading).toBe(false)
  })

  it('should support update mannually', async () => {
    const data = useAsyncData(async () => {
      await sleep(10)
      return 1
    }, 0)

    await data.load()
    expect(data.data).toBe(1)

    data.update(2)
    expect(data.data).toBe(2)
  })
})
