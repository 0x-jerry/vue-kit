import { sleep } from '@0x-jerry/utils'
import { useAsyncData } from '.'

describe('useAsyncData', () => {
  it('should return default value', () => {
    const data = useAsyncData(() => '', '123')

    expect(data.value).toBe('123')
  })

  it('should return resolved value', async () => {
    const data = useAsyncData(async () => {
      await sleep(10)
      return 'resolved'
    })

    expect(data.value).toBe(undefined)
    await data.load()
    expect(data.value).toBe('resolved')
  })

  it('should threw error', async () => {
    const data = useAsyncData(async () => {
      await sleep(10)
      throw new Error('error')
      return ''
    }, '123')

    expect(data.value).toBe('123')

    await expect(data.load).rejects.toThrow('error')
    expect(data.value).toBe('123')
  })

  it('should loading when load data', async () => {
    const data = useAsyncData(async () => {
      await sleep(10)
      return 1
    }, 0)
    expect(data.loading).toBe(false)

    const res = data.load()
    expect(data.loading).toBe(true)

    await res
    expect(data.loading).toBe(false)
  })
})
